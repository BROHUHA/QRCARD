![ci](https://github.com/bndw/wifi-card/workflows/ci/badge.svg)

# <img width="32px" src="./public/images/wifi.png"> WiFi Card

>  **Generate beautiful, printable WiFi QR code cards** - Share your network credentials securely with guests!

<p align="center">
  <a href="https://wificard.io/">
    <img alt="wificard" src="public/demo.gif" width="600">
  </a>
</p>

<p align="center">
  <a href="https://thiswebsitedoesnottrackyou.com/">
    <img width="300" alt="This website does not track you" src="https://user-images.githubusercontent.com/4248167/184430158-849d4b2c-de43-483f-86fe-0743b23bc40c.png">
  </a>
</p>

---

##  Features

-  **QR Code Generation** - Instant WiFi connection by scanning
-  **Modern UI** - Beautiful glassmorphism design with animations
-  **Multi-language** - Support for 30+ languages
-  **Print Ready** - Optimized for printing
-  **Download as Image** - Save as PNG for digital sharing
-  **Privacy First** - All processing happens in your browser
-  **Flexible Layout** - Portrait and landscape orientations
-  **Multiple Encryption** - WPA/WPA2/WPA3, WEP, WPA2-EAP support

---

##  Technology Stack

This project is built with modern web technologies:

| Technology | Purpose | Documentation |
|------------|---------|---------------|
| **React 17** | UI Framework | [reactjs.org](https://reactjs.org/) |
| **Evergreen UI** | Component Library | [evergreen.segment.com](https://evergreen.segment.com/) |
| **i18next** | Internationalization | [i18next.com](https://www.i18next.com/) |
| **qrcode.react** | QR Code Generation | [npm](https://www.npmjs.com/package/qrcode.react) |
| **html-to-image** | Image Export | [npm](https://www.npmjs.com/package/html-to-image) |
| **downloadjs** | File Downloads | [npm](https://www.npmjs.com/package/downloadjs) |

---

##  Project Architecture

```
wifi-card/
├── public/                    # Static assets
│   ├── images/               # Icon and logo files
│   ├── index.html            # HTML template with meta tags
│   └── manifest.json         # PWA manifest
│
├── src/
│   ├── components/           # React components
│   │   ├── WifiCard.js      # Main card with QR code
│   │   ├── Settings.js      # Configuration options
│   │   ├── style.css        # Component-specific styles
│   │   └── SourceSerif4-Semibold.otf  # Custom font
│   │
│   ├── images/              # Image assets
│   ├── App.js               # Root component
│   ├── i18n.js              # i18next configuration
│   ├── translations.js      # Language translations
│   ├── nodeToImageDownloader.js  # Image export utility
│   ├── style.css            # Global styles
│   └── index.js             # App entry point
│
├── package.json             # Dependencies and scripts
└── README.md               # This file
```

### Component Breakdown

#### `App.js` - Main Application
The root component that:
- Manages application state (SSID, password, settings)
- Handles form validation
- Controls print and download functionality
- Manages language direction (LTR/RTL)

#### `WifiCard.js` - WiFi Card Component
Renders the printable card containing:
- QR code generated from WiFi credentials
- Editable SSID and password fields
- Visual instructions for users

#### `Settings.js` - Configuration Panel
Provides controls for:
- Language selection
- Card orientation (portrait/landscape)
- Password visibility toggle
- Hidden SSID option
- Encryption mode selection

---

##  How It Works

### QR Code Format

WiFi QR codes follow the standard format:

```
WIFI:T:<encryption>;S:<ssid>;P:<password>;H:<hidden>;;
```

| Parameter | Description | Example |
|-----------|-------------|---------|
| `T` | Encryption type | `WPA`, `WEP`, or empty |
| `S` | Network SSID | `MyNetwork` |
| `P` | Password | `mypassword123` |
| `H` | Hidden network | `true` or `false` |

For **WPA2-EAP** networks, additional parameters:
```
WIFI:T:WPA2-EAP;S:<ssid>;P:<password>;H:<hidden>;E:<eapMethod>;I:<identity>;;
```

### Encryption Modes

| Mode | Description |
|------|-------------|
| **WPA/WPA2/WPA3** | Modern, secure encryption (recommended) |
| **WPA2-EAP** | Enterprise authentication with identity |
| **WEP** | Legacy encryption (not recommended) |
| **None** | Open network without password |

### State Management

The app uses React's `useState` hook to manage:
- `settings` - All WiFi configuration options
- `errors` - Form validation error messages

```javascript
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
```

### Internationalization (i18n)

The app supports 30+ languages using `react-i18next`:

1. **Language Detection** - Auto-detects browser language
2. **RTL Support** - Right-to-left languages (Arabic, Persian, Urdu)
3. **Dynamic Switching** - Change language without reload

---

##  Getting Started

### Prerequisites

- Node.js 16+ (for npm) or Yarn
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/bndw/wifi-card.git
   cd wifi-card
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm start
   # or
   yarn start
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

> **Note for Node.js 17+**: If you encounter OpenSSL errors, use:
> ```bash
> set NODE_OPTIONS=--openssl-legacy-provider && npm start
> ```

### Docker

Run with Docker on http://localhost:8080:

```bash
make run
```

### Production Build

```bash
npm run build
# or
yarn build
```

---

##  Design System

The UI features a modern, professional design:

### Color Palette

| Variable | Value | Usage |
|----------|-------|-------|
| `--primary-gradient` | Purple → Pink | Buttons, accents |
| `--background-gradient` | Dark blue → Purple | Page background |
| `--glass-bg` | `rgba(255,255,255,0.08)` | Glassmorphism panels |
| `--accent-color` | `#667eea` | Links, focus states |

### Typography

- **Headings**: Inter (600-700 weight)
- **Body**: Inter (400-500 weight)
- **WiFi Details**: Source Serif 4 (custom font)

### Effects

- **Glassmorphism** - Frosted glass cards with backdrop blur
- **Animations** - Smooth fade-in and slide-up on load
- **Hover States** - Subtle lift and shadow transitions

---

##  Contributing

We welcome contributions! Here's how to help:

### Adding a New Language

1. Add translation to [`./src/translations.js`](./src/translations.js):

   ```javascript
   {
      id: 'de-DE',              // Locale code
      name: 'German - Deutsch', // Format: 'English - Native'
      rtl: false,               // true for RTL languages
      translation: {
         // Translation keys...
      }
   }
   ```

2. Add entry to the [Supported Languages](#supported-languages) table below.

### Code Contributions

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run Prettier: `npm run format`
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Style

This project uses [Prettier](https://prettier.io/) for formatting. Prettier runs automatically as a pre-commit hook.

---

##  Supported Languages

| Language | Author Credit |
|----------|---------------|
| English | [bndw](https://github.com/bndw) |
| Chinese | [Baoyuantop](https://github.com/Baoyuantop) |
| Spanish | [oscfdezdz](https://github.com/oscfdezdz) |
| Portuguese | [pedrorenan](https://github.com/pedrorenan) |
| Portuguese (Brazil) | [ismaelpereira](https://github.com/ismaelpereira) |
| Japanese | [hatsu38](https://github.com/hatsu38) |
| Russian | [Teraskull](https://github.com/Teraskull) |
| Ukrainian | [Teraskull](https://github.com/Teraskull) |
| Dutch | [wouterbrink](https://github.com/wouterbrink) |
| French | [Divlo](https://github.com/Divlo) |
| Turkish | [Riza Ergun](https://github.com/rizaergun) |
| Hindi | [Pushpender](https://github.com/PushpenderSaini0) |
| Catalan | [aniol](https://github.com/aniol) |
| German | [devofthings](https://github.com/devofthings) |
| Greek | [nautilus7](https://github.com/nautilus7) |
| Indonesian | [nyancodeid](https://github.com/nyancodeid) |
| Persian (Farsi) | [RaminR77](https://github.com/raminr77/) |
| Polish | [olekstomek](https://github.com/olekstomek) |
| Arabic | [Ahmed Tokyo](https://github.com/a-tokyo) |
| Occitan | [ensag-dev](https://github.com/ensag-dev) |
| Italian | [Domenico Pascucci](https://github.com/pasmimmo) |
| Korean | [Seungbin Oh](https://github.com/sboh1214) |
| Norwegian | [tplive](https://github.com/tplive) |
| Hungarian | [munkacsimark](https://github.com/munkacsimark) |
| Serbian | [demanderbag](https://github.com/demanderbag) |
| Urdu | [mHassan11](https://github.com/mHassan11) |
| Swedish | [ddund](https://github.com/ddund) |
| Thai | [l2D](https://github.com/l2D) |
| Traditional Chinese (Taiwan) | [Dxball](https://github.com/dxball) |
| Simplified Cantonese | [ous50](https://github.com/ous50) |
| Punjabi | [phoenixgill34](https://github.com/phoenixgill34/) |
| Danish | [dk90103](https://github.com/dk90103/) |

---

##  License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

---

##  Acknowledgments

- Original project by [ABIN](https://github.com/BROHUHA)
- All language contributors listed above
- [Evergreen UI](https://evergreen.segment.com/) for the component library
- [QRCode.react](https://github.com/zpao/qrcode.react) for QR generation

---

<p align="center">
  Made with ❤️ for the open-source community
</p>
