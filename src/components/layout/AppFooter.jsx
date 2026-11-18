import React from 'react';
import { ChromeStar } from '../ui/ChromeStar';
import { PixelReveal } from '../ui/PixelReveal';

export const AppFooter = ({ onNavigate }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#030303] text-white border-t border-white/[0.08] overflow-hidden select-none no-print">
      <div className="absolute inset-0 ambient-spotlight-bottom pointer-events-none" />

      <PixelReveal delay={40} pixelSize={22} className="w-full">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 pt-16 pb-12 relative z-10 space-y-12">
          {/* Top Grid Columns */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Brand Info */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                <span className="text-lg font-extrabold tracking-tight text-white font-heading">
                  ALL QR STUDIO
                </span>
              </div>
              <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
                Next-generation optical QR card studio. Precision
                physical-to-digital tokens engineered for frictionless Wi-Fi
                connectivity, instant UPI settlement, vCard contacts, social
                matrices, and web gateways. 100% client-side privacy.
              </p>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-3 space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-semibold">
                SPECIMEN SUITE
              </div>
              <ul className="space-y-2 text-xs text-neutral-400">
                <li>
                  <span className="hover:text-white transition-colors cursor-default">
                    Wi-Fi 802.11ax Network
                  </span>
                </li>
                <li>
                  <span className="hover:text-white transition-colors cursor-default">
                    UPI Direct Pay (Zero Fee)
                  </span>
                </li>
                <li>
                  <span className="hover:text-white transition-colors cursor-default">
                    vCard 3.0 Digital Contact
                  </span>
                </li>
                <li>
                  <span className="hover:text-white transition-colors cursor-default">
                    Multi-Channel Social Matrix
                  </span>
                </li>
                <li>
                  <span className="hover:text-white transition-colors cursor-default">
                    Encrypted Plain Text &amp; URL
                  </span>
                </li>
              </ul>
            </div>

            {/* Project & Creator */}
            <div className="md:col-span-4 space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-semibold">
                ARCHITECTURE &amp; ARCHIVE
              </div>
              <ul className="space-y-2 text-xs text-neutral-400">
                <li>
                  <a
                    href="https://github.com/BROHUHA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    GitHub Repository →
                  </a>
                </li>
                <li>
                  {onNavigate ? (
                    <button
                      type="button"
                      onClick={() => onNavigate('/privacy')}
                      className="hover:text-white transition-colors text-left cursor-pointer"
                    >
                      Privacy Policy (Zero-Telemetry) →
                    </button>
                  ) : (
                    <span className="text-neutral-500">
                      Zero Telemetry &bull; 100% Client-Side Engine
                    </span>
                  )}
                </li>
                <li>
                  <span className="text-neutral-500">
                    4X Ultra-HD Vector &amp; PNG Export
                  </span>
                </li>
                <li>
                  <span className="text-neutral-500">
                    100% Client-Side Cryptographic Engine
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Huge Modern Outlined Typography at Bottom (Exact match to SEOTalos in reference) */}
          <div className="pt-6 border-t border-white/[0.06] flex flex-col items-center justify-center space-y-4">
            <div
              className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-center uppercase select-none opacity-20 hover:opacity-40 transition-opacity font-heading"
              style={{
                WebkitTextStroke: '1px #ffffff',
                color: 'transparent',
              }}
            >
              ALL QR STUDIO
            </div>

            <div className="w-full flex flex-wrap items-center justify-between text-xs text-neutral-500 pt-2 font-mono gap-2">
              <div>
                &copy; {currentYear} ALL QR STUDIO. All rights reserved.
              </div>
              <div>
                Zero Server Tracking &bull; All Computations Executed Locally in
                Browser
              </div>
            </div>
          </div>
        </div>
      </PixelReveal>
    </footer>
  );
};
