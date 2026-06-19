/* ============================================================
   data.jsx — single source of truth + shared YearContext
   All per-year numbers live here. Swap these arrays for real
   figures (e.g. parsed from a 10-K / CSV) and the whole
   dashboard updates — charts, KPIs and the year scrubber.
   ============================================================ */

const YEARS = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];

// Headline metrics, one value per fiscal year (FY2018 → FY2025).
// Sources: Nike 10-K FY2025 (SEC), Nike Q4 FY2025 earnings release.
const DATA = {
  revenue:     [36.4, 39.1, 37.4, 44.5, 46.7, 51.2, 51.4, 46.3],   // $B
  netIncome:   [1.93, 4.03, 2.54, 5.73, 6.05, 5.07, 5.70, 3.20],   // $B
  grossMargin: [43.8, 44.7, 43.4, 44.8, 46.0, 43.5, 44.6, 44.9],   // %
  dtcShare:    [30,   32,   35,   39,   42,   44,   42,   41 ],      // %
  // these series begin in 2019
  marketing:   { years: [2019, 2020, 2021, 2022, 2023, 2024, 2025], data: [3.8, 3.6, 3.1, 3.9, 4.1, 4.3, 4.7] }, // $B — FY2025 demand creation +9% YoY (Nike 10-K FY2025)
  digital:     { years: [2019, 2020, 2021, 2022, 2023, 2024, 2025], data: [5.2, 7.3, 9.1, 10.7, 11.6, 12.5, 9.6] }, // $B — FY2025 digital −20% as Nike repositions to full-price channel
};

// Which chart ids respond to the year scrubber, and the series they track.
const YEAR_CHARTS = {
  growth:  { years: YEARS, fmt: v => '$' + v.toFixed(1) + 'B' },
  dtc:     { years: YEARS, fmt: v => v + '% direct' },
  mktg:    { years: DATA.marketing.years, fmt: v => '$' + v.toFixed(1) + 'B' },
  digital: { years: DATA.digital.years, fmt: v => '$' + v.toFixed(1) + 'B' },
};

// Supply-chain locations — drives both the map markers and the detail panel.
const SUPPLY_SITES = [
  { id: 'hq', n: 'Beaverton HQ', role: 'Design & R&D', kind: 'design', c: '#111114', r: 9, ll: [45.49, -122.78],
    country: 'United States', factories: '1 campus', makes: 'Every product designed here',
    detail: "Nike's world headquarters. 1,000+ designers and engineers create every shoe and garment before a single one is built. This is where ideas, materials and brand decisions begin." },
  { id: 'vn', n: 'Vietnam', role: '50% of footwear', kind: 'mfg', c: '#5A5A5A', r: 11, ll: [16.0, 107.8],
    country: 'Vietnam', factories: '~130 factories', makes: 'Footwear · Apparel',
    detail: "Nike's single largest manufacturing base. Roughly half of all Nike shoes are assembled here by contract factories, none of them owned by Nike itself." },
  { id: 'id', n: 'Indonesia', role: '27% of footwear', kind: 'mfg', c: '#5A5A5A', r: 10, ll: [-2.5, 118],
    country: 'Indonesia', factories: '~50 factories', makes: 'Footwear · Apparel',
    detail: "The second-biggest footwear source. A growing hub as Nike spreads production across South-East Asia to reduce reliance on any one country." },
  { id: 'cn', n: 'China', role: '18% of footwear', kind: 'mfg', c: '#5A5A5A', r: 10, ll: [31.2, 121.5],
    country: 'China', factories: '~110 factories', makes: 'Footwear · Apparel · Equipment',
    detail: "Once Nike's main workshop, now its third-largest. China is also a massive consumer market for Nike, making it both a factory and a customer." },
  { id: 'kh', n: 'Cambodia', role: 'Apparel', kind: 'mfg', c: '#5A5A5A', r: 7, ll: [12.5, 104.9],
    country: 'Cambodia', factories: '~30 factories', makes: 'Apparel',
    detail: "A key apparel hub. Clothing is more labour-intensive than footwear, and Cambodia is one of several countries specialising in stitched garments." },
  { id: 'mem', n: 'Memphis DC', role: 'Distribution', kind: 'dist', c: '#9B9BA1', r: 8, ll: [35.1, -90.0],
    country: 'United States', factories: 'Distribution centre', makes: 'Ships across the Americas',
    detail: "A giant distribution centre. Finished products arrive from Asia, are sorted and stored, then sent on to North-American shops and online orders." },
  { id: 'be', n: 'Laakdal DC', role: 'Distribution', kind: 'dist', c: '#9B9BA1', r: 8, ll: [51.08, 4.97],
    country: 'Belgium', factories: 'Distribution centre', makes: 'Ships across Europe',
    detail: "Nike's main European logistics hub, largely powered by renewable energy. It supplies stores and customers right across the continent." },
];

