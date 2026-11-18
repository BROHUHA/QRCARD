import React, { useState } from 'react';
import { CreditCard, DollarSign, User, FileText, Info, ArrowRight, ArrowLeft } from 'lucide-react';
import { CardThemeSelector } from './ui/CardThemeSelector';

export const UpiSettings = ({
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
          {/* VPA (UPI ID) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CreditCard size={14} className="text-neutral-400" />
                <span>UPI ID / VPA *</span>
              </span>
              <span className="text-[10px] text-neutral-500 font-mono">e.g. mobile@upi</span>
            </label>
            <input
              type="text"
              name="vpa"
              value={settings.vpa}
              onChange={handleChange}
              placeholder="yourname@okhdfcbank"
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-white/40 focus:ring-1 focus:ring-white/40 text-white placeholder-neutral-500 font-mono text-sm outline-none transition-all"
            />
            {errors.vpa && (
              <p className="text-xs text-[#ff0047] font-medium">{errors.vpa}</p>
            )}
          </div>

          {/* Payee Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <User size={14} className="text-neutral-400" />
                <span>Beneficiary Name *</span>
              </span>
              <span className="text-[10px] text-neutral-500 font-mono">Displayed to scanner</span>
            </label>
            <input
              type="text"
              name="name"
              value={settings.name}
              onChange={handleChange}
              placeholder="e.g. Acme Studio"
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-white/40 focus:ring-1 focus:ring-white/40 text-white placeholder-neutral-500 font-sans text-sm outline-none transition-all"
            />
            {errors.name && (
              <p className="text-xs text-[#ff0047] font-medium">{errors.name}</p>
            )}
          </div>

          {/* Amount & Note */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
                <DollarSign size={14} className="text-neutral-400" />
                <span>Fixed Amount (₹)</span>
              </label>
              <input
                type="number"
                name="amount"
                value={settings.amount}
                onChange={handleChange}
                placeholder="Optional, e.g. 500"
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-white/40 focus:ring-1 focus:ring-white/40 text-white placeholder-neutral-500 font-mono text-sm outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
                <FileText size={14} className="text-neutral-400" />
                <span>Payment Note</span>
              </label>
              <input
                type="text"
                name="note"
                value={settings.note}
                onChange={handleChange}
                placeholder="e.g. Design Consulting"
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-white/40 focus:ring-1 focus:ring-white/40 text-white placeholder-neutral-500 font-sans text-sm outline-none transition-all"
              />
            </div>
          </div>

          {/* Helper */}
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-2.5 text-neutral-400">
            <Info size={15} className="shrink-0 mt-0.5 text-white/80" />
            <p className="text-xs leading-relaxed">
              Standard NPCI QR format supported by Google Pay, PhonePe, Paytm, BHIM, Cred, and mobile banking apps.
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
