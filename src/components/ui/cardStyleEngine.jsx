import React from 'react';
import { SafeQRCode } from './SafeQRCode';
import { TactileQRCode } from './TactileQRCode';
import {
  DESIGNER_TEMPLATES,
  LIGHT_GRADIENTS,
  QR_BG_STYLES,
} from './designerTemplates';
import { TACTILE_STYLES } from './tactileStyles';

// Determine if the aspect ratio should use a horizontal (side-by-side) layout
export const isHorizontalAspect = (ratio) =>
  ['16:9', '3:2', 'card', 'auto'].includes(ratio);

// Determine if the aspect ratio should use a vertical (stacked) layout
export const isVerticalAspect = (ratio) =>
  ['1:1', '9:16', '4:5', '3:4'].includes(ratio);

export const ASPECT_CONFIG_MAP = {
  '1:1': {
    container:
      'w-full aspect-square max-w-[420px] mx-auto flex flex-col items-center justify-center p-6 sm:p-8 text-center',
    body: 'flex items-center justify-center w-full h-full my-auto',
    qrOnly: true,
    qrSize: 220,
    layout: 'vertical',
  },
  '9:16': {
    container:
      'w-full aspect-[9/16] max-w-[380px] mx-auto flex flex-col justify-between py-6 px-5 sm:py-7 sm:px-6 text-center',
    headerPadding: 'pb-2.5 mb-3',
    body: 'flex flex-col items-center justify-between flex-1 min-h-0 w-full py-2',
    textAlign: 'text-center',
    alignItems: 'items-center',
    qrSize: 180,
    nameSize: 'text-xl sm:text-2xl font-extrabold',
    metaSize: 'text-xs sm:text-sm font-mono',
    footerPadding: 'pt-2',
    layout: 'vertical',
  },
  '4:5': {
    container:
      'w-full aspect-[4/5] max-w-[420px] mx-auto flex flex-col justify-between p-4 sm:p-5 text-center',
    headerPadding: 'pb-2 mb-2',
    body: 'flex flex-col items-center justify-between flex-1 min-h-0 w-full py-1.5',
    textAlign: 'text-center',
    alignItems: 'items-center',
    qrSize: 148,
    nameSize: 'text-lg sm:text-xl font-black',
    metaSize: 'text-xs font-mono',
    footerPadding: 'pt-1.5',
    layout: 'vertical',
  },
  '3:4': {
    container:
      'w-full aspect-[3/4] max-w-[420px] mx-auto flex flex-col justify-between p-4 sm:p-5 text-center',
    headerPadding: 'pb-2 mb-2',
    body: 'flex flex-col items-center justify-between flex-1 min-h-0 w-full py-1.5',
    textAlign: 'text-center',
    alignItems: 'items-center',
    qrSize: 152,
    nameSize: 'text-lg sm:text-xl font-bold',
    metaSize: 'text-xs font-mono',
    footerPadding: 'pt-1.5',
    layout: 'vertical',
  },
  '16:9': {
    container:
      'w-full aspect-[16/9] max-w-[660px] mx-auto flex flex-col justify-between p-5 sm:p-6 text-left',
    headerPadding: 'pb-2 mb-2.5',
    body: 'flex flex-row items-center justify-between gap-5 flex-1 min-h-0',
    textAlign: 'text-left',
    alignItems: 'items-start',
    qrSize: 150,
    nameSize: 'text-xl sm:text-2xl font-bold',
    metaSize: 'text-xs sm:text-sm font-mono',
    footerPadding: 'pt-2',
    layout: 'horizontal',
  },
  '3:2': {
    container:
      'w-full aspect-[3/2] max-w-[600px] mx-auto flex flex-col justify-between p-5 sm:p-6 text-left',
    headerPadding: 'pb-2 mb-2.5',
    body: 'flex flex-row items-center justify-between gap-5 flex-1 min-h-0',
    textAlign: 'text-left',
    alignItems: 'items-start',
    qrSize: 145,
    nameSize: 'text-xl sm:text-2xl font-bold',
    metaSize: 'text-xs sm:text-sm font-mono',
    footerPadding: 'pt-2',
    layout: 'horizontal',
  },
  card: {
    container:
      'w-full aspect-[1.586/1] max-w-[520px] mx-auto flex flex-col justify-between p-4 sm:p-5 text-left',
    headerPadding: 'pb-1.5 mb-1.5',
    body: 'flex flex-row items-center justify-between gap-4 flex-1 min-h-0',
    textAlign: 'text-left',
    alignItems: 'items-start',
    qrSize: 130,
    nameSize: 'text-base sm:text-lg font-bold',
    metaSize: 'text-[11px] font-mono',
    footerPadding: 'pt-1.5',
    layout: 'horizontal',
  },
  auto: {
    container: 'w-full max-w-[620px] mx-auto p-6 sm:p-8 text-left',
    headerPadding: 'pb-3 mb-3.5',
    body: 'flex flex-col sm:flex-row justify-between items-center gap-6 text-left',
    textAlign: 'text-left',
    alignItems: 'items-start',
    qrSize: 164,
    nameSize: 'text-2xl sm:text-3xl font-extrabold',
    metaSize: 'text-sm sm:text-base font-mono',
    footerPadding: 'pt-2',
    layout: 'horizontal',
  },
};

