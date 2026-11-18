import React from 'react';
import {
  ShieldCheck,
  Lock,
  WifiOff,
  EyeOff,
  FileCode,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { PixelReveal } from '../ui/PixelReveal';

export const PrivacySection = ({ onGoToStudio, onGoToBuild }) => {
  const principles = [
    {
      icon: EyeOff,
      title: 'Zero Data Transmission',
      desc: 'All optical QR code generation, cryptographic encoding, styling, and rendering occur entirely in your local browser sandbox. No user inputs (passwords, UPI VPAs, phone numbers, contact records, or plain text) are ever dispatched to any server.',
    },
    {
      icon: WifiOff,
      title: '100% Offline Capable',
      desc: 'You can disconnect from the internet or switch to Airplane Mode. ALL QR STUDIO functions completely offline, computing mathematical QR matrices directly using client-side Web APIs.',
    },
    {
      icon: Lock,
      title: 'No Tracking & Zero Telemetry',
      desc: 'We do not run Google Analytics, Meta Pixels, tracking cookies, or diagnostic beacon telemetry. There are no tracking scripts, fingerprinting hooks, or third-party advertising dependencies in this application.',
    },
    {
      icon: FileCode,
      title: 'Ephemeral Client Memory',
      desc: 'Payload state is kept exclusively in temporary browser memory. When you close or refresh your browser tab, all entered credentials, contacts, and configuration settings are instantly purged.',
    },
  ];

  return (
    <section className="relative w-full overflow-hidden pt-4 pb-20 select-none animate-fade-in">
      <div className="w-full max-w-[1440px] 2xl:max-w-[1680px] mx-auto px-6 sm:px-12 lg:px-16 relative z-10 space-y-12">
        {/* Navigation Breadcrumb / Back Action */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <button
            type="button"
            onClick={onGoToBuild}
            className="flex items-center gap-2 text-xs font-mono font-bold text-neutral-400 hover:text-white transition-colors cursor-pointer group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span>RETURN TO BUILD ALBUMS</span>
          </button>
        </div>

        {/* Header Block with Pixel Reveal */}
        <PixelReveal delay={40} pixelSize={22}>
          <div className="space-y-4 max-w-4xl">
            <div className="font-brush text-5xl sm:text-7xl lg:text-8xl text-white tracking-normal leading-none select-none">
              Privacy Policy
            </div>

            <h1 className="font-heading text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              100% Client-Side Private Engine
            </h1>

            <p className="text-base sm:text-xl text-neutral-300 font-normal leading-relaxed pt-1">
              ALL QR STUDIO is engineered from the ground up on the principle of unconditional client-side privacy. Unlike conventional online QR generators that route your sensitive Wi-Fi credentials, personal contact vCards, and payment identifiers through remote cloud logging databases, our architecture never touches a server.
            </p>
          </div>
        </PixelReveal>

        {/* 4 Architectural Privacy Pillars */}
        <PixelReveal delay={120} pixelSize={20}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {principles.map((p, idx) => {
              const IconComp = p.icon;
              return (
                <div
                  key={p.title}
                  className="liquid-glass rounded-2xl p-6 sm:p-8 space-y-4 border border-white/10 hover:border-white/30 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white">
                      <IconComp size={22} />
                    </div>
                    <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest">
                      PILLAR 0{idx + 1}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-white font-heading">
                    {p.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-normal">
                    {p.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </PixelReveal>

        {/* Detailed Technical Privacy Specifications */}
        <PixelReveal delay={180} pixelSize={22}>
          <div className="liquid-glass rounded-3xl p-6 sm:p-10 space-y-8 border border-white/10">
            <div className="space-y-2">
              <div className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-bold flex items-center gap-2">
                <ShieldCheck size={16} className="text-white" />
                <span>TECHNICAL AUDIT GUARANTEES</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                What Happens to Your Data
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-neutral-300">
              <div className="space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                <div className="flex items-center gap-2 text-white font-bold font-mono text-sm">
                  <CheckCircle2 size={16} className="text-white" />
                  <span>Wi-Fi Credentials</span>
                </div>
                <p className="text-neutral-400 leading-relaxed">
                  Network SSIDs and WPA/WPA2/WPA3 pre-shared keys are formatted directly into standard <code className="text-white bg-white/10 px-1 py-0.5 rounded">WIFI:T:WPA;S:...</code> strings inside browser memory. They are never transmitted over HTTP/HTTPS.
                </p>
              </div>

              <div className="space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                <div className="flex items-center gap-2 text-white font-bold font-mono text-sm">
                  <CheckCircle2 size={16} className="text-white" />
                  <span>UPI Payment VPAs</span>
                </div>
                <p className="text-neutral-400 leading-relaxed">
                  Beneficiary Virtual Payment Addresses (VPAs) and transaction amounts are converted directly into URI intents according to NPCI UPI specifications. No banking data is stored or proxied.
                </p>
              </div>

              <div className="space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                <div className="flex items-center gap-2 text-white font-bold font-mono text-sm">
                  <CheckCircle2 size={16} className="text-white" />
                  <span>Contact vCard 3.0</span>
                </div>
                <p className="text-neutral-400 leading-relaxed">
                  Names, telephone numbers, emails, and organization credentials are built into standard vCard 3.0 MIME blocks on your machine, enabling safe generation of personal business identity tokens.
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/[0.06]">
              <div className="text-xs text-neutral-500 font-mono">
                Source code is public and transparently verifiable.
              </div>

              <div className="flex items-center gap-3">
                <a
                  href="https://github.com/BROHUHA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-neutral-300 hover:text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2"
                >
                  <span>Verify on GitHub</span>
                  <ExternalLink size={13} />
                </a>

                <button
                  type="button"
                  onClick={onGoToStudio}
                  className="btn-chrome-primary px-6 py-2.5 rounded-full text-xs font-extrabold flex items-center gap-2 cursor-pointer shadow-lg hover:scale-105 transition-all"
                >
                  <span>Open Live Studio</span>
                </button>
              </div>
            </div>
          </div>
        </PixelReveal>
      </div>
    </section>
  );
};
