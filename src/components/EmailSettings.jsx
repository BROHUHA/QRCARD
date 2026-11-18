import React, { useState } from 'react';
import { Mail, FileText, AlignLeft, ArrowRight, ArrowLeft } from 'lucide-react';
import { CardThemeSelector } from './ui/CardThemeSelector';

export const EmailSettings = ({
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
        <div className="space-y-4 animate-fade-in">
          {/* Target Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Mail size={14} className="text-neutral-400" />
                <span>Target Email *</span>
              </span>
              <span className="text-[10px] text-neutral-500 font-mono">
                Recipient Inbox
              </span>
            </label>
            <input
              type="email"
              name="email"
              value={settings.email}
              onChange={handleChange}
              placeholder="hello@domain.com"
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-white/40 focus:ring-1 focus:ring-white/40 text-white placeholder-neutral-500 font-mono text-sm outline-none transition-all"
            />
            {errors.email && (
              <p className="text-xs text-[#ff0047] font-medium">
                {errors.email}
              </p>
            )}
          </div>

          {/* Subject Line */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
              <FileText size={14} className="text-neutral-400" />
              <span>Subject Line</span>
            </label>
            <input
              type="text"
              name="subject"
              value={settings.subject}
              onChange={handleChange}
              placeholder="e.g. Project Inquiry // Collaboration"
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-white/40 focus:ring-1 focus:ring-white/40 text-white placeholder-neutral-500 font-sans text-sm outline-none transition-all"
            />
          </div>

          {/* Body */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
              <AlignLeft size={14} className="text-neutral-400" />
              <span>Pre-filled Email Body</span>
            </label>
            <textarea
              name="body"
              value={settings.body}
              onChange={handleChange}
              rows={3}
              placeholder="Draft text to populate the scanner's email client..."
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-white/40 focus:ring-1 focus:ring-white/40 text-white placeholder-neutral-500 font-sans text-sm outline-none transition-all resize-y"
            />
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
