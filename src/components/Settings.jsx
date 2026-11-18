import React, { useState } from 'react';
import { Wifi, Lock, Shield, Info, ArrowRight, ArrowLeft } from 'lucide-react';
import { CardThemeSelector } from './ui/CardThemeSelector';

export const Settings = ({
  settings,
  setSettings,
  themeSettings,
  setThemeSettings,
  errors = {},
}) => {
  const [activeStepTab, setActiveStepTab] = useState('payload'); // 'payload' | 'style'

  const currentTheme = themeSettings || settings;
  const updateTheme = setThemeSettings || setSettings;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
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
        <div className="space-y-5 animate-fade-in">
          {/* Network Name (SSID) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Wifi size={14} className="text-neutral-400" />
                <span>Network SSID *</span>
              </span>
              <span className="text-[10px] text-neutral-500 font-mono">Wi-Fi Name</span>
            </label>
            <input
              type="text"
              name="ssid"
              value={settings.ssid}
              onChange={handleChange}
              placeholder="e.g. STUDIO_5G_NETWORK"
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-white/40 focus:ring-1 focus:ring-white/40 text-white placeholder-neutral-500 font-sans text-sm outline-none transition-all"
            />
            {errors.ssid && (
              <p className="text-xs text-[#ff0047] font-medium">{errors.ssid}</p>
            )}
          </div>

          {/* Encryption Protocol */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
              <Shield size={14} className="text-neutral-400" />
              <span>Security Protocol</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['WPA', 'WEP', 'None'].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setSettings((prev) => ({ ...prev, encryptionMode: mode }))}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                    settings.encryptionMode === mode
                      ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.2)] font-semibold'
                      : 'bg-white/[0.03] text-neutral-400 border-white/10 hover:border-white/20 hover:text-white'
                  }`}
                >
                  {mode === 'WPA' ? 'WPA2 / WPA3' : mode}
                </button>
              ))}
            </div>
          </div>

          {/* Password (if not open) */}
          {settings.encryptionMode !== 'None' && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Lock size={14} className="text-neutral-400" />
                  <span>Password *</span>
                </span>
                <span className="text-[10px] text-neutral-500 font-mono">Min 8 chars for WPA</span>
              </label>
              <input
                type="text"
                name="password"
                value={settings.password}
                onChange={handleChange}
                placeholder="Enter Wi-Fi password"
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-white/40 focus:ring-1 focus:ring-white/40 text-white placeholder-neutral-500 font-mono text-sm outline-none transition-all"
              />
              {errors.password && (
                <p className="text-xs text-[#ff0047] font-medium">{errors.password}</p>
              )}
            </div>
          )}

          {/* Toggles */}
          <div className="space-y-3 pt-2 border-t border-white/[0.08]">
            <label className="flex items-center justify-between cursor-pointer py-1">
              <span className="text-xs text-neutral-300 font-medium">Hide Password on Card</span>
              <input
                type="checkbox"
                name="hidePassword"
                checked={settings.hidePassword}
                onChange={handleChange}
                className="w-4 h-4 rounded accent-white bg-black/40 border-white/20 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer py-1">
              <span className="text-xs text-neutral-300 font-medium">Hidden SSID Network</span>
              <input
                type="checkbox"
                name="hiddenSSID"
                checked={settings.hiddenSSID}
                onChange={handleChange}
                className="w-4 h-4 rounded accent-white bg-black/40 border-white/20 cursor-pointer"
              />
            </label>
          </div>

          {/* Helper */}
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-2.5 text-neutral-400">
            <Info size={15} className="shrink-0 mt-0.5 text-white/80" />
            <p className="text-xs leading-relaxed">
              The generated Wi-Fi optical token connects visitors instantly when scanned by any iPhone or Android camera without typing credentials.
            </p>
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
            bgPreset={currentTheme.bgPreset || currentTheme.theme || 'opal-mint'}
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
