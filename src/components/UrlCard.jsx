import React, { useState, useEffect, useMemo } from 'react';
import { Globe } from 'lucide-react';
import {
  resolveCardTheme,
  SpecimenCardContainer,
  SpecimenQRCode,
} from './ui/cardStyleEngine';

const FAVICON_PROVIDERS = [
  (d) => `https://unavatar.io/${d}`,
  (d) => `https://icons.duckduckgo.com/ip3/${d}.ico`,
  (d) => `https://www.google.com/s2/favicons?domain=${d}&sz=64`,
  (d) => `https://${d}/favicon.ico`,
];

const WebsiteFavicon = ({ url, size = 18, className = '' }) => {
  const [providerIndex, setProviderIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const domain = useMemo(() => {
    try {
      const u = new URL(url.startsWith('http') ? url : `https://${url}`);
      return u.hostname;
    } catch {
      return '';
    }
  }, [url]);

  useEffect(() => {
    setProviderIndex(0);
    setLoaded(false);
  }, [domain]);

  if (!domain || providerIndex >= FAVICON_PROVIDERS.length) {
    return (
      <Globe
        size={size}
        className={`w-full h-full object-contain p-0.5 ${className}`}
      />
    );
  }

  const src = FAVICON_PROVIDERS[providerIndex](domain);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {!loaded && (
        <Globe
          size={size}
          className={`absolute inset-0 m-auto w-full h-full p-0.5 opacity-50 transition-opacity ${className}`}
        />
      )}
      <img
        key={src}
        src={src}
        alt={`${domain} favicon`}
        width={size}
        height={size}
        className={`w-full h-full object-contain transition-opacity duration-200 ${
          loaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        crossOrigin="anonymous"
        onLoad={(e) => {
          if (e.target.naturalWidth <= 1 || e.target.naturalHeight <= 1) {
            setProviderIndex((prev) => prev + 1);
          } else {
            setLoaded(true);
          }
        }}
        onError={() => setProviderIndex((prev) => prev + 1)}
      />
    </div>
  );
};

export const UrlCard = ({ id, settings }) => {
  const {
    url = '',
    title = '',
    description = '',
    hideTitle = false,
    showCenterLogo = true,
    hideWebLink = true,
    hideHyperlink = true,
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

  const validUrl = url
    ? url.startsWith('http')
      ? url
      : `https://${url}`
    : 'https://';

  const cleanDomain = useMemo(() => {
    if (!url) return 'yourwebsite.com';
    try {
      const u = new URL(validUrl);
      return (u.hostname + (u.pathname !== '/' ? u.pathname : '')).replace(
        /^www\./i,
        ''
      );
    } catch {
      return (
        validUrl.replace(/^https?:\/\//i, '').replace(/^www\./i, '') ||
        'yourwebsite.com'
      );
    }
  }, [validUrl, url]);

  const renderTextBlock = () => (
    <div className={`space-y-3 w-full flex-1 ${cfg.textAlign || 'text-left'}`}>
      {!hideTitle && title && (
        <div>
          <div
            className={`font-heading font-extrabold tracking-tight break-all ${
              cfg.nameSize || 'text-2xl sm:text-3xl font-extrabold'
            } ${textColor}`}
          >
            {title}
          </div>
        </div>
      )}

      {description && (
        <div className="space-y-1.5">
          <div
            className={`px-3.5 py-2.5 rounded-xl font-sans text-xs border leading-relaxed ${
              !isHorizontal ? 'mx-auto text-left' : ''
            } ${
              isLightCard
                ? 'bg-slate-900/5 border-slate-900/10 text-slate-700'
                : 'bg-white/10 border-white/15 text-neutral-200'
            } max-w-sm`}
          >
            {description}
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
          <span>Scan with camera to open in browser</span>
        </div>
      </div>
    </div>
  );

  const renderQrBlock = () => (
    <div className="shrink-0 flex items-center justify-center">
      <SpecimenQRCode
        value={validUrl}
        size={qrSize}
        qrMaterial={activeQrMaterial}
        qrBgConfig={qrBgConfig}
        centerIcon={
          <WebsiteFavicon
            url={validUrl}
            size={22}
            className="w-full h-full object-contain rounded-md"
          />
        }
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
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden transition-all p-1.5 ${iconBox}`}
            >
              <WebsiteFavicon
                url={validUrl}
                size={28}
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
            <div className="min-w-0">
              <div
                className={`text-sm font-extrabold tracking-tight font-heading leading-tight truncate max-w-[240px] sm:max-w-sm ${textColor}`}
                title={!hideWebLink ? cleanDomain : 'Website Link'}
              >
                {!hideWebLink ? cleanDomain : 'Website Link'}
              </div>
              <div
                className={`text-[11px] font-mono opacity-65 ${subTextColor}`}
              >
                Scan to visit
              </div>
            </div>
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
              value={validUrl}
              size={qrSize}
              qrMaterial={activeQrMaterial}
              qrBgConfig={qrBgConfig}
              centerIcon={
                <WebsiteFavicon
                  url={validUrl}
                  size={24}
                  className="w-full h-full object-contain rounded-md"
                />
              }
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