// Lead time: how long a product takes from idea to shelf (~12–18 months).
const LEAD_TIME = [
  { ph: 'Design & sampling', span: '4–6 months', pct: 32, ic: 'pencil' },
  { ph: 'Sourcing materials', span: '1–2 months', pct: 12, ic: 'box' },
  { ph: 'Manufacturing', span: '2–3 months', pct: 18, ic: 'factory' },
  { ph: 'Shipping & freight', span: '1–2 months', pct: 14, ic: 'truck' },
  { ph: 'Warehousing & retail', span: '3–5 months', pct: 24, ic: 'warehouse' },
];

// Revenue by quarter, FY2024 (USD billions).
const QUARTERLY = { labels: ['Q1','Q2','Q3','Q4'], data: [13.4, 13.4, 12.4, 12.6] };

// Where every $100 of revenue goes (FY2024 economics, rounded for clarity).
const DOLLAR_SPLIT = [
  { k: 'Cost of products', v: 55, note: 'Materials & factory payments' },
  { k: 'Operating costs', v: 24, note: 'Stores, staff, logistics, admin' },
  { k: 'Marketing', v: 8,  note: 'Athletes, ads, demand creation' },
  { k: 'Tax', v: 2,  note: 'Corporate income tax' },
  { k: 'Profit kept', v: 11, note: 'Net income Nike keeps' },
];

// ---- Market Position ----
// Head-to-head comparison table.
const COMPETITORS = [
  { name: 'Nike',          revenue: 51.4, margin: 44.6, brand: 53.0, home: 'USA', founded: 1964, lead: true },
  { name: 'Adidas',        revenue: 23.7, margin: 47.3, brand: 15.7, home: 'Germany', founded: 1949 },
  { name: 'Puma',          revenue: 8.6,  margin: 47.0, brand: 5.0,  home: 'Germany', founded: 1948 },
  { name: 'New Balance',   revenue: 7.5,  margin: null, brand: 4.0,  home: 'USA', founded: 1906 },
  { name: 'Under Armour',  revenue: 5.7,  margin: 47.9, brand: 3.8,  home: 'USA', founded: 1996 },
];
// Global sportswear market share over time (% of the big-5 group, illustrative).
const SHARE_TREND = {
  years: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
  nike:   [49, 50, 51, 52, 53, 53, 54],
  adidas: [28, 27, 26, 25, 24, 24, 25],
  others: [23, 23, 23, 23, 23, 23, 21],
};

// ---- Brand & Marketing — biggest endorsement deals ----
const DEALS = [
  { who: 'Michael Jordan', sport: 'Basketball', note: 'Air Jordan royalties \u2014 earns more per year from Nike now than he did as an NBA player. Total lifetime deal worth ~$1.3B.', amount: '$330M+/yr' },
  { who: 'LeBron James', sport: 'Basketball', note: 'Lifetime deal signed in 2015, widely reported as the largest athlete endorsement deal in history.', amount: '$1B lifetime' },
  { who: 'Cristiano Ronaldo', sport: 'Football', note: 'Lifetime deal extended in 2016 \u2014 one of the biggest endorsement deals in football history.', amount: '$1B lifetime' },
  { who: 'Kylian Mbappé', sport: 'Football', note: '10-year extension signed in 2022, making him one of Nike\u2019s highest-paid active athletes globally.', amount: '~$18M+/yr' },
];

// ---- Digital — Nike\u2019s digital milestones ----
// Sources: Nike 10-K FY2025, Nike investor relations, Nike loyalty program data.
const DIGITAL_STEPS = [
  { y: '2006', t: 'Nike+ with Apple', d: 'A sensor in your shoe talks to your iPod, Nike\u2019s first step into digital fitness.' },
  { y: '2010', t: 'Nike+ Running app', d: 'Tracking moves to the phone. The community that becomes Nike Run Club is born.' },
  { y: '2012', t: 'FuelBand', d: 'A wearable that turns all movement into "Fuel" points. Early, bold, and ahead of its time.' },
  { y: '2015', t: 'SNKRS app', d: 'A dedicated app for hyped sneaker drops, turning launches into cultural events and sell-outs.' },
  { y: '2018', t: 'Nike App & membership', d: 'One shopping app tied to a free membership programme, the backbone of Nike\u2019s direct strategy.' },
  { y: '2023', t: 'Digital repositioning', d: 'Nike shifts its digital channels away from discounting to become a full-price premium destination, accepting short-term revenue declines to protect brand value.' },
  { y: '2025', t: '300M+ members', d: 'Nike\u2019s membership base reaches over 300 million across the Nike App, Run Club, Training Club and SNKRS. Members drive the majority of Nike.com sales. (Nike 10-K FY2025)' },
];

// ---- Sustainability — flagship initiatives ----
const INITIATIVES = [
  { name: 'Nike Grind', ic: 'sustainability', d: 'Old shoes and factory scraps are ground down into a material reused in new products and even sports surfaces. Over 130 million pounds diverted from landfill each year.' },
  { name: 'Nike Refurbished', ic: 'bag', d: 'Gently-used and returned shoes are cleaned, inspected and resold at a lower price, keeping wearable shoes out of the bin and giving them a second life.' },
  { name: 'Space Hippie', ic: 'run', d: 'A shoe collection made almost entirely from factory waste ("space junk"). It has one of the lowest carbon footprints Nike has ever produced.' },
  { name: 'Move to Zero', ic: 'shieldCheck', d: 'The umbrella name for Nike\u2019s climate journey: zero carbon and zero waste. It ties every other initiative together toward net-zero by 2050.' },
];

