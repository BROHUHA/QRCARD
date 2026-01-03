import { Button, Heading, Link, Pane, Paragraph } from 'evergreen-ui';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import logo from '../src/images/wifi.png';
import { Settings } from './components/Settings';
import { WifiCard } from './components/WifiCard';
import { downloadHDCard } from './nodeToImageDownloader';
import './style.css';
import { Translations } from './translations';

const WIFI_CARD_ID = 'wifi-card';

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

function App() {
  const html = document.querySelector('html');
  const { t, i18n } = useTranslation();
  const firstLoad = useRef(true);
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
  const [errors, setErrors] = useState({
    ssidError: '',
    passwordError: '',
    eapIdentityError: '',
  });
  const [activePanel, setActivePanel] = useState(null);

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
    return true;
  };

  const onPrint = () => {
    if (!validateForm()) return;
    document.title = 'WiFi Card - ' + settings.ssid;
    window.print();
  };

  const onDownloadHD = () => {
    if (!validateForm()) return;
    downloadHDCard(WIFI_CARD_ID, `wifi-${settings.ssid || 'card'}`);
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

  useEffect(() => {
    if (htmlDirection() === 'rtl') {
      html.style.direction = 'rtl';
    }
  });

  return (
    <Pane className="app">
      {/* Header */}
      <header className="header">
        <div className="header-container">
          <div className="logo">
            <div className="logo-icon">
              <img alt="WiFi" src={logo} />
            </div>
            <span className="logo-text">WiFi Card</span>
          </div>
          <nav className="nav">
            <button
              className={`nav-item ${activePanel === 'guide' ? 'active' : ''}`}
              onClick={() => setActivePanel(activePanel === 'guide' ? null : 'guide')}
            >
              <BookIcon /> Guide
            </button>
            <button
              className={`nav-item ${activePanel === 'about' ? 'active' : ''}`}
              onClick={() => setActivePanel(activePanel === 'about' ? null : 'about')}
            >
              <InfoIcon /> About
            </button>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="content">
        {/* Panels */}
        {activePanel === 'guide' && (
          <div className="panel">
            <div className="panel-header">
              <h3>How to Use</h3>
              <button className="panel-close" onClick={() => setActivePanel(null)}>
                <CloseIcon />
              </button>
            </div>
            <ol className="panel-list">
              <li>Enter your WiFi network name (SSID)</li>
              <li>Enter your WiFi password</li>
              <li>Customize settings if needed</li>
              <li>Click "Download HD" or "Print"</li>
              <li>Share with guests - they scan to connect!</li>
            </ol>
          </div>
        )}

        {activePanel === 'about' && (
          <div className="panel">
            <div className="panel-header">
              <h3>About WiFi Card</h3>
              <button className="panel-close" onClick={() => setActivePanel(null)}>
                <CloseIcon />
              </button>
            </div>
            <p>Create beautiful, printable WiFi cards with QR codes. Perfect for homes, offices, hotels, and cafes.</p>
            <p><strong>Privacy:</strong> All data stays in your browser. Nothing is uploaded to any server.</p>
            <p><Link href="https://github.com/BROHUHA/wifiQR">View Source on GitHub →</Link></p>
          </div>
        )}

        {/* Hero */}
        <section className="hero">
          <span className="badge">Free & Open Source</span>
          <h1>{t('title')}</h1>
          <p>Generate printable WiFi QR codes for easy guest access</p>
        </section>

        {/* Card */}
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

        {/* Settings */}
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

        {/* Actions */}
        <div className="actions">
          <button className="btn btn-primary" onClick={onDownloadHD}>
            <DownloadIcon />
            <span>Download HD</span>
          </button>
          <button className="btn btn-secondary" onClick={onPrint}>
            <PrintIcon />
            <span>Print Card</span>
          </button>
        </div>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-content">
            <div className="footer-top">
              <div className="footer-brand">
                <img alt="WiFi" src={logo} className="footer-logo" />
                <div className="footer-brand-info">
                  <span className="footer-title">WiFi Card</span>
                  <span className="footer-version">v1.0.0</span>
                </div>
              </div>
              <div className="footer-links">
                <Link href="https://github.com/BROHUHA" className="footer-link">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  GitHub
                </Link>
                <Link href="https://abinbinoyme.vercel.app" className="footer-link">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  Portfolio
                </Link>
              </div>
            </div>
            <div className="footer-divider"></div>
            <div className="footer-bottom">
              <p>© 2026 WiFi Card. Open source under MIT License.</p>
              <p className="footer-credit">Crafted with ❤️ by <Link href="https://abinbinoyme.vercel.app">Abin Binoy</Link></p>
            </div>
          </div>
        </footer>
      </main>
    </Pane>
  );
}

export default App;
