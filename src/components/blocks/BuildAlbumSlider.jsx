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
  const startYRef = useRef(0);
  const startTimeRef = useRef(0);
  const isHorizontalSwipeRef = useRef(null); // null = undetermined, true = horizontal swipe, false = vertical scroll
  const isMouseDownRef = useRef(false);
  const hasMovedRef = useRef(false);

  const total = SPECIMEN_CARDS.length;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;

  // Responsive card geometry: snug fit & visible edge peeking on mobile
  const cardWidth = isMobile
    ? Math.min(windowWidth - 52, 320)
    : isTablet
    ? 360
    : 400;

  const cardGap = isMobile ? 12 : 20;
  const cardStep = cardWidth + cardGap;
  const centerOffset = (windowWidth - cardWidth) / 2;
  const currentTranslateX = centerOffset - activeIndex * cardStep + dragOffset;

  const handlePrev = () => {
    setActiveIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => Math.min(total - 1, prev + 1));
  };

  // Keyboard arrow controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [total]);

  // TOUCH GESTURE HANDLING WITH DIRECTION LOCKING (SILKY 60-120FPS)
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    startXRef.current = touch.clientX;
    startYRef.current = touch.clientY;
    startTimeRef.current = Date.now();
    isHorizontalSwipeRef.current = null;
    hasMovedRef.current = false;
    setIsDragging(false);
    setDragOffset(0);
  };

  const handleTouchMove = (e) => {
    // If determined as vertical page scroll, let browser handle naturally without interference
    if (isHorizontalSwipeRef.current === false) return;

    const touch = e.touches[0];
    const diffX = touch.clientX - startXRef.current;
    const diffY = touch.clientY - startYRef.current;

    // Detect direction intent once movement passes 7px threshold
    if (isHorizontalSwipeRef.current === null) {
      const absX = Math.abs(diffX);
      const absY = Math.abs(diffY);
      if (absX > 7 || absY > 7) {
        if (absX >= absY) {
          isHorizontalSwipeRef.current = true;
          setIsDragging(true);
        } else {
          isHorizontalSwipeRef.current = false;
          return;
        }
      } else {
        return;
      }
    }

    if (isHorizontalSwipeRef.current === true) {
      if (Math.abs(diffX) > 5) {
        hasMovedRef.current = true;
      }
      // Apply rubber-band damping at boundaries
      let offset = diffX;
      if (
        (activeIndex === 0 && offset > 0) ||
        (activeIndex === total - 1 && offset < 0)
      ) {
        offset = offset * 0.3;
      }
      setDragOffset(offset);
    }
  };

  const handleTouchEnd = () => {
    if (isHorizontalSwipeRef.current === true) {
      const dt = Math.max(Date.now() - startTimeRef.current, 1);
      const velocity = dragOffset / dt; // px per ms

      // Fast flick or distance threshold
      if (dragOffset < -40 || velocity < -0.3) {
        handleNext();
      } else if (dragOffset > 40 || velocity > 0.3) {
        handlePrev();
      }
    }
    isHorizontalSwipeRef.current = null;
    setIsDragging(false);
    setDragOffset(0);
    setTimeout(() => {
      hasMovedRef.current = false;
    }, 50);
  };

  // MOUSE DRAG HANDLING
  const handleMouseDown = (e) => {
    isMouseDownRef.current = true;
    startXRef.current = e.clientX;
    startTimeRef.current = Date.now();
    hasMovedRef.current = false;
    setIsDragging(true);
    setDragOffset(0);
  };

  const handleMouseMove = (e) => {
    if (!isMouseDownRef.current) return;
    const diffX = e.clientX - startXRef.current;
    if (Math.abs(diffX) > 5) {
      hasMovedRef.current = true;
    }
    let offset = diffX;
    if (
      (activeIndex === 0 && offset > 0) ||
      (activeIndex === total - 1 && offset < 0)
    ) {
      offset = offset * 0.3;
    }
    setDragOffset(offset);
  };

  const handleMouseUp = () => {
    if (!isMouseDownRef.current) return;
    isMouseDownRef.current = false;
    const dt = Math.max(Date.now() - startTimeRef.current, 1);
    const velocity = dragOffset / dt;

    if (dragOffset < -45 || velocity < -0.3) {
      handleNext();
    } else if (dragOffset > 45 || velocity > 0.3) {
      handlePrev();
    }
    setIsDragging(false);
    setDragOffset(0);
    setTimeout(() => {
      hasMovedRef.current = false;
    }, 50);
  };

  return (
    <section className="relative w-full pt-3 sm:pt-6 pb-2 sm:pb-6 select-none overflow-hidden">
      {/* Navigation Breadcrumb / Back Action */}
      {onBackToHome && (
        <div className="max-w-[1440px] 2xl:max-w-[1680px] mx-auto px-5 sm:px-12 lg:px-16 mb-1 sm:mb-2 relative z-20">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 sm:pb-4">
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

      {/* 1. GIANT FROSTED BACKGROUND TEXT */}
      <div className="absolute top-2 sm:top-10 left-1/2 -translate-x-1/2 pointer-events-none select-none z-0 text-center w-full">
        <span className="font-heading font-black text-[5.5rem] sm:text-[12rem] md:text-[16rem] lg:text-[20rem] leading-none tracking-tighter text-white opacity-20 sm:opacity-25 select-none block">
          Build
        </span>
      </div>

      {/* 2. FOREGROUND CAROUSEL CONTAINER */}
      <PixelReveal delay={50} pixelSize={22} className="w-full">
        <div className="relative z-10 w-full pt-4 sm:pt-14 pb-2 sm:pb-4">
          {/* TRACK WRAPPER WITH PAN-Y FOR NATIVE VERTICAL SCROLL */}
          <div
            className="w-full overflow-hidden cursor-grab active:cursor-grabbing py-2 sm:py-5"
            style={{ touchAction: 'pan-y' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex items-stretch justify-start will-change-transform"
              style={{
                gap: `${cardGap}px`,
                transform: `translate3d(${currentTranslateX}px, 0, 0)`,
                transition: isDragging
                  ? 'none'
                  : 'transform 420ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {SPECIMEN_CARDS.map((card, idx) => {
                const isCenter = idx === activeIndex;
                const IconComp = card.icon;

                return (
                  <div
                    key={card.id}
                    onClick={() => {
                      if (hasMovedRef.current) return;
                      if (!isCenter) setActiveIndex(idx);
                    }}
                    style={{ width: `${cardWidth}px` }}
                    className={`shrink-0 rounded-[22px] sm:rounded-[32px] p-4 sm:p-7 md:p-8 flex flex-col justify-between select-none transition-[transform,opacity] duration-350 ease-out will-change-transform ${
                      isCenter
                        ? 'liquid-glass-active scale-100 sm:scale-105 z-20 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.9),0_0_30px_rgba(255,255,255,0.06)]'
                        : 'liquid-glass scale-95 opacity-50 sm:opacity-55 hover:opacity-85 z-10 cursor-pointer'
                    }`}
                  >
                    {/* Liquid Specular Glow for Center Active Card */}
                    {isCenter && (
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-40 sm:w-48 h-20 sm:h-24 bg-white/15 rounded-full blur-2xl pointer-events-none" />
                    )}

                    <div className="space-y-3 sm:space-y-5 relative z-10">
                      {/* Badge & Icon */}
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] sm:text-[11px] font-mono uppercase tracking-widest text-neutral-400 font-bold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">
                          {card.badge}
                        </span>
                        <div
                          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all ${
                            isCenter
                              ? 'liquid-glass text-white border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.25)]'
                              : 'bg-white/5 text-neutral-400 border border-white/10'
                          }`}
                        >
                          <IconComp size={15} />
                        </div>
                      </div>

                      {/* Title & Subtitle */}
                      <div>
                        <h3 className="text-lg sm:text-2xl md:text-3xl font-extrabold font-heading text-white tracking-tight leading-snug">
                          {card.name}
                        </h3>
                        <p className="text-[10px] sm:text-xs text-neutral-400 font-mono mt-0.5 sm:mt-1">
                          {card.subtitle}
                        </p>
                      </div>

                      {/* Feature Checkmarks */}
                      <div className="pt-2.5 sm:pt-3 border-t border-white/[0.08] space-y-1.5 sm:space-y-2.5">
                        {card.features.map((feature, fIdx) => (
                          <div
                            key={fIdx}
                            className="flex items-start gap-2 sm:gap-2.5 text-[10.5px] sm:text-xs text-neutral-300"
                          >
                            <div
                              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                                isCenter
                                  ? 'bg-white/20 text-white shadow-sm'
                                  : 'bg-white/10 text-neutral-400'
                              }`}
                            >
                              <Check size={9} strokeWidth={3} />
                            </div>
                            <span className="leading-tight sm:leading-snug">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Action Button */}
                    <div className="pt-4 sm:pt-6 relative z-10">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectType(card.id);
                        }}
                        className={`w-full py-2.5 sm:py-3.5 rounded-full text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          isCenter
                            ? 'btn-chrome-primary shadow-[0_0_25px_rgba(255,255,255,0.4)] hover:scale-[1.02]'
                            : 'bg-white/10 hover:bg-white/20 border border-white/20 text-white hover:border-white/40'
                        }`}
                      >
                        <span>Build {card.name}</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. SLEEK BOTTOM INDICATOR DOTS & UNIFIED NAVIGATION CONTROLS */}
          <div className="mt-4 sm:mt-8 flex items-center justify-center gap-3 sm:gap-4 z-20">
            {/* Backward Arrow */}
            <button
              type="button"
              onClick={handlePrev}
              disabled={activeIndex === 0}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full liquid-glass flex items-center justify-center text-white active:scale-90 hover:scale-105 hover:border-white/30 transition-all shadow-md cursor-pointer ${
                activeIndex === 0
                  ? 'opacity-30 cursor-not-allowed'
                  : 'opacity-100'
              }`}
              title="Previous Specimen"
              aria-label="Previous Specimen"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Pagination Dots */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {SPECIMEN_CARDS.map((c, idx) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    activeIndex === idx
                      ? 'w-6 sm:w-8 bg-white shadow-[0_0_12px_rgba(255,255,255,0.85)]'
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
              disabled={activeIndex === total - 1}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full liquid-glass flex items-center justify-center text-white active:scale-90 hover:scale-105 hover:border-white/30 transition-all shadow-md cursor-pointer ${
                activeIndex === total - 1
                  ? 'opacity-30 cursor-not-allowed'
                  : 'opacity-100'
              }`}
              title="Next Specimen"
              aria-label="Next Specimen"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </PixelReveal>
    </section>
  );
};
