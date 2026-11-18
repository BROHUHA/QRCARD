import React, { useEffect, useRef } from 'react';
import QRCodePackage from 'qrcode.react';

const QRCodeComponent = QRCodePackage.default || QRCodePackage;

export const SafeQRCode = ({
  value = '',
  size = 150,
  level = 'M',
  includeMargin = false,
  className = '',
  fgColor = '#000000',
  bgColor = '#FFFFFF',
  gradient = null, // { id: string, startColor: string, endColor: string }
  ...props
}) => {
  const containerRef = useRef(null);
  const gradientId = gradient?.id || 'qr-designer-gradient';

  useEffect(() => {
    if (!containerRef.current) return;
    const svg = containerRef.current.querySelector('svg');
    if (!svg) return;

    let defs = svg.querySelector('defs');
    if (gradient && gradient.startColor && gradient.endColor) {
      if (!defs) {
        defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        svg.insertBefore(defs, svg.firstChild);
      }
      defs.innerHTML = `
        <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${gradient.startColor}" />
          <stop offset="100%" stop-color="${gradient.endColor}" />
        </linearGradient>
      `;
    } else if (defs) {
      defs.remove();
    }
  }, [gradient, gradientId, value, size, level]);

  const effectiveFgColor =
    gradient && gradient.startColor && gradient.endColor
      ? `url(#${gradientId})`
      : fgColor;

  return (
    <div
      ref={containerRef}
      className={`inline-flex items-center justify-center ${className}`}
    >
      <QRCodeComponent
        value={value || 'https://allqr.studio'}
        size={size}
        level={level}
        includeMargin={includeMargin}
        renderAs="svg"
        fgColor={effectiveFgColor}
        bgColor={bgColor}
        {...props}
      />
    </div>
  );
};
