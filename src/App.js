import { Button, Heading, Link, Pane, Paragraph } from 'evergreen-ui';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Settings } from './components/Settings';
import { SocialCard } from './components/SocialCard';
import { SocialSettings } from './components/SocialSettings';
import { UrlCard } from './components/UrlCard';
import { UrlSettings } from './components/UrlSettings';
import { WifiCard } from './components/WifiCard';
import { downloadHDCard } from './nodeToImageDownloader';
import './style.css';
import { Translations } from './translations';

const WIFI_CARD_ID = 'wifi-card';
const URL_CARD_ID = 'url-card';
const SOCIAL_CARD_ID = 'social-card';

// SVG Icons
const DownloadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const PrintIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 6 2 18 2 18 9" />
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <rect x="6" y="14" width="12" height="8" />
  </svg>
);

const BookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const InfoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// Tab Icons
const WifiIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.55a11 11 0 0 1 14.08 0" />
    <path d="M1.42 9a16 16 0 0 1 21.16 0" />
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
    <line x1="12" y1="20" x2="12.01" y2="20" />
  </svg>
);

const LinkNavIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const SocialNavIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

function App() {
  const html = document.querySelector('html');
  const { t, i18n } = useTranslation();
  const firstLoad = useRef(true);
  const [activeTab, setActiveTab] = useState('wifi'); // 'wifi', 'url', or 'social'
  const [settings, setSettings] = useState({
    ssid: '',
    password: '',
    encryptionMode: 'WPA',
    eapMethod: 'PWD',
    eapIdentity: '',
    hidePassword: false,
    hiddenSSID: false,
    portrait: false,
  });
  const [urlSettings, setUrlSettings] = useState({
    url: '',
    title: '',
    portrait: false,
    hideTitle: false,
  });
  const [socialSettings, setSocialSettings] = useState({
    platform: 'whatsapp',
    value: '',
    displayName: '',
    portrait: false,
    hideDisplayName: false,
  });
  const [errors, setErrors] = useState({
    ssidError: '',
    passwordError: '',
    eapIdentityError: '',
  });
  const [urlErrors, setUrlErrors] = useState({
    urlError: '',
  });
  const [socialErrors, setSocialErrors] = useState({
    valueError: '',
  });
  const [activePanel, setActivePanel] = useState(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const htmlDirection = (languageID) => {
    languageID = languageID || i18n.language;
    const rtl = Translations.filter((t) => t.id === languageID)[0]?.rtl;
    return rtl ? 'rtl' : 'ltr';
  };

  const onChangeLanguage = (language) => {
    html.style.direction = htmlDirection(language);
    i18n.changeLanguage(language);
  };

  const validateForm = () => {
    if (activeTab === 'wifi') {
      if (!settings.ssid.length) {
        setErrors({ ...errors, ssidError: t('wifi.alert.name') });
        return false;
      }
      if (settings.password.length < 8 && settings.encryptionMode === 'WPA') {
        setErrors({ ...errors, passwordError: t('wifi.alert.password.length.8') });
        return false;
      }
      if (settings.password.length < 5 && settings.encryptionMode === 'WEP') {
        setErrors({ ...errors, passwordError: t('wifi.alert.password.length.5') });
        return false;
      }
      if (settings.password.length < 1 && settings.encryptionMode === 'WPA2-EAP') {
        setErrors({ ...errors, passwordError: t('wifi.alert.password') });
        return false;
      }
      if (settings.eapIdentity.length < 1 && settings.encryptionMode === 'WPA2-EAP') {
        setErrors({ ...errors, eapIdentityError: t('wifi.alert.eapIdentity') });
        return false;
      }
    } else if (activeTab === 'url') {
      if (!urlSettings.url.length) {
        setUrlErrors({ urlError: t('url.alert.empty') || 'Please enter a URL' });
        return false;
      }
    } else if (activeTab === 'social') {
      if (!socialSettings.value.length) {
        setSocialErrors({ valueError: t('social.alert.empty') || 'Please enter a value' });
        return false;
      }
    }
    return true;
  };

  const onPrint = () => {
    if (!validateForm()) return;
    if (activeTab === 'wifi') {
      document.title = 'WiFi Card - ' + settings.ssid;
    } else if (activeTab === 'url') {
      document.title = 'URL Card - ' + (urlSettings.title || urlSettings.url);
    } else {
      document.title = 'Social Card - ' + (socialSettings.displayName || socialSettings.platform);
    }
    window.print();
  };

  const onDownloadHD = () => {
    if (!validateForm()) return;
    if (activeTab === 'wifi') {
      downloadHDCard(WIFI_CARD_ID, `wifi-${settings.ssid || 'card'}`);
    } else if (activeTab === 'url') {
      downloadHDCard(URL_CARD_ID, `url-${urlSettings.title || 'card'}`);
    } else {
      downloadHDCard(SOCIAL_CARD_ID, `social-${socialSettings.platform || 'card'}`);
    }
  };

  const onSSIDChange = (ssid) => {
    setErrors({ ...errors, ssidError: '' });
    setSettings({ ...settings, ssid });
  };
  const onPasswordChange = (password) => {
    setErrors({ ...errors, passwordError: '' });
    setSettings({ ...settings, password });
  };
  const onEncryptionModeChange = (encryptionMode) => {
    setErrors({ ...errors, passwordError: '' });
    setSettings({ ...settings, encryptionMode });
  };
  const onEapMethodChange = (eapMethod) => {
    setSettings({ ...settings, eapMethod });
  };
  const onEapIdentityChange = (eapIdentity) => {
    setErrors({ ...errors, eapIdentityError: '' });
    setSettings({ ...settings, eapIdentity });
  };
  const onOrientationChange = (portrait) => {
    setSettings({ ...settings, portrait });
  };
  const onHidePasswordChange = (hidePassword) => {
    setSettings({ ...settings, hidePassword });
  };
  const onHiddenSSIDChange = (hiddenSSID) => {
    setSettings({ ...settings, hiddenSSID });
  };
  const onFirstLoad = () => {
    html.style.direction = htmlDirection();
    firstLoad.current = false;
  };

  // URL Card handlers
  const onUrlChange = (url) => {
    setUrlErrors({ urlError: '' });
    setUrlSettings({ ...urlSettings, url });
  };
  const onTitleChange = (title) => {
    setUrlSettings({ ...urlSettings, title });
  };
  const onUrlOrientationChange = (portrait) => {
    setUrlSettings({ ...urlSettings, portrait });
  };
  const onHideTitleChange = (hideTitle) => {
    setUrlSettings({ ...urlSettings, hideTitle });
  };

  // Social Card handlers
  const onPlatformChange = (platform) => {
    setSocialSettings({ ...socialSettings, platform });
  };
  const onSocialValueChange = (value) => {
    setSocialErrors({ valueError: '' });
    setSocialSettings({ ...socialSettings, value });
  };
  const onDisplayNameChange = (displayName) => {
    setSocialSettings({ ...socialSettings, displayName });
  };
  const onSocialOrientationChange = (portrait) => {
    setSocialSettings({ ...socialSettings, portrait });
  };
  const onHideDisplayNameChange = (hideDisplayName) => {
    setSocialSettings({ ...socialSettings, hideDisplayName });
  };

  useEffect(() => {
    if (htmlDirection() === 'rtl') {
      html.style.direction = 'rtl';
    }
  });

  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('selection'); // 'selection' or 'editor'

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleSelection = (tab) => {
    setActiveTab(tab);
    setViewMode('editor');
    window.scrollTo(0, 0);
  };

  const handleBackToHome = () => {
    setViewMode('selection');
    setMobileNavOpen(false);
    setActivePanel(null);
  };

  if (loading) {
    return (
      <div className="preloader">
        <div className="preloader-content">
          <div className="preloader-logo">
            <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="5" y="5" width="35" height="35" rx="5" fill="black" />
              <rect x="60" y="5" width="35" height="35" rx="5" fill="black" />
              <rect x="5" y="60" width="35" height="35" rx="5" fill="black" />
              <path d="M60 60H95V95H60V60Z" fill="#FFC900" />
              <rect x="15" y="15" width="15" height="15" fill="white" />
              <rect x="70" y="15" width="15" height="15" fill="white" />
              <rect x="15" y="70" width="15" height="15" fill="white" />
            </svg>
          </div>
          <h2>QR CARD</h2>
          <div className="loader-bar"></div>
        </div>
      </div>
    );
  }

  // Dynamic Theme Colors based on Active Tab
  const getThemeColor = (tab = activeTab) => {
    switch (tab) {
      case 'wifi': return '#FF5A5F'; // Red/Pink
      case 'url': return '#FFC900';  // Yellow
      case 'social': return '#88ccca'; // Teal
      default: return '#ffffff';
    }
  };

  const activeColor = getThemeColor();

  // Selection Screen Component
  if (viewMode === 'selection') {
    return (
      <Pane className="app selection-screen" style={{ maxWidth: '800px', border: 'none', boxShadow: 'none', background: 'transparent' }}>
        <div className="selection-container">
          <div className="selection-header">
            <div className="logo-large">
              <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="5" y="5" width="35" height="35" rx="5" fill="black" />
                <rect x="60" y="5" width="35" height="35" rx="5" fill="black" />
                <rect x="5" y="60" width="35" height="35" rx="5" fill="black" />
                <path d="M60 60H95V95H60V60Z" fill="#FFC900" />
                <rect x="15" y="15" width="15" height="15" fill="white" />
                <rect x="70" y="15" width="15" height="15" fill="white" />
                <rect x="15" y="70" width="15" height="15" fill="white" />
              </svg>
            </div>
            <h1>What would you like to create?</h1>
            <p>Select a card type to get started</p>
          </div>

          <div className="selection-grid">
            <button className="selection-card click-btn" onClick={() => handleSelection('wifi')}>
              <div className="selection-icon" style={{ background: '#FF5A5F' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                  <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                  <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                  <line x1="12" y1="20" x2="12.01" y2="20" strokeWidth="3" />
                </svg>
              </div>
              <h3>WiFi Card</h3>
              <p>Give guests instant access to your WiFi.</p>
            </button>
            <button className="selection-card click-btn" onClick={() => handleSelection('url')}>
              <div className="selection-icon" style={{ background: '#FFC900' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              </div>
              <h3>URL Card</h3>
              <p>Share any website or link easily.</p>
            </button>
            <button className="selection-card click-btn" onClick={() => handleSelection('social')}>
              <div className="selection-icon" style={{ background: '#88ccca' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth="2" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" strokeWidth="2" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="3" />
                </svg>
              </div>
              <h3>Social Card</h3>
              <p>Grow your social media following.</p>
            </button>
          </div>

          <footer className="simple-footer">
            <p>© 2026 QR Card. Open Source.</p>
          </footer>
        </div>
      </Pane>
    );
  }

  return (
    <Pane className="app">
      {/* Header with Dynamic Border Bottom */}
      <header className="header" style={{ borderBottomColor: activeColor === '#ffffff' ? '#000' : activeColor, borderBottomWidth: '4px' }}>
        <div className="header-container" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="logo click-btn" onClick={handleBackToHome}>
            <div className="logo-icon" style={{ backgroundColor: activeColor }}>
              <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="5" y="5" width="35" height="35" rx="5" fill="black" />
                <rect x="60" y="5" width="35" height="35" rx="5" fill="black" />
                <rect x="5" y="60" width="35" height="35" rx="5" fill="black" />
                <path d="M60 60H95V95H60V60Z" fill="white" />
                <rect x="15" y="15" width="15" height="15" fill="white" />
                <rect x="70" y="15" width="15" height="15" fill="white" />
                <rect x="15" y="70" width="15" height="15" fill="white" />
              </svg>
            </div>
            <span className="logo-text">QR Card</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            <button className={`nav-item click-btn ${activeTab === 'wifi' ? 'active' : ''}`} onClick={() => setActiveTab('wifi')}>WiFi</button>
            <button className={`nav-item click-btn ${activeTab === 'url' ? 'active' : ''}`} onClick={() => setActiveTab('url')}>URL</button>
            <button className={`nav-item click-btn ${activeTab === 'social' ? 'active' : ''}`} onClick={() => setActiveTab('social')}>Social</button>
            <div style={{ width: '2px', background: '#000', margin: '0 8px' }}></div>
            <button className="nav-item click-btn" onClick={() => setViewMode('selection')}>Home</button>
            <button className="nav-item click-btn" onClick={() => setActivePanel('guide')}>Guide</button>
            <button className="nav-item click-btn" onClick={() => setActivePanel('about')}>About</button>
            <a className="nav-item click-btn" href="https://abinbinoy.vercel.app" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>Portfolio</a>
          </nav>

          {/* Mobile Nav Toggle */}
          <button className="hamburger" onClick={() => setMobileNavOpen(!mobileNavOpen)}>
            <div className="hamburger-line" style={{ transform: mobileNavOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }}></div>
            <div className="hamburger-line" style={{ opacity: mobileNavOpen ? 0 : 1 }}></div>
            <div className="hamburger-line" style={{ transform: mobileNavOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }}></div>
          </button>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      <div
        className={`mobile-nav ${mobileNavOpen ? 'open' : ''}`}
        style={{ top: '70px' }} // Explicit top to avoid var issues if any
      >
        <button
          className={`mobile-nav-item click-btn ${activeTab === 'wifi' ? 'active' : ''}`}
          onClick={() => { setActiveTab('wifi'); setMobileNavOpen(false); }}
        >
          <WifiIcon /> WiFi Card
        </button>
        <button
          className={`mobile-nav-item click-btn ${activeTab === 'url' ? 'active' : ''}`}
          onClick={() => { setActiveTab('url'); setMobileNavOpen(false); }}
        >
          <LinkNavIcon /> URL Card
        </button>
        <button
          className={`mobile-nav-item click-btn ${activeTab === 'social' ? 'active' : ''}`}
          onClick={() => { setActiveTab('social'); setMobileNavOpen(false); }}
        >
          <SocialNavIcon /> Social Card
        </button>
        <div className="mobile-nav-divider" style={{ height: '3px', background: 'black' }}></div>
        <button
          className="mobile-nav-item click-btn"
          onClick={handleBackToHome}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg> Home
        </button>

        <button
          className={`mobile-nav-item click-btn ${activePanel === 'guide' ? 'active' : ''}`}
          onClick={() => { setActivePanel(activePanel === 'guide' ? null : 'guide'); setMobileNavOpen(false); }}
        >
          <BookIcon /> Guide
        </button>

        <button
          className={`mobile-nav-item click-btn ${activePanel === 'about' ? 'active' : ''}`}
          onClick={() => { setActivePanel(activePanel === 'about' ? null : 'about'); setMobileNavOpen(false); }}
        >
          <InfoIcon /> About
        </button>
      </div>

      {/* Main content with dynamic background accent? No, cleaner white. */}
      <main className="content" onClick={() => setMobileNavOpen(false)}>

        {/* Panels */}
        {activePanel === 'guide' && (
          <>
            <div className="modal-backdrop" onClick={() => setActivePanel(null)} />
            <div className="panel panel-modal">
              <div className="panel-header">
                <h3>Guide</h3>
                <button className="panel-close click-btn" onClick={() => setActivePanel(null)}>
                  <CloseIcon />
                </button>
              </div>
              {activeTab === 'wifi' ? (
                <ol className="panel-list">
                  <li>Enter your WiFi network name (SSID)</li>
                  <li>Enter your WiFi password</li>
                  <li>Choose encryption type and settings</li>
                  <li>Click "Download HD" or "Print"</li>
                  <li>Share with guests - they scan to connect!</li>
                </ol>
              ) : activeTab === 'url' ? (
                <ol className="panel-list">
                  <li>Enter any URL or website link</li>
                  <li>Add an optional title for the card</li>
                  <li>Customize orientation and settings</li>
                  <li>Click "Download HD" or "Print"</li>
                  <li>Share the QR code - scan to open the link!</li>
                </ol>
              ) : (
                <ol className="panel-list">
                  <li>Select a social platform (WhatsApp, Telegram, etc.)</li>
                  <li>Enter your phone number, username, or profile link</li>
                  <li>Add an optional display name</li>
                  <li>Click "Download HD" or "Print"</li>
                  <li>Share the QR code - scan to connect!</li>
                </ol>
              )}
            </div>
          </>
        )}

        {/* ... About Panel ... */}
        {activePanel === 'about' && (
          <>
            <div className="modal-backdrop" onClick={() => setActivePanel(null)} />
            <div className="panel panel-modal">
              <div className="panel-header">
                <h3>About</h3>
                <button className="panel-close click-btn" onClick={() => setActivePanel(null)}>
                  <CloseIcon />
                </button>
              </div>
              <p>Simple, secure, and open-source QR code generator.</p>
              <p><Link href="https://github.com/1999azzar/wifi-card" target="_blank" rel="noopener noreferrer">View Source on GitHub →</Link></p>
              <div style={{ marginTop: '20px', borderTop: '2px solid #eee', paddingTop: '10px' }}>
                <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>More from creator:</p>
                <Link href="https://abinbinoy.vercel.app" target="_blank" rel="noopener noreferrer" style={{ fontSize: '1.1rem', fontWeight: '800', textDecoration: 'none', color: '#0070f3' }}>
                  View Portfolio
                </Link>
              </div>
            </div>
          </>
        )}

        {/* Refined Hero - Cleaner, no heavily bordered box */}
        <section className="hero-clean">
          <h1 style={{ color: activeColor === '#ffffff' ? '#000' : 'black' }}>
            {activeTab === 'wifi' ? 'WiFi Card' : activeTab === 'url' ? 'URL Card' : 'Social Card'}
          </h1>
          <p>{activeTab === 'wifi'
            ? 'Generate printable WiFi QR codes'
            : activeTab === 'url'
              ? 'Convert any link into a printable QR code'
              : 'Create QR codes for social media'
          }</p>
        </section>

        {/* Cards - Conditionally rendered */}
        {activeTab === 'wifi' ? (
          <>
            <WifiCard
              id={WIFI_CARD_ID}
              settings={settings}
              ssidError={errors.ssidError}
              passwordError={errors.passwordError}
              eapIdentityError={errors.eapIdentityError}
              onSSIDChange={onSSIDChange}
              onEapIdentityChange={onEapIdentityChange}
              onPasswordChange={onPasswordChange}
            />

            {/* WiFi Settings */}
            <Settings
              settings={settings}
              firstLoad={firstLoad}
              onFirstLoad={onFirstLoad}
              onLanguageChange={onChangeLanguage}
              onEncryptionModeChange={onEncryptionModeChange}
              onEapMethodChange={onEapMethodChange}
              onOrientationChange={onOrientationChange}
              onHidePasswordChange={onHidePasswordChange}
              onHiddenSSIDChange={onHiddenSSIDChange}
            />
          </>
        ) : activeTab === 'url' ? (
          <>
            <UrlCard
              id={URL_CARD_ID}
              settings={urlSettings}
              urlError={urlErrors.urlError}
              onUrlChange={onUrlChange}
              onTitleChange={onTitleChange}
            />

            {/* URL Settings */}
            <UrlSettings
              settings={urlSettings}
              firstLoad={firstLoad}
              onFirstLoad={onFirstLoad}
              onLanguageChange={onChangeLanguage}
              onOrientationChange={onUrlOrientationChange}
              onHideTitleChange={onHideTitleChange}
            />
          </>
        ) : (
          <>
            <SocialCard
              id={SOCIAL_CARD_ID}
              settings={socialSettings}
              valueError={socialErrors.valueError}
              onPlatformChange={onPlatformChange}
              onValueChange={onSocialValueChange}
              onDisplayNameChange={onDisplayNameChange}
            />

            {/* Social Settings */}
            <SocialSettings
              settings={socialSettings}
              firstLoad={firstLoad}
              onFirstLoad={onFirstLoad}
              onPlatformChange={onPlatformChange} // Pass the handler
              onLanguageChange={onChangeLanguage}
              onOrientationChange={onSocialOrientationChange}
              onHideDisplayNameChange={onHideDisplayNameChange}
            />
          </>
        )}

        {/* Actions */}
        <div className="actions">
          <button className="btn btn-primary click-btn" onClick={onDownloadHD} style={{ backgroundColor: activeColor === '#ffffff' ? '#000' : activeColor }}>
            <DownloadIcon />
            <span>Download HD</span>
          </button>
          <button className="btn btn-secondary click-btn" onClick={onPrint}>
            <PrintIcon />
            <span>Print Card</span>
          </button>
        </div>

        <div className="footer" style={{ borderTop: `4px solid ${activeColor}` }}>
          <div className="footer-content">
            <div className="footer-bottom">
              <p>© 2026 QR Card. Open Source.</p>
              <p className="footer-credit">By <Link href="https://abinbinoy.vercel.app" target="_blank" rel="noopener noreferrer">Abin Binoy</Link></p>
            </div>
          </div>
        </div>
      </main>


    </Pane>
  );
}

export default App;
