import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Wifi,
  Globe,
  Share2,
  CreditCard,
  UserCheck,
  Mail,
  FileText,
  Download,
  Printer,
  Copy,
  Check,
  ArrowLeft,
  Sparkles,
  ArrowRight,
  Image as ImageIcon,
} from 'lucide-react';
import { Preloader } from './components/ui/Preloader';
import { AppHeader } from './components/layout/AppHeader';
import { HeroSection } from './components/blocks/HeroSection';
import { BuildAlbumSlider } from './components/blocks/BuildAlbumSlider';
import { AppFooter } from './components/layout/AppFooter';
import { WifiCard } from './components/WifiCard';
import { Settings } from './components/Settings';
import { UrlCard } from './components/UrlCard';
import { UrlSettings } from './components/UrlSettings';
import { SocialCard } from './components/SocialCard';
import { SocialSettings } from './components/SocialSettings';
import { UpiCard } from './components/UpiCard';
import { UpiSettings } from './components/UpiSettings';
import { VCard } from './components/VCard';
import { VCardSettings } from './components/VCardSettings';
import { EmailCard } from './components/EmailCard';
import { EmailSettings } from './components/EmailSettings';
import { TextCard } from './components/TextCard';
import { TextSettings } from './components/TextSettings';
import { downloadHDCard } from './nodeToImageDownloader';
import { Translations } from './translations';
import { PLATFORMS_CONFIG } from './components/ui/socialConfig';
import { LIGHT_GRADIENTS } from './components/ui/designerTemplates';
import { DownloadModal, ASPECT_RATIOS } from './components/ui/DownloadModal';
import { PixelReveal } from './components/ui/PixelReveal';
import { PrivacySection } from './components/blocks/PrivacySection';
import './style.css';

const CARD_ELEMENT_ID = 'live-specimen-card';

// Parse initial route from window.location.pathname
const getInitialRoute = () => {
  if (typeof window === 'undefined') return '/';
  const path = window.location.pathname;
  if (path === '/privacy') return '/privacy';
  if (path.startsWith('/build')) {
    const parts = path.split('/').filter(Boolean);
    if (parts.length >= 2) return '/studio';
    return '/build';
  }
  if (path.startsWith('/studio')) return '/studio';
  return '/';
};

const getInitialTab = () => {
  if (typeof window === 'undefined') return 'social';
  const path = window.location.pathname;
  const parts = path.split('/').filter(Boolean);
  if (parts.length >= 2 && ['social', 'wifi', 'vcard', 'url', 'text', 'upi', 'email'].includes(parts[1])) {
    return parts[1];
  }
  return 'social';
};

