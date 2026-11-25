# Suraksha Chakra (सुरक्षा चक्र)

> **Safe hands. Fair pay. Trusted work.**
> *सुरक्षित हाथ। सही दाम। भरोसेमंद काम।*

A mobile-first Progressive Web App (PWA) designed for informal waste workers in India (ragpickers, kabadiwalas, and doorstep collection staff). Suraksha Chakra repositions occupational safety by integrating **Safety Net + Trusted Digital Identity + Fair Income**, with on-device AI hazard scanning as one vital tool in a complete support ecosystem.

---

## 🌟 Core Pillars

1. **Safety Net**
   - **Hazard Detection AI**: On-device CLIP vision model (`Xenova/clip-vit-base-patch32`) in a dedicated Web Worker to identify needles, biohazards, broken glass, batteries, and corrosive chemicals before handling.
   - **"I Got Hurt" Emergency Flow**: Immediate, voice-guided first-aid steps, one-tap emergency calls (112 / 102), and a private injury incident logger.
   - **Hazard Guide**: Offline DO/DON'T guidance for high-risk scrap categories.

2. **Trusted Identity**
   - **Verified Worker Passport**: Digital identity card with real-time Safety Score (0–100) calculated from verified jobs, passed training quizzes, and reported hazards.
   - **Cross-Device Verification QR**: Encodes a compact URL snapshot (`/verify/:id?d=...`) so any homeowner, RWA guard, or recycler can verify worker safety credentials on any device without backend dependencies.
   - **Printable & Shareable**: Print/PDF stylesheet and Native Web Share with clipboard fallback.

3. **Fair Income**
   - **Fair Price Check**: Pure mathematical offer evaluator comparing buyer offers against daily indicative scrap market rates.
   - **Nearby Jobs**: Curated collection requests from RWAs and bulk generators with distance filtering and automated earnings credit.
   - **Recycler Connect**: Direct directory of verified recycling centers with transparent rates, one-tap calling, and Google Maps navigation.
   - **Earnings Tracker**: 4-week visual bar charts (Recharts) and transaction history.

4. **Municipal Intelligence (Admin Dashboard)**
   - **Ward-Level Leaflet Map**: Geo-tagged hazard incident heat markers across Delhi NCR wards.
   - **Hazard Breakdown**: Interactive donut charts by category.
   - **Real-Time Browser Sync**: Reports submitted in worker sessions appear immediately in the admin dashboard.
   - **CSV Export**: One-click download of all flagged hazard reports.

---

## 🛠️ Locked Tech Stack

- **Framework**: React 18 (`18.3.1`, pinned — not React 19)
- **Tooling**: Vite (`5.4.14`), TypeScript (`5.7.3`, strict)
- **Styling**: Tailwind CSS v3 (`3.4.17`) with bespoke earthy brand design tokens
- **Routing**: React Router v6 (`6.28.2`, `createBrowserRouter`)
- **State Management**: Zustand (`4.5.6`)
- **Localization**: i18next + react-i18next (`en` and colloquial spoken `hi`)
- **Icons**: Lucide React (`0.475.0`)
- **PWA & Offline**: `vite-plugin-pwa` (`0.21.1`) with service worker caching
- **Data Visualization**: Recharts (`2.15.1`)
- **Maps**: Leaflet (`1.9.4`), React-Leaflet (`4.2.1`), `@types/leaflet` (lazy-loaded in admin chunk)
- **QR Codes**: `qrcode.react` (`4.2.0`, `QRCodeSVG`)
- **Machine Learning**: `@huggingface/transformers` (`3.3.3`, WebAssembly + Web Worker)
- **Testing**: Vitest (`2.1.8`)

---

## 📂 Repository Structure

