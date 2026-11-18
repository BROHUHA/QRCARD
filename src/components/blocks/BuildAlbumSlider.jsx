import React, { useState, useRef, useEffect } from 'react';
import {
  Check,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Wifi,
  Share2,
  UserCheck,
  Globe,
  FileText,
  CreditCard,
  Mail,
  MoveHorizontal,
} from 'lucide-react';
import { PixelReveal } from '../ui/PixelReveal';

const SPECIMEN_CARDS = [
  {
    id: 'wifi',
    name: 'Wi-Fi Access',
    badge: '802.11ax Protocol',
    subtitle: 'Zero-Password Connection',
    icon: Wifi,
    features: [
      'Instant connection without typing passwords',
      'WPA, WPA2, WPA3 & WEP security support',
      'Hidden SSID broadcast compatibility',
      '4X Ultra-HD vector PNG export',
      '100% Client-side offline generation',
    ],
  },
  {
    id: 'social',
    name: 'Social Matrix',
    badge: 'Universal Multi-Hub',
    subtitle: 'Cross-Platform Identity',
    icon: Share2,
    features: [
      'Connect Instagram, WhatsApp, LinkedIn & X',
      'Instant profile redirection on camera scan',
      'Custom display handles & studio branding',
      'High-contrast optical scannability',
      'Vector SVG & print ready output',
    ],
  },
  {
    id: 'vcard',
    name: 'Contact vCard',
    badge: 'vCard 3.0 Standard',
    subtitle: 'Digital Business Identity',
    icon: UserCheck,
    features: [
      '1-tap "Add to Contacts" phonebook prompt',
      'Stores Name, Phone, Email & Company',
      'Compatible with all iOS & Android cameras',
      'Zero cloud tracking or contact upload',
      'Professional business card layout',
    ],
  },
  {
    id: 'url',
    name: 'Hyperlink Gateway',
    badge: 'Direct HTTPS Redirect',
    subtitle: 'Web Redirection Link',
    icon: Globe,
    features: [
      'Direct website, menu & portfolio launch',
      'Secure SSL link handling',
      'Custom specimen title framing',
      'High error correction tolerance',
      'Perfect for physical flyers & menus',
    ],
  },
  {
    id: 'text',
    name: 'Plain Text Card',
    badge: 'Raw UTF-8 Payload',
    subtitle: 'Text, Notes & Serials',
    icon: FileText,
    features: [
      'Encodes custom raw text, notes & serials',
      'Scans directly into notes, clipboard or search',
      'Secret keys, recovery codes or instructions',
      'No internet required to scan or decode',
      'Universal machine readability',
    ],
  },
  {
    id: 'upi',
    name: 'UPI Instant Pay',
    badge: 'NPCI Direct Settlement',
    subtitle: 'Zero-Fee Direct Pay',
    icon: CreditCard,
    features: [
      'Zero transaction fee bank-to-bank settlement',
      'Works with GPay, PhonePe, Paytm, BHIM',
      'Optional fixed amount & payment notes',
      'Instant payment interface trigger',
      'Merchant & freelance invoice ready',
    ],
  },
  {
    id: 'email',
    name: 'Direct Email Draft',
    badge: 'RFC 2368 Mailto',
    subtitle: 'Auto-Compose Dispatch',
    icon: Mail,
    features: [
      'Launches email client with pre-filled inbox',
      'Automated subject line & body message',
      'Apple Mail, Gmail & Outlook support',
      'Zero server transmission',
      'Ideal for inquiries & customer contracts',
    ],
  },
];

export const BuildAlbumSlider = ({ onSelectType, onBackToHome }) => {
  const [activeIndex, setActiveIndex] = useState(1); // Default to Social Matrix
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  const startXRef = useRef(0);
  const total = SPECIMEN_CARDS.length;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;

  // Responsive card geometry: exact mathematical centering on any viewport
  const cardWidth = isMobile
    ? Math.min(Math.max(windowWidth - 72, 280), 330)
    : isTablet
    ? 370
    : 410;

  const cardGap = isMobile ? 16 : 24;
  const cardStep = cardWidth + cardGap;
  const centerOffset = (windowWidth - cardWidth) / 2;
  const currentTranslateX = centerOffset - activeIndex * cardStep + dragOffset;

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : total - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < total - 1 ? prev + 1 : 0));
  };

  // Keyboard arrow controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // MANUAL DRAGGING & SLIDING (Mouse + Touch)
  const handleDragStart = (clientX) => {
    setIsDragging(true);
    startXRef.current = clientX;
    setDragOffset(0);
  };

  const handleDragMove = (clientX) => {
    if (!isDragging) return;
    const delta = clientX - startXRef.current;
    // Dampen drag effect slightly
    setDragOffset(delta);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragOffset < -60) {
      handleNext();
    } else if (dragOffset > 60) {
      handlePrev();
    }
    setDragOffset(0);
  };

  return (
    <section className="relative w-full pt-4 sm:pt-6 pb-2 sm:pb-6 select-none overflow-hidden">
      {/* Navigation Breadcrumb / Back Action */}
      {onBackToHome && (
        <div className="max-w-[1440px] 2xl:max-w-[1680px] mx-auto px-6 sm:px-12 lg:px-16 mb-2 relative z-20">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
            <button
              type="button"
              onClick={onBackToHome}
              className="flex items-center gap-2 text-xs font-mono font-bold text-neutral-400 hover:text-white transition-colors cursor-pointer group"
            >
              <ArrowLeft
                size={14}
                className="group-hover:-translate-x-1 transition-transform"
              />
              <span>RETURN TO HOME</span>
            </button>
          </div>
        </div>
      )}

      {/* 1. GIANT FROSTED BACKGROUND TEXT (Shifted below header blur) */}
      <div className="absolute top-6 sm:top-12 left-1/2 -translate-x-1/2 pointer-events-none select-none z-0 text-center w-full">
        <span className="font-heading font-black text-[6rem] sm:text-[12rem] md:text-[16rem] lg:text-[20rem] leading-none tracking-tighter text-white opacity-20 sm:opacity-25 select-none block">
          Build
        </span>
      </div>

      {/* 2. FOREGROUND CAROUSEL CONTAINER */}
      <PixelReveal delay={50} pixelSize={22} className="w-full">
        <div className="relative z-10 w-full pt-8 sm:pt-16 pb-4">
          {/* MANUAL SLIDING TRACK (DRAGGABLE & TOUCH-SWIPEABLE) */}
          <div
            className="w-full overflow-hidden cursor-grab active:cursor-grabbing py-4 sm:py-6"
            onMouseDown={(e) => handleDragStart(e.clientX)}
            onMouseMove={(e) => handleDragMove(e.clientX)}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
            onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
            onTouchEnd={handleDragEnd}
          >
            <div
              className="flex items-stretch justify-start transition-transform will-change-transform"
              style={{
                gap: `${cardGap}px`,
                transform: `translateX(${currentTranslateX}px)`,
                transition: isDragging
                  ? 'none'
                  : 'transform 550ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {SPECIMEN_CARDS.map((card, idx) => {
                const isCenter = idx === activeIndex;
                const IconComp = card.icon;

                return (
                  <div
                    key={card.id}
                    onClick={() => {
                      if (!isCenter) setActiveIndex(idx);
                    }}
                    style={{ width: `${cardWidth}px` }}
                    className={`shrink-0 rounded-[24px] sm:rounded-[32px] p-5 sm:p-7 md:p-8 flex flex-col justify-between select-none transition-all duration-500 transform will-change-transform ${
                      isCenter
                        ? 'liquid-glass-active scale-100 sm:scale-105 z-20 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.95),0_0_35px_rgba(255,255,255,0.08)]'
                        : 'liquid-glass scale-95 opacity-50 sm:opacity-55 hover:opacity-85 hover:scale-[0.98] z-10 cursor-pointer'
                    }`}
                  >
                    {/* Liquid Specular Glow for Center Active Card */}
                    {isCenter && (
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-24 bg-white/20 rounded-full blur-2xl pointer-events-none" />
                    )}

                    <div className="space-y-4 sm:space-y-5 relative z-10">
                      {/* Badge & Icon */}
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-neutral-400 font-bold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">
                          {card.badge}
                        </span>
                        <div
                          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center transition-all ${
                            isCenter
                              ? 'liquid-glass text-white border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.25)]'
                              : 'bg-white/5 text-neutral-400 border border-white/10'
                          }`}
                        >
                          <IconComp size={16} />
                        </div>
                      </div>

                      {/* Title & Subtitle */}
                      <div>
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold font-heading text-white tracking-tight leading-snug">
                          {card.name}
                        </h3>
                        <p className="text-[11px] sm:text-xs text-neutral-400 font-mono mt-0.5 sm:mt-1">
                          {card.subtitle}
                        </p>
                      </div>

                      {/* Feature Checkmarks */}
                      <div className="pt-3 border-t border-white/[0.08] space-y-2 sm:space-y-2.5">
                        {card.features.map((feature, fIdx) => (
                          <div
                            key={fIdx}
                            className="flex items-start gap-2 sm:gap-2.5 text-[11px] sm:text-xs text-neutral-300"
                          >
                            <div
                              className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                                isCenter
                                  ? 'bg-white/20 text-white shadow-sm'
                                  : 'bg-white/10 text-neutral-400'
                              }`}
                            >
                              <Check size={10} strokeWidth={3} />
                            </div>
                            <span className="leading-snug">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Action Button */}
                    <div className="pt-5 sm:pt-6 relative z-10">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectType(card.id);
                        }}
                        className={`w-full py-3 sm:py-3.5 rounded-full text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          isCenter
                            ? 'btn-chrome-primary shadow-[0_0_25px_rgba(255,255,255,0.4)] hover:scale-[1.02]'
                            : 'bg-white/10 hover:bg-white/20 border border-white/20 text-white hover:border-white/40'
                        }`}
                      >
                        <span>Build {card.name}</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. SLEEK BOTTOM INDICATOR DOTS & UNIFIED NAVIGATION CONTROLS */}
          <div className="mt-6 sm:mt-8 flex items-center justify-center gap-3 sm:gap-4 z-20">
            {/* Backward Arrow */}
            <button
              type="button"
              onClick={handlePrev}
              className="w-10 h-10 rounded-full liquid-glass flex items-center justify-center text-white active:scale-90 hover:scale-105 hover:border-white/30 transition-all shadow-md cursor-pointer"
              title="Previous Specimen"
              aria-label="Previous Specimen"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Pagination Dots */}
            <div className="flex items-center gap-2">
              {SPECIMEN_CARDS.map((c, idx) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    activeIndex === idx
                      ? 'w-7 sm:w-8 bg-white shadow-[0_0_12px_rgba(255,255,255,0.85)]'
                      : 'w-1.5 sm:w-2 bg-white/20 hover:bg-white/40'
                  }`}
                  title={c.name}
                />
              ))}
            </div>

            {/* Forward Arrow */}
            <button
              type="button"
              onClick={handleNext}
              className="w-10 h-10 rounded-full liquid-glass flex items-center justify-center text-white active:scale-90 hover:scale-105 hover:border-white/30 transition-all shadow-md cursor-pointer"
              title="Next Specimen"
              aria-label="Next Specimen"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </PixelReveal>
    </section>
  );
};
