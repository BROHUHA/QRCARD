import React from 'react';
import { Wifi, Shield } from 'lucide-react';
import {
  resolveCardTheme,
  SpecimenCardContainer,
  SpecimenQRCode,
} from './ui/cardStyleEngine';

export const WifiCard = ({ id, settings }) => {
  const {
    ssid = 'STUDIO_5G_NETWORK',
    password = 'optical_swiss_key',
    encryptionMode = 'WPA',
    hiddenSSID = false,
    hidePassword = false,
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

  const escapeString = (str) =>
    str
      ? str
          .replace(/\\/g, '\\\\')
          .replace(/;/g, '\\;')
          .replace(/:/g, '\\:')
          .replace(/,/g, '\\,')
      : '';

  const wifiPayload =
    encryptionMode === 'None'
      ? `WIFI:T:nopass;S:${escapeString(ssid)};H:${hiddenSSID};;`
      : `WIFI:T:${encryptionMode};S:${escapeString(ssid)};P:${escapeString(
          password
        )};H:${hiddenSSID};;`;

  // Text and QR info block shared across layouts
  const renderTextBlock = () => (
    <div
      className={`space-y-3.5 w-full flex-1 ${cfg.textAlign || 'text-left'}`}
    >
      <div>
        <div
          className={`text-[10px] font-mono uppercase tracking-widest opacity-60 font-semibold ${subTextColor}`}
        >
          Network Name
        </div>
        <div
          className={`font-heading font-extrabold tracking-tight break-all mt-0.5 ${
            cfg.nameSize || 'text-2xl sm:text-3xl font-extrabold'
          } ${textColor}`}
        >
          {ssid || 'NETWORK'}
        </div>
      </div>

      {!hidePassword && encryptionMode !== 'None' && (
        <div className="space-y-1.5">
          <div
            className={`text-[10px] font-mono uppercase tracking-widest opacity-60 font-semibold ${subTextColor}`}
          >
            Password
          </div>
          <div className={`inline-flex items-center ${!isHorizontal ? 'justify-center' : ''}`}>
            <div
              className={`px-3 py-1.5 rounded-xl font-mono text-xs sm:text-sm border transition-all ${
                isLightCard
                  ? 'bg-slate-900/5 border-slate-900/10 text-slate-800'
                  : 'bg-white/10 border-white/15 text-neutral-100'
              }`}
            >
              {password || '(No password required)'}
            </div>
          </div>
        </div>
      )}

      <div className="pt-1">
        <div
          className={`text-[11px] font-mono opacity-60 flex items-center gap-1.5 ${subTextColor} ${
            !isHorizontal ? 'justify-center' : ''
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
          <span>Scan with camera to connect</span>
        </div>
      </div>
    </div>
  );

  const renderQrBlock = () => (
    <div className="shrink-0 flex items-center justify-center">
      <SpecimenQRCode
        value={wifiPayload}
        size={qrSize}
        qrMaterial={activeQrMaterial}
        qrBgConfig={qrBgConfig}
        centerIcon={<Wifi size={16} />}
        showCenterLogo={showCenterLogo}
      />
    </div>
  );

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
              <Wifi size={18} />
            </div>
            <div>
              <div
                className={`text-sm font-extrabold tracking-tight font-heading leading-tight ${textColor}`}
              >
                Wi-Fi Network
              </div>
              <div
                className={`text-[11px] font-mono opacity-65 ${subTextColor}`}
              >
                Scan to join
              </div>
            </div>
          </div>

          <div
            className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5 ${badgeBg}`}
          >
            <Shield size={12} className="text-emerald-500" />
            <span>
              {encryptionMode === 'None'
                ? 'Open Network'
                : encryptionMode || 'WPA2/WPA3'}
            </span>
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
              value={wifiPayload}
              size={qrSize}
              qrMaterial={activeQrMaterial}
              qrBgConfig={qrBgConfig}
              centerIcon={<Wifi size={18} />}
              showCenterLogo={showCenterLogo}
            />
          </div>
        ) : isHorizontal ? (
          /* Horizontal layout: Text left, QR right */
          <>
            {renderTextBlock()}
            {renderQrBlock()}
          </>
        ) : (
          /* Vertical layout: Text top, QR center, stacked */
          <>
            {renderTextBlock()}
            {renderQrBlock()}
          </>
        )}
      </div>
    </SpecimenCardContainer>
  );
};
