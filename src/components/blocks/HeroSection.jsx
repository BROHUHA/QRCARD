import React from 'react';
import {
  Wifi,
  CreditCard,
  UserCheck,
  Share2,
  Mail,
  Globe,
  FileText,
  ArrowRight,
  Disc,
  ShieldCheck,
} from 'lucide-react';
import { ChromeStar } from '../ui/ChromeStar';
import { PixelReveal } from '../ui/PixelReveal';

export const HeroSection = ({ onSelectCategory, onGoToBuildSection }) => {
  const categories = [
    {
      id: 'social',
      name: 'Social Matrix',
      tag: 'Multi-Channel',
      desc: 'Connect Instagram, WhatsApp, LinkedIn, GitHub, X & Telegram',
      icon: Share2,
    },
    {
      id: 'wifi',
      name: 'Wi-Fi Access',
      tag: '802.11ax',
      desc: 'Instant zero-password scan for guests and enterprise teams',
      icon: Wifi,
    },
    {
      id: 'vcard',
      name: 'Contact vCard',
      tag: 'vCard 3.0',
      desc: 'One-tap auto-save for name, email, phone & company profile',
      icon: UserCheck,
    },
    {
      id: 'url',
      name: 'Web Gateway',
      tag: 'HTTPS Direct',
      desc: 'Minimal high-contrast portal for portfolios, menus & campaigns',
      icon: Globe,
    },
    {
      id: 'text',
      name: 'Plain Text Card',
      tag: 'Raw UTF-8',
      desc: 'Encode arbitrary passcodes, notes, serials, and instructions',
      icon: FileText,
    },
    {
      id: 'upi',
      name: 'UPI Instant Pay',
      tag: 'Zero-Fee Direct',
      desc: 'Direct payment via GPay, PhonePe, Paytm, BHIM & bank apps',
      icon: CreditCard,
    },
    {
      id: 'email',
      name: 'Direct Email',
      tag: 'Auto-Compose',
      desc: 'Pre-fills recipient, subject line, and initial draft message',
      icon: Mail,
    },
  ];

  return (
    <section className="relative w-full overflow-hidden pt-4 pb-16 select-none">
      {/* Floating 3D Chrome Stars in Hero */}
      <div className="absolute top-8 right-8 sm:right-20 lg:right-32 pointer-events-none hidden sm:block">
        <ChromeStar size={120} className="transform rotate-12" />
      </div>
      <div className="absolute top-44 right-4 sm:right-12 lg:right-16 pointer-events-none hidden sm:block">
        <ChromeStar size={48} className="transform -rotate-12 opacity-80" />
      </div>

      {/* Fitted Wide Container (No wasted space on left and right) */}
      <div className="w-full max-w-[1440px] 2xl:max-w-[1680px] mx-auto px-6 sm:px-12 lg:px-16 relative z-10 space-y-10">
        {/* Typographic Identity matching reference font styling */}
        <PixelReveal delay={50} pixelSize={22}>
          <div className="space-y-4 max-w-5xl">
            {/* Top Brush Signature Font (Grindy Brush) */}
            <div className="font-brush text-5xl sm:text-7xl lg:text-8xl text-white tracking-normal leading-none select-none">
              ALL QR
            </div>

            {/* Heavy Bold Geometric Headline */}
            <h1 className="font-heading text-3xl sm:text-5xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.08]">
              Design Production-Grade Optical Cards
            </h1>

            {/* Metadata / Subtitle Tag */}
            <div className="text-xs sm:text-sm font-bold uppercase tracking-widest text-neutral-400 font-mono">
              PRECISION OPTICAL TOKENS &bull; 100% PRIVATE CLIENT-SIDE STUDIO
            </div>

            {/* Clean, Readable Body Description */}
            <p className="text-base sm:text-xl text-neutral-300 font-normal leading-relaxed max-w-4xl pt-1">
              An all-in-one optical studio to craft high-precision, tactile QR cards. Build production-ready, scan-verified tokens for instant Wi-Fi connectivity, zero-fee UPI settlement, digital vCard identities, multi-channel social matrices, direct emails, and web gateways with razor-sharp 4X Ultra-HD export.
            </p>

            {/* Action CTAs: CREATE button directing to /build album section */}
            <div className="flex items-center gap-3.5 pt-4">
              <button
                type="button"
                onClick={onGoToBuildSection}
                className="btn-chrome-primary px-8 py-4 rounded-full text-sm font-extrabold flex items-center justify-center gap-2.5 cursor-pointer shadow-[0_0_25px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform"
              >
                <Disc size={18} className="animate-spin-slow" />
                <span className="tracking-wide">CREATE QR CARD</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </PixelReveal>

        {/* Brand Capabilities Bar */}
        <div className="pt-6 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4 text-xs text-neutral-400 font-medium">
          <div className="flex items-center gap-2.5">
            <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
            <span className="text-xs sm:text-sm text-neutral-300">100% Client-Side Offline &bull; Zero Server Tracking &bull; 4X Ultra-HD Vector &amp; PNG Export</span>
          </div>

          <div className="hidden md:flex items-center gap-3 font-mono text-[11px] text-neutral-400">
            <span>SOCIAL</span>
            <span>&bull;</span>
            <span>WI-FI</span>
            <span>&bull;</span>
            <span>VCARD</span>
            <span>&bull;</span>
            <span>HYPERLINK</span>
            <span>&bull;</span>
            <span>TEXT</span>
            <span>&bull;</span>
            <span>UPI</span>
            <span>&bull;</span>
            <span>EMAIL</span>
          </div>
        </div>

        {/* Quick Category Selector Bento Bar across full fitted width */}
        <PixelReveal delay={150} pixelSize={18}>
          <div className="pt-2 space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs uppercase tracking-widest text-neutral-300 font-semibold flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>SELECT CARD TYPE</span>
              </div>
              <span className="text-xs text-neutral-400 font-mono hidden sm:inline">INSTANT STUDIO ACCESS</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
              {categories.map((cat) => {
                const IconComp = cat.icon;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => onSelectCategory(cat.id)}
                    className="group liquid-glass rounded-2xl p-4 text-left flex flex-col justify-between h-32 cursor-pointer hover:border-white/40 hover:-translate-y-1 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white/90 group-hover:bg-white group-hover:text-black transition-all">
                        <IconComp size={16} />
                      </div>
                      <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-neutral-400 group-hover:text-neutral-200">
                        {cat.tag}
                      </span>
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-white group-hover:text-white leading-tight">
                        {cat.name}
                      </div>
                      <div className="text-[10px] text-neutral-400 font-mono mt-1 flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        <span>Launch</span>
                        <ArrowRight size={10} />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </PixelReveal>
      </div>
    </section>
  );
};
