import React, { useMemo } from 'react';
import QRCodeImpl from 'qr.js/lib/QRCode.js';
import ErrorCorrectLevel from 'qr.js/lib/ErrorCorrectLevel.js';

export const TactileQRCode = ({
  value = 'https://scanfolk.com',
  styleId = 'botanical-moss',
  size = 280,
  className = '',
  bgFillCustom = null,
}) => {
  // Generate raw QR 2D boolean matrix
  const { modules, count } = useMemo(() => {
    try {
      // Use Error Correction Level Q for robust scannability with artistic textures
      const qr = new QRCodeImpl(-1, ErrorCorrectLevel.Q);
      qr.addData(value || 'https://scanfolk.com');
      qr.make();
      return { modules: qr.modules, count: qr.modules.length };
    } catch (e) {
      // Fallback for long data
      const qr = new QRCodeImpl(-1, ErrorCorrectLevel.M);
      qr.addData(value || 'https://scanfolk.com');
      qr.make();
      return { modules: qr.modules, count: qr.modules.length };
    }
  }, [value]);

  // ViewBox dimensions: 2-module quiet margin so QR code fills the card canvas completely
  const margin = 2;
  const viewBoxSize = count + margin * 2;
  const centerCoord = Math.floor(count / 2);

  // Dedicated physical texture backgrounds for filled display
  const STYLE_BG = {
    'fluffy-plush': '#FACC15',
    'coffee-beans': '#F5ECE1',
    'botanical-moss': '#EEF5F0',
    'ceramic-tiles': '#F8FAFC',
    'candied-orange': '#FFF7ED',
  };
  const bgFill = bgFillCustom || STYLE_BG[styleId] || '#FFFFFF';

  // Check if a cell is part of the 3 Corner Finder Patterns (7x7)
  const isFinderPattern = (r, c) => {
    if (r < 7 && c < 7) return true; // Top-Left
    if (r < 7 && c >= count - 7) return true; // Top-Right
    if (r >= count - 7 && c < 7) return true; // Bottom-Left
    return false;
  };

  // Check if cell is in the chick mascot center excavation (only for fluffy-plush style)
  const isMascotCenter = (r, c) => {
    if (styleId !== 'fluffy-plush') return false;
    return Math.abs(r - centerCoord) <= 3 && Math.abs(c - centerCoord) <= 3;
  };

  // Pseudo-random deterministic hash for natural organic variations
  const getHash = (r, c) => {
    const n = Math.sin(r * 12.9898 + c * 78.233) * 43758.5453;
    return n - Math.floor(n);
  };

  return (
    <svg
      viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      width={size}
      height={size}
      className={`select-none overflow-visible ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* ========================================================
            1. COFFEE BEANS DEFS
           ======================================================== */}
        <linearGradient id="beanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4A2613" />
          <stop offset="50%" stopColor="#2E1509" />
          <stop offset="100%" stopColor="#190B04" />
        </linearGradient>
        <filter id="beanShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0.08" dy="0.14" stdDeviation="0.1" floodColor="#0D0603" floodOpacity="0.55" />
        </filter>

        {/* ========================================================
            2. BOTANICAL LIVING MOSS DEFS
           ======================================================== */}
        <linearGradient id="mossGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#65A30D" />
          <stop offset="40%" stopColor="#36662D" />
          <stop offset="100%" stopColor="#1E3A20" />
        </linearGradient>
        <filter id="mossRelief" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0.06" dy="0.12" stdDeviation="0.1" floodColor="#0D200E" floodOpacity="0.45" />
        </filter>

        {/* ========================================================
            3. AZULEJO CERAMIC TILES DEFS
           ======================================================== */}
        <linearGradient id="ceramicTileGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="60%" stopColor="#1D4ED8" />
          <stop offset="100%" stopColor="#172554" />
        </linearGradient>
        <filter id="tileShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0.06" dy="0.1" stdDeviation="0.08" floodColor="#0A1633" floodOpacity="0.38" />
        </filter>

        {/* ========================================================
            4. CANDIED CITRUS JELLY DEFS
           ======================================================== */}
        <linearGradient id="citrusJellyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="50%" stopColor="#EA580C" />
          <stop offset="100%" stopColor="#C2410C" />
        </linearGradient>
        <filter id="jellyGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0.06" dy="0.12" stdDeviation="0.12" floodColor="#C2410C" floodOpacity="0.45" />
        </filter>

        {/* ========================================================
            5. FLUFFY PLUSH FUR DEFS
           ======================================================== */}
        <linearGradient id="furChocGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#54280E" />
          <stop offset="100%" stopColor="#301506" />
        </linearGradient>
        <filter id="furShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0.08" dy="0.14" stdDeviation="0.12" floodColor="#1F0D04" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* ========================================================
          BACKGROUND LAYER (Full-Bleed Filled Canvas)
         ======================================================== */}
      <rect
        x={0}
        y={0}
        width={viewBoxSize}
        height={viewBoxSize}
        rx={3.5}
        fill={bgFill}
      />

      {/* ========================================================
          MODULES RENDER ENGINE
         ======================================================== */}
      <g>
        {modules.map((row, r) =>
          row.map((isDark, c) => {
            const x = c + margin;
            const y = r + margin;
            const hash = getHash(r, c);

            // Skip mascot center in chick mode so face renders cleanly
            if (isMascotCenter(r, c)) return null;

            // ----------------------------------------------------
            // STYLE 1: ROASTED COFFEE BEANS
            // ----------------------------------------------------
            if (styleId === 'coffee-beans') {
              if (!isDark) return null;
              const angle = (hash * 34 - 17).toFixed(1);
              return (
                <g
                  key={`${r}-${c}`}
                  transform={`translate(${x + 0.5}, ${y + 0.5}) rotate(${angle})`}
                  filter="url(#beanShadow)"
                >
                  {/* Bean Body */}
                  <ellipse
                    cx="0"
                    cy="0"
                    rx="0.48"
                    ry="0.38"
                    fill="url(#beanGrad)"
                  />
                  {/* Bean Characteristic Center Slit / Crease */}
                  <path
                    d="M -0.32 -0.02 Q 0 -0.06 0.32 0.02"
                    stroke="#0F0602"
                    strokeWidth="0.07"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* Subtle Roasted Gloss Highlight */}
                  <ellipse
                    cx="-0.12"
                    cy="-0.15"
                    rx="0.18"
                    ry="0.08"
                    fill="#FFFFFF"
                    opacity="0.16"
                  />
                </g>
              );
            }

            // ----------------------------------------------------
            // STYLE 2: LIVING BOTANICAL MOSS
            // ----------------------------------------------------
            if (styleId === 'botanical-moss') {
              if (!isDark) return null;
              const radius = hash > 0.6 ? 0.44 : hash > 0.3 ? 0.38 : 0.42;
              return (
                <g key={`${r}-${c}`} filter="url(#mossRelief)">
                  {/* Moss Clump Cluster */}
                  <rect
                    x={x + 0.05}
                    y={y + 0.05}
                    width={0.9}
                    height={0.9}
                    rx={radius}
                    fill="url(#mossGrad)"
                  />
                  {/* Organic Foliage Texture Specks */}
                  {hash > 0.4 && (
                    <circle
                      cx={x + 0.35 + hash * 0.3}
                      cy={y + 0.35 + hash * 0.3}
                      r={0.16}
                      fill="#84CC16"
                      opacity="0.75"
                    />
                  )}
                  {hash < 0.3 && (
                    <circle
                      cx={x + 0.25}
                      cy={y + 0.25}
                      r={0.14}
                      fill="#14532D"
                      opacity="0.8"
                    />
                  )}
                </g>
              );
            }

            // ----------------------------------------------------
            // STYLE 3: AZULEJO CERAMIC TILES
            // ----------------------------------------------------
            if (styleId === 'ceramic-tiles') {
              if (!isDark) return null;
              // Occasionally render a decorative floral tile rosette in non-finder modules
              const isRosetteTile = !isFinderPattern(r, c) && hash > 0.88;

              return (
                <g key={`${r}-${c}`} filter="url(#tileShadow)">
                  {/* Beveled Ceramic Tile Body */}
                  <rect
                    x={x + 0.07}
                    y={y + 0.07}
                    width={0.86}
                    height={0.86}
                    rx={0.18}
                    fill="url(#ceramicTileGrad)"
                    stroke="#1E3A8A"
                    strokeWidth="0.04"
                  />
                  {/* Top-Left Specular Glaze Sheen */}
                  <path
                    d={`M ${x + 0.15} ${y + 0.7} L ${x + 0.15} ${y + 0.2} L ${x + 0.7} ${y + 0.15}`}
                    stroke="#FFFFFF"
                    strokeWidth="0.06"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.35"
                  />
                  {/* Decorative Rosette Accent Tile */}
                  {isRosetteTile && (
                    <g transform={`translate(${x + 0.5}, ${y + 0.5})`}>
                      <circle r="0.14" fill="#F59E0B" />
                      <circle r="0.07" fill="#FFFFFF" />
                      <path
                        d="M 0 -0.28 L 0.08 0 L 0 0.28 L -0.08 0 Z"
                        fill="#FFFFFF"
                        opacity="0.85"
                      />
                      <path
                        d="M -0.28 0 L 0 0.08 L 0.28 0 L 0 -0.08 Z"
                        fill="#FFFFFF"
                        opacity="0.85"
                      />
                    </g>
                  )}
                </g>
              );
            }

            // ----------------------------------------------------
            // STYLE 4: CANDIED ORANGE MARMALADE
            // ----------------------------------------------------
            if (styleId === 'candied-orange') {
              if (!isDark) return null;
              return (
                <g key={`${r}-${c}`} filter="url(#jellyGlow)">
                  {/* Translucent Marmalade Gel Block */}
                  <rect
                    x={x + 0.06}
                    y={y + 0.06}
                    width={0.88}
                    height={0.88}
                    rx={0.22}
                    fill="url(#citrusJellyGrad)"
                  />
                  {/* Citrus Zest Speck */}
                  {hash > 0.45 && (
                    <circle
                      cx={x + 0.3 + hash * 0.4}
                      cy={y + 0.3 + hash * 0.4}
                      r={0.12}
                      fill="#FEF08A"
                      opacity="0.75"
                    />
                  )}
                  {/* Jelly Glossy Highlight Rim */}
                  <rect
                    x={x + 0.14}
                    y={y + 0.14}
                    width={0.3}
                    height={0.16}
                    rx={0.08}
                    fill="#FFFFFF"
                    opacity="0.4"
                  />
                </g>
              );
            }

            // ----------------------------------------------------
            // STYLE 5: FLUFFY CHICK / FUR
            // ----------------------------------------------------
            if (styleId === 'fluffy-plush') {
              if (!isDark) return null;
              return (
                <rect
                  key={`${r}-${c}`}
                  x={x + 0.04}
                  y={y + 0.04}
                  width={0.92}
                  height={0.92}
                  rx={0.32}
                  fill="url(#furChocGrad)"
                  filter="url(#furShadow)"
                />
              );
            }

            return null;
          })
        )}
      </g>

      {/* ========================================================
          CORNERS FINDER EYES ARTISTIC ENHANCEMENTS
         ======================================================== */}
      {styleId === 'ceramic-tiles' && (
        <>
          {/* Top-Left, Top-Right, Bottom-Left Azulejo Corner Inlays */}
          {[
            { cx: margin + 3.5, cy: margin + 3.5 },
            { cx: margin + count - 3.5, cy: margin + 3.5 },
            { cx: margin + 3.5, cy: margin + count - 3.5 },
          ].map((corner, i) => (
            <g key={`corner-${i}`} transform={`translate(${corner.cx}, ${corner.cy})`} pointerEvents="none">
              <circle r="0.4" fill="#F59E0B" opacity="0.9" />
              <circle r="0.18" fill="#FFFFFF" />
            </g>
          ))}
        </>
      )}

      {/* ========================================================
          STYLE 5 SPECIAL: FLUFFY BABY CHICK 3D FACE CENTER
         ======================================================== */}
      {styleId === 'fluffy-plush' && (
        <g
          transform={`translate(${margin + centerCoord + 0.5}, ${margin + centerCoord + 0.5})`}
          pointerEvents="none"
        >
          {/* Fluffy Circular Head */}
          <circle r="2.8" fill="#FACC15" filter="url(#furShadow)" />
          <circle r="2.6" fill="#FDE047" opacity="0.9" />

          {/* Cute Tuft Feather on Top */}
          <path
            d="M -0.3 -2.6 C -0.2 -3.3, 0 -3.4, 0.1 -2.7"
            stroke="#CA8A04"
            strokeWidth="0.22"
            strokeLinecap="round"
            fill="none"
          />

          {/* Left Eye */}
          <ellipse cx="-0.85" cy="-0.35" rx="0.32" ry="0.36" fill="#180A03" />
          <circle cx="-0.95" cy="-0.45" r="0.1" fill="#FFFFFF" />

          {/* Right Eye */}
          <ellipse cx="0.85" cy="-0.35" rx="0.32" ry="0.36" fill="#180A03" />
          <circle cx="0.75" cy="-0.45" r="0.1" fill="#FFFFFF" />

          {/* 3D Orange Beak */}
          <polygon
            points="0,-0.1 0.55,0.45 -0.55,0.45"
            fill="#EA580C"
            filter="url(#furShadow)"
          />
          <polygon
            points="0,0.1 0.45,0.4 -0.45,0.4"
            fill="#F97316"
          />

          {/* Subtle Cheek Blush */}
          <ellipse cx="-1.5" cy="0.2" rx="0.4" ry="0.25" fill="#F43F5E" opacity="0.22" />
          <ellipse cx="1.5" cy="0.2" rx="0.4" ry="0.25" fill="#F43F5E" opacity="0.22" />
        </g>
      )}
    </svg>
  );
};