export const resolveCardTheme = (settings = {}) => {
  const {
    theme = 'opal-mint',
    bgPreset = 'opal-mint',
    qrMaterial = 'classic',
    qrBgStyle = 'white',
    gradientConfig = {
      startColor: '#E0F7F6',
      endColor: '#C5ECE9',
      startStop: 0,
      endStop: 100,
      direction: 180,
    },
    bgImage = null,
    bgImageBlur = 0,
    bgImageOverlay = 0.25,
    aspectRatio = 'auto',
  } = settings;

  const isQrOnly = aspectRatio === '1:1';
  const cfg = ASPECT_CONFIG_MAP[aspectRatio] || ASPECT_CONFIG_MAP.auto;

  const qrBgConfig =
    QR_BG_STYLES.find((s) => s.id === qrBgStyle) || QR_BG_STYLES[0];

  const activeBgId =
    bgPreset ||
    (LIGHT_GRADIENTS.some((g) => g.id === theme)
      ? theme
      : LIGHT_GRADIENTS[0]?.id || 'opal-mint');
  const isCustomImage =
    (activeBgId === 'custom-image' || !bgPreset) && !!bgImage;
  const lightGradientMatch = LIGHT_GRADIENTS.find((g) => g.id === activeBgId);
  const isLightGradient = !isCustomImage && !!lightGradientMatch;
  const isBrandTheme = theme === 'brand' && !bgPreset && !isCustomImage;
  const darkMatch =
    DESIGNER_TEMPLATES.find((t) => t.id === activeBgId) ||
    DESIGNER_TEMPLATES[0];

  const direction = gradientConfig?.direction ?? 180;
  const startColor =
    gradientConfig?.startColor || lightGradientMatch?.startColor || '#E0F7F6';
  const endColor =
    gradientConfig?.endColor || lightGradientMatch?.endColor || '#C5ECE9';
  const startStop = gradientConfig?.startStop ?? 0;
  const endStop = gradientConfig?.endStop ?? 100;

  const dynamicBgStyle = `linear-gradient(${direction}deg, ${startColor} ${startStop}%, ${endColor} ${endStop}%)`;

  const activeQrMaterial = qrMaterial || 'classic';
  const isTactileQr = TACTILE_STYLES.some((t) => t.id === activeQrMaterial);

  let cardBg,
    headerBorder,
    textColor,
    subTextColor,
    badgeBg,
    iconBox,
    qrFrame,
    glowEffect,
    isLightCard;

  if (isCustomImage) {
    cardBg = 'text-white border-white/20 shadow-[0_30px_70px_rgba(0,0,0,0.85)]';
    headerBorder = 'border-white/20';
    textColor = 'text-white';
    subTextColor = 'text-neutral-200';
    badgeBg =
      'bg-white/20 text-white backdrop-blur-md border border-white/25 shadow-sm font-bold';
    iconBox =
      'bg-white/20 text-white backdrop-blur-md border border-white/25 shadow-md';
    qrFrame = 'bg-white/95 border border-white/40 shadow-2xl backdrop-blur-md';
    glowEffect = 'bg-white/20';
    isLightCard = false;
  } else if (isLightGradient) {
    cardBg =
      'text-slate-900 border-slate-300/80 shadow-[0_25px_60px_-10px_rgba(0,0,0,0.15)]';
    headerBorder = 'border-slate-300/70';
    textColor = 'text-slate-900';
    subTextColor = 'text-slate-600';
    badgeBg =
      'bg-white/90 text-slate-800 border border-slate-300 shadow-sm font-bold';
    iconBox = 'bg-white text-slate-900 border border-slate-200 shadow-md';
    qrFrame =
      'bg-white/95 border border-slate-200/90 shadow-2xl backdrop-blur-md';
    glowEffect = 'bg-white/40';
    isLightCard = true;
  } else if (isBrandTheme) {
    cardBg =
      'bg-gradient-to-br from-[#121214] via-[#0D0D0E] to-[#050505] text-white border-white/15 shadow-[0_30px_70px_rgba(0,0,0,0.9)]';
    headerBorder = 'border-white/10';
    textColor = 'text-white';
    subTextColor = 'text-neutral-400';
    badgeBg = 'bg-white/10 text-white border border-white/20 font-bold';
    iconBox = 'bg-white text-black font-bold shadow-md';
    qrFrame = 'bg-white border border-white/20 shadow-2xl';
    glowEffect = 'blur-3xl';
    isLightCard = false;
  } else {
    cardBg =
      darkMatch?.cardStyle?.cardBg ||
      'bg-[#121214] text-white border-white/15 shadow-2xl';
    headerBorder = darkMatch?.cardStyle?.headerBorder || 'border-white/10';
    textColor = darkMatch?.cardStyle?.textColor || 'text-white';
    subTextColor = darkMatch?.cardStyle?.subTextColor || 'text-neutral-400';
    badgeBg =
      darkMatch?.cardStyle?.badgeBg ||
      'bg-white/10 text-white border border-white/20';
    iconBox =
      darkMatch?.cardStyle?.iconBox ||
      'bg-white/10 text-white border border-white/20';
    qrFrame = darkMatch?.cardStyle?.qrFrame || 'bg-white text-black shadow-2xl';
    glowEffect = darkMatch?.cardStyle?.glow || 'bg-white/10';
    isLightCard = darkMatch?.id === 'swiss-mono';
  }

  const isHorizontal = cfg.layout === 'horizontal';

  return {
    cfg,
    isQrOnly,
    isHorizontal,
    qrSize: cfg.qrSize,
    qrBgConfig,
    activeBgId,
    isCustomImage,
    bgImage,
    bgImageBlur,
    bgImageOverlay,
    isLightGradient,
    dynamicBgStyle,
    activeQrMaterial,
    isTactileQr,
    cardBg,
    headerBorder,
    textColor,
    subTextColor,
    badgeBg,
    iconBox,
    qrFrame,
    glowEffect,
    isLightCard,
  };
};

