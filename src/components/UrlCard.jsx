import React from 'react';
import { Globe, ArrowUpRight } from 'lucide-react';
import {
  resolveCardTheme,
  SpecimenCardContainer,
  SpecimenQRCode,
} from './ui/cardStyleEngine';

export const UrlCard = ({ id, settings }) => {
  const {
    url = 'https://allqr.studio',
    title = 'DIGITAL GATEWAY',
    hideTitle = false,
    showCenterLogo = true,
  } = settings;

  const themeResult = resolveCardTheme(settings);
  const {
    cfg,
    isQrOnly,
    qrSize,
    qrBgConfig,
    activeQrMaterial,
    headerBorder,
    textColor,
    subTextColor,
    badgeBg,
    iconBox,
    isLightCard,
  } = themeResult;

  const validUrl = url
    ? url.startsWith('http')
      ? url
      : `https://${url}`
    : 'https://';

  return (
    <SpecimenCardContainer id={id} themeResult={themeResult}>
      {/* 1. CARD HEADER (Omitted in 1:1 QR-Only mode) */}
      {!isQrOnly && (
        <div
          className={`flex items-center justify-between border-b ${
            cfg.headerPadding || 'pb-3.5 mb-4'
          } relative z-10 ${headerBorder}`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center transition-all ${iconBox}`}
            >
              <Globe size={18} />
            </div>
            <div>
              <div
                className={`text-sm font-extrabold tracking-tight font-heading leading-tight ${textColor}`}
              >
                Website Link
              </div>
              <div
                className={`text-[11px] font-mono opacity-65 ${subTextColor}`}
              >
                Scan to visit
              </div>
            </div>
          </div>

          <div
            className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5 ${badgeBg}`}
          >
            <span>Open Link</span>
            <ArrowUpRight size={11} className="text-emerald-500" />
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
            <SpecimenQRCode
              value={validUrl}
              size={qrSize}
              qrMaterial={activeQrMaterial}
              qrBgConfig={qrBgConfig}
              centerIcon={<Globe size={18} />}
              showCenterLogo={showCenterLogo}
            />
          </div>
        ) : (
          <>
            <div className={`space-y-3 w-full flex-1 ${cfg.textAlign}`}>
              {!hideTitle && title && (
                <div>
                  <div
                    className={`font-heading font-extrabold tracking-tight break-all ${cfg.nameSize} ${textColor}`}
                  >
                    {title}
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <div
                  className={`px-3.5 py-2.5 rounded-xl font-mono text-xs border truncate max-w-sm ${
                    isLightCard
                      ? 'bg-slate-900/5 border-slate-900/10 text-slate-800'
                      : 'bg-white/10 border-white/15 text-neutral-100'
                  }`}
                >
                  {validUrl}
                </div>
              </div>

              <div className="pt-1">
                <div
                  className={`text-[11px] font-mono opacity-60 flex items-center gap-1.5 ${subTextColor}`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span>Scan with camera to open in browser</span>
                </div>
              </div>
            </div>

            {/* QR Code Container */}
            <div className="shrink-0 flex items-center justify-center">
              <SpecimenQRCode
                value={validUrl}
                size={qrSize}
                qrMaterial={activeQrMaterial}
                qrBgConfig={qrBgConfig}
                centerIcon={<Globe size={16} />}
                showCenterLogo={showCenterLogo}
              />
            </div>
          </>
        )}
      </div>
    </SpecimenCardContainer>
  );
};