export default function App() {
  const { t, i18n } = useTranslation();
  const [currentRoute, setCurrentRoute] = useState(getInitialRoute); // '/' | '/build' | '/studio'
  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [copied, setCopied] = useState(false);
  const [bgPreset, setBgPreset] = useState('opal-mint');
  const [qrMaterial, setQrMaterial] = useState('classic');
  const [tabRatios, setTabRatios] = useState({
    text: '1:1',
    social: 'auto',
    wifi: 'auto',
    upi: 'auto',
    vcard: 'auto',
    email: 'auto',
    url: 'auto',
  });
  const selectedRatio = tabRatios[activeTab] || (activeTab === 'text' ? '1:1' : 'auto');
  const setSelectedRatio = (ratio) => {
    setTabRatios((prev) => ({
      ...prev,
      [activeTab]: ratio,
    }));
  };
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  // Global Unified Theme & Background Engine (Pastel Gradients, Custom Image, QR Materials & QR Glass)
  const [themeSettings, setThemeSettings] = useState({
    theme: 'opal-mint',
    bgPreset: 'opal-mint',
    qrMaterial: 'classic',
    qrBgStyle: 'white',
    gradientConfig: {
      startColor: '#E0F7F6',
      endColor: '#C5ECE9',
      startStop: 0,
      endStop: 100,
      direction: 180,
    },
    bgImage: null,
    bgImageBlur: 0,
    bgImageOverlay: 0.25,
  });

  // Handle background preset selection
  const handleSelectBgPreset = (presetId) => {
    setBgPreset(presetId);
    const lightMatch = LIGHT_GRADIENTS.find((g) => g.id === presetId);
    setThemeSettings((prev) => ({
      ...prev,
      bgPreset: presetId,
      theme: presetId,
      gradientConfig: lightMatch
        ? {
            ...prev.gradientConfig,
            startColor: lightMatch.startColor,
            endColor: lightMatch.endColor,
          }
        : prev.gradientConfig,
    }));
  };

  // Handle QR material selection
  const handleSelectQrMaterial = (materialId) => {
    setQrMaterial(materialId);
    setThemeSettings((prev) => ({
      ...prev,
      qrMaterial: materialId,
    }));
  };

  // Get current active raw QR payload string
  const getCurrentPayload = () => {
    if (activeTab === 'wifi') {
      return `WIFI:T:${wifiSettings.encryptionMode};S:${wifiSettings.ssid};P:${wifiSettings.password};;`;
    } else if (activeTab === 'upi') {
      const p = new URLSearchParams();
      if (upiSettings.vpa) p.append('pa', upiSettings.vpa);
      if (upiSettings.name) p.append('pn', upiSettings.name);
      if (upiSettings.amount) p.append('am', upiSettings.amount);
      p.append('cu', 'INR');
      if (upiSettings.note) p.append('tn', upiSettings.note);
      return `upi://pay?${p.toString()}`;
    } else if (activeTab === 'vcard') {
      return `BEGIN:VCARD\nVERSION:3.0\nFN:${vcardSettings.firstName} ${vcardSettings.lastName}\nTEL:${vcardSettings.phone}\nEMAIL:${vcardSettings.email}\nORG:${vcardSettings.company}\nTITLE:${vcardSettings.title}\nURL:${vcardSettings.website}\nEND:VCARD`;
    } else if (activeTab === 'social') {
      const currentPlat = PLATFORMS_CONFIG.find((p) => p.id === socialSettings.platform) || PLATFORMS_CONFIG[0];
      const base = currentPlat.baseUrl || 'https://';
      const cleanVal = (socialSettings.value || '')
        .replace(/^@/, '')
        .replace(/^https?:\/\/[^/]+\//, '')
        .replace(/^\+/, '');
      return `${base}${cleanVal}`;
    } else if (activeTab === 'email') {
      return `mailto:${emailSettings.email}?subject=${encodeURIComponent(emailSettings.subject)}&body=${encodeURIComponent(emailSettings.body)}`;
    } else if (activeTab === 'text') {
      return textSettings.text || 'ALL QR';
    } else {
      return urlSettings.url || 'https://scanfolk.com';
    }
  };

  // 1. Wi-Fi Card Settings State
  const [wifiSettings, setWifiSettings] = useState({
    ssid: 'STUDIO_5G_NETWORK',
    password: 'optical_swiss_key',
    encryptionMode: 'WPA',
    hidePassword: false,
    hiddenSSID: false,
    portrait: false,
  });

  // 2. UPI Card Settings State
  const [upiSettings, setUpiSettings] = useState({
    vpa: 'merchant@upi',
    name: 'ACME STUDIO',
    amount: '500',
    note: 'Studio Design Services',
    portrait: false,
  });

  // 3. vCard Contact Settings State
  const [vcardSettings, setVcardSettings] = useState({
    firstName: 'Alex',
    lastName: 'Morgan',
    phone: '+1 (555) 019-2834',
    email: 'alex.morgan@allqr.studio',
    company: 'ALL QR STUDIO',
    title: 'Creative Technologist',
    website: 'https://allqr.studio',
    portrait: false,
  });

  // 4. Social Media Settings State
  const [socialSettings, setSocialSettings] = useState({
    platform: 'instagram',
    value: 'optical.studio',
    displayName: 'Studio Design',
    bio: 'Digital Design & Optical Systems',
    verified: true,
    theme: 'opal-mint',
    templateId: 'opal-mint',
    bgPreset: 'opal-mint',
    bgImage: null,
    bgImageBlur: 0,
    bgImageOverlay: 0.25,
    qrMaterial: 'classic',
    qrBgStyle: 'white',
    gradientConfig: {
      startColor: '#E0F7F6',
      endColor: '#C5ECE9',
      startStop: 0,
      endStop: 100,
      direction: 180,
    },
    qrCaption: 'SCAN TO FOLLOW',
    showCenterLogo: true,
    portrait: false,
    hideDisplayName: false,
  });

  // 5. Email Dispatch Settings State
  const [emailSettings, setEmailSettings] = useState({
    email: 'contact@allqr.studio',
    subject: 'Project Inquiry // Collaboration',
    body: 'Hello,\n\nI would love to inquire about collaborating on an upcoming project.',
    portrait: false,
  });

  // 6. URL Settings State
  const [urlSettings, setUrlSettings] = useState({
    url: 'https://allqr.studio',
    title: 'DIGITAL GATEWAY',
    portrait: false,
    hideTitle: false,
  });

  // 7. Plain Text Settings State
  const [textSettings, setTextSettings] = useState({
    text: 'Hello, scan to read or copy this text directly to your device.',
    title: 'Quick Note',
  });

  // Validation Errors
  const [errors, setErrors] = useState({});

  // Browser Navigation History Synchronization
  const navigateTo = (path, replace = false) => {
    if (path === '/privacy') {
      setCurrentRoute('/privacy');
      window.history[replace ? 'replaceState' : 'pushState']({}, '', '/privacy');
    } else if (path.startsWith('/build/')) {
      const type = path.replace('/build/', '');
      setActiveTab(type);
      setCurrentRoute('/studio');
      window.history[replace ? 'replaceState' : 'pushState']({}, '', path);
    } else if (path === '/build') {
      setCurrentRoute('/build');
      window.history[replace ? 'replaceState' : 'pushState']({}, '', '/build');
    } else if (path === '/studio') {
      setCurrentRoute('/studio');
      window.history[replace ? 'replaceState' : 'pushState']({}, '', `/build/${activeTab}`);
    } else {
      setCurrentRoute('/');
      window.history[replace ? 'replaceState' : 'pushState']({}, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle popstate (Browser Back & Forward)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/privacy') {
        setCurrentRoute('/privacy');
      } else if (path.startsWith('/build/')) {
        const type = path.replace('/build/', '');
        setActiveTab(type);
        setCurrentRoute('/studio');
      } else if (path.startsWith('/build')) {
        setCurrentRoute('/build');
      } else if (path.startsWith('/studio')) {
        setCurrentRoute('/studio');
      } else {
        setCurrentRoute('/');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Language Change
  const handleLanguageChange = (langId) => {
    i18n.changeLanguage(langId);
    const rtl = Translations.find((item) => item.id === langId)?.rtl;
    document.documentElement.dir = rtl ? 'rtl' : 'ltr';
  };

  // Select Specimen from Slider or Bento
  const handleSelectCardType = (cardId) => {
    setActiveTab(cardId);
    navigateTo(`/build/${cardId}`);
  };

  // Validate Active Card
  const validate = () => {
    const newErrors = {};
    if (activeTab === 'wifi') {
      if (!wifiSettings.ssid.trim()) newErrors.ssid = 'Network SSID is required';
      if (wifiSettings.encryptionMode === 'WPA' && wifiSettings.password.length < 8) {
        newErrors.password = 'WPA requires at least 8 characters';
      }
    } else if (activeTab === 'upi') {
      if (!upiSettings.vpa.trim()) newErrors.vpa = 'UPI ID (VPA) is required';
      if (!upiSettings.name.trim()) newErrors.name = 'Beneficiary Name is required';
    } else if (activeTab === 'vcard') {
      if (!vcardSettings.firstName.trim() && !vcardSettings.lastName.trim()) {
        newErrors.name = 'First or Last Name is required';
      }
    } else if (activeTab === 'social') {
      if (!socialSettings.value.trim()) newErrors.value = 'Handle / Identifier is required';
    } else if (activeTab === 'email') {
      if (!emailSettings.email.trim()) newErrors.email = 'Target email is required';
    } else if (activeTab === 'url') {
      if (!urlSettings.url.trim()) newErrors.url = 'Destination URL is required';
    } else if (activeTab === 'text') {
      if (!textSettings.text.trim()) newErrors.text = 'Text content cannot be empty';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Download 4x Ultra-HD PNG
  // Download 4x Ultra-HD with Aspect Ratio & Format Selection
  const handleDownload = () => {
    if (!validate()) return;
    setIsDownloadModalOpen(true);
  };

  const handleExecuteDownload = async (ratio = selectedRatio, format = 'png') => {
    if (!validate()) return;
    const filename = `allqr-${activeTab}-${Date.now()}`;
    await downloadHDCard(CARD_ELEMENT_ID, filename, {
      format,
      aspectRatio: ratio,
      pixelRatio: 4,
    });
  };

  // High-Precision Print Specimen Card
  const handlePrint = async () => {
    if (!validate()) return;
    try {
      await document.fonts?.ready;
    } catch (e) {
      // Continue if fonts API not supported
    }
    window.print();
  };

  // Copy Raw QR Payload
  const handleCopyPayload = () => {
    const payload = getCurrentPayload();
    navigator.clipboard.writeText(payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Render the Selected Settings Form
  const renderSettingsForm = () => {
    const commonFormProps = {
      themeSettings,
      setThemeSettings,
      errors,
    };

    switch (activeTab) {
      case 'wifi':
        return <Settings settings={wifiSettings} setSettings={setWifiSettings} {...commonFormProps} />;
      case 'upi':
        return <UpiSettings settings={upiSettings} setSettings={setUpiSettings} {...commonFormProps} />;
      case 'vcard':
        return <VCardSettings settings={vcardSettings} setSettings={setVcardSettings} {...commonFormProps} />;
      case 'social':
        return <SocialSettings settings={socialSettings} setSettings={setSocialSettings} {...commonFormProps} />;
      case 'email':
        return <EmailSettings settings={emailSettings} setSettings={setEmailSettings} {...commonFormProps} />;
      case 'url':
        return <UrlSettings settings={urlSettings} setSettings={setUrlSettings} {...commonFormProps} />;
      case 'text':
        return <TextSettings settings={textSettings} setSettings={setTextSettings} {...commonFormProps} />;
      default:
        return null;
    }
  };

  // Render the Live Interactive Specimen Card or Scanfolk Poster
  const renderLiveCard = () => {
    const commonCardSettings = {
      ...themeSettings,
      aspectRatio: selectedRatio,
    };

    switch (activeTab) {
      case 'wifi':
        return <WifiCard id={CARD_ELEMENT_ID} settings={{ ...wifiSettings, ...commonCardSettings }} />;
      case 'upi':
        return <UpiCard id={CARD_ELEMENT_ID} settings={{ ...upiSettings, ...commonCardSettings }} />;
      case 'vcard':
        return <VCard id={CARD_ELEMENT_ID} settings={{ ...vcardSettings, ...commonCardSettings }} />;
      case 'social':
        return <SocialCard id={CARD_ELEMENT_ID} settings={{ ...socialSettings, ...commonCardSettings }} />;
      case 'email':
        return <EmailCard id={CARD_ELEMENT_ID} settings={{ ...emailSettings, ...commonCardSettings }} />;
      case 'url':
        return <UrlCard id={CARD_ELEMENT_ID} settings={{ ...urlSettings, ...commonCardSettings }} />;
      case 'text':
        return <TextCard id={CARD_ELEMENT_ID} settings={{ ...textSettings, ...commonCardSettings }} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans selection:bg-white selection:text-black flex flex-col relative overflow-x-hidden">
      {/* 1. CONTINUOUS GLOBAL BACKGROUND LIGHTING & GRID (Seamless from y=0) */}
      <div className="fixed inset-0 dark-grid-bg pointer-events-none opacity-40 z-0" />
      <div className="fixed inset-0 ambient-spotlight pointer-events-none z-0" />

      {/* 2. SIMPLE DARK PRELOADER (Plays on initial mount and section switches) */}
      <Preloader triggerKey={currentRoute} />

      {/* 3. LIQUID GLASS FADED HEADER WITH MENU BUTTON */}
      <AppHeader
        currentRoute={currentRoute}
        onNavigate={navigateTo}
        currentLang={i18n.language}
        onChangeLanguage={handleLanguageChange}
      />

      {/* 4. DYNAMIC ROUTE VIEWS (Fitted wide layout with header clearance) */}
      <main className="flex-1 w-full flex flex-col justify-start relative z-10 pt-16 sm:pt-20">
        {currentRoute === '/' && (
          /* HOME VIEW */
          <div className="w-full">
            <HeroSection
              onSelectCategory={handleSelectCardType}
              onGoToBuildSection={() => navigateTo('/build')}
            />
          </div>
        )}

        {currentRoute === '/build' && (
          /* /build ROUTE: 3-CARD FROSTED GLASS SLIDING SECTION (Clean, Unsegmented) */
          <div className="w-full animate-fade-in">
            <BuildAlbumSlider
              onSelectType={handleSelectCardType}
              onBackToHome={() => navigateTo('/')}
            />
          </div>
        )}

        {currentRoute === '/studio' && (
          /* /build/[type] ROUTE: DEDICATED REAL-TIME QR CARD BUILDING SECTION */
          <div className="w-full max-w-[1440px] 2xl:max-w-[1680px] mx-auto py-2 sm:py-4 px-4 sm:px-8 lg:px-12 animate-fade-in">
            {/* Top Breadcrumb Navigation Bar */}
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-6">
              <button
                type="button"
                onClick={() => navigateTo('/build')}
                className="flex items-center gap-2 text-xs font-mono font-bold text-neutral-400 hover:text-white transition-colors cursor-pointer group"
              >
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                <span>RETURN TO BUILD ALBUMS</span>
              </button>
            </div>

            {/* TWO COLUMN STUDIO WORKSPACE (Wide Fitted) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* LEFT COLUMN: Clean & Understandable Detail Collecting Form */}
              <PixelReveal triggerKey={activeTab} delay={30} pixelSize={18} className="lg:col-span-5 w-full">
                <div className="liquid-glass rounded-2xl p-6 sm:p-8 space-y-6 no-print">
                  <div className="border-b border-white/10 pb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white uppercase tracking-wider font-heading">
                        {activeTab.toUpperCase()} Card Details
                      </h3>
                      <div className="text-xs text-neutral-400 font-mono mt-0.5">
                        Live real-time card customization
                      </div>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  </div>

                  {/* Form fields */}
                  {renderSettingsForm()}
                </div>
              </PixelReveal>

              {/* RIGHT COLUMN: Live Creation of QR (Sticky Preview & Action Buttons) */}
              <PixelReveal triggerKey={`${activeTab}-${selectedRatio}`} delay={50} pixelSize={18} className="lg:col-span-7 sticky top-8 w-full">
                <div className="flex flex-col gap-4">
                  {/* Live Card: Placed FIRST on mobile, SECOND on desktop */}
                  <div className="w-full flex justify-center py-2 order-1 lg:order-2">
                    {renderLiveCard()}
                  </div>

                  {/* Action Toolbar / Download Section: Placed AFTER preview on mobile, FIRST on desktop */}
                  <div className="liquid-glass rounded-2xl p-4 flex flex-col gap-3.5 order-2 lg:order-1 no-print">
                    {/* Top Bar: Title & Utility Actions (Copy / Print) */}
                    <div className="flex items-center justify-between gap-3 pb-2.5 border-b border-white/[0.08]">
                      <div className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                        <Sparkles size={14} className="text-white" />
                        <span>Real-Time Optical Matrix</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Copy Raw Payload */}
                        <button
                          type="button"
                          onClick={handleCopyPayload}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-neutral-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer font-medium"
                        >
                          {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                          <span>{copied ? 'Copied' : 'Copy Payload'}</span>
                        </button>

                        {/* Print */}
                        <button
                          type="button"
                          onClick={handlePrint}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-neutral-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer font-medium"
                        >
                          <Printer size={13} />
                          <span>Print</span>
                        </button>
                      </div>
                    </div>

                    {/* Main Action Bar: Aspect Ratios FIRST, followed directly by Download 4X HD */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                      {/* Quick Aspect Ratio Selector (Placed BEFORE Download Option) */}
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none flex-1">
                        <span className="text-[10px] font-mono uppercase text-neutral-400 font-bold shrink-0 mr-1">
                          Ratio:
                        </span>
                        {ASPECT_RATIOS.map((r) => {
                          const isSelected = selectedRatio === r.id;
                          return (
                            <button
                              key={r.id}
                              type="button"
                              onClick={() => setSelectedRatio(r.id)}
                              className={`px-2.5 py-1.5 rounded-xl text-[11px] font-mono shrink-0 transition-all cursor-pointer border ${
                                isSelected
                                  ? 'bg-white text-black font-extrabold border-white shadow-md scale-[1.04]'
                                  : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white hover:bg-white/10'
                              }`}
                              title={`${r.name} (${r.dims}) - ${r.useCase}`}
                            >
                              {r.ratio}
                            </button>
                          );
                        })}
                      </div>

                      {/* Download 4x Ultra-HD Button (Placed AFTER Aspect Ratios) */}
                      <button
                        type="button"
                        onClick={handleDownload}
                        className="btn-chrome-primary flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold cursor-pointer shadow-lg hover:scale-[1.02] transition-all shrink-0"
                      >
                        <Download size={14} />
                        <span>Download 4X HD</span>
                      </button>
                    </div>
                  </div>
                </div>
              </PixelReveal>
            </div>
          </div>
        )}
        {currentRoute === '/privacy' && (
          /* /privacy ROUTE: ZERO-TELEMETRY PRIVACY POLICY SPECIFICATION */
          <div className="w-full animate-fade-in">
            <PrivacySection
              onGoToStudio={() => navigateTo('/studio')}
              onGoToBuild={() => navigateTo('/build')}
            />
          </div>
        )}
      </main>

      {/* 4. EXPORT ASPECT RATIO & FORMAT MODAL */}
      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        selectedRatio={selectedRatio}
        onSelectRatio={setSelectedRatio}
        onDownload={handleExecuteDownload}
        activeTab={activeTab}
      />

      {/* 5. FOOTER */}
      <AppFooter onNavigate={navigateTo} />
    </div>
  );
}
