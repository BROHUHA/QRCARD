import React, { useState } from 'react';
import {
  X,
  Download,
  Sparkles,
  Check,
  Smartphone,
  Square,
  RectangleHorizontal,
  RectangleVertical,
  CreditCard,
  Printer,
  FileCode,
  Layers,
} from 'lucide-react';

export const ASPECT_RATIOS = [
  {
    id: 'auto',
    name: 'Auto Fluid',
    ratio: 'Adaptive',
    dims: 'Original Canvas',
    useCase: 'Universal Responsive',
    aspectClass: '',
    icon: Layers,
  },
  {
    id: '1:1',
    name: 'Square Post',
    ratio: '1:1',
    dims: '2160 × 2160 px',
    useCase: 'Instagram, WhatsApp DP, Stand',
    aspectClass: 'aspect-square max-w-[460px]',
    icon: Square,
  },
  {
    id: '9:16',
    name: 'Story & Reel',
    ratio: '9:16',
    dims: '2160 × 3840 px',
    useCase: 'IG Story, TikTok, Wallpaper',
    aspectClass: 'aspect-[9/16] max-w-[380px]',
    icon: Smartphone,
  },
  {
    id: '4:5',
    name: 'Social Portrait',
    ratio: '4:5',
    dims: '2160 × 2700 px',
    useCase: 'Instagram Feed Portrait',
    aspectClass: 'aspect-[4/5] max-w-[430px]',
    icon: RectangleVertical,
  },
  {
    id: '16:9',
    name: 'Landscape Banner',
    ratio: '16:9',
    dims: '3840 × 2160 px',
    useCase: 'Twitter/X Header, Desktop',
    aspectClass: 'aspect-[16/9] max-w-[680px]',
    icon: RectangleHorizontal,
  },
  {
    id: '3:2',
    name: 'Classic Photo',
    ratio: '3:2',
    dims: '3600 × 2400 px',
    useCase: '4x6" Postcard & Photo Print',
    aspectClass: 'aspect-[3/2] max-w-[620px]',
    icon: Printer,
  },
  {
    id: '3:4',
    name: 'Editorial Poster',
    ratio: '3:4',
    dims: '2700 × 3600 px',
    useCase: 'Swiss Specimen Poster',
    aspectClass: 'aspect-[3/4] max-w-[450px]',
    icon: RectangleVertical,
  },
  {
    id: 'card',
    name: 'Business Card',
    ratio: '85.6 : 54',
    dims: '3425 × 2160 px',
    useCase: 'CR80 Standard Wallet Card',
    aspectClass: 'aspect-[1.586/1] max-w-[540px]',
    icon: CreditCard,
  },
];

export const DownloadModal = ({
  isOpen = false,
  onClose,
  selectedRatio = 'auto',
  onSelectRatio,
  onDownload,
  activeTab = 'social',
}) => {
  const [format, setFormat] = useState('png'); // 'png' | 'jpeg' | 'svg'
  const [downloading, setDownloading] = useState(false);

  if (!isOpen) return null;

  const currentRatioObj =
    ASPECT_RATIOS.find((r) => r.id === selectedRatio) || ASPECT_RATIOS[0];

  const handleTriggerDownload = async () => {
    setDownloading(true);
    try {
      if (onDownload) {
        await onDownload(selectedRatio, format);
      }
    } finally {
      setDownloading(false);
      if (onClose) onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-2xl bg-[#0C0C0E] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl text-white space-y-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 uppercase tracking-wider">
              <Sparkles size={14} />
              <span>4X Ultra-HD Specimen Render</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading tracking-tight mt-1 text-white">
              Export Aspect Ratio & Resolution
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Select target aspect ratio before download. Scaled with 4x pixel density.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* 8 Aspect Ratios Grid */}
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center justify-between">
            <span>1. Select Aspect Ratio ({ASPECT_RATIOS.length} Options)</span>
            <span className="text-indigo-400 font-bold">{currentRatioObj.name} ({currentRatioObj.ratio})</span>
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {ASPECT_RATIOS.map((r) => {
              const isSelected = selectedRatio === r.id;
              const IconComp = r.icon;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => onSelectRatio && onSelectRatio(r.id)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden group ${
                    isSelected
                      ? 'bg-white text-black border-white shadow-xl scale-[1.02] font-bold'
                      : 'bg-white/[0.03] border-white/10 hover:border-white/30 text-neutral-300 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                        isSelected ? 'bg-black text-white' : 'bg-white/10 text-neutral-300'
                      }`}
                    >
                      <IconComp size={15} />
                    </div>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        isSelected ? 'bg-black/10 text-black font-extrabold' : 'bg-white/10 text-neutral-400'
                      }`}
                    >
                      {r.ratio}
                    </span>
                  </div>

                  <div className="text-xs font-bold truncate leading-snug">{r.name}</div>
                  <div
                    className={`text-[10px] font-mono mt-0.5 truncate ${
                      isSelected ? 'text-neutral-700' : 'text-neutral-400'
                    }`}
                  >
                    {r.dims}
                  </div>
                  <div
                    className={`text-[9px] mt-1 truncate ${
                      isSelected ? 'text-neutral-600' : 'text-neutral-400'
                    }`}
                  >
                    {r.useCase}
                  </div>

                  {isSelected && (
                    <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-black text-white flex items-center justify-center">
                      <Check size={10} strokeWidth={3} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Format Selector: PNG | JPEG | SVG */}
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-wider text-neutral-400">
            2. Choose File Format
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'png', name: 'PNG Image', desc: '4X Lossless Ultra-HD' },
              { id: 'jpeg', name: 'JPEG Photo', desc: 'High Quality Compressed' },
              { id: 'svg', name: 'SVG Vector', desc: 'Infinitely Scalable Vector' },
            ].map((f) => {
              const isSelected = format === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFormat(f.id)}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md font-bold'
                      : 'bg-white/[0.03] border-white/10 text-neutral-300 hover:text-white hover:border-white/20'
                  }`}
                >
                  <div className="text-xs font-bold">{f.name}</div>
                  <div className="text-[10px] text-neutral-400 font-mono mt-0.5">{f.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs font-mono text-neutral-400">
            Output: <span className="text-white font-bold">{currentRatioObj.dims}</span> &bull; {format.toUpperCase()}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-neutral-300 hover:bg-white/10 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleTriggerDownload}
              disabled={downloading}
              className="flex-1 sm:flex-none btn-chrome-primary px-6 py-2.5 rounded-full text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
            >
              <Download size={14} />
              <span>{downloading ? 'Rendering...' : `Download ${currentRatioObj.name}`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
