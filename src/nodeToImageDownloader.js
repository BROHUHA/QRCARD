import { toPng, toJpeg, toSvg } from 'html-to-image';
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
    const urlMatches = Array.from(cssText.matchAll(/url\((https:\/\/[^)]+)\)/g));
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

export const downloadHDCard = async (
  nodeId,
  imageName = 'specimen-card',
  { format = 'png', pixelRatio = 4, aspectRatio = 'auto' } = {}
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
    const targetWidth = Math.round(rect.width);
    const targetHeight = Math.round(rect.height);
    const actualPixelRatio = pixelRatio || 4;

    const options = {
      quality: 1,
      pixelRatio: actualPixelRatio, // 4X for Ultra-HD print quality
      backgroundColor: null,
      width: targetWidth,
      height: targetHeight,
      canvasWidth: targetWidth * actualPixelRatio,
      canvasHeight: targetHeight * actualPixelRatio,
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

    if (cleanFormat === 'jpeg' || cleanFormat === 'jpg') {
      dataUrl = await toJpeg(node, {
        ...options,
        quality: 0.98,
        backgroundColor: '#FFFFFF',
      });
    } else if (cleanFormat === 'svg') {
      dataUrl = await toSvg(node, options);
    } else {
      dataUrl = await toPng(node, options);
    }

    // Pure ESM download trigger
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().slice(0, 10);
    const ratioTag = aspectRatio && aspectRatio !== 'auto' ? `-${aspectRatio.replace(':', 'x')}` : '';
    const fileExt = cleanFormat === 'jpeg' ? 'jpg' : cleanFormat;
    link.download = `${imageName}${ratioTag}-${timestamp}.${fileExt}`;
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
