import React from 'react';
import { Mail, Send } from 'lucide-react';
import {
  resolveCardTheme,
  SpecimenCardContainer,
  SpecimenQRCode,
} from './ui/cardStyleEngine';

export const EmailCard = ({ id, settings }) => {
  const {
    email = 'contact@allqr.studio',
    subject = 'Inquiry regarding Project Collaboration',
    body = 'Hello,\n\nI would love to inquire about collaborating on an upcoming project.',
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

  const mailParams = new URLSearchParams();
  if (subject) mailParams.append('subject', subject);
  if (body) mailParams.append('body', body);

  const queryStr = mailParams.toString();
  const mailtoPayload = `mailto:${email || ''}${queryStr ? `?${queryStr}` : ''}`;

  return (
    <SpecimenCardContainer id={id} themeResult={themeResult}>
      {/* 1. CARD HEADER (Omitted in 1:1 QR-Only mode) */}
      {!isQrOnly && (
        <div
          className={`flex items-center justify-between border-b ${cfg.headerPadding || 'pb-3.5 mb-4'} relative z-10 ${headerBorder}`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center transition-all ${iconBox}`}
            >
              <Mail size={18} />
            </div>
            <div>
              <div className={`text-sm font-extrabold tracking-tight font-heading leading-tight ${textColor}`}>
                Email Contact
              </div>
              <div className={`text-[11px] font-mono opacity-65 ${subTextColor}`}>
                Scan to send message
              </div>
            </div>
          </div>

          <div
            className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5 ${badgeBg}`}
          >
            <Send size={11} className="text-emerald-500" />
            <span>Send Email</span>
          </div>
        </div>
      )}

      {/* 2. MAIN CARD BODY */}
      <div className={`relative z-10 w-full ${isQrOnly ? 'flex-1 flex items-center justify-center my-auto h-full' : cfg.body}`}>
        {isQrOnly ? (
          /* 1:1 Pure QR Hero Display */
          <div className="relative shrink-0 flex items-center justify-center animate-fade-in my-auto">
            <SpecimenQRCode
              value={mailtoPayload}
              size={qrSize}
              qrMaterial={activeQrMaterial}
              qrBgConfig={qrBgConfig}
              centerIcon={<Mail size={18} />}
              showCenterLogo={showCenterLogo}
            />
          </div>
        ) : (
          <>
            <div className={`space-y-3 w-full flex-1 ${cfg.textAlign}`}>
              <div>
                <div className={`font-heading font-extrabold tracking-tight break-all ${cfg.nameSize} ${textColor}`}>
                  {email || 'recipient@mail.com'}
                </div>
              </div>

              <div className="space-y-2 text-xs">
                {subject && (
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className={`text-[10px] font-mono uppercase opacity-60 font-semibold ${subTextColor}`}>
                      Subject:
                    </span>
                    <span className="font-medium text-xs truncate max-w-sm">
                      {subject}
                    </span>
                  </div>
                )}
                {body && (
                  <div
                    className={`text-xs opacity-75 italic border-l-2 pl-2.5 mt-1 line-clamp-3 max-w-sm ${
                      isLightCard ? 'border-slate-400' : 'border-white/30'
                    } ${subTextColor}`}
                  >
                    "{body}"
                  </div>
                )}
              </div>

              <div className="pt-1">
                <div className={`text-[11px] font-mono opacity-60 flex items-center gap-1.5 ${subTextColor}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span>Scan with camera to compose email</span>
                </div>
              </div>
            </div>

            {/* QR Code Container */}
            <div className="shrink-0 flex items-center justify-center">
              <SpecimenQRCode
                value={mailtoPayload}
                size={qrSize}
                qrMaterial={activeQrMaterial}
                qrBgConfig={qrBgConfig}
                centerIcon={<Mail size={16} />}
                showCenterLogo={showCenterLogo}
              />
            </div>
          </>
        )}
      </div>
    </SpecimenCardContainer>
  );
};
