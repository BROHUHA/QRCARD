import React from 'react';

export const CoffeeBeanIcon = ({ size = 18, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <path
      d="M12 3C7.03 3 3 7.03 3 12C3 16.97 7.03 21 12 21C16.97 21 21 16.97 21 12C21 7.03 16.97 3 12 3Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M12 3.5C10 7.5 9.5 10.5 12 12C14.5 13.5 14 16.5 12 20.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export const MossLeafIcon = ({ size = 18, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <path
      d="M12 22C12 22 12 15 17 11C22 7 21 2 21 2C21 2 16 3 12 8C8 3 3 2 3 2C3 2 2 7 7 11C12 15 12 22 12 22Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 8V22"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export const CeramicTileIcon = ({ size = 18, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <rect
      x="3"
      y="3"
      width="18"
      height="18"
      rx="3"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path d="M12 3L21 12L12 21L3 12Z" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="12" cy="12" r="2.5" fill="currentColor" />
  </svg>
);

export const CitrusSliceIcon = ({ size = 18, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
    <circle
      cx="12"
      cy="12"
      r="6"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeDasharray="2 2"
    />
    <path
      d="M12 3V21M3 12H21M5.64 5.64L18.36 18.36M18.36 5.64L5.64 18.36"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);

export const ChickMascotIcon = ({ size = 18, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
    <circle cx="9.5" cy="10" r="1.2" fill="currentColor" />
    <circle cx="14.5" cy="10" r="1.2" fill="currentColor" />
    <polygon points="10,13 12,15.5 14,13" fill="currentColor" />
    <path
      d="M12 4C11.5 2.5 12.5 1.5 12 1"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

export const ClassicQrIcon = ({ size = 18, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <rect
      x="3"
      y="3"
      width="7"
      height="7"
      rx="1.5"
      stroke="currentColor"
      strokeWidth="2"
    />
    <rect x="5.5" y="5.5" width="2" height="2" fill="currentColor" />
    <rect
      x="14"
      y="3"
      width="7"
      height="7"
      rx="1.5"
      stroke="currentColor"
      strokeWidth="2"
    />
    <rect x="16.5" y="5.5" width="2" height="2" fill="currentColor" />
    <rect
      x="3"
      y="14"
      width="7"
      height="7"
      rx="1.5"
      stroke="currentColor"
      strokeWidth="2"
    />
    <rect x="5.5" y="16.5" width="2" height="2" fill="currentColor" />
    <rect x="14" y="14" width="3" height="3" fill="currentColor" />
    <rect x="18" y="14" width="3" height="3" fill="currentColor" />
    <rect x="14" y="18" width="3" height="3" fill="currentColor" />
    <rect x="18" y="18" width="3" height="3" fill="currentColor" />
  </svg>
);

export const MaterialIcon = ({ materialId, size = 18, className = '' }) => {
  switch (materialId) {
    case 'coffee-beans':
      return <CoffeeBeanIcon size={size} className={className} />;
    case 'botanical-moss':
      return <MossLeafIcon size={size} className={className} />;
    case 'ceramic-tiles':
      return <CeramicTileIcon size={size} className={className} />;
    case 'candied-orange':
      return <CitrusSliceIcon size={size} className={className} />;
    case 'fluffy-plush':
      return <ChickMascotIcon size={size} className={className} />;
    case 'classic':
    default:
      return <ClassicQrIcon size={size} className={className} />;
  }
};
