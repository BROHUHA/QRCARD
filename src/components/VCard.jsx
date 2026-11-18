import React from 'react';
import { User, Phone, Mail, Globe } from 'lucide-react';
import {
  resolveCardTheme,
  SpecimenCardContainer,
  SpecimenQRCode,
} from './ui/cardStyleEngine';

export const VCard = ({ id, settings }) => {
  const {
    firstName = 'Alex',
    lastName = 'Morgan',
    phone = '+1 (555) 019-2834',
    email = 'alex.morgan@allqr.studio',
    company = 'ALL QR STUDIO',
    title = 'Creative Technologist',
    website = 'https://allqr.studio',
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

  const vcardPayload = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${lastName || ''};${firstName || ''};;;`,
    `FN:${[firstName, lastName].filter(Boolean).join(' ')}`,
    company ? `ORG:${company}` : '',
    title ? `TITLE:${title}` : '',
    phone ? `TEL;TYPE=CELL:${phone}` : '',
    email ? `EMAIL;TYPE=WORK:${email}` : '',
    website ? `URL:${website}` : '',
    'END:VCARD',
  ]
    .filter(Boolean)
    .join('\n');

  const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'Contact';

  const renderTextBlock = () => (
    <div className={`space-y-3 w-full flex-1 ${cfg.textAlign || 'text-left'}`}>
      <div>
        <div
          className={`font-heading font-extrabold tracking-tight break-all ${
            cfg.nameSize || 'text-2xl sm:text-3xl font-extrabold'
          } ${textColor}`}
        >
          {fullName}
        </div>
        {(title || company) && (
          <div
            className={`flex items-center gap-2 mt-1 flex-wrap ${
              !isHorizontal ? 'justify-center' : 'justify-start'
            }`}
          >
            {title && (
              <span className={`text-xs font-medium ${subTextColor}`}>
                {title}
              </span>
            )}
            {company && (
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${
                  isLightCard
                    ? 'bg-slate-900/5 border-slate-900/10 text-slate-800'
                    : 'bg-white/10 border-white/15 text-neutral-200'
                }`}
              >
                {company}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Contact meta lines */}
      <div className="space-y-1.5 text-xs">
        {phone && (
          <div
            className={`flex items-center gap-2 ${
              !isHorizontal ? 'justify-center' : ''
            }`}
          >
            <Phone size={12} className="opacity-50 shrink-0" />
            <span className="font-mono text-xs">{phone}</span>
          </div>
        )}
        {email && (
          <div
            className={`flex items-center gap-2 ${
              !isHorizontal ? 'justify-center' : ''
            }`}
          >
            <Mail size={12} className="opacity-50 shrink-0" />
            <span className="font-mono text-xs truncate">{email}</span>
          </div>
        )}
        {website && (
          <div
            className={`flex items-center gap-2 ${
              !isHorizontal ? 'justify-center' : ''
            }`}
          >
            <Globe size={12} className="opacity-50 shrink-0" />
            <span className="font-mono text-xs truncate">{website}</span>
          </div>
        )}
      </div>

      <div className="pt-1">
        <div
          className={`text-[11px] font-mono opacity-60 flex items-center gap-1.5 ${subTextColor}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
          <span>Scan with camera to add directly to contacts</span>
        </div>
      </div>
    </div>
  );

  const renderQrBlock = () => (
    <div className="shrink-0 flex items-center justify-center">
      <SpecimenQRCode
        value={vcardPayload}
        size={qrSize}
        qrMaterial={activeQrMaterial}
        qrBgConfig={qrBgConfig}
        centerIcon={<User size={16} />}
        showCenterLogo={showCenterLogo}
      />
    </div>
  );

  return (
    <SpecimenCardContainer id={id} themeResult={themeResult}>
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
            >
              <User size={18} />
            </div>
            <div>
              <div
                className={`text-sm font-extrabold tracking-tight font-heading leading-tight ${textColor}`}
              >
                Contact Card
              </div>
              <div
                className={`text-[11px] font-mono opacity-65 ${subTextColor}`}
              >
                Scan to save
              </div>
            </div>
          </div>

          <div
            className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5 ${badgeBg}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>vCard</span>
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
          <div className="relative shrink-0 flex items-center justify-center animate-fade-in my-auto">
            <SpecimenQRCode
              value={vcardPayload}
              size={qrSize}
              qrMaterial={activeQrMaterial}
              qrBgConfig={qrBgConfig}
              centerIcon={<User size={18} />}
              showCenterLogo={showCenterLogo}
            />
          </div>
        ) : (
          <>
            {renderTextBlock()}
            {renderQrBlock()}
          </>
        )}
      </div>
    </SpecimenCardContainer>
  );
};
