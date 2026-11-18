# ALL QR STUDIO

High-performance, client-side optical QR card design studio. Generate precision, production-grade machine-readable cards for Wi-Fi access, instant UPI settlements, vCard contacts, multi-channel social profiles, web portals, and raw text payloads with 4X Ultra-HD export.

---

## Overview

ALL QR STUDIO is a browser-native design environment for producing physical and digital optical tokens. All encoding, styling, rendering, and export operations are executed entirely on the client side using the HTML5 Canvas and SVG APIs. No user data, passwords, payment handles, or contact records are ever transmitted to or stored on external servers.

---

## Features

### Specimen Archetypes
- **Wi-Fi 802.11ax Network**: Instant zero-password network joining for guests and internal teams. Supports WPA/WPA2/WPA3 Personal, WEP, and Open configurations. Includes conditional password masking and complete removal on output cards.
- **UPI Instant Pay**: Direct payment settlement compliant with the NPCI UPI specification. Generates deep links for Google Pay, PhonePe, Paytm, BHIM, and standard mobile banking applications with optional pre-set transaction amounts.
- **Contact vCard 3.0**: One-tap digital business cards. Encodes structured contact records (full name, phone numbers, email addresses, organization, job title, and website) directly into phone address books without external services.
- **Social Matrix**: Multi-channel social profile hubs supporting Instagram, WhatsApp, LinkedIn, GitHub, X (Twitter), and Telegram with platform-specific branding, verified status badges, and direct handle routing.
- **Web Gateway**: High-contrast, clean HTTPS portals tailored for portfolios, restaurant menus, product launch campaigns, and digital bio links.
- **Plain Text Payload**: Raw UTF-8 string encoding for arbitrary passcodes, technical instructions, hardware serial numbers, and cryptographic keys.
- **Direct Email**: Pre-composed mailto links encoding recipient inbox, subject line, and initial draft template for customer inquiries and feedback.

### Styling & Optical Engine
- **Curated Palette**: 12 calibrated pastel gradients engineered to maintain scannability while delivering modern aesthetics.
- **Custom Image Backgrounds**: Upload local images as card backdrops with fine-grained control over Gaussian blur intensity and contrast scrim overlays.
- **Optical Glass Backdrops**: 5 distinct QR contrast backplates:
  - Solid White: Maximum scannability with opaque contrast.
  - Lucid Glass: Ultra-clear liquid glass finish with specular gloss rims.
  - Frosted Glass: Translucent diffusion with background blur.
  - Gaussian Glass: Soft Gaussian blur scrim with ambient depth.
  - Inverted Glass: Smoked dark glass substrate with inverted white optical modules.
- **Tactile QR Materials**: 6 visual dot styles (Classic Precision, Roasted Coffee, Living Moss, Azulejo Ceramic, Citrus Marmalade, and Fluffy Chick Mascot).
- **Responsive Aspect Ratios**: Preset framing controls for 1:1 (Square), 4:5 (Portrait Feed), 16:9 (Landscape Display), 9:16 (Story / Reel), and Auto-Fit layouts.

### Export & Printing
- **4X Ultra-HD Raster Export**: Multiplies device pixel ratio to generate print-grade, ultra-sharp PNG images suitable for professional printing and large displays.
- **Scalable Vector Export**: Generates mathematical vector SVG outputs for infinite scaling without resolution loss.
- **Isolated Print Engine**: Dedicated print stylesheet isolating the target card specimen in the center of the sheet, hiding all UI panels and dark backgrounds to conserve ink.

### User Experience
- **Cinematic Pixel Reveal**: Staggered 2D optical dissolution transitions for viewports and section headers.
- **Decoding Preloader**: High-tech matrix preloader with progressive monospace counter.
- **Internationalization**: Multi-language support with automatic Right-to-Left (RTL) text direction handling.

---

## Technology Stack

| Layer | Tooling | Purpose |
|---|---|---|
| Runtime / Build | Vite 8 + Node.js | Modern, rapid ESM development and bundling |
| Core Framework | React 17 | Component-driven UI architecture |
| Styling | Tailwind CSS 3 | Utility-first responsive design system |
| Iconography | Lucide React | Clean, consistent vector interface icons |
| QR Code Generation | qrcode.react | ISO/IEC 18004 compliant matrix computation |
| Export Engine | html-to-image + downloadjs | Multi-scale client-side canvas rendering |
| Internationalization | i18next + react-i18next | Multi-language catalog and layout switching |

---

## Project Structure

