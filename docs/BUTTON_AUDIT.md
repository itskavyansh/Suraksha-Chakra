# Suraksha Chakra — Interactive Button & Link Audit

This document records the verification of every interactive element across every route in the Suraksha Chakra Progressive Web App.
**Zero Dead Buttons Policy**: Every button, link, tab, and card navigates, triggers a state change, or performs a real in-app action with visible feedback (Toast, Modal, Sheet, or UI update).

| Route | Element / Component | Expected Result | Verified | How Verified |
|---|---|---|---|---|
| `/` | Language Toggle | Toggles language between English (en) and Hindi (hi); persists in `sc_lang` | YES | Tested click, updates UI text immediately, persists in `localStorage` |
| `/` | "Try as demo worker (Ramesh)" | Logs in as demo worker Ramesh, sets session, shows Toast, navigates to `/home` | YES | Tested click, session set in `localStorage`, redirected to `/home` with greeting |
| `/` | "Log in" | Navigates to `/login` | YES | Tested click, router navigates to `/login` |
| `/` | "Create account" | Navigates to `/signup` | YES | Tested click, router navigates to `/signup` |
| `/` | "View admin demo" | Navigates to `/admin` demo dashboard | YES | Tested click, router navigates to `/admin` without authentication required |
| `/login` | Back button | Navigates back to landing page `/` | YES | Tested click, navigates to `/` |
| `/login` | Language Toggle | Toggles language en/hi | YES | Tested click, updates form labels |
| `/login` | PIN Visibility Toggle | Toggles 4-digit PIN between password and text input | YES | Tested click, toggles input `type="password"` and `type="text"` |
| `/login` | "Log in" button | Validates 10-digit phone & PIN; shows error on invalid, sets session and navigates `/home` on success | YES | Tested with demo credentials (9800000001 / 1234) and registered accounts |
| `/login` | "Forgot PIN?" link | Navigates to `/forgot-pin` | YES | Tested click, navigates to `/forgot-pin` |
| `/login` | "Don't have an account? Sign up" | Navigates to `/signup` | YES | Tested click, navigates to `/signup` |
| `/login` | "Try demo worker instead" | Instant one-tap demo worker login, navigates `/home` | YES | Tested click, signs in Ramesh and navigates to `/home` |
| `/signup` | Back button | Navigates back to `/` | YES | Tested click, navigates to `/` |
| `/signup` | PIN & Confirm PIN toggles | Toggles visibility of PIN inputs | YES | Tested click, toggles text visibility |
| `/signup` | City dropdown | Selects worker city (Delhi, Gurugram, Noida, Ghaziabad, Faridabad, Other) | YES | Tested selection change, updates worker ID prefix code |
| `/signup` | Skills multi-select chips | Selects / deselects skills (Segregation, Door-to-door, Sorting yard, Recycling shop, Other) | YES | Tested click, toggles chip selection styling and array state |
| `/signup` | Preferred language toggle | Selects 'en' or 'hi' | YES | Tested click, toggles selected language |
| `/signup` | Consent checkbox | Required prototype disclaimer agreement | YES | Tested validation prevents submission until checked |
| `/signup` | "Create Account" button | Validates all fields, hashes PIN with SHA-256, stores in `sc_accounts`, logs in, navigates `/home` | YES | Tested submission, generated `SC-DEL-XXXXXX`, redirected to `/home` with Toast |
| `/signup` | "Already have an account? Log in" | Navigates to `/login` | YES | Tested click, navigates to `/login` |
| `/forgot-pin` | Back button | Navigates to `/login` | YES | Tested click, navigates to `/login` |
| `/forgot-pin` | "Verify Mobile" button | Checks if phone exists in `sc_accounts` or demo worker; reveals new PIN fields | YES | Tested phone check with valid and invalid numbers |
| `/forgot-pin` | "Reset PIN" button | Validates and hashes new PIN, updates `sc_accounts`, shows Toast, navigates to `/login` | YES | Tested PIN reset flow and successful subsequent login |
| `/home` | Language Toggle | Toggles language en/hi across app | YES | Tested click, all tiles and topbar translate immediately |
| `/home` | Earnings Banner | Navigates to `/earnings` | YES | Tested click, navigates to `/earnings` |
| `/home` | Tile: Scan Waste | Navigates to `/scan` | YES | Tested click, navigates to `/scan` |
| `/home` | Tile: I Got Hurt | Navigates to `/hurt` | YES | Tested click, navigates to `/hurt` |
| `/home` | Tile: Nearby Jobs | Navigates to `/jobs` | YES | Tested click, navigates to `/jobs` |
| `/home` | Tile: Fair Price Check | Navigates to `/price-check` | YES | Tested click, navigates to `/price-check` |
| `/home` | Tile: My Passport | Navigates to `/profile` | YES | Tested click, navigates to `/profile` |
| `/home` | Tile: Safety Training | Navigates to `/training` | YES | Tested click, navigates to `/training` |
| `/home` | Tile: Recycler Connect | Navigates to `/recyclers` | YES | Tested click, navigates to `/recyclers` |
| `/home` | Tile: Hazard Guide | Navigates to `/guide` | YES | Tested click, navigates to `/guide` |
| Layout | BottomNav: Home | Navigates to `/home` | YES | Tested click, active icon highlight |
| Layout | BottomNav: Scan | Navigates to `/scan` | YES | Tested click, active icon highlight |
| Layout | BottomNav: Jobs | Navigates to `/jobs` | YES | Tested click, active icon highlight |
| Layout | BottomNav: Earnings | Navigates to `/earnings` | YES | Tested click, active icon highlight |
| Layout | BottomNav: Profile | Navigates to `/profile` | YES | Tested click, active icon highlight |
| `/scan` | "Start camera" / "Stop camera" | Starts/stops `navigator.mediaDevices.getUserMedia` video stream | YES | Tested with video element and graceful fallback on camera permission error |
| `/scan` | "Capture photo" | Takes frame snapshot from video, scales to 640px, analyzes | YES | Tested canvas capture and transition to analyzing state |
| `/scan` | "Upload from gallery" | File input picker, downscales selected image to canvas | YES | Tested file upload with validation (<10MB, image mime) |
| `/scan` | Sample Item Chips (8 chips) | Needles, Broken glass, Battery, Chemical can, Medical, Bottle, Cardboard, Unknown | YES | Tested all 8 sample chips; instantly classifies and loads guidance |
| `/scan` | "Listen" / "Stop" button | Speaks guidance text aloud via Web Speech API (`useSpeech`) | YES | Tested speech playback and cancellation |
| `/scan` | "Scan another" button | Resets state back to capture | YES | Tested click, resets canvas and result state |
| `/scan` | "Report hazard" button | Opens confirmation Sheet with GPS checkbox | YES | Tested click, opens sheet with hazard details |
| `/scan` | "Submit report" button | Submits hazard report to API (+5 safety score), adds to admin sync | YES | Tested submission, awards safety score, appends to `sc_hazard_reports` |
| `/scan` | "View training" button | Navigates to relevant module in `/training` | YES | Tested click, navigates to `/training` |
| `/scan` | "Read full guide" button | Navigates to `/guide/:category` | YES | Tested click, opens dedicated guide page |
| `/scan` | "I got hurt" button | Navigates to `/hurt` | YES | Tested click, opens emergency first-aid flow |
| `/hurt` | Incident Type Cards (4 cards) | Needle prick, Cut from glass/metal, Chemical on skin/eyes, Other | YES | Tested click, navigates to `/hurt/:type` with specific steps |
| `/hurt` | "Record workplace injury" button | Navigates to `/hurt/log` | YES | Tested click, navigates to injury incident logger |
| `/hurt/:type` | Step Next / Previous buttons | Advances / reverses first-aid step carousel | YES | Tested click, step counter updates and content changes |
| `/hurt/:type` | "Listen" button | Speaks current first-aid step aloud | YES | Tested speech synthesis |
| `/hurt/:type` | "Call 112" button | Initiates `tel:112` call | YES | Tested `tel:` URI trigger |
| `/hurt/:type` | "Call 102" button | Initiates `tel:102` ambulance call | YES | Tested `tel:` URI trigger |
| `/hurt/:type` | Clinic Call buttons | Initiates `tel:` call to planned clinic | YES | Tested `tel:` URI trigger |
| `/hurt/:type` | Clinic Directions buttons | Opens Google Maps search for clinic location | YES | Tested `window.open` external link |
| `/hurt/:type` | "Log this incident" button | Navigates to `/hurt/log?type=...` | YES | Tested click, navigates with prefilled type query |
| `/hurt/log` | "Save Record" button | Validates fields, saves to `api.saveIncident`, shows Toast, refreshes list | YES | Tested submission, adds record to session storage |
| `/hurt/log` | Delete incident button | Opens confirmation dialog and deletes incident from session | YES | Tested click, confirm dialog, record removed |
| `/priceCheck` | Material dropdown | Selects scrap material type | YES | Tested selection change |
| `/priceCheck` | "Check price" button | Evaluates offer against indicative rates; displays verdict and expected range | YES | Tested with low, fair, and high offers; unit tests verify accuracy |
| `/priceCheck` | "Clear" button | Clears weight and offer inputs | YES | Tested click, resets form state |
| `/priceCheck` | "See recyclers who accept this" | Navigates to `/recyclers?material=...` | YES | Tested click, passes selected material as query param |
| `/guide` | Category Cards (5 cards) | Sharps, Glass, Batteries, Chemicals, Medical | YES | Tested click, navigates to `/guide/:category` |
| `/guide/:category` | "Listen" button | Speaks DO and DON'T handling procedures | YES | Tested speech playback |
| `/guide/:category` | "Scan an item" button | Navigates to `/scan` | YES | Tested click, navigates to `/scan` |
| `/guide/:category` | "I got hurt" button | Navigates to `/hurt` | YES | Tested click, navigates to `/hurt` |
| `/training` | Module Cards (5 cards) | Navigates to `/training/:id` | YES | Tested click on all 5 modules |
| `/training` | "Start module" / "Review module" | Navigates to `/training/:id` | YES | Tested click, opens module detail |
| `/training/:id` | Step Next / Back buttons | Walks through 4 training steps | YES | Tested click, step indicators and content update |
| `/training/:id` | "Listen" button | Reads current step aloud | YES | Tested speech synthesis |
| `/training/:id` | "Take Quiz" button / tab | Switches to 3-question knowledge quiz | YES | Tested click, renders quiz questions |
| `/training/:id` | Quiz option buttons | Selects answer, highlights correct/incorrect, shows explanation | YES | Tested click, validates answer and locks question |
| `/training/:id` | "Retry Quiz" button | Resets quiz state to try again | YES | Tested click, resets quiz |
| `/training/:id` | "Back to Training" button | Navigates back to `/training` | YES | Tested click, navigates to `/training` |
| `/jobs` | Filter Chips (All, <2km, High value) | Filters job cards list | YES | Tested click, filtered list updates instantly |
| `/jobs` | "Accept job" button | Calls `api.acceptJob`, changes status to accepted, shows Toast | YES | Tested click, status badge updates to "Accepted" |
| `/jobs` | "Mark done" button | Calls `api.markJobDone`, status changes to completed, creates earnings transaction, +2 score | YES | Tested click, transaction created, safety score updated |
| `/earnings` | 4-week bar chart | Renders responsive Recharts bar chart of weekly earnings | YES | Tested render, tooltip on hover |
| `/earnings` | "Price Check" link | Navigates to `/price-check` | YES | Tested click, navigates to `/price-check` |
| `/earnings` | "Find nearby jobs" (empty state) | Navigates to `/jobs` | YES | Tested click, navigates to `/jobs` |
| `/recyclers` | Material filter chips | Filters recyclers by accepted material, updates `?material=` in URL | YES | Tested click, updates URL search params and filtered list |
| `/recyclers` | "Call" button | Initiates `tel:` call to recycler phone | YES | Tested `tel:` URI trigger |
| `/recyclers` | "Directions" button | Opens Google Maps search for recycler location | YES | Tested `window.open` external link |
| `/profile` | Enlarge QR Code | Opens full-screen QR modal with high-res QR | YES | Tested tap on QR code, opens modal |
| `/profile` | "Download QR" button | Converts QR SVG to PNG via HTML5 Canvas and downloads image file | YES | Tested click, triggers `.png` download with try/catch |
| `/profile` | "Share my passport" button | Calls `navigator.share` with fallback to clipboard link copy | YES | Tested click, clipboard copy and Toast feedback |
| `/profile` | "View public verification passport" | Navigates to public `/verify/:workerId?d=...` | YES | Tested click, opens public passport view |
| `/profile` | "Edit profile" button | Opens slide-up Sheet to edit Name, City, Language | YES | Tested form submission, updates state and session |
| `/profile` | "Reset demo data" button | Opens confirm modal, calls `api.resetDemoData`, reloads app | YES | Tested click, resets sessionStorage to factory defaults |
| `/profile` | "Delete my account" button | Opens confirm modal, deletes from `sc_accounts`, logs out to `/` | YES | Tested click, account removed from `localStorage` |
| `/profile` | "Log out" button | Opens confirm modal, clears session, navigates to `/` | YES | Tested click, session cleared, redirected to `/` |
| `/admin` | Navigation Tabs (7 tabs) | Dashboard, Reports, Workers, Jobs, Recyclers, Training, Analytics | YES | Tested desktop sidebar and mobile horizontal scroll bar |
| `/admin` | "Back to home" button | Navigates to `/home` | YES | Tested click, returns to worker app |
| `/admin` | Ward Map Leaflet Markers | Clicking circle marker opens popup with hazard details & worker ID | YES | Tested popup click on markers |
| `/admin` | Donut Chart Hover | Shows tooltip breakdown of hazard counts | YES | Tested hover on pie slices |
| `/admin?tab=reports` | Category Filter Chips | Filters reports table by category | YES | Tested all category chips |
| `/admin?tab=reports` | Search input | Searches reports by label or worker ID | YES | Tested input filtering |
| `/admin?tab=reports` | Sort toggle | Toggles between newest and oldest reports | YES | Tested sort order switch |
| `/admin?tab=reports` | Pagination Next/Prev | Paginates through 10 reports per page | YES | Tested page navigation |
| `/admin?tab=reports` | "View on map" button | Opens modal with focused Leaflet map on report coordinates | YES | Tested click, opens modal with zoomed marker |
| `/admin?tab=reports` | "Export CSV" button | Generates CSV blob and downloads file | YES | Tested click, triggers CSV download |
| `/admin?tab=workers` | Search input | Filters workers by name, ID or city | YES | Tested search filtering |
| `/admin?tab=workers` | Worker row click | Opens detail modal showing verification, skills and scores | YES | Tested click, opens worker detail modal |
| `/verify/:id` | "Print / Save as PDF" button | Triggers `window.print()` with print-optimized CSS | YES | Tested click, opens print dialog |
| `/verify/:id` | "Share link" button | Copies public passport verification URL to clipboard | YES | Tested click, copies URL and shows Toast |
| `/verify/:id` | "Open Suraksha Chakra" | Navigates to `/` | YES | Tested click, navigates to `/` |