// ---- Business Model — the economics of one pair of shoes ----
const SHOE_ECON = [
  { k: 'Retail price', v: '$100', note: 'What you pay in the store' },
  { k: 'Factory cost', v: '~$25', note: 'Materials + labour to build it' },
  { k: 'Shipping & duties', v: '~$5', note: 'Getting it across the world' },
  { k: 'Marketing & overhead', v: '~$25', note: 'Ads, athletes, stores, staff' },
  { k: 'Nike profit', v: '~$20', note: 'Roughly what Nike keeps' },
  { k: 'Retailer share', v: '~$25', note: 'If sold via a shop, not direct' },
];

function yearIndex(year) { return YEARS.indexOf(year); }

// Build the four Overview KPIs for a given fiscal year (with YoY delta).
function overviewKPIs(year) {
  const i = yearIndex(year);
  const prev = i > 0 ? i - 1 : null;
  const fmtDelta = (cur, was, unit) => {
    if (was == null) return null;
    const d = cur - was;
    const pct = unit === 'pt' ? d.toFixed(1) + 'pt' : (was !== 0 ? Math.abs(d / was * 100).toFixed(d >= 0 ? 0 : 0) + '%' : '—');
    return { up: d >= 0, text: pct };
  };
  const rev = DATA.revenue[i], ni = DATA.netIncome[i], gm = DATA.grossMargin[i], dtc = DATA.dtcShare[i];
  return {
    revenue:    { value: rev, delta: prev != null ? fmtDelta(rev, DATA.revenue[prev]) : null },
    netIncome:  { value: ni,  delta: prev != null ? fmtDelta(ni, DATA.netIncome[prev]) : null },
    grossMargin:{ value: gm,  delta: prev != null ? fmtDelta(gm, DATA.grossMargin[prev], 'pt') : null },
    dtcShare:   { value: dtc, delta: prev != null ? fmtDelta(dtc, DATA.dtcShare[prev], 'pt') : null },
  };
}

// Shared context so the scrubber, charts and KPIs stay in sync.
const YearCtx = React.createContext({ year: 2024, setYear: () => {} });

// Ordered route for the "play the journey" animation on the supply map.
const SUPPLY_ROUTE = [
  { ll: [45.49, -122.78], name: 'Beaverton, Oregon', stage: 'Designed',  ic: 'pencil',  cap: 'Designed at HQ in Oregon' },
  { ll: [16.0, 107.8],    name: 'Vietnam',           stage: 'Made',      ic: 'factory', cap: 'Built in a Vietnam factory' },
  { ll: [35.1, -90.0],    name: 'Memphis, USA',      stage: 'Shipped',   ic: 'truck',   cap: 'Shipped to a US distribution centre' },
  { ll: [40.71, -74.0],   name: 'Your front door',   stage: 'Delivered', ic: 'home',    cap: 'Delivered to your front door' },
];

// Per-stop meta for The Journey: where on the globe, a real-map zoom, plus tangible facts.
const JOURNEY_STOPS = [
  { ll: [45.49, -122.78], zoom: 4.4, place: 'Beaverton, Oregon', far: 'Start of the line',     dur: '≈ 12 months of design' },
  { ll: [14.0, 101.0],    zoom: 3.0, place: 'Suppliers across Asia', far: 'Parts from 100s of suppliers', dur: '≈ 1–2 months to gather' },
  { ll: [16.0, 107.8],    zoom: 4.8, place: 'Factory · Vietnam',  far: '≈ 13,000 km from HQ',    dur: '≈ 3–4 weeks to build' },
  { ll: [16.0, 107.8],    zoom: 6.2, place: 'Factory floor · Vietnam', far: 'On-site checks',    dur: 'A few days' },
  { ll: [20.0, -150.0],   zoom: 2.3, place: 'Across the Pacific', far: '≈ 12,000 km at sea',     dur: '≈ 3–5 weeks on a ship' },
  { ll: [35.1, -90.0],    zoom: 4.6, place: 'Memphis, USA',       far: 'Into the warehouse',     dur: 'Days in the DC' },
  { ll: [40.71, -74.0],   zoom: 9.5, place: 'Your front door',    far: 'The last mile',          dur: '1–3 days to you' },
];

Object.assign(window, { YEARS, DATA, YEAR_CHARTS, yearIndex, overviewKPIs, YearCtx,
  SUPPLY_SITES, SUPPLY_ROUTE, JOURNEY_STOPS, LEAD_TIME, QUARTERLY, DOLLAR_SPLIT,
  COMPETITORS, SHARE_TREND, DEALS, DIGITAL_STEPS, INITIATIVES, SHOE_ECON });
