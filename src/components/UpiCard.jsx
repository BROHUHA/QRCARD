import React from 'react';
import { CreditCard, ShieldCheck } from 'lucide-react';
import {
  resolveCardTheme,
  SpecimenCardContainer,
  SpecimenQRCode,
} from './ui/cardStyleEngine';

export const UpiCard = ({ id, settings }) => {
  const {
    vpa = 'merchant@upi',
    name = 'ACME STUDIO',
    amount = '500',
    note = 'Design Studio Services',
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

  const upiParams = new URLSearchParams();
  if (vpa) upiParams.append('pa', vpa);
  if (name) upiParams.append('pn', name);
  if (amount && Number(amount) > 0) upiParams.append('am', amount);
  upiParams.append('cu', 'INR');
  if (note) upiParams.append('tn', note);

  const upiPayload = `upi://pay?${upiParams.toString()}`;

  const renderTextBlock = () => (
    <div className={`space-y-3 w-full flex-1 ${cfg.textAlign || 'text-left'}`}>
      <div>
        <div
          className={`text-[10px] font-mono uppercase tracking-widest opacity-60 font-semibold ${subTextColor}`}
        >
          Payee
        </div>
        <div
          className={`font-heading font-extrabold tracking-tight break-all mt-0.5 ${cfg.nameSize || 'text-2xl sm:text-3xl font-extrabold'
            } ${textColor}`}
        >
          {name || 'Beneficiary'}
        </div>
      </div>

      <div className="space-y-2">
        <div
          className={`flex items-center gap-2 flex-wrap ${!isHorizontal ? 'justify-center' : ''
            }`}
        >
          <span
            className={`text-[10px] font-mono opacity-60 uppercase font-semibold ${subTextColor}`}
          >
            UPI ID:
          </span>
          <span
            className={`px-2.5 py-1 rounded-lg font-mono text-xs border ${isLightCard
                ? 'bg-slate-900/5 border-slate-900/10 text-slate-800'
                : 'bg-white/10 border-white/15 text-neutral-100'
              }`}
          >
            {vpa || 'username@upi'}
          </span>
        </div>

        {amount && Number(amount) > 0 && (
          <div
            className={`flex items-center gap-2 flex-wrap ${!isHorizontal ? 'justify-center' : ''
              }`}
          >
            <span
              className={`text-[10px] font-mono opacity-60 uppercase font-semibold ${subTextColor}`}
            >
              Amount:
            </span>
            <span
              className={`px-3 py-1 rounded-lg font-heading font-black text-sm border shadow-sm ${isLightCard
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.25)]'
                }`}
            >
              {'\u20B9'} {amount} INR
            </span>
          </div>
        )}

        {note && (
          <div
            className={`text-xs opacity-75 italic border-l-2 pl-2.5 mt-1 max-w-sm ${!isHorizontal ? 'mx-auto' : ''
              } ${isLightCard ? 'border-slate-400' : 'border-white/30'} ${subTextColor}`}
          >
            "{note}"
          </div>
        )}
      </div>

      <div className="pt-1">
        <div
          className={`text-[11px] font-mono opacity-60 flex items-center gap-1.5 ${subTextColor} ${!isHorizontal ? 'justify-center' : ''
            }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
          <span>Works with Google Pay, PhonePe, Paytm & banking apps</span>
        </div>
      </div>
    </div>
  );

  const renderQrBlock = () => (
    <div className="shrink-0 flex items-center justify-center">
      <SpecimenQRCode
        value={upiPayload}
        size={qrSize}
        qrMaterial={activeQrMaterial}
        qrBgConfig={qrBgConfig}
        centerIcon={<CreditCard size={16} />}
        showCenterLogo={showCenterLogo}
      />
    </div>
  );

  return (
    <SpecimenCardContainer id={id} themeResult={themeResult}>
      {/* 1. CARD HEADER */}
      {!isQrOnly && (
        <div
          className={`flex items-center justify-between border-b ${cfg.headerPadding || 'pb-3.5 mb-4'
            } relative z-10 ${headerBorder}`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center transition-all ${iconBox}`}
            >
              <CreditCard size={18} />
            </div>
            <div>
              <div
                className={`text-sm font-extrabold tracking-tight font-heading leading-tight ${textColor}`}
              >
                UPI Payment
              </div>
              <div
                className={`text-[11px] font-mono opacity-65 ${subTextColor}`}
              >
                Scan to pay
              </div>
            </div>
          </div>

          <div
            className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5 ${badgeBg}`}
          >
            <ShieldCheck size={12} className="text-emerald-500" />
            <span>Verified Payee</span>
          </div>
        </div>
      )}

      {/* 2. MAIN CARD BODY */}
      <div
        className={`relative z-10 w-full ${isQrOnly
            ? 'flex-1 flex items-center justify-center my-auto h-full'
            : cfg.body
          }`}
      >
        {isQrOnly ? (
          <div className="relative shrink-0 flex items-center justify-center animate-fade-in my-auto">
            <SpecimenQRCode
              value={upiPayload}
              size={qrSize}
              qrMaterial={activeQrMaterial}
              qrBgConfig={qrBgConfig}
              centerIcon={<CreditCard size={18} />}
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
