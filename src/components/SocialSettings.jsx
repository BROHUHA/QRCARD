import React, { useState, useEffect } from 'react';
import {
  Share2,
  User,
  BadgeCheck,
  Sparkles,
  Layers,
  FileText,
  Palette,
  ArrowRight,
  ArrowLeft,
  Link2Off,
  Loader2,
} from 'lucide-react';
import { PLATFORMS_CONFIG } from './ui/socialConfig';
import { SocialIcon } from './ui/SocialIcons';
import { CardThemeSelector } from './ui/CardThemeSelector';

export const SocialSettings = ({
  settings,
  setSettings,
  themeSettings,
  setThemeSettings,
  errors = {},
}) => {
  const [activeStepTab, setActiveStepTab] = useState('payload'); // 'payload' | 'style'
  const [isFetchingAvatar, setIsFetchingAvatar] = useState(false);
  const [avatarFound, setAvatarFound] = useState(false);
  const [fetchStatus, setFetchStatus] = useState(null); // null | { type: 'loading'|'success'|'error', message: string }

  const currentTheme = themeSettings || settings;
  const updateTheme = setThemeSettings || setSettings;

  const fetchProfileImage = async (overrideValue) => {
    const rawVal = overrideValue !== undefined ? overrideValue : settings.value;
    if (!rawVal || settings.platform === 'whatsapp') {
      setAvatarFound(false);
      setFetchStatus(null);
      return;
    }

    const cleanUser = rawVal
      .replace(/^@/, '')
      .replace(/^https?:\/\/[^/]+\//, '')
      .trim();

    if (!cleanUser || cleanUser.length < 2) {
      setAvatarFound(false);
      setFetchStatus({
        type: 'error',
        message: 'Please enter a valid username first',
      });
      return;
    }

    setIsFetchingAvatar(true);
    setFetchStatus({
      type: 'loading',
      message: 'Fetching profile picture...',
    });

    try {
      const res = await fetch(
        `/api/profile-image?platform=${encodeURIComponent(
          settings.platform
        )}&username=${encodeURIComponent(cleanUser)}`
      );
      if (!res.ok) {
        setAvatarFound(false);
        setFetchStatus({
          type: 'error',
          message: 'Profile picture not accessible for this handle',
        });
        return;
      }
      const data = await res.json();
      if (data.success && data.dataUri) {
        setAvatarFound(true);
        setFetchStatus({
          type: 'success',
          message: 'Profile picture found & set as card background',
        });
        updateTheme((prev) => ({
          ...prev,
          bgImage: data.dataUri,
          bgPreset: 'custom-image',
          bgImageBlur: prev.bgImageBlur ?? 4,
          bgImageOverlay: prev.bgImageOverlay ?? 0.35,
        }));
      } else {
        setAvatarFound(false);
        setFetchStatus({
          type: 'error',
          message: 'Profile picture not accessible for this handle',
        });
      }
    } catch (err) {
      setAvatarFound(false);
      setFetchStatus({
        type: 'error',
        message: 'Error fetching profile picture',
      });
    } finally {
      setIsFetchingAvatar(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'value') {
      setFetchStatus(null);
      setAvatarFound(false);
    }
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const currentPlat =
    PLATFORMS_CONFIG.find((p) => p.id === settings.platform) ||
    PLATFORMS_CONFIG[0];

  const handleSelectPlatform = (platId) => {
    setFetchStatus(null);
    setAvatarFound(false);
    setSettings((prev) => {
      let nextValue = prev.value;
      if (platId === 'whatsapp') {
        if (!nextValue || !/^\+?\d[\d\s-]{5,}/.test(nextValue)) {
          nextValue = '';
        }
      } else if (prev.platform === 'whatsapp') {
        if (nextValue === '+12 3455678') {
          nextValue = '';
        }
      }
      return {
        ...prev,
        platform: platId,
        value: nextValue,
      };
    });
  };

  return (
    <div className="space-y-5 text-white">
      {/* Step Tabs: [ Payload ] [ Style ] (Matching Scanfolk Reference Image 2 & 3) */}
      <div className="flex items-center p-1 rounded-2xl bg-white/5 border border-white/10">
        <button
          type="button"
          onClick={() => setActiveStepTab('payload')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
            activeStepTab === 'payload'
              ? 'bg-white text-black shadow-md'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Payload & Content
        </button>
        <button
          type="button"
          onClick={() => setActiveStepTab('style')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
            activeStepTab === 'style'
              ? 'bg-white text-black shadow-md'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Style & Background
        </button>
      </div>

      {/* ========================================================
          STEP 1: PAYLOAD & CONTENT (Matching Image 3)
         ======================================================== */}
      {activeStepTab === 'payload' && (
        <div className="space-y-4 animate-fade-in">
          {/* 1. SOCIAL PLATFORM SELECTOR */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Share2 size={13} className="text-neutral-400" />
                <span>Select Platform</span>
              </span>
              <span className="text-[10px] font-mono text-neutral-400">
                {PLATFORMS_CONFIG.length} Channels
              </span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PLATFORMS_CONFIG.map((plat) => {
                const isSelected = settings.platform === plat.id;
                return (
                  <button
                    key={plat.id}
                    type="button"
                    onClick={() => handleSelectPlatform(plat.id)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium border transition-all cursor-pointer truncate ${
                      isSelected
                        ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)] font-bold scale-[1.02]'
                        : 'bg-white/[0.03] text-neutral-300 border-white/10 hover:border-white/30 hover:text-white hover:bg-white/[0.06]'
                    }`}
                    title={plat.name}
                  >
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                        isSelected ? 'text-black' : 'text-neutral-300'
                      }`}
                    >
                      <SocialIcon platform={plat.id} size={15} />
                    </div>
                    <span className="truncate">{plat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. USERNAME OR IDENTIFIER */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center justify-between">
              <span>
                {currentPlat.id === 'whatsapp'
                  ? 'Phone Number *'
                  : 'Username or Handle *'}
              </span>
              <span className="text-[10px] text-neutral-400 font-mono">
                {currentPlat.id === 'whatsapp'
                  ? 'e.g. +12 3455678'
                  : currentPlat.prefix
                  ? `Format: ${currentPlat.prefix}handle`
                  : 'Direct handle'}
              </span>
            </label>
            <div className="relative flex items-center">
              {currentPlat.prefix && (
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500 font-mono text-xs">
                  {currentPlat.prefix}
                </div>
              )}
              <input
                type="text"
                name="value"
                value={settings.value || ''}
                onChange={handleChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    fetchProfileImage();
                  }
                }}
                placeholder={
                  currentPlat.id === 'whatsapp'
                    ? '+12 3455678'
                    : 'username'
                }
                className={`w-full ${
                  currentPlat.prefix ? 'pl-9' : 'px-4'
                } ${
                  currentPlat.id !== 'whatsapp' ? 'pr-24' : 'pr-4'
                } py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-white/40 focus:ring-1 focus:ring-white/40 text-white placeholder-neutral-500 font-mono text-sm outline-none transition-all`}
              />
              {currentPlat.id !== 'whatsapp' && (
                <button
                  type="button"
                  onClick={() => fetchProfileImage()}
                  disabled={isFetchingAvatar || !settings.value?.trim()}
                  className="absolute right-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 text-xs font-semibold font-mono text-white border border-white/15 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5 shadow-sm"
                  title="Fetch profile picture manually"
                >
                  {isFetchingAvatar ? (
                    <>
                      <Loader2 size={12} className="animate-spin text-amber-300" />
                      <span>Fetching</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={12} className="text-amber-300" />
                      <span>Fetch</span>
                    </>
                  )}
                </button>
              )}
            </div>
            {errors.value && (
              <p className="text-xs text-[#ff0047] font-medium">
                {errors.value}
              </p>
            )}
            {fetchStatus && (
              <p
                className={`text-[10px] font-mono flex items-center gap-1.5 mt-1 ${
                  fetchStatus.type === 'loading'
                    ? 'text-neutral-400 animate-pulse'
                    : fetchStatus.type === 'success'
                    ? 'text-emerald-400'
                    : 'text-amber-400/90'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    fetchStatus.type === 'loading'
                      ? 'bg-amber-400'
                      : fetchStatus.type === 'success'
                      ? 'bg-emerald-400'
                      : 'bg-amber-400'
                  }`}
                />
                <span>{fetchStatus.message}</span>
              </p>
            )}
          </div>

          {/* 3. DISPLAY NAME & ROLE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                <User size={13} className="text-neutral-400" />
                <span>Display Name</span>
              </label>
              <input
                type="text"
                name="displayName"
                value={settings.displayName || ''}
                onChange={handleChange}
                placeholder="e.g. Studio Design"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-white/40 focus:ring-1 focus:ring-white/40 text-white placeholder-neutral-500 font-sans text-sm outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                <FileText size={13} className="text-neutral-400" />
                <span>Role / Tagline</span>
              </label>
              <input
                type="text"
                name="bio"
                value={settings.bio || ''}
                onChange={handleChange}
                placeholder="e.g. Creative Technologist"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-white/40 focus:ring-1 focus:ring-white/40 text-white placeholder-neutral-500 font-sans text-sm outline-none transition-all"
              />
            </div>
          </div>

          {/* 4. TOGGLES */}
          <div className="space-y-2 pt-2 border-t border-white/[0.08]">
            <label className="flex items-center justify-between cursor-pointer py-1 text-xs text-neutral-300">
              <span className="flex items-center gap-2">
                <BadgeCheck size={14} className="text-sky-400" />
                <span>Show Verified Checkmark</span>
              </span>
              <input
                type="checkbox"
                name="verified"
                checked={settings.verified !== false}
                onChange={handleChange}
                className="w-4 h-4 rounded accent-white bg-black/40 border-white/20 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer py-1 text-xs text-neutral-300">
              <span className="flex items-center gap-2">
                <Sparkles size={14} className="text-neutral-400" />
                <span>Embed Platform Logo in Center of QR</span>
              </span>
              <input
                type="checkbox"
                name="showCenterLogo"
                checked={settings.showCenterLogo !== false}
                onChange={handleChange}
                className="w-4 h-4 rounded accent-white bg-black/40 border-white/20 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer py-1 text-xs text-neutral-300">
              <span className="flex items-center gap-2">
                <Link2Off size={14} className="text-neutral-400" />
                <span>Hide Hyperlink URL</span>
              </span>
              <input
                type="checkbox"
                name="hideHyperlink"
                checked={settings.hideHyperlink !== false}
                onChange={handleChange}
                className="w-4 h-4 rounded accent-white bg-black/40 border-white/20 cursor-pointer"
              />
            </label>
          </div>

          {/* Next Button (Matching Image 3) */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setActiveStepTab('style')}
              className="w-full py-3 rounded-xl bg-white text-black font-bold text-xs flex items-center justify-center gap-2 hover:bg-neutral-200 transition-all cursor-pointer shadow-md"
            >
              <span>Next: Style & Background</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          STEP 2: STYLE & BACKGROUND (Matching Image 2)
         ======================================================== */}
      {activeStepTab === 'style' && (
        <div className="space-y-4 animate-fade-in">
          {/* Combined Background & QR Material Customisation (Scanfolk Technique) */}
          <CardThemeSelector
            bgPreset={
              currentTheme.bgPreset || currentTheme.theme || 'opal-mint'
            }
            onSelectBgPreset={(presetId) =>
              updateTheme((prev) => ({
                ...prev,
                bgPreset: presetId,
                theme: presetId,
              }))
            }
            gradientConfig={currentTheme.gradientConfig}
            onChangeGradient={(newConfig) =>
              updateTheme((prev) => ({
                ...prev,
                gradientConfig: newConfig,
              }))
            }
            qrMaterial={currentTheme.qrMaterial || 'classic'}
            onSelectQrMaterial={(materialId) =>
              updateTheme((prev) => ({
                ...prev,
                qrMaterial: materialId,
              }))
            }
            qrBgStyle={currentTheme.qrBgStyle || 'white'}
            onSelectQrBgStyle={(styleId) =>
              updateTheme((prev) => ({
                ...prev,
                qrBgStyle: styleId,
              }))
            }
            platform={settings.platform}
            bgImage={currentTheme.bgImage}
            onUploadBgImage={(dataUrl) =>
              updateTheme((prev) => ({
                ...prev,
                bgImage: dataUrl,
                bgPreset: dataUrl ? 'custom-image' : 'opal-mint',
              }))
            }
            bgImageBlur={currentTheme.bgImageBlur ?? 0}
            onChangeBgImageBlur={(blur) =>
              updateTheme((prev) => ({
                ...prev,
                bgImageBlur: blur,
              }))
            }
            bgImageOverlay={currentTheme.bgImageOverlay ?? 0.25}
            onChangeBgImageOverlay={(overlay) =>
              updateTheme((prev) => ({
                ...prev,
                bgImageOverlay: overlay,
              }))
            }
          />

          {/* Back Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setActiveStepTab('payload')}
              className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-neutral-300 font-medium text-xs flex items-center justify-center gap-2 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Back to Content Parameters</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
