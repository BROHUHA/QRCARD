import React, { useEffect, useRef, useState } from 'react';

export const PixelReveal = ({
  children,
  className = '',
  pixelSize = 20,
  duration = 1350, // Cinematic, slower optical pixel dissolve
  delay = 0,
  triggerKey = null,
  fillColor = '#030303',
  showBorderGlitch = true,
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsRevealed(true);
      return;
    }

    setIsRevealed(false);

    let animationId;
    let observer;

    const startPixelAnimation = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      const width = rect.width;
      const height = rect.height;

      if (width <= 0 || height <= 0) {
        setIsRevealed(true);
        return;
      }

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsRevealed(true);
        return;
      }

      ctx.scale(dpr, dpr);

      const cols = Math.ceil(width / pixelSize);
      const rows = Math.ceil(height / pixelSize);
      const totalPixels = cols * rows;

      // Generate progressive wave delays sweeping from Right-Top to Left-Bottom
      const pixels = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const normX = c / cols;
          const normY = r / rows;
          // Smooth wave: starts at Top-Right (normX=1, normY=0) and sweeps to Left-Bottom
          const wave = (1 - normX) * 0.45 + normY * 0.28;
          const randomJitter = Math.random() * 0.28;
          const startDelay = (wave + randomJitter) * 0.55;

          pixels.push({
            x: c * pixelSize,
            y: r * pixelSize,
            w: pixelSize + 0.5,
            h: pixelSize + 0.5,
            startDelay,
          });
        }
      }

      let startTime = null;

      const render = (now) => {
        if (!startTime) startTime = now;
        const elapsed = now - startTime - delay;

        if (elapsed < 0) {
          ctx.fillStyle = fillColor;
          ctx.fillRect(0, 0, width, height);
          animationId = requestAnimationFrame(render);
          return;
        }

        const progress = Math.min(1, elapsed / duration);

        ctx.clearRect(0, 0, width, height);

        let activeCount = 0;

        for (let i = 0; i < totalPixels; i++) {
          const p = pixels[i];

          if (progress < p.startDelay) {
            // Fully visible pixel with subtle white matrix border
            ctx.fillStyle = fillColor;
            ctx.fillRect(p.x, p.y, p.w, p.h);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.lineWidth = 0.5;
            ctx.strokeRect(p.x, p.y, p.w, p.h);
            activeCount++;
          } else {
            const pixelProgress = Math.min(1, (progress - p.startDelay) / 0.42);
            if (pixelProgress < 1) {
              const alpha = 1 - pixelProgress;
              ctx.fillStyle = fillColor;
              ctx.globalAlpha = alpha;

              // Shrink pixel toward center as it dissolves
              const shrink = pixelProgress * (pixelSize * 0.55);
              ctx.fillRect(
                p.x + shrink / 2,
                p.y + shrink / 2,
                p.w - shrink,
                p.h - shrink
              );

              // Optical matrix luminous white edge accent on dissolve
              if (showBorderGlitch && pixelProgress > 0.05 && pixelProgress < 0.75) {
                ctx.strokeStyle = `rgba(255, 255, 255, ${0.75 * (1 - pixelProgress)})`;
                ctx.lineWidth = 1;
                ctx.strokeRect(p.x, p.y, p.w, p.h);
              }

              ctx.globalAlpha = 1.0;
              activeCount++;
            }
          }
        }

        if (activeCount > 0 && progress < 1) {
          animationId = requestAnimationFrame(render);
        } else {
          ctx.clearRect(0, 0, width, height);
          setIsRevealed(true);
        }
      };

      animationId = requestAnimationFrame(render);
    };

    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          startPixelAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(container);

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      if (observer) observer.disconnect();
    };
  }, [triggerKey, delay, duration, pixelSize, fillColor, showBorderGlitch]);

  const hasPos = className.includes('fixed') || className.includes('absolute');
  const wrapperClass = `${hasPos ? '' : 'relative '}${className}`.trim();

  return (
    <div ref={containerRef} className={wrapperClass}>
      <div className="w-full h-full">
        {children}
      </div>

      {!isRevealed && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-30 pointer-events-none rounded-[inherit]"
          style={{ willChange: 'opacity, transform' }}
        />
      )}
    </div>
  );
};
