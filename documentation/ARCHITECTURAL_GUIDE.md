# Vanguard Outpost & Expedition Co. — Architecture & Design Guide

## 1. Project Philosophy & Visual Identity
Vanguard Outpost is a bespoke multi-page showcase for premium hunting gear, precision optics, technical camouflage apparel, and backcountry expedition systems. 

### Rugged Aesthetic Pillars
- **Curated Wilderness Palette:** Deep forest green (`#172a1e`), charcoal gunmetal (`#0d110f`), blaze orange (`#e05d26`), olive drab (`#4d5d3b`), and earthy khaki (`#cbbb9d`).
- **Typography:** Display typography via `Barlow Condensed` and `Oswald`, crisp body text with `Inter`, and technical field telemetry through `JetBrains Mono`.
- **Card Consistency:** All card elements implement physics-based 3D tilt interaction with dynamic specular glare and **strictly center-aligned icons, typography, specifications, and call-to-actions across all viewports** (Mobile, Tablet, 1024px, Desktop).
- **Ambient 3D Visual Accents:** Procedural 3D topographic elevation contour canvas lines with mouse-displacement physics and drifting forest embers/particles.

---

## 2. Page & Section Breakdown (Strict Compliance)

| Page | Sections | Primary Storyline & Angle |
| :--- | :--- | :--- |
| **Home 1 (`pages/index.html`)** | **Exactly 6** | Seasonal Armory, ballistic materials matrix, verified guide dispatches, season regulations preview, outpost newsletter drop. |
| **Home 2 (`pages/home-2.html`)** | **Exactly 6** | High-Alpine Mountain Survival, split telemetry hero with live altitude/barometer meters, 4 backcountry disciplines, Fair Chase ethics, interactive pack weight optimizer. |
| **Products (`pages/products.html`)** | **Exactly 4** | Filterable catalog (Apparel, Optics, Accessories), 12+ items with 3D tilt and quick-look modal, optical glass comparison chamber, wholesale outfitter CTA. |
| **Safety & Regulations (`pages/safety-regulations.html`)** | **Exactly 4** | Hunter emergency hotline, state-by-state blaze orange/legal hours matrix, 4 field safety commandments, accredited hunter certification CTA. |
| **Trade-In Program (`pages/trade-in.html`)** | **Exactly 4** | Buyback overview, 4-step appraisal workflow, interactive real-time valuation calculator (+18% store credit bonus), submission form & FAQ. |
| **Contact Outpost (`pages/contact.html`)** | **Exactly 4** | Headquarters telemetry & hours, client-validated outfitter inquiry form (Formspree/Netlify ready), tactical facility map with coordinates, regional pro-staff directory. |
| **404 Page (`pages/404.html`)** | Standalone | "Off The Trail / Coordinates Unknown" with interactive spinning 3D compass and quick navigation recovery links. |
| **Coming Soon (`pages/coming-soon.html`)** | Standalone | "Next-Gen Thermal Vault Dropping Soon" with functional countdown timer and priority VIP signup. |

---

## 3. Navigation Architecture
- **Desktop Navbar:** Contains strictly 5 items (**Home \| Products \| Safety & Regulations \| Trade-In \| Contact**).
- **No Login / No Dashboard Buttons:** Strictly product showcase, education, trade-in, and inquiry capture.
- **Home 2 Access:** Linked via top notification ticker banner, prominent hero badge ("Expedition Mode"), and footer directory.
- **Mobile Navbar:** Collapses into an accessible hamburger drawer with backdrop blur, body scroll lock, and ESC key dismissal.

---

## 4. Responsive Design Engine
- **Mobile (< 640px):** Single-column stacked layouts, touch-friendly min 44px buttons, centered cards, zero horizontal overflow.
- **Tablet (640px – 1023px):** Balanced 2-column grids with adjusted spacing.
- **1024px View Specifically:** Explicit media query prevents awkward wrapping, grid collapse, or overlapping text.
- **Large Desktop (> 1024px):** Multi-column full-width layouts with active 3D tilt and particle effects.

---

## 5. Theming & Internationalization
- **Dark/Light Mode:** Toggleable via top ticker bar button and header, respecting `prefers-color-scheme` with `localStorage` persistence. Light theme retains outdoor character (canvas stone parchment, pine needle green, burnt orange).
- **RTL Support:** Bidirectional styling via `assets/css/rtl.css` for right-to-left languages (Arabic, Hebrew, Persian).
