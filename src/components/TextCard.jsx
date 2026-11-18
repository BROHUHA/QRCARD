import React from 'react';
import { FileText, AlignLeft } from 'lucide-react';
import {
  resolveCardTheme,
  SpecimenCardContainer,
  SpecimenQRCode,
} from './ui/cardStyleEngine';

export const TextCard = ({ id, settings }) => {
  const {
    text = 'Hello, scan to read or copy this text directly to your device.',
    title = 'Quick Note',
    showCenterLogo = true,
  } = settings;

  const themeResult = resolveCardTheme(settings);
  const {
    cfg,
    isQrOnly,
    isHorizontal,
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

  const textPayload = text || 'ALL QR STUDIO';

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
              <FileText size={18} />
            </div>
            <div>
              <div
                className={`text-sm font-extrabold tracking-tight font-heading leading-tight ${textColor}`}
              >
                Text Note
              </div>
              <div
                className={`text-[11px] font-mono opacity-65 ${subTextColor}`}
              >
                Scan to read
              </div>
            </div>
          </div>

          <div
            className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5 ${badgeBg}`}
          >
            <AlignLeft size={11} className="text-emerald-500" />
            <span>Note</span>
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
              value={textPayload}
              size={qrSize}
              qrMaterial={activeQrMaterial}
              qrBgConfig={qrBgConfig}
              centerIcon={<FileText size={18} />}
              showCenterLogo={showCenterLogo}
            />
          </div>
        ) : (
          <>
            <div className={`space-y-3 w-full flex-1 ${cfg.textAlign}`}>
              {title && (
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
                  className={`p-3 rounded-xl font-mono text-xs border leading-relaxed whitespace-pre-wrap line-clamp-4 max-w-sm ${
                    !isHorizontal ? 'mx-auto text-left' : ''
                  } ${
                    isLightCard
                      ? 'bg-slate-900/5 border-slate-900/10 text-slate-800'
                      : 'bg-white/10 border-white/15 text-neutral-100'
                  }`}
                >
                  {text || '(Empty text)'}
                </div>
              </div>

              <div className="pt-1">
                <div
                  className={`text-[11px] font-mono opacity-60 flex items-center gap-1.5 ${subTextColor} ${
                    !isHorizontal ? 'justify-center' : ''
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span>Scan with camera to copy or read text</span>
                </div>
              </div>
            </div>

            {/* QR Code Container */}
            <div className="shrink-0 flex items-center justify-center">
              <SpecimenQRCode
                value={textPayload}
                size={qrSize}
                qrMaterial={activeQrMaterial}
                qrBgConfig={qrBgConfig}
                centerIcon={<FileText size={16} />}
                showCenterLogo={showCenterLogo}
              />
            </div>
          </>
        )}
      </div>
    </SpecimenCardContainer>
  );
};
