╔══════════════════════════════════════════════════════════╗
║          ECOTRACE — Green Growth Tracking Platform       ║
║         "Tracking Green Growth Through Technology"       ║
╚══════════════════════════════════════════════════════════╝

ABOUT
──────────────────────────────────────────────────────────
Ecotrace is a fully responsive static website for AI-powered
tree plantation monitoring. Built with HTML5, CSS3, and
vanilla JavaScript.

PROJECT STRUCTURE
──────────────────────────────────────────────────────────
Ecotrace/
├── index.html              ← Main website (all sections)
├── css/
│   └── style.css           ← All styles, responsive design
├── js/
│   └── script.js           ← Interactivity, map, charts
├── data/
│   └── mock-data.json      ← Sample NGO/plantation data
├── assets/
│   ├── images/             ← Add your images here
│   └── icons/              ← Custom icons
└── README.txt              ← This file

FEATURES
──────────────────────────────────────────────────────────
✅ Responsive (mobile, tablet, desktop)
✅ Dark mode toggle
✅ Interactive satellite comparison slider (Hero + Analysis)
✅ Animated counters (847K+ trees, 312 NGOs, etc.)
✅ Leaflet.js interactive map with NGO markers
✅ Chart.js (vegetation growth + survival doughnut charts)
✅ Group/NGO cards loaded from JSON
✅ Impact calculator with range sliders
✅ Dashboard UI mockup with mini bar chart
✅ Gallery grid with hover effects
✅ Registration form with validation
✅ AOS scroll animations
✅ Smooth scrolling navigation
✅ Glassmorphism design language
✅ Syne + DM Sans fonts (Google Fonts)

EXTERNAL LIBRARIES (loaded via CDN)
──────────────────────────────────────────────────────────
• Leaflet.js 1.9.4 — interactive maps
• Chart.js 4.4.0 — data charts
• Google Fonts — Syne (headings), DM Sans (body)
All loaded dynamically; no bundler required.

HOW TO DEPLOY ON HOSTINGER
──────────────────────────────────────────────────────────
1. Log in to Hostinger → hPanel
2. Go to "File Manager" for your domain
3. Navigate to public_html/
4. Upload ALL files and folders from this Ecotrace/ folder
   (maintain the same folder structure)
5. Visit your domain — site is live!

For a subdirectory (e.g. yoursite.com/ecotrace/):
- Create an "ecotrace" folder in public_html
- Upload everything inside that folder
- Visit yoursite.com/ecotrace/

CUSTOMIZATION GUIDE
──────────────────────────────────────────────────────────
NGO Data:        Edit data/mock-data.json
Colors:          Edit :root variables in css/style.css
Stats counters:  Edit data-target="XXXX" attributes in HTML
Map center:      Edit initMap() in js/script.js → center: [lat, lng]
Add more NGOs:   Add entries to data/mock-data.json groups array

SEO
──────────────────────────────────────────────────────────
Meta title, description, and OG tags are in <head> of index.html.
Update these for your actual domain.

BROWSER SUPPORT
──────────────────────────────────────────────────────────
Chrome 90+ ✅  Firefox 88+ ✅  Safari 14+ ✅  Edge 90+ ✅
Mobile Chrome/Safari ✅

──────────────────────────────────────────────────────────
Built for: College projects · NGO demos · Hackathons · Startups
License: MIT — Free to use and modify
──────────────────────────────────────────────────────────
