import React, { useState } from 'react';
import {
  Palette,
  Check,
  ShieldCheck,
  Compass,
  QrCode,
  Sparkles,
  CheckCircle2,
  Image as ImageIcon,
  Upload,
  Trash2,
  Sliders,
  ImagePlus,
} from 'lucide-react';
import { LIGHT_GRADIENTS, DESIGNER_TEMPLATES, QR_BG_STYLES } from './designerTemplates';
import { TACTILE_STYLES } from './tactileStyles';
import { MaterialIcon } from './MaterialIcons';

const SAMPLE_WALLPAPERS = [
  {
    id: 'silk',
    name: 'Silk Waves',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'nordic',
    name: 'Nordic Art',
    url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'brutalist',
    name: 'Studio Sand',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'obsidian',
    name: 'Dark Ripple',
    url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80',
  },
];

export const CardThemeSelector = ({
  bgPreset = 'opal-mint',
  onSelectBgPreset,
  gradientConfig = {
    startColor: '#E0F7F6',
    endColor: '#C5ECE9',
    startStop: 0,
    endStop: 100,
    direction: 180,
  },
  onChangeGradient,
  qrMaterial = 'classic',
  onSelectQrMaterial,
  platform = 'instagram',
  // QR Glass Background Style Props
  qrBgStyle = 'white',
  onSelectQrBgStyle,
  // Background Image Upload Props
  bgImage = null,
  onUploadBgImage,
  bgImageBlur = 0,
  onChangeBgImageBlur,
  bgImageOverlay = 0.25,
  onChangeBgImageOverlay,
}) => {
  // Sub-tab state: 'gradient' (Background) | 'image' (Image BG) | 'qr' (QR Code Style) | 'dark' (Dark Glass)
  const [subTab, setSubTab] = useState(bgImage ? 'image' : 'gradient');

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (onUploadBgImage) onUploadBgImage(dataUrl);
      if (onSelectBgPreset) onSelectBgPreset('custom-image');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    if (onUploadBgImage) onUploadBgImage(null);
    if (onSelectBgPreset) onSelectBgPreset('opal-mint');
    setSubTab('gradient');
  };

  const handlePickSampleWallpaper = (url) => {
    if (onUploadBgImage) onUploadBgImage(url);
    if (onSelectBgPreset) onSelectBgPreset('custom-image');
  };

  const startColor = gradientConfig?.startColor || '#E0F7F6';
  const endColor = gradientConfig?.endColor || '#C5ECE9';
  const startStop = gradientConfig?.startStop ?? 0;
  const endStop = gradientConfig?.endStop ?? 100;
  const direction = gradientConfig?.direction ?? 180;

  const handleSelectGradient = (g) => {
    if (onSelectBgPreset) onSelectBgPreset(g.id);
    if (onChangeGradient) {
      onChangeGradient({
        startColor: g.startColor,
        endColor: g.endColor,
        startStop: 0,
        endStop: 100,
        direction: direction,
      });
    }
  };

  const handleRotateDial = () => {
    const nextAngle = (direction + 45) % 360;
    if (onChangeGradient) {
      onChangeGradient({
        ...gradientConfig,
        direction: nextAngle,
      });
    }
  };

  const handleAngleChange = (angle) => {
    const num = Math.max(0, Math.min(360, Number(angle) || 0));
    if (onChangeGradient) {
      onChangeGradient({
        ...gradientConfig,
        direction: num,
      });
    }
  };

  const handleColorChange = (key, value) => {
    if (onChangeGradient) {
      onChangeGradient({
        ...gradientConfig,
        [key]: value,
      });
    }
  };

  const handleStopChange = (key, value) => {
    const num = Math.max(0, Math.min(100, Number(value) || 0));
    if (onChangeGradient) {
      onChangeGradient({
        ...gradientConfig,
        [key]: num,
      });
    }
  };

  // Predefined QR Materials: Classic Precision is FIRST (Default)
  const ALL_QR_MATERIALS = [
    {
      id: 'classic',
      name: 'Classic Precision',
      subtitle: 'Pure optical contrast & sharp modules',
      category: 'DEFAULT',
      code: 'MONO / 00',
    },
    ...TACTILE_STYLES,
  ];

  return (
    <div className="space-y-4 text-white">
      {/* 1. Header with Top Pill Switcher: [ Pastel Gradients | Image BG | QR Style | Dark Glass ] */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-white/[0.08]">
        <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
          {subTab === 'qr-bg' ? (
            <>
              <Sparkles size={13} className="text-indigo-400" />
              <span>QR Glass Background</span>
            </>
          ) : subTab === 'qr' ? (
            <>
              <QrCode size={13} className="text-emerald-400" />
              <span>QR Code Style</span>
            </>
          ) : subTab === 'image' ? (
            <>
              <ImageIcon size={13} className="text-amber-400" />
              <span>Background Image</span>
            </>
          ) : (
            <>
              <Palette size={13} className="text-indigo-400" />
              <span>Background Style</span>
            </>
          )}
        </label>

        {/* Top Pill Switcher: [ Pastel Gradients | Image BG | QR Style | QR Glass BG ] */}
        <div className="flex items-center p-1 rounded-2xl bg-white/5 border border-white/10 shrink-0 flex-wrap gap-0.5">
          <button
            type="button"
            onClick={() => {
              setSubTab('gradient');
              if (onSelectBgPreset && bgPreset === 'custom-image') onSelectBgPreset('opal-mint');
            }}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              subTab === 'gradient'
                ? 'bg-white text-black shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Pastel Gradients
          </button>
          <button
            type="button"
            onClick={() => {
              setSubTab('image');
              if (onSelectBgPreset && bgImage) onSelectBgPreset('custom-image');
            }}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === 'image'
                ? 'bg-white text-black shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <ImageIcon size={12} />
            <span>Image BG</span>
          </button>
          <button
            type="button"
            onClick={() => setSubTab('qr')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              subTab === 'qr'
                ? 'bg-white text-black shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            QR Style
          </button>
          <button
            type="button"
            onClick={() => setSubTab('qr-bg')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === 'qr-bg'
                ? 'bg-white text-black shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Sparkles size={12} className={subTab === 'qr-bg' ? 'text-indigo-600' : 'text-neutral-400'} />
            <span>QR Glass BG</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          TAB 1: PASTEL GRADIENT BACKGROUND (Matching Image 2)
         ======================================================== */}
      {subTab === 'gradient' && (
        <div className="space-y-3.5 animate-fade-in">
          {/* 12 Pastel Gradient Swatches Grid (2 rows of 6 matching reference) */}
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 sm:gap-2.5">
            {LIGHT_GRADIENTS.map((g) => {
              const isSelected = bgPreset === g.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => handleSelectGradient(g)}
                  className={`group relative h-14 sm:h-16 rounded-xl border transition-all cursor-pointer overflow-hidden shadow-sm ${
                    isSelected
                      ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-[#0A0A0A] scale-[1.05] shadow-md border-indigo-400'
                      : 'border-white/10 hover:border-white/30 hover:scale-[1.03]'
                  }`}
                  style={{ background: g.swatchBg }}
                  title={`${g.name} (${g.startColor} → ${g.endColor})`}
                >
                  {isSelected && (
                    <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[0.5px] flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-md">
                        <Check size={10} strokeWidth={3} />
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Gradient Inspector Box (Live Bar, Start/End Cards, Direction Controller) */}
          <div className="liquid-glass rounded-2xl p-4 space-y-3.5 border border-white/10">
            {/* Live Spectrum Strip with Handles */}
            <div
              className="w-full h-8 rounded-xl shadow-inner border border-white/15 relative overflow-hidden transition-all duration-300"
              style={{
                background: `linear-gradient(${direction}deg, ${startColor} ${startStop}%, ${endColor} ${endStop}%)`,
              }}
            >
              <div
                className="absolute top-1 bottom-1 w-2.5 rounded-sm bg-white border border-neutral-300 shadow-md cursor-ew-resize"
                style={{ left: `calc(${startStop}% - 5px)` }}
              />
              <div
                className="absolute top-1 bottom-1 w-2.5 rounded-sm bg-white border border-neutral-300 shadow-md cursor-ew-resize"
                style={{ left: `calc(${endStop}% - 5px)` }}
              />
            </div>

            {/* Start & End Color Controls */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* Start */}
              <div className="space-y-1">
                <div className="p-2 rounded-xl bg-black/40 border border-white/10 flex items-center gap-2">
                  <label className="relative w-7 h-7 rounded-lg border border-white/20 shrink-0 cursor-pointer overflow-hidden">
                    <input
                      type="color"
                      value={startColor}
                      onChange={(e) => handleColorChange('startColor', e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <div className="w-full h-full" style={{ backgroundColor: startColor }} />
                  </label>
                  <div className="truncate">
                    <div className="text-[9px] uppercase font-mono text-neutral-400">Start</div>
                    <div className="text-xs font-mono font-bold text-white truncate">{startColor}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 text-xs font-mono">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={startStop}
                    onChange={(e) => handleStopChange('startStop', e.target.value)}
                    className="w-full bg-transparent text-white outline-none"
                  />
                  <span className="text-neutral-500">%</span>
                </div>
              </div>

              {/* End */}
              <div className="space-y-1">
                <div className="p-2 rounded-xl bg-black/40 border border-white/10 flex items-center gap-2">
                  <label className="relative w-7 h-7 rounded-lg border border-white/20 shrink-0 cursor-pointer overflow-hidden">
                    <input
                      type="color"
                      value={endColor}
                      onChange={(e) => handleColorChange('endColor', e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <div className="w-full h-full" style={{ backgroundColor: endColor }} />
                  </label>
                  <div className="truncate">
                    <div className="text-[9px] uppercase font-mono text-neutral-400">End</div>
                    <div className="text-xs font-mono font-bold text-white truncate">{endColor}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 text-xs font-mono">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={endStop}
                    onChange={(e) => handleStopChange('endStop', e.target.value)}
                    className="w-full bg-transparent text-white outline-none"
                  />
                  <span className="text-neutral-500">%</span>
                </div>
              </div>
            </div>

            {/* Gradient Direction Controller (Dial & Input) */}
            <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between gap-3">
              <span className="text-xs font-medium text-neutral-300">Direction</span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRotateDial}
                  className="w-8 h-8 rounded-full bg-white text-indigo-600 shadow-md flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer border border-neutral-200"
                  title="Rotate angle by 45°"
                >
                  <div
                    className="transition-transform duration-300 flex items-center justify-center"
                    style={{ transform: `rotate(${direction}deg)` }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <line x1="5" y1="19" x2="19" y2="5" stroke="#4F46E5" strokeWidth="3.5" strokeLinecap="round" />
                      <circle cx="19" cy="5" r="2.5" fill="#4F46E5" />
                    </svg>
                  </div>
                </button>

                <div className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs font-mono w-16">
                  <input
                    type="number"
                    min="0"
                    max="360"
                    value={direction}
                    onChange={(e) => handleAngleChange(e.target.value)}
                    className="w-full bg-transparent text-white outline-none font-bold text-center"
                  />
                  <span className="text-neutral-400">°</span>
                </div>
              </div>
            </div>

            {/* Scan Range Safety Note */}
            <div className="flex items-center gap-1.5 pt-1 text-[11px] text-emerald-400 font-mono">
              <ShieldCheck size={13} className="shrink-0" />
              <span>This light background stays inside the tested scan range.</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: CUSTOM IMAGE BACKGROUND UPLOAD
         ======================================================== */}
      {subTab === 'image' && (
        <div className="space-y-3.5 animate-fade-in">
          {bgImage ? (
            <div className="liquid-glass rounded-2xl p-4 border border-white/10 space-y-3.5">
              {/* Preview with Action Overlay */}
              <div className="relative h-32 rounded-xl overflow-hidden border border-white/20 group shadow-inner">
                <img
                  src={bgImage}
                  alt="Custom Background"
                  className="w-full h-full object-cover transition-transform duration-300"
                  style={{ filter: bgImageBlur ? `blur(${bgImageBlur}px)` : undefined }}
                />
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                  style={{ backgroundColor: '#000000', opacity: bgImageOverlay }}
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2.5 backdrop-blur-[1px]">
                  <label className="px-3.5 py-1.5 rounded-xl bg-white text-black text-xs font-bold cursor-pointer hover:bg-neutral-200 shadow-md transition-all flex items-center gap-1.5">
                    <Upload size={12} />
                    <span>Replace</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="px-3.5 py-1.5 rounded-xl bg-rose-600/90 text-white text-xs font-bold hover:bg-rose-500 shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 size={12} />
                    <span>Remove</span>
                  </button>
                </div>
              </div>

              {/* Controls: Contrast Scrim & Frosted Blur */}
              <div className="space-y-3 pt-1">
                {/* Contrast Scrim / Readability Tint Slider */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono text-neutral-300">
                    <span className="flex items-center gap-1.5">
                      <Sliders size={12} className="text-indigo-400" />
                      <span>Readability Tint Overlay</span>
                    </span>
                    <span className="text-white font-bold">{Math.round(bgImageOverlay * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="0.8"
                    step="0.05"
                    value={bgImageOverlay}
                    onChange={(e) =>
                      onChangeBgImageOverlay &&
                      onChangeBgImageOverlay(parseFloat(e.target.value))
                    }
                    className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                </div>

                {/* Frosted Glass Blur Slider */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono text-neutral-300">
                    <span className="flex items-center gap-1.5">
                      <Sparkles size={12} className="text-amber-400" />
                      <span>Frosted Glass Blur</span>
                    </span>
                    <span className="text-white font-bold">{bgImageBlur}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="1"
                    value={bgImageBlur}
                    onChange={(e) =>
                      onChangeBgImageBlur &&
                      onChangeBgImageBlur(parseInt(e.target.value, 10))
                    }
                    className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                </div>
              </div>

              {/* Safety Contrast Indicator */}
              <div className="flex items-center gap-1.5 pt-1 text-[11px] text-emerald-400 font-mono">
                <ShieldCheck size={13} className="shrink-0" />
                <span>Adjust tint to keep text & QR code high-contrast and easily scannable.</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* File Upload Drag & Drop Area */}
              <label className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-white/20 hover:border-white/40 bg-white/[0.02] hover:bg-white/[0.05] transition-all cursor-pointer text-center group shadow-inner">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-neutral-300 group-hover:scale-110 group-hover:bg-white group-hover:text-black transition-all mb-3 shadow-md">
                  <ImagePlus size={22} />
                </div>
                <div className="text-xs font-bold text-white mb-1">
                  Click or Drop Background Wallpaper
                </div>
                <div className="text-[11px] text-neutral-400 font-mono">
                  PNG, JPG, WebP, SVG up to 10MB
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {/* Curated Studio Aesthetic Wallpapers for Instant 1-Click Testing */}
              <div className="space-y-2 pt-1">
                <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                  Or pick curated studio wallpaper
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {SAMPLE_WALLPAPERS.map((wp) => (
                    <button
                      key={wp.id}
                      type="button"
                      onClick={() => handlePickSampleWallpaper(wp.url)}
                      className="group relative h-16 rounded-xl border border-white/10 hover:border-white/40 overflow-hidden cursor-pointer shadow-sm hover:scale-[1.03] transition-all"
                      title={wp.name}
                    >
                      <img src={wp.url} alt={wp.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/15 transition-colors flex items-end p-1.5">
                        <span className="text-[10px] font-semibold text-white truncate drop-shadow-sm">
                          {wp.name}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          TAB 2: QR CODE STYLE & MATERIAL (Moved to Top Pill)
         ======================================================== */}
      {subTab === 'qr' && (
        <div className="space-y-2.5 animate-fade-in">
          {/* Material Cards Grid with Vector SVG Icons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
            {ALL_QR_MATERIALS.map((m) => {
              const isSelected = (qrMaterial || 'classic') === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onSelectQrMaterial && onSelectQrMaterial(m.id)}
                  className={`p-3 rounded-2xl text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between h-20 border ${
                    isSelected
                      ? 'border-2 border-emerald-400 bg-emerald-500/10 shadow-[0_0_20px_rgba(52,211,153,0.2)] scale-[1.02]'
                      : 'border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="w-full flex items-center justify-between">
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-emerald-400 text-black shadow-md'
                          : 'bg-white/10 text-neutral-300'
                      }`}
                    >
                      <MaterialIcon materialId={m.id} size={15} />
                    </div>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-emerald-400 text-black flex items-center justify-center">
                        <Check size={11} strokeWidth={3} />
                      </span>
                    )}
                  </div>

                  <div className="w-full">
                    <div className="text-xs font-bold text-white truncate leading-tight">
                      {m.name}
                    </div>
                    <div className="text-[10px] text-neutral-400 font-mono truncate mt-0.5">
                      {m.category || 'Texture'}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 4: QR GLASS BACKGROUND (Lucid, Frosted, Gaussian, Inverted, Solid White)
         ======================================================== */}
      {subTab === 'qr-bg' && (
        <div className="space-y-2.5 animate-fade-in">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
            {QR_BG_STYLES.map((style) => {
              const isSelected = (qrBgStyle || 'white') === style.id;
              return (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => onSelectQrBgStyle && onSelectQrBgStyle(style.id)}
                  className={`p-3 rounded-2xl text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between h-20 border ${
                    isSelected
                      ? 'border-2 border-indigo-400 bg-indigo-500/10 shadow-[0_0_20px_rgba(129,140,248,0.25)] scale-[1.02]'
                      : 'border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="w-full flex items-center justify-between">
                    <div
                      className={`w-7 h-7 rounded-xl ${style.previewBg} border ${style.previewBorder} shadow-sm flex items-center justify-center`}
                    >
                      <QrCode size={13} className={style.previewText} />
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isSelected ? (
                        <span className="w-4 h-4 rounded-full bg-indigo-400 text-black flex items-center justify-center shrink-0">
                          <Check size={11} strokeWidth={3} />
                        </span>
                      ) : (
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-white/10 text-neutral-400">
                          {style.tag}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="w-full">
                    <div className="text-xs font-bold text-white truncate leading-tight">
                      {style.name}
                    </div>
                    <div className="text-[10px] text-neutral-400 font-mono truncate mt-0.5">
                      {style.tag || 'Optic Glass'}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