```
suraksha-chakra/
├── backend/                  # Reserved for future cloud backend
│   └── .gitkeep
├── docs/
│   └── BUTTON_AUDIT.md       # Complete verification log of all interactive elements
├── frontend/
│   ├── public/
│   │   ├── icons/            # PWA icons (192x192, 512x512)
│   │   └── samples/          # Sample test images and dataset credits
│   └── src/
│       ├── app/              # Router, routes constants, worker & admin layouts, guards
│       ├── components/ui/    # Accessible design system (Button, Card, Badge, Modal, Sheet...)
│       ├── config/           # Brand constants (single source of truth for name & tagline)
│       ├── data/             # api.ts (single data access boundary) & seed datasets
│       ├── features/
│       │   ├── admin/        # Lazy-loaded municipal intelligence dashboard & Leaflet map
│       │   ├── auth/         # Prototype signup, login, PIN reset
│       │   ├── earnings/     # Weekly charts & transaction ledger
│       │   ├── eval/         # In-browser zero-shot CLIP benchmark harness
│       │   ├── guide/        # Visual handling procedures for high-risk hazards
│       │   ├── home/         # Worker dashboard & ordered service tiles
│       │   ├── hurt/         # Emergency first-aid, clinics directory & injury log
│       │   ├── jobs/         # Collection request listings with accept & mark done
│       │   ├── landing/      # Public onboarding & 1-tap demo worker entry
│       │   ├── passport/     # Verified Worker Passport
│       │   ├── priceCheck/   # Pure evaluateOffer logic & market rate calculator
│       │   ├── profile/      # Worker profile, full-screen QR & account settings
│       │   ├── recyclers/    # Verified buyer directory with material filtering
│       │   ├── scan/         # Camera capture, speech guidance & Web Worker classifier
│       │   ├── training/     # 5 safety modules & interactive knowledge quizzes
│       │   └── verify/       # Public passport verification page
│       ├── hooks/            # useSpeech (Web Speech API abstraction)
│       ├── i18n/             # English and Hindi localization strings
│       ├── store/            # Session and model readiness Zustand stores
│       └── types/            # TypeScript strict shared domain types
├── netlify.toml              # Netlify build and SPA routing configuration
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js `20.x` or higher
- npm `10.x` or higher

### Local Development
```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies (pinned exact versions)
npm install

# Start Vite development server
npm run dev
```
Open your browser at `http://localhost:5173`.

### Running Unit Tests
```bash
npm test
```
Runs the Vitest test suite covering:
- Route URL patterns & collision checks (`routes.test.ts`)
- Phone, PIN, and account field validators (`validators.test.ts`)
- Scrap buyer offer evaluation logic (`evaluateOffer.test.ts`)
- Safety decision rules & confidence clamping (`decision.test.ts`)

### Building for Production
```bash
npm run build
```
Generates a production build in `frontend/dist/` with code-split vendor chunks, lazy-loaded Leaflet map assets, and PWA service worker manifests.

---

## 🔒 Prototype Status & Honest Disclosures

Suraksha Chakra is built as a production-grade hackathon prototype designed for realistic judge evaluation on mobile phones and laptops:

1. **Data Layer Boundary**:
   - There is no live remote cloud database yet. All components communicate **exclusively** through `src/data/api.ts`.
   - Switching to a live backend requires modifying only `src/data/api.ts`.
2. **Storage Boundary**:
   - `localStorage` is restricted to: `sc_lang` (language choice), `sc_accounts` (local prototype accounts), and `sc_session` (current session).
   - All other working data (training progress, jobs, transactions, incidents, hazard reports) lives in `sessionStorage` under `sc_*` keys.
3. **No Dead Buttons**:
   - Every button, tab, tile, and link across all 21 routes executes a real action, navigates to a real route, or produces visible feedback (Toast, Sheet, Modal).
   - "Coming soon" placeholder toasts are prohibited.
4. **Sample Data Transparency**:
   - Every screen displaying pre-seeded records (e.g. clinics, recyclers, municipal ward statistics) carries a visible `"Sample data"` badge.
5. **On-Device Privacy**:
   - Model inference and camera processing execute completely in-browser inside a Web Worker. No images are uploaded to any external server.

---

## 📄 License
MIT License. Created with pride for India's informal sanitation and waste management workforce.
