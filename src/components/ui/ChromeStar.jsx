import React from 'react';

export const ChromeStar = ({ className = 'w-24 h-24', size = 96 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`liquid-star select-none pointer-events-none ${className}`}
    >
      <defs>
        {/* Chrome metallic 3D gradients */}
        <radialGradient
          id="chromeGlow"
          cx="50%"
          cy="50%"
          r="50%"
          fx="35%"
          fy="35%"
        >
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#d1d5db" stopOpacity="0.7" />
          <stop offset="80%" stopColor="#374151" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#111827" stopOpacity="0.8" />
        </radialGradient>
        <linearGradient id="chromeSpecular" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="25%" stopColor="#f3f4f6" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#9ca3af" stopOpacity="0.5" />
          <stop offset="75%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#1f2937" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="chromeEdge" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#4b5563" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.9" />
        </linearGradient>
      </defs>

      {/* 4-point curved chrome star matching reference */}
      <path
        d="M50 0C50 27.6142 72.3858 50 100 50C72.3858 50 50 72.3858 50 100C50 72.3858 27.6142 50 0 50C27.6142 50 50 27.6142 50 0Z"
        fill="url(#chromeGlow)"
      />
      <path
        d="M50 0C50 27.6142 72.3858 50 100 50C72.3858 50 50 72.3858 50 100C50 72.3858 27.6142 50 0 50C27.6142 50 50 27.6142 50 0Z"
        fill="url(#chromeSpecular)"
        fillOpacity="0.85"
      />
      <path
        d="M50 0C50 27.6142 72.3858 50 100 50C72.3858 50 50 72.3858 50 100C50 72.3858 27.6142 50 0 50C27.6142 50 50 27.6142 50 0Z"
        stroke="url(#chromeEdge)"
        strokeWidth="1.2"
      />

      {/* Internal highlight core reflection */}
      <circle
        cx="48"
        cy="48"
        r="8"
        fill="#ffffff"
        fillOpacity="0.4"
        filter="blur(2px)"
      />
    </svg>
  );
};
