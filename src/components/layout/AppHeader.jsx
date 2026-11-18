import React, { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { Translations } from '../../translations';
import { PixelReveal } from '../ui/PixelReveal';

export const AppHeader = ({
  currentRoute,
  onNavigate,
  currentLang,
  onChangeLanguage,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Lock body scroll when drawer is open to eliminate dual scrollbars
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const handleNav = (route, href = null) => {
    if (href) {
      window.open(href, '_blank', 'noopener,noreferrer');
      setMenuOpen(false);
      return;
    }
    onNavigate(route);
    setMenuOpen(false);
  };

  return (
    <>
      {/* 1. PROGRESSIVE LIQUID GLASS FADED HEADER (Smooth 84px Blending, Ending Before Content) */}
      <div
        className="liquid-glass-progressive no-print select-none"
        aria-hidden="true"
      >
        <div className="absolute inset-0 liquid-glass-blur-1" />
        <div className="absolute inset-0 liquid-glass-blur-2" />
        <div className="absolute inset-0 liquid-glass-blur-3" />
        <div className="absolute inset-0 liquid-glass-blur-4" />
        <div className="absolute inset-0 liquid-glass-sheen" />
      </div>

      {/* 2. UNIVERSAL TOP-RIGHT MORPHING MENU / CLOSE BUTTON (Exact match to Reference Image 1) */}
      <div className="fixed top-4 right-4 sm:top-6 sm:right-8 z-[60] no-print select-none">
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="liquid-glass group w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.8)] hover:scale-105 hover:border-white/30 transition-all"
          title={menuOpen ? 'Close Menu' : 'Open Menu'}
          aria-label={menuOpen ? 'Close Menu' : 'Open Menu'}
        >
          <div className="w-5 h-3.5 relative flex flex-col justify-between items-center pointer-events-none">
            <span
              className={`w-5 h-0.5 bg-white rounded-full transition-all duration-300 origin-center ${
                menuOpen ? 'rotate-45 translate-y-[6px]' : ''
              }`}
            />
            <span
              className={`w-5 h-0.5 bg-white rounded-full transition-all duration-200 origin-center ${
                menuOpen ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'
              }`}
            />
            <span
              className={`w-5 h-0.5 bg-white rounded-full transition-all duration-300 origin-center ${
                menuOpen ? '-rotate-45 -translate-y-[6px]' : ''
              }`}
            />
          </div>
        </button>
      </div>

      {/* 3. REFERENCE-MATCHING MINIMAL FULLSCREEN MENU OVERLAY (Exact match to Reference Image 2 & 3) */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 w-screen h-screen min-h-screen bg-[#030303] flex flex-col justify-between overflow-hidden select-none">
          <PixelReveal
            triggerKey={menuOpen}
            duration={1350}
            pixelSize={24}
            className="w-full h-full flex flex-col justify-between"
          >
            <div className="w-full h-full min-h-screen bg-[#030303] flex flex-col justify-between p-6 sm:p-10 md:p-12 relative z-10">
              <div className="absolute inset-0 ambient-spotlight pointer-events-none" />

              {/* Top Bar: Brand on Top-Left (Matching Reference Image 2) */}
              <div className="relative z-10 flex items-center justify-between max-w-6xl mx-auto w-full">
                <button
                  type="button"
                  onClick={() => handleNav('/')}
                  className="flex items-center gap-2.5 cursor-pointer group"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 group-hover:scale-125 transition-transform shadow-[0_0_10px_rgba(52,211,153,0.7)]" />
                  <span className="font-heading font-black text-xl sm:text-2xl tracking-tight text-white group-hover:text-neutral-200 transition-colors">
                    ALL QR
                  </span>
                </button>
                {/* Spacing placeholder for the fixed top-right close button */}
                <div className="w-12 h-12" />
              </div>

              {/* Center: Stacked Bold Typography Menu Items (Exact match to Reference Image 3) */}
              <div className="relative z-10 flex flex-col items-center justify-center my-auto space-y-6 sm:space-y-8 text-center py-6">
                {[
                  { id: '/', label: 'HOME' },
                  { id: '/build', label: 'BUILD ALBUMS' },
                  {
                    id: 'about',
                    label: 'ABOUT',
                    href: 'https://4bin.vercel.app',
                  },
                  { id: '/privacy', label: 'PRIVACY' },
                ].map((item) => {
                  const isActive = currentRoute === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNav(item.id, item.href)}
                      className={`group relative text-3xl sm:text-5xl md:text-6xl font-heading font-black tracking-wider transition-all duration-300 cursor-pointer ${
                        isActive
                          ? 'text-white scale-105'
                          : 'text-neutral-400 hover:text-white hover:scale-105'
                      }`}
                    >
                      <span className="relative z-10">{item.label}</span>
                      {isActive && (
                        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-white rounded-full shadow-[0_0_12px_rgba(255,255,255,0.9)]" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Bottom Bar: Ultra-minimal footer */}
              <div className="relative z-10 max-w-6xl mx-auto w-full flex items-center justify-between text-xs text-neutral-500 font-mono pt-4 border-t border-white/[0.06]">
                <div>&copy; 2026 ALL QR STUDIO</div>
                <div className="flex items-center gap-2">
                  <Globe size={13} className="text-neutral-400" />
                  <select
                    value={currentLang}
                    onChange={(e) => onChangeLanguage(e.target.value)}
                    className="bg-transparent border-none text-neutral-400 hover:text-white text-xs outline-none cursor-pointer"
                  >
                    {Translations.map((lang) => (
                      <option
                        key={lang.id}
                        value={lang.id}
                        className="bg-neutral-900 text-white"
                      >
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </PixelReveal>
        </div>
      )}
    </>
  );
};
