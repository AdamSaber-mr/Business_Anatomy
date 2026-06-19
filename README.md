# Business Anatomy — Nike

An interactive "annual report" dashboard that takes a single company apart section by
section: Overview, Supply Chain Map, Revenue, Market Position, Growth Timeline, Business
Model, Brand & Marketing, Digital Ecosystem, Sustainability, The Journey and Business Basics.

**Live demo:** https://adamsaber-mr.github.io/Business-Anatomy/

This is the implementation of the Claude Design handoff — recreated faithfully with the same
stack the prototype used: **React 18** (UMD) transpiled in the browser with **Babel
standalone**, **MapLibre GL** for the interactive maps, **Chart.js** for charts and
**D3 + topojson** for the timeline mini-map. No build step required — every dependency is
vendored locally under `vendor/`.

## Run it locally

It's a static site, so any web server works. Two easy options:

```bash
# Option A — Node (installs a tiny static server into node_modules)
npm install
npm start            # serves on http://localhost:8765 and opens the browser

# Option B — no install, just Python
python3 -m http.server 8765
# then open http://localhost:8765
```

> Opening `index.html` directly via `file://` will **not** work: the `.jsx` files are
> fetched and transpiled at runtime, so it must be served over HTTP.

## Folder structure

```
.
├── index.html              # entry: loads vendored libs + React/Babel, mounts react/ in order
├── package.json            # optional Node dev-server scripts (npm start)
├── .nojekyll               # tells GitHub Pages to serve files as-is (no Jekyll)
├── react/                  # the app (transpiled in-browser by Babel)
│   ├── data.jsx            #   single source of truth — all figures + shared YearContext
│   ├── ui.jsx              #   icon set + shared components (KPI, Card, YearBar, Counter…)
│   ├── charts.jsx          #   Chart.js configs, MapLibre supply/journey maps, D3 timeline
│   ├── intro.jsx           #   company-selection cover screen
│   ├── sections.jsx        #   the eleven dashboard sections
│   ├── app.jsx             #   shell: sidebar, topbar (search/export/theme), routing
│   ├── styles.css          #   all styling, incl. light/dark themes
│   └── image-slot.js       #   <image-slot> web component for user-fillable photos
├── vendor/                 # all third-party libraries, vendored for offline use
│   ├── react.development.js, react-dom.development.js, babel.min.js
│   ├── chart.umd.min.js, d3.min.js, topojson-client.min.js
│   ├── maplibre/           #   maplibre-gl.js + maplibre-gl.css
│   ├── fonts/              #   Manrope (manrope.css + manrope.woff2)
│   └── data/               #   countries-110m.json (world-atlas borders)
└── assets/uploads/         # reference screenshots from the design
```

## Editing the data

All per-year numbers live in `react/data.jsx`. Swap those arrays for real figures (e.g.
parsed from a 10-K) and the whole dashboard updates — charts, KPIs and the year scrubber.

## Notes

- **Map tiles** (the basemap the MapLibre maps draw on) still stream from CartoDB at
  runtime — they're not practical to bundle. Everything else (charts, fonts, layout,
  animations) works fully offline.
- `node_modules/` is intentionally **not** committed — it only holds the optional local
  dev server and is recreated by `npm install`.
