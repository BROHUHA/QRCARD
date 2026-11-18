import React from 'react';
import { BadgeCheck } from 'lucide-react';
import { PLATFORMS_CONFIG } from './ui/socialConfig';
import { SocialIcon } from './ui/SocialIcons';
import {
  LIGHT_GRADIENTS,
  QR_BG_STYLES,
  DESIGNER_TEMPLATES,
} from './ui/designerTemplates';
import { TACTILE_STYLES } from './ui/tactileStyles';
import { SafeQRCode } from './ui/SafeQRCode';
import { TactileQRCode } from './ui/TactileQRCode';
import { ASPECT_CONFIG_MAP } from './ui/cardStyleEngine';

export const SocialCard = ({ id, settings }) => {
  const {
    platform = 'instagram',
    value = '',
    displayName = '',
    bio = '',
    verified = true,
    theme = 'glacier-blue',
    bgPreset = 'glacier-blue',
    qrMaterial = 'classic',
    gradientConfig = {
      startColor: '#F7FBFF',
      endColor: '#DDEEFF',
      startStop: 0,
      endStop: 100,
      direction: 135,
    },
    showCenterLogo = true,
    portrait = false,
    hideDisplayName = false,
    hideHyperlink = true,
  } = settings;

  const currentPlat =
    PLATFORMS_CONFIG.find((p) => p.id === platform) || PLATFORMS_CONFIG[0];

  const base = currentPlat.baseUrl || 'https://';
  const isPhonePlat = platform === 'whatsapp';
  const cleanVal = isPhonePlat
    ? value.replace(/[^\d+]/g, '')
    : value.replace(/^@/, '').replace(/^https?:\/\/[^/]+\//, '');
  const finalUrl = isPhonePlat
    ? `${base}${cleanVal.replace(/^\+/, '')}`
    : `${base}${cleanVal}`;
  const displayHandle = isPhonePlat
    ? value || '+12 3455678'
    : cleanVal || 'username';

  // Aspect Ratio and Layout Configuration
  const aspectRatio = settings.aspectRatio || 'auto';
  const isQrOnly = aspectRatio === '1:1';

  // Use shared config from cardStyleEngine
  const sharedCfg = ASPECT_CONFIG_MAP[aspectRatio] || ASPECT_CONFIG_MAP.auto;
  const isHorizontal = sharedCfg.layout === 'horizontal';

  // Social-specific overrides for vertical portrait ratios
  const socialVerticalOverrides = {
    '9:16': {
      qrSize: 180,
      nameSize: 'text-xl sm:text-2xl font-extrabold',
      handleSize: 'text-xs sm:text-sm font-mono',
      showBio: true,
      bioClamp: 'text-xs max-w-xs leading-relaxed line-clamp-2',
      urlSize: 'text-xs',
    },
    '4:5': {
      qrSize: 145,
      nameSize: 'text-lg sm:text-xl font-black',
      handleSize: 'text-xs font-mono',
      showBio: true,
      bioClamp: 'line-clamp-2 text-xs max-w-xs',
      urlSize: 'text-xs',
    },
    '3:4': {
      qrSize: 148,
      nameSize: 'text-lg sm:text-xl font-bold',
      handleSize: 'text-xs font-mono',
      showBio: true,
      bioClamp: 'line-clamp-2 text-xs max-w-xs',
      urlSize: 'text-xs',
    },
    '16:9': {
      qrSize: 150,
      nameSize: 'text-xl sm:text-2xl font-bold',
      handleSize: 'text-xs sm:text-sm font-mono',
      showBio: true,
      bioClamp: 'text-xs line-clamp-2 max-w-sm',
      urlSize: 'text-xs',
    },
    '3:2': {
      qrSize: 145,
      nameSize: 'text-xl sm:text-2xl font-bold',
      handleSize: 'text-xs sm:text-sm font-mono',
      showBio: true,
      bioClamp: 'text-xs line-clamp-2 max-w-sm',
      urlSize: 'text-xs',
    },
    card: {
      qrSize: 130,
      nameSize: 'text-base sm:text-lg font-bold',
      handleSize: 'text-xs font-mono',
      showBio: false,
      bioClamp: '',
      urlSize: 'text-[10px] sm:text-xs',
    },
    auto: {
      qrSize: isHorizontal ? 164 : 175,
      nameSize: 'text-2xl sm:text-3xl font-extrabold',
      handleSize: 'text-sm sm:text-base font-mono',
      showBio: true,
      bioClamp: 'text-xs max-w-sm',
      urlSize: 'text-xs',
    },
    '1:1': {
      qrSize: 220,
    },
  };

  const socialCfg =
    socialVerticalOverrides[aspectRatio] || socialVerticalOverrides.auto;
  const qrSize = socialCfg.qrSize || sharedCfg.qrSize;

  // Build merged config for layout classes
  const cfg = {
    ...sharedCfg,
    ...socialCfg,
    container: sharedCfg.container,
    body: sharedCfg.body,
    headerPadding: sharedCfg.headerPadding,
    textAlign: sharedCfg.textAlign || 'text-left',
    alignItems: sharedCfg.alignItems || 'items-start',
    footerPadding: sharedCfg.footerPadding || 'pt-2',
  };

  // QR Glass Background Style Resolution
  const qrBgStyleId = settings.qrBgStyle || 'white';
  const qrBgConfig =
    QR_BG_STYLES.find((s) => s.id === qrBgStyleId) || QR_BG_STYLES[0];

  // 1. BACKGROUND RESOLUTION
  const bgImage = settings.bgImage;
  const bgImageBlur = settings.bgImageBlur ?? 0;
  const bgImageOverlay = settings.bgImageOverlay ?? 0.25;

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

  // 2. QR MATERIAL RESOLUTION
  const activeQrMaterial = qrMaterial || 'classic';
  const isTactileQr = TACTILE_STYLES.some((t) => t.id === activeQrMaterial);

  // Style Tokens
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
    cardBg = darkMatch.cardStyle.cardBg;
    headerBorder = darkMatch.cardStyle.headerBorder;
    textColor = darkMatch.cardStyle.textColor;
    subTextColor = darkMatch.cardStyle.subTextColor;
    badgeBg = darkMatch.cardStyle.badgeBg;
    iconBox = darkMatch.cardStyle.iconBox;
    qrFrame = darkMatch.cardStyle.qrFrame;
    glowEffect = darkMatch.cardStyle.glow;
    isLightCard = darkMatch.id === 'swiss-mono';
  }

  // Shared QR renderer
  const renderQr = (size) => (
    <div
      className={`transition-all shadow-xl rounded-2xl overflow-hidden ${
        isTactileQr
          ? 'p-0 border border-black/10'
          : `p-2.5 ${qrBgConfig.frameClass}`
      }`}
    >
      <div className="relative flex items-center justify-center">
        {isTactileQr ? (
          <TactileQRCode
            value={finalUrl}
            styleId={activeQrMaterial}
            size={size}
            className="rounded-2xl"
            bgFillCustom={qrBgConfig.id !== 'white' ? qrBgConfig.svgFill : null}
          />
        ) : (
          <SafeQRCode
            value={finalUrl}
            size={size}
            level="H"
            fgColor={qrBgConfig.fgColor}
            bgColor={qrBgConfig.bgColor}
          />
        )}

        {!isTactileQr && showCenterLogo && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className={`w-8 h-8 rounded-lg p-1 shadow-md border flex items-center justify-center ${
                qrBgConfig.id === 'inverted-glass'
                  ? 'bg-neutral-900 border-white/20 text-white'
                  : 'bg-white border-neutral-300 text-black'
              }`}
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.25)' }}
            >
              <SocialIcon
                platform={platform}
                size={18}
                className={
                  qrBgConfig.id === 'inverted-glass'
                    ? 'text-white'
                    : 'text-black'
                }
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div
      id={id}
      className={`relative overflow-hidden rounded-[28px] border select-none transition-all duration-300 ${cardBg} ${cfg.container}`}
      style={
        !isCustomImage && isLightGradient
          ? { background: dynamicBgStyle }
          : undefined
      }
    >
      {/* Background Image Layer */}
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

      {/* Dynamic Ambient Glow */}
      {isBrandTheme ? (
        <div
          className="absolute -top-12 -right-12 w-80 h-80 rounded-full pointer-events-none opacity-45 blur-3xl transition-colors duration-500"
          style={{ backgroundColor: currentPlat.brandColor }}
        />
      ) : (
        !isLightGradient &&
        !isCustomImage && (
          <div
            className={`absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl pointer-events-none ${glowEffect}`}
          />
        )
      )}

      {/* 1. CARD HEADER */}
      {!isQrOnly && (
        <div
          className={`flex items-center justify-between border-b ${
            cfg.headerPadding || 'pb-3.5 mb-4'
          } relative z-10 ${headerBorder}`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center transition-all ${iconBox}`}
              style={
                isBrandTheme
                  ? {
                      background: currentPlat.brandColor,
                      color:
                        currentPlat.id === 'github' ||
                        currentPlat.id === 'threads'
                          ? '#000000'
                          : '#FFFFFF',
                      boxShadow: `0 0 15px ${currentPlat.glowColor}`,
                    }
                  : {}
              }
            >
              <SocialIcon platform={platform} size={20} />
            </div>

            <div>
              <div
                className={`text-sm font-extrabold tracking-tight font-heading leading-tight ${textColor}`}
              >
                {currentPlat.name}
              </div>
              <div
                className={`text-[11px] font-mono opacity-65 ${subTextColor}`}
              >
                {currentPlat.prefix}
                {displayHandle}
              </div>
            </div>
          </div>

          <div
            className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5 ${badgeBg}`}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: currentPlat.brandColor }}
            />
            <span>CONNECT</span>
          </div>
        </div>
      )}

      {/* 2. MAIN CARD BODY */}
      <div
        className={`relative z-10 w-full ${
          isQrOnly
            ? 'flex-1 flex items-center justify-center my-auto h-full'
            : cfg.body
        }`}
      >
        {isQrOnly ? (
          /* 1:1 Pure QR Hero Display */
          <div className="relative shrink-0 flex items-center justify-center animate-fade-in my-auto">
            <div
              className={`transition-all shadow-2xl rounded-2xl overflow-hidden ${
                isTactileQr
                  ? 'p-0 border border-black/10'
                  : `p-3.5 ${qrBgConfig.frameClass}`
              }`}
            >
              <div className="relative flex items-center justify-center">
                {isTactileQr ? (
                  <TactileQRCode
                    value={finalUrl}
                    styleId={activeQrMaterial}
                    size={qrSize}
                    className="rounded-2xl"
                    bgFillCustom={
                      qrBgConfig.id !== 'white' ? qrBgConfig.svgFill : null
                    }
                  />
                ) : (
                  <SafeQRCode
                    value={finalUrl}
                    size={qrSize}
                    level="H"
                    fgColor={qrBgConfig.fgColor}
                    bgColor={qrBgConfig.bgColor}
                  />
                )}

                {!isTactileQr && showCenterLogo && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div
                      className={`w-9 h-9 rounded-xl p-1.5 shadow-md border flex items-center justify-center ${
                        qrBgConfig.id === 'inverted-glass'
                          ? 'bg-neutral-900 border-white/20 text-white'
                          : 'bg-white border-neutral-300 text-black'
                      }`}
                      style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.25)' }}
                    >
                      <SocialIcon
                        platform={platform}
                        size={20}
                        className={
                          qrBgConfig.id === 'inverted-glass'
                            ? 'text-white'
                            : 'text-black'
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : isHorizontal ? (
          <>
            {/* Horizontal Left Column: Identity + Bottom URL */}
            <div className="flex-1 space-y-2.5 w-full flex flex-col justify-between text-left items-start min-h-0">
              <div className="space-y-1">
                {!hideDisplayName && displayName && (
                  <div className="flex items-center gap-2 flex-wrap justify-start">
                    <span
                      className={`${cfg.nameSize} tracking-tight font-heading leading-tight ${textColor}`}
                    >
                      {displayName}
                    </span>
                    {verified && (
                      <span
                        className="inline-flex items-center text-sky-500 drop-shadow-sm"
                        title="Verified Profile"
                      >
                        <BadgeCheck
                          size={18}
                          strokeWidth={2.5}
                          className="text-white fill-sky-500"
                        />
                      </span>
                    )}
                  </div>
                )}

                <div
                  className={`${cfg.handleSize} font-mono font-semibold flex items-center justify-start`}
                >
                  {currentPlat.prefix && (
                    <span className="opacity-60">{currentPlat.prefix}</span>
                  )}
                  <span className={textColor}>{displayHandle}</span>
                </div>

                {cfg.showBio && bio && (
                  <div
                    className={`mt-1.5 ${
                      cfg.bioClamp || 'text-xs'
                    } leading-relaxed ${subTextColor}`}
                  >
                    {bio}
                  </div>
                )}
              </div>

              {!hideHyperlink && (
                <div
                  className={`w-full ${cfg.footerPadding || 'pt-2'} border-t ${
                    isLightCard ? 'border-slate-300/60' : 'border-white/[0.08]'
                  }`}
                >
                  <div
                    className={`${
                      cfg.urlSize || 'text-xs'
                    } font-mono truncate max-w-sm ${subTextColor}`}
                  >
                    {finalUrl}
                  </div>
                </div>
              )}
            </div>

            {/* Horizontal Right Column: QR Code */}
            <div className="relative shrink-0 flex items-center justify-center">
              {renderQr(qrSize)}
            </div>
          </>
        ) : (
          <>
            {/* Vertical Tier 1: Identity Details */}
            <div
              className={`w-full ${cfg.textAlign} flex flex-col ${cfg.alignItems} shrink-0`}
            >
              {!hideDisplayName && displayName && (
                <div
                  className={`flex items-center gap-2 flex-wrap ${
                    cfg.textAlign === 'text-center'
                      ? 'justify-center'
                      : 'justify-start'
                  }`}
                >
                  <span
                    className={`${cfg.nameSize} tracking-tight font-heading leading-tight ${textColor}`}
                  >
                    {displayName}
                  </span>
                  {verified && (
                    <span
                      className="inline-flex items-center text-sky-500 drop-shadow-sm"
                      title="Verified Profile"
                    >
                      <BadgeCheck
                        size={18}
                        strokeWidth={2.5}
                        className="text-white fill-sky-500"
                      />
                    </span>
                  )}
                </div>
              )}

              <div
                className={`${
                  cfg.handleSize
                } font-mono font-semibold mt-0.5 flex items-center ${
                  cfg.textAlign === 'text-center'
                    ? 'justify-center'
                    : 'justify-start'
                }`}
              >
                {currentPlat.prefix && (
                  <span className="opacity-60">{currentPlat.prefix}</span>
                )}
                <span className={textColor}>{displayHandle}</span>
              </div>

              {cfg.showBio && bio && (
                <div
                  className={`mt-1 ${
                    cfg.bioClamp || 'text-xs'
                  } leading-relaxed ${subTextColor} ${
                    cfg.textAlign === 'text-center' ? 'mx-auto' : ''
                  }`}
                >
                  {bio}
                </div>
              )}
            </div>

            {/* Vertical Tier 2: QR Hero (Centered) */}
            <div className="relative shrink-0 flex items-center justify-center my-auto py-1">
              {renderQr(qrSize)}
            </div>

            {/* Vertical Tier 3: Scan / URL Footer */}
            {!hideHyperlink && (
              <div
                className={`w-full ${
                  cfg.footerPadding || 'pt-2'
                } border-t shrink-0 ${
                  isLightCard ? 'border-slate-300/60' : 'border-white/[0.08]'
                }`}
              >
                <div
                  className={`${
                    cfg.urlSize || 'text-xs'
                  } font-mono truncate max-w-sm ${subTextColor} ${
                    cfg.textAlign === 'text-center' ? 'mx-auto' : ''
                  }`}
                >
                  {finalUrl}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
