# QR Studio

A production-grade QR code generator built with React and Vite. Generate beautiful, customizable QR codes with live preview, logo overlays, label/arrow decorations, and one-click export.

![QR Studio](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react) ![Vite](https://img.shields.io/badge/Vite-5-646cff?style=flat-square&logo=vite) ![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev

# 3. Open in browser
# → http://localhost:5173
```

---

## Features

### QR Modes
| Mode | Description |
|------|-------------|
| **URL** | Automatically prepends `https://` if missing |
| **Text** | Plain text, multi-line supported |
| **Contact** | Generates a vCard 3.0 — name, phone, email, org, website, address |

### Style Templates
Eight presets that set the foreground color, background color, and dot style in one click:

| Template | Style | Colors |
|----------|-------|--------|
| Minimal | Square | Black on white |
| Dots | Circular dots | Dark navy on white |
| Rounded | Soft corners | Dark on light grey |
| Gradient | Square + gradient overlay | Purple on white |
| Frame | Rounded finder patterns | Near-black on white |
| Neon | Circular dots | Cyan on near-black |
| Rose | Rounded | Pink on blush |
| Forest | Square | Green on mint |

### Customization
- **Size** — slider from 150px to 600px
- **Foreground color** — native color picker
- **Background color** — native color picker
- **Dot style** — square, dots, rounded, gradient, frame (set via templates or directly via `style` state)

### Label
- Toggle on/off
- Custom text (default: "Scan Me")
- Position — top or bottom
- Font size — 10px to 28px
- Color picker

### Arrow
- Toggle on/off
- Direction — right (→) or down (↓)
- Drawn directly onto the canvas

### Logo Upload
- Drag & drop or click to upload (PNG, JPG, SVG)
- Position — center or top of QR
- Size control — 10% to 40% of QR width
- Automatic white padding around the logo

### Actions
- **Download PNG** — saves the canvas as `qr-studio.png`
- **Copy to Clipboard** — writes the image as `image/png` via the Clipboard API
- **Reset** — restores all settings to defaults

### UX Details
- Live re-render on every state change
- Animated toast notifications (success / error / info)
- Sticky preview panel on desktop
- Responsive layout — stacks vertically on mobile
- Smooth CSS transitions and spring animations throughout

---

## Project Structure

```
qr-generator/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx                          # App entry point
    ├── App.jsx                           # Root component + ToastProvider
    ├── styles/
    │   └── tokens.css                    # Global CSS design tokens + resets
    ├── utils/
    │   └── vcardBuilder.js               # Builds vCard 3.0 strings from contact fields
    ├── features/
    │   └── qrGenerator/
    │       └── qrService.js              # Canvas render pipeline + download/copy helpers
    ├── hooks/
    │   └── useQRGenerator.js             # Central state, actions, and render trigger
    ├── components/
    │   ├── ModeTabs/                     # URL / Text / Contact tab switcher
    │   ├── QRControls/                   # Content inputs, size slider, color pickers
    │   ├── QRPreview/                    # Canvas element, empty state, action buttons
    │   ├── Templates/                    # 8-preset style grid
    │   ├── LabelControls/                # Label toggle/config + Arrow toggle/config
    │   ├── LogoUpload/                   # Drag-and-drop logo uploader with controls
    │   └── Toast/                        # Toast context provider + animated notifications
    └── pages/
        └── Home/                         # Full-page layout (header, panels, footer)
```

---

## Architecture

### Render Pipeline (`qrService.js`)

Every change to state triggers a full canvas redraw in this order:

```
1. Clear canvas + fill background color
2. Generate QR matrix via the `qrcode` library
3. Draw each module with the selected dot style
   - square   → fillRect
   - dots     → arc (circles)
   - rounded  → quadratic-curve rounded rects
   - frame    → rounded finder patterns, square data modules
   - gradient → square pass, then linear gradient composited on top
4. Draw logo image (if uploaded) with white padding
5. Draw label text (if enabled) at top or bottom
6. Draw arrow (if enabled) at right or bottom edge
```

### State Management (`useQRGenerator.js`)

All QR state lives in a single flat object managed by `useState`. The hook exposes:

```js
const {
  state,          // full state object
  canvasRef,      // ref passed to <canvas>
  update,         // patch top-level state fields
  updateContact,  // patch nested contact fields
  getQRData,      // derives the string to encode from current mode + inputs
  handleDownload, // triggers PNG download
  handleCopy,     // writes PNG to clipboard
  handleReset,    // restores DEFAULT_STATE
  handleLogoUpload, // reads file → base64 data URL
  applyTemplate,  // applies a named style preset
} = useQRGenerator(toastFn)
```

A `useEffect` watches all state and calls `renderQRToCanvas` automatically on every change.

### Design Tokens (`styles/tokens.css`)

All colors, spacing, shadows, radii, fonts, and transitions are defined as CSS custom properties on `:root` and used throughout every CSS Module. No hardcoded values appear in component stylesheets.

---

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^18.2.0 | UI framework |
| `react-dom` | ^18.2.0 | DOM rendering |
| `qrcode` | ^1.5.3 | QR matrix generation |
| `vite` | ^5.0.8 | Dev server + bundler |
| `@vitejs/plugin-react` | ^4.2.1 | React fast refresh |

No CSS framework, no icon library, no animation library — everything is hand-crafted with CSS Modules and native Canvas APIs.

---

## Scripts

```bash
npm run dev       # Start development server (http://localhost:5173)
npm run build     # Production build → dist/
npm run preview   # Preview production build locally
```

---

## Browser Support

Requires a modern browser with support for:
- Canvas 2D API
- Clipboard API (`navigator.clipboard.write`) — used for Copy to Clipboard; falls back to a toast error on unsupported browsers
- CSS Custom Properties
- ES Modules

---

## License

MIT License