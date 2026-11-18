import React, { useEffect, useRef, useState } from 'react';

export const Preloader = ({ onFinish, triggerKey = '' }) => {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const canvasRef = useRef(null);
  const isFirstMount = useRef(true);
  const [showProgressBadge, setShowProgressBadge] = useState(true);

  // Optical QR 9x9 pixel matrix bit pattern (Finder patterns + data dots)
  const MATRIX_SIZE = 9;
  const QR_PATTERN = [
    [1, 1, 1, 0, 1, 0, 1, 1, 1],
    [1, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 1, 1, 0, 1, 0, 1, 1, 1],
    [0, 0, 0, 1, 0, 1, 0, 0, 0],
    [1, 0, 1, 0, 2, 0, 1, 0, 1], // 2 = luminous white center
    [0, 0, 0, 1, 0, 1, 0, 0, 0],
    [1, 1, 1, 0, 1, 0, 1, 1, 1],
    [1, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 1, 1, 0, 1, 0, 1, 1, 1],
  ];

  useEffect(() => {
    setIsDone(false);
    setIsFading(false);
    setProgress(isFirstMount.current ? 8 : 100);
    setShowProgressBadge(isFirstMount.current);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    const pixelSize = 24;
    const cols = Math.ceil(width / pixelSize);
    const rows = Math.ceil(height / pixelSize);
    const totalPixels = cols * rows;

    // Full screen dissolve grid sweeping from Right-Top to Left-Bottom
    const screenPixels = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const normX = c / cols;
        const normY = r / rows;
        const wave = (1 - normX) * 0.45 + normY * 0.28;
        const randomScatter = Math.random() * 0.25;
        const dissolveDelay = wave * 0.65 + randomScatter * 0.35;
        screenPixels.push({
          x: c * pixelSize,
          y: r * pixelSize,
          w: pixelSize + 0.5,
          h: pixelSize + 0.5,
          dissolveDelay,
        });
      }
    }

    let animationId;
    let fadeTimer;
    let startTime = null;

    // Initial load has full decode; subsequent route switches have snappy cinematic wipe
    const decodeDuration = isFirstMount.current ? 450 : 200;
    const dissolveDuration = isFirstMount.current ? 420 : 280;
    isFirstMount.current = false;

    const render = (now) => {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;

      ctx.clearRect(0, 0, width, height);

      if (elapsed < decodeDuration) {
        // --- PHASE 1: FULL SOLID PIXEL CURTAIN + CENTER PIXEL QR DECODE ---
        const currentProgress = Math.min(100, Math.round((elapsed / decodeDuration) * 100));
        setProgress(currentProgress);

        // Draw solid dark pixel backdrop with matrix grid
        ctx.fillStyle = '#030303';
        ctx.fillRect(0, 0, width, height);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.lineWidth = 1;
        for (let x = 0; x < width; x += pixelSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y < height; y += pixelSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }

        // Draw Center Pixelated QR Matrix
        const cellSize = 12;
        const matrixPixelWidth = MATRIX_SIZE * cellSize;
        const matrixX = Math.round(width / 2 - matrixPixelWidth / 2);
        const matrixY = Math.round(height / 2 - matrixPixelWidth / 2 - 24);

        // Frame
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1;
        ctx.strokeRect(matrixX - 6, matrixY - 6, matrixPixelWidth + 12, matrixPixelWidth + 12);

        // Render cells up to current decode progress
        const activeCellsThreshold = Math.floor((currentProgress / 100) * (MATRIX_SIZE * MATRIX_SIZE));
        let cellIndex = 0;

        for (let r = 0; r < MATRIX_SIZE; r++) {
          for (let c = 0; c < MATRIX_SIZE; c++) {
            if (cellIndex <= activeCellsThreshold) {
              const val = QR_PATTERN[r][c];
              if (val === 1) {
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(matrixX + c * cellSize + 1, matrixY + r * cellSize + 1, cellSize - 2, cellSize - 2);
              } else if (val === 2) {
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(matrixX + c * cellSize + 1, matrixY + r * cellSize + 1, cellSize - 2, cellSize - 2);
                ctx.shadowColor = '#FFFFFF';
                ctx.shadowBlur = 10;
                ctx.fillRect(matrixX + c * cellSize + 2, matrixY + r * cellSize + 2, cellSize - 4, cellSize - 4);
                ctx.shadowBlur = 0;
              }
            }
            cellIndex++;
          }
        }

        animationId = requestAnimationFrame(render);
      } else {
        // --- PHASE 2: PIXEL CURTAIN DISSOLVE INTO SITE ---
        setProgress(100);
        const dissolveElapsed = elapsed - decodeDuration;
        const dissolveProgress = Math.min(1, dissolveElapsed / dissolveDuration);

        let activeCount = 0;

        for (let i = 0; i < totalPixels; i++) {
          const p = screenPixels[i];

          if (dissolveProgress < p.dissolveDelay) {
            ctx.fillStyle = '#030303';
            ctx.fillRect(p.x, p.y, p.w, p.h);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.lineWidth = 0.5;
            ctx.strokeRect(p.x, p.y, p.w, p.h);
            activeCount++;
          } else {
            const pixelP = Math.min(1, (dissolveProgress - p.dissolveDelay) / 0.32);
            if (pixelP < 1) {
              const alpha = 1 - pixelP;
              ctx.fillStyle = '#030303';
              ctx.globalAlpha = alpha;
              const shrink = pixelP * (pixelSize * 0.6);
              ctx.fillRect(p.x + shrink / 2, p.y + shrink / 2, p.w - shrink, p.h - shrink);

              // Optical white glint
              if (pixelP > 0.05 && pixelP < 0.65) {
                ctx.strokeStyle = `rgba(255, 255, 255, ${0.75 * (1 - pixelP)})`;
                ctx.lineWidth = 1;
                ctx.strokeRect(p.x, p.y, p.w, p.h);
              }
              ctx.globalAlpha = 1.0;
              activeCount++;
            }
          }
        }

        if (activeCount > 0 && dissolveProgress < 1) {
          animationId = requestAnimationFrame(render);
        } else {
          ctx.clearRect(0, 0, width, height);
          setIsFading(true);
          fadeTimer = setTimeout(() => {
            setIsDone(true);
            if (onFinish) onFinish();
          }, 200);
        }
      }
    };

    animationId = requestAnimationFrame(render);

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      if (fadeTimer) clearTimeout(fadeTimer);
    };
  }, [triggerKey, onFinish]);

  if (isDone) return null;

  return (
    <div
      onClick={() => {
        setIsDone(true);
        if (onFinish) onFinish();
      }}
      className={`fixed inset-0 z-[9999] pointer-events-auto select-none flex flex-col justify-end items-center pb-12 cursor-pointer transition-opacity duration-200 ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* Modern High-Performance Progress Bar during initial load */}
      {showProgressBadge && progress < 100 && (
        <div className="relative z-10 flex flex-col items-center space-y-3 text-center pointer-events-none mb-10">
          <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-white/90">
            <span className="w-1.5 h-1.5 bg-white rounded-sm animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
            <span>ALL QR STUDIO // PIXEL MATRIX</span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px] text-neutral-400">
            <div className="w-36 sm:w-44 h-1 bg-white/10 rounded-full overflow-hidden p-[1px]">
              <div
                className="h-full bg-white rounded-full transition-all duration-75 shadow-[0_0_8px_rgba(255,255,255,0.9)]"
                style={{ width: `${Math.max(progress, 6)}%` }}
              />
            </div>
            <span className="w-8 text-right font-bold text-white font-mono">{progress}%</span>
          </div>
        </div>
      )}
    </div>
  );
};