export const SpecimenCardContainer = ({
  id,
  themeResult,
  children,
  className = '',
}) => {
  const {
    cfg,
    isCustomImage,
    bgImage,
    bgImageBlur,
    bgImageOverlay,
    isLightGradient,
    dynamicBgStyle,
    cardBg,
    glowEffect,
  } = themeResult;

  return (
    <div
      id={id}
      className={`relative overflow-hidden rounded-[28px] border select-none transition-all duration-300 ${cardBg} ${cfg.container} ${className}`}
      style={
        !isCustomImage && isLightGradient
          ? { background: dynamicBgStyle }
          : undefined
      }
    >
      {/* Background Image Layer with Optional Frosted Blur & Contrast Scrim */}
      {isCustomImage && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-300 pointer-events-none"
            style={{
              backgroundImage: `url(${bgImage})`,
              filter: bgImageBlur ? `blur(${bgImageBlur}px)` : undefined,
              transform: bgImageBlur ? 'scale(1.08)' : undefined,
            }}
          />
          <div
            className="absolute inset-0 transition-opacity duration-300 pointer-events-none"
            style={{
              backgroundColor: '#000000',
              opacity: bgImageOverlay,
            }}
          />
        </>
      )}

      {/* Dynamic Ambient Glow Behind Card */}
      {!isLightGradient && !isCustomImage && (
        <div
          className={`absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl pointer-events-none ${glowEffect}`}
        />
      )}

      {children}
    </div>
  );
};

export const SpecimenQRCode = ({
  value,
  size = 160,
  qrMaterial = 'classic',
  qrBgConfig,
  centerIcon = null,
  showCenterLogo = true,
}) => {
  const isTactile = TACTILE_STYLES.some((t) => t.id === qrMaterial);

  return (
    <div
      className={`transition-all shadow-2xl rounded-2xl overflow-hidden shrink-0 ${
        isTactile
          ? 'p-0 border border-black/10'
          : `p-3.5 ${qrBgConfig?.frameClass || 'bg-white shadow-xl'}`
      }`}
    >
      <div className="relative flex items-center justify-center">
        {isTactile ? (
          <TactileQRCode
            value={value}
            styleId={qrMaterial}
            size={size}
            className="rounded-2xl"
            bgFillCustom={
              qrBgConfig?.id !== 'white' ? qrBgConfig?.svgFill : null
            }
          />
        ) : (
          <SafeQRCode
            value={value}
            size={size}
            level="H"
            fgColor={qrBgConfig?.fgColor || '#000000'}
            bgColor={qrBgConfig?.bgColor || '#FFFFFF'}
          />
        )}

        {!isTactile && showCenterLogo && centerIcon && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className={`w-8 h-8 rounded-xl p-1.5 shadow-md border flex items-center justify-center ${
                qrBgConfig?.id === 'inverted-glass'
                  ? 'bg-neutral-900 border-white/20 text-white'
                  : 'bg-white border-neutral-300 text-black'
              }`}
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.25)' }}
            >
              {centerIcon}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