```
QRCARD/
├── public/
│   ├── fonts/               # Custom typeface files (Grindy Brush)
│   ├── cover.png            # 1200x630 social sharing preview card
│   ├── favicon.svg          # High-definition vector browser favicon
│   ├── index.html           # Main HTML shell with OpenGraph metadata
│   └── manifest.json        # Web application manifest
│
├── src/
│   ├── components/
│   │   ├── blocks/
│   │   │   ├── BuildAlbumSlider.jsx   # 3-card frosted glass album carousel
│   │   │   ├── HeroSection.jsx        # Landing hero with typography and bento grid
│   │   │   └── PrivacySection.jsx     # Zero-telemetry privacy policy specification
│   │   ├── layout/
│   │   │   ├── AppFooter.jsx          # Studio footer with repository links
│   │   │   └── AppHeader.jsx          # Header with fullscreen overlay menu
│   │   ├── ui/
│   │   │   ├── CardThemeSelector.jsx  # Pastel gradients, image BG, and glass picker
│   │   │   ├── cardStyleEngine.jsx    # Unified card style and QR backdrop engine
│   │   │   ├── ChromeStar.jsx         # 3D chrome visual star element
│   │   │   ├── DownloadModal.jsx      # Aspect ratio selector and HD export modal
│   │   │   ├── MaterialIcons.jsx      # Material icon definitions
│   │   │   ├── PixelReveal.jsx        # Staggered optical pixel dissolve animation
│   │   │   ├── Preloader.jsx          # Optical matrix loading sequence
│   │   │   ├── SafeQRCode.jsx         # Standard high-contrast QR component
│   │   │   ├── SocialIcons.jsx        # Vector brand icons for social networks
│   │   │   ├── TactileQRCode.jsx      # Custom stylized optical QR module renderer
│   │   │   ├── designerTemplates.js   # Color schemes, gradients, and backdrop definitions
│   │   │   ├── socialConfig.js        # Social network configurations and patterns
│   │   │   └── tactileStyles.js       # Dot pattern styles and palette presets
│   │   ├── EmailCard.jsx              # Card specimen for email drafting
│   │   ├── EmailSettings.jsx          # Form controls for email parameters
│   │   ├── Settings.jsx               # Form controls for Wi-Fi credentials
│   │   ├── SocialCard.jsx             # Card specimen for social media profiles
│   │   ├── SocialSettings.jsx         # Form controls for social network handles
│   │   ├── TextCard.jsx               # Card specimen for raw plain text
│   │   ├── TextSettings.jsx           # Form controls for plain text encoding
│   │   ├── UpiCard.jsx                # Card specimen for UPI payments
│   │   ├── UpiSettings.jsx            # Form controls for UPI payment parameters
│   │   ├── UrlCard.jsx                # Card specimen for direct web URLs
│   │   ├── UrlSettings.jsx            # Form controls for URL destinations
│   │   ├── VCard.jsx                  # Card specimen for vCard 3.0 contacts
│   │   ├── VCardSettings.jsx          # Form controls for contact information
│   │   └── WifiCard.jsx               # Card specimen for Wi-Fi access credentials
│   ├── App.jsx                        # Root application orchestrator and router
│   ├── i18n.js                        # Internationalization configuration
│   ├── index.jsx                      # Application entry point
│   ├── nodeToImageDownloader.js       # 4X canvas rendering and export pipeline
│   ├── style.css                      # Global styles, glassmorphism, and print rules
│   └── translations.js                # Language translation catalogs
│
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js version 18.0.0 or higher
- npm version 8.0.0 or higher

### Installation
Clone the repository and install dependencies:

```bash
git clone https://github.com/BROHUHA/QRCARD.git
cd QRCARD
npm install
```

### Development
Start the local development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

The application will be accessible at `http://localhost:3000/`.

### Production Build
Compile and bundle the application for production:

```bash
npm run build
```

The output artifacts will be written to the `dist/` directory, ready for deployment to any static web hosting provider (Vercel, Netlify, Cloudflare Pages, GitHub Pages).

### Preview Build
Locally preview the production build:

```bash
npm run preview
```

---

## Privacy & Security

ALL QR STUDIO adheres to a strict zero-telemetry architecture:
- No tracking pixels, Google Analytics, or third-party monitoring scripts.
- No remote API endpoints are invoked during QR encoding or image generation.
- Network credentials, payment addresses, and contact payloads never leave your local browser session.
- Safe for generating sensitive access cards, offline credentials, and internal enterprise passes.

---

## License

This project is open-source software licensed under the MIT License.

## Author

Created and engineered by **Abin Binoy** (4bin / BROHUHA).
- Portfolio: [4bin.vercel.app](https://4bin.vercel.app)
- GitHub: [github.com/BROHUHA](https://github.com/BROHUHA)
- LinkedIn: [linkedin.com/in/abinn-binoyy](https://www.linkedin.com/in/abinn-binoyy/)
