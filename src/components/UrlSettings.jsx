import React, { useState } from 'react';
import {
  Globe,
  Type,
  ArrowRight,
  ArrowLeft,
  Link2Off,
  FileText,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { CardThemeSelector } from './ui/CardThemeSelector';

export const UrlSettings = ({
  settings,
  setSettings,
  themeSettings,
  setThemeSettings,
  errors = {},
}) => {
  const [activeStepTab, setActiveStepTab] = useState('payload'); // 'payload' | 'style'
  const [isFetchingCover, setIsFetchingCover] = useState(false);
  const [fetchStatus, setFetchStatus] = useState(null); // null | { type: 'loading'|'success'|'error', message: string }

  const currentTheme = themeSettings || settings;
  const updateTheme = setThemeSettings || setSettings;

  const fetchCoverImage = async (overrideUrl) => {
    const rawVal = (
      overrideUrl !== undefined ? overrideUrl : settings.url || ''
    ).trim();
    if (!rawVal) {
      setFetchStatus({
        type: 'error',
        message: 'Please enter a target URL first',
      });
      return;
    }

    setIsFetchingCover(true);
    setFetchStatus({
      type: 'loading',
      message: 'Searching website for cover image (og:image)...',
    });

    try {
      const res = await fetch(
        `/api/cover-image?url=${encodeURIComponent(rawVal)}`
      );
      if (!res.ok) {
        setFetchStatus({
          type: 'error',
          message: 'No cover image found for this website',
        });
        return;
      }
      const data = await res.json();
      if (data.success && data.dataUri) {
        setFetchStatus({
          type: 'success',
          message: 'Cover image found & set as card background',
        });
        updateTheme((prev) => ({
          ...prev,
          bgImage: data.dataUri,
          bgPreset: 'custom-image',
          bgImageBlur: prev.bgImageBlur ?? 0,
          bgImageOverlay: prev.bgImageOverlay ?? 0.25,
        }));
      } else {
        setFetchStatus({
          type: 'error',
          message: 'No cover image found for this website',
        });
      }
    } catch {
      setFetchStatus({
        type: 'error',
        message: 'Could not connect to target website',
      });
    } finally {
      setIsFetchingCover(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'url') {
      setFetchStatus(null);
    }
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div className="space-y-5 text-white">
      {/* Step Tabs: [ Payload & Content ] [ Style & Background ] */}
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

      {/* STEP 1: PAYLOAD & CONTENT */}
      {activeStepTab === 'payload' && (
        <div className="space-y-4 animate-fade-in">
          {/* Destination URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Globe size={14} className="text-neutral-400" />
                <span>Target Web URL *</span>
              </span>
              <span className="text-[10px] text-neutral-500 font-mono">
                https://
              </span>
            </label>
            <div className="relative flex items-center">
              <input
                type="url"
                name="url"
                value={settings.url || ''}
                onChange={handleChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    fetchCoverImage();
                  }
                }}
                placeholder="https://yourwebsite.com"
                className="w-full pl-4 pr-24 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-white/40 focus:ring-1 focus:ring-white/40 text-white placeholder-neutral-500 font-mono text-sm outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => fetchCoverImage()}
                disabled={isFetchingCover || !settings.url?.trim()}
                className="absolute right-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 text-xs font-semibold font-mono text-white border border-white/15 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5 shadow-sm"
                title="Fetch website cover image (og:image) as card background"
              >
                {isFetchingCover ? (
                  <>
                    <Loader2
                      size={12}
                      className="animate-spin text-amber-300"
                    />
                    <span>Fetching</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={12} className="text-amber-300" />
                    <span>Fetch</span>
                  </>
                )}
              </button>
            </div>
            {errors.url && (
              <p className="text-xs text-[#ff0047] font-medium">{errors.url}</p>
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

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
              <Type size={14} className="text-neutral-400" />
              <span>Card Title (Optional)</span>
            </label>
            <input
              type="text"
              name="title"
              value={settings.title}
              onChange={handleChange}
              placeholder="e.g. DIGITAL GATEWAY"
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-white/40 focus:ring-1 focus:ring-white/40 text-white placeholder-neutral-500 font-sans text-sm outline-none transition-all"
            />
          </div>

          {/* Description (Optional) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
              <FileText size={14} className="text-neutral-400" />
              <span>Description / Note (Optional)</span>
            </label>
            <textarea
              name="description"
              value={settings.description || ''}
              onChange={handleChange}
              rows={2}
              placeholder="e.g. Creative design systems, technology & digital portfolio"
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-white/40 focus:ring-1 focus:ring-white/40 text-white placeholder-neutral-500 font-sans text-xs outline-none transition-all resize-none"
            />
          </div>

          {/* Toggle Hide Web Link */}
          <div className="pt-2 border-t border-white/[0.08] space-y-2">
            <label className="flex items-center justify-between cursor-pointer py-1 text-xs text-neutral-300">
              <span className="flex items-center gap-2">
                <Link2Off size={14} className="text-neutral-400" />
                <span>Hide Web Link</span>
              </span>
              <input
                type="checkbox"
                name="hideWebLink"
                checked={settings.hideWebLink !== false}
                onChange={handleChange}
                className="w-4 h-4 rounded accent-white bg-black/40 border-white/20 cursor-pointer"
              />
            </label>
          </div>

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

      {/* STEP 2: STYLE & BACKGROUND */}
      {activeStepTab === 'style' && (
        <div className="space-y-4 animate-fade-in">
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
