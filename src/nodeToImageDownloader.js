import { toCanvas, toSvg } from 'html-to-image';
import confetti from 'canvas-confetti';

const FONT_CSS_URL =
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap';

let cachedFontEmbedCSS = null;

// Pre-fetches and inlines webfonts as base64 data URIs so html-to-image exports identical typography
const getEmbeddedFontCSS = async () => {
  if (cachedFontEmbedCSS !== null) return cachedFontEmbedCSS;

  try {
    const res = await fetch(FONT_CSS_URL);
    if (!res.ok) return '';
    let cssText = await res.text();

    // Extract all font file URLs (woff2) from Google Fonts CSS
    const urlMatches = Array.from(
      cssText.matchAll(/url\((https:\/\/[^)]+)\)/g)
    );
    const fontPromises = urlMatches.map(async (m) => {
      const fontUrl = m[1].replace(/["']/g, '');
      try {
        const fontRes = await fetch(fontUrl);
        if (!fontRes.ok) return null;
        const blob = await fontRes.blob();
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({
              original: m[0],
              dataUri: `url("${reader.result}")`,
            });
          };
          reader.onerror = () => resolve(null);
          reader.readAsDataURL(blob);
        });
      } catch (e) {
        return null;
      }
    });

    const fontReplacements = await Promise.all(fontPromises);
    fontReplacements.forEach((rep) => {
      if (rep && rep.original && rep.dataUri) {
        cssText = cssText.replaceAll(rep.original, rep.dataUri);
      }
    });

    cachedFontEmbedCSS = cssText;
    return cachedFontEmbedCSS;
  } catch (err) {
    console.warn('Webfont embedding for HD export skipped:', err);
    return '';
  }
};

// Target export pixel dimensions for each aspect ratio at 4X Ultra-HD
const EXPORT_DIMENSIONS = {
  auto: null, // Use DOM node's natural dimensions
  '1:1': { width: 2160, height: 2160 },
  '9:16': { width: 2160, height: 3840 },
  '4:5': { width: 2160, height: 2700 },
  '16:9': { width: 3840, height: 2160 },
  '3:2': { width: 3600, height: 2400 },
  '3:4': { width: 2700, height: 3600 },
  card: { width: 3425, height: 2160 },
};

export const downloadHDCard = async (
  nodeId,
  imageName = 'specimen-card',
  { format = 'jpeg', pixelRatio = 4, aspectRatio = 'auto' } = {}
) => {
  if (!nodeId) return;

  const node = document.getElementById(nodeId);
  if (!node) {
    console.error(`Node with id "${nodeId}" not found`);
    return;
  }

  const buttons = document.querySelectorAll('.action-btn, button');
  buttons.forEach((btn) => (btn.disabled = true));

  try {
    // 1. Ensure all Google fonts and webfonts are 100% loaded before rasterizing
    try {
      await document.fonts?.ready;
    } catch (e) {
      // Continue if document.fonts is not supported
    }

    // 2. Fetch base64-embedded fonts CSS so canvas renders identical typography without fallback
    const fontEmbedCSS = await getEmbeddedFontCSS();

    // 3. Ensure all images inside node are fully loaded
    const images = node.querySelectorAll('img');
    await Promise.all(
      Array.from(images).map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      })
    );

    const rect = node.getBoundingClientRect();
    const sourceWidth = Math.round(rect.width);
    const sourceHeight = Math.round(rect.height);

    // Determine final export canvas dimensions
    const exportDims = EXPORT_DIMENSIONS[aspectRatio];
    let effectivePixelRatio;

    if (exportDims) {
      // Calculate scaling ratio based on the target width
      effectivePixelRatio = Math.max(1, exportDims.width / sourceWidth);
    } else {
      // Auto mode: use the standard 4x pixel ratio on natural card size
      effectivePixelRatio = pixelRatio || 4;
    }

    const captureOptions = {
      quality: 1,
      pixelRatio: effectivePixelRatio,
      backgroundColor: null,
      width: sourceWidth,
      height: sourceHeight,
      cacheBust: true,
      fontEmbedCSS: fontEmbedCSS || undefined,
      style: {
        transform: 'none',
        margin: '0',
      },
      filter: (child) => {
        if (child.classList?.contains('no-export')) return false;
        return true;
      },
    };

    let dataUrl;
    const cleanFormat = (format || 'png').toLowerCase();

    if (cleanFormat === 'svg') {
      dataUrl = await toSvg(node, captureOptions);
    } else {
      const renderedCanvas = await toCanvas(node, captureOptions);
      let finalCanvas = renderedCanvas;

      if (exportDims) {
        // Guarantee EXACT target dimensions without floating-point distortion
        const targetCanvas = document.createElement('canvas');
        targetCanvas.width = exportDims.width;
        targetCanvas.height = exportDims.height;
        const ctx = targetCanvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        if (cleanFormat === 'jpeg' || cleanFormat === 'jpg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, exportDims.width, exportDims.height);
        }

        ctx.drawImage(
          renderedCanvas,
          0,
          0,
          exportDims.width,
          exportDims.height
        );
        finalCanvas = targetCanvas;
      } else if (cleanFormat === 'jpeg' || cleanFormat === 'jpg') {
        const targetCanvas = document.createElement('canvas');
        targetCanvas.width = renderedCanvas.width;
        targetCanvas.height = renderedCanvas.height;
        const ctx = targetCanvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, renderedCanvas.width, renderedCanvas.height);
        ctx.drawImage(renderedCanvas, 0, 0);
        finalCanvas = targetCanvas;
      }

      dataUrl =
        cleanFormat === 'jpeg' || cleanFormat === 'jpg'
          ? finalCanvas.toDataURL('image/jpeg', 0.98)
          : finalCanvas.toDataURL('image/png');
    }

    // Pure ESM download trigger
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().slice(0, 10);
    const ratioTag =
      aspectRatio && aspectRatio !== 'auto'
        ? `-${aspectRatio.replace(':', 'x')}`
        : '';
    const dimTag = exportDims
      ? `-${exportDims.width}x${exportDims.height}`
      : `-${Math.round(sourceWidth * effectivePixelRatio)}x${Math.round(
          sourceHeight * effectivePixelRatio
        )}`;
    const fileExt = cleanFormat === 'jpeg' ? 'jpg' : cleanFormat;
    link.download = `${imageName}${ratioTag}${dimTag}-${timestamp}.${fileExt}`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Fire celebratory confetti animation!
    try {
      confetti({
        particleCount: 65,
        spread: 75,
        origin: { y: 0.7 },
        colors: ['#4F46E5', '#10B981', '#F59E0B', '#FFFFFF'],
      });
    } catch (e) {
      // Ignore if confetti fails
    }
  } catch (error) {
    console.error('HD Specimen export failed:', error);
    alert('Export failed. Please check permissions or try again.');
  } finally {
    buttons.forEach((btn) => (btn.disabled = false));
  }
};

export const nodeToImageDownloader = ({ nodeId, imageName }) => {
  downloadHDCard(nodeId, imageName);
};
