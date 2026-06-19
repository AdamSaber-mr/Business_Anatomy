/* ============================================================
   charts.jsx — Chart.js wrapper, custom vector world map, serpentine timeline
   ============================================================ */
let INK = '#111114', G1 = '#3A3A42', G2 = '#7A7A82', G3 = '#B4B4B8', G4 = '#D8D8DC',
      LINE = '#EAEAEC', MUT = '#6B6B72', CARD = '#FFFFFF';
function syncPalette(){var cs=getComputedStyle(document.documentElement);var v=function(n,f){var x=cs.getPropertyValue(n).trim();return x||f;};var dark=document.documentElement.getAttribute('data-theme')==='dark';INK=v('--ink','#111114');LINE=v('--line','#EAEAEC');MUT=v('--muted','#6B6B72');G1=dark?'#C9C9CE':'#3A3A42';G2=dark?'#9A9AA2':'#7A7A82';G3=dark?'#5C5C64':'#B4B4B8';G4=dark?'#3A3A40':'#D8D8DC';CARD=v('--card','#FFFFFF');if(typeof _grid!=='undefined')_grid.color=LINE;if(window.Chart){Chart.defaults.color=MUT;Chart.defaults.plugins.tooltip.backgroundColor=INK;var onInk=dark?'#111114':'#fff';Chart.defaults.plugins.tooltip.titleColor=onInk;Chart.defaults.plugins.tooltip.bodyColor=onInk;}}

(function setChartDefaults() {
  if (!window.Chart) return;
  const C = window.Chart;
  C.defaults.font.family = "'Manrope', system-ui, sans-serif";
  C.defaults.font.size = 12.5;
  C.defaults.color = MUT;
  C.defaults.plugins.tooltip.backgroundColor = INK;
  C.defaults.plugins.tooltip.padding = 11;
  C.defaults.plugins.tooltip.cornerRadius = 9;
  C.defaults.plugins.tooltip.titleFont = { weight: '700', size: 12 };
  C.defaults.plugins.tooltip.bodyFont = { weight: '600', size: 13 };
  C.defaults.plugins.tooltip.displayColors = false;
})();

const _usd = v => '$' + v.toFixed(1) + 'B';
const _grid = { color: LINE, drawTicks: false };
const _noGrid = { display: false };
function _gradient(canvas, h) {
  const g = canvas.getContext('2d').createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, INK + '2E'); g.addColorStop(1, INK + '00');
  return g;
}

/* ---- chart config builders: (canvas) => Chart.js config ---- */
const CHART = {
  growth: (cv) => ({
    type: 'line',
    data: { labels: window.YEARS.map(String),
      datasets: [{ data: window.DATA.revenue.slice(), borderColor: INK, borderWidth: 2.5,
        backgroundColor: _gradient(cv, 340), fill: true, tension: .34,
        pointBackgroundColor: CARD, pointBorderColor: INK, pointBorderWidth: 2.5, pointRadius: 4, pointHoverRadius: 6 }] },
    options: { responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { callbacks: { title: i => 'FY' + i[0].label, label: c => _usd(c.parsed.y) } } },
      scales: { y: { min: 30, ticks: { callback: v => '$' + v + 'B', padding: 8 }, grid: _grid, border: { display: false } },
        x: { grid: _noGrid, border: { display: false }, ticks: { padding: 8, font: { weight: '600' } } } } },
  }),
  mfg: () => ({
    type: 'bar',
    data: { labels: ['Vietnam','Indonesia','China','Cambodia','Other'],
      datasets: [{ label: 'Footwear', data: [50,27,18,3,2], backgroundColor: INK, borderRadius: 4, maxBarThickness: 24 },
        { label: 'Apparel', data: [28,8,16,15,33], backgroundColor: G3, borderRadius: 4, maxBarThickness: 24 }] },
    options: { responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => c.dataset.label + ': ' + c.parsed.y + '%' } } },
      scales: { y: { max: 55, ticks: { callback: v => v + '%', padding: 8 }, grid: _grid, border: { display: false } },
        x: { grid: _noGrid, border: { display: false }, ticks: { padding: 6, font: { weight: '600' } } } } },
  }),
  cat: () => ({
    type: 'bar',
    data: { labels: ['Footwear','Apparel','Equipment','Converse'],
      datasets: [{ data: [35.2,13.9,2.1,2.1], backgroundColor: [INK,G1,G3,G3], borderRadius: 5, maxBarThickness: 30 }] },
    options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => _usd(c.parsed.x) } } },
      scales: { x: { ticks: { callback: v => '$' + v + 'B', padding: 8 }, grid: _grid, border: { display: false } },
        y: { grid: _noGrid, border: { display: false }, ticks: { font: { weight: '700' } } } } },
  }),
  region: () => ({
    type: 'doughnut',
    data: { labels: ['North America','EMEA','Greater China','APAC & LatAm','Converse'],
      datasets: [{ data: [21.4,13.6,7.5,6.7,2.1], backgroundColor: [INK,G1,G2,G3,G4], borderColor: CARD, borderWidth: 2.5, hoverOffset: 6 }] },
    options: { responsive: true, maintainAspectRatio: false, cutout: '62%',
      plugins: { legend: { position: 'right', labels: { boxWidth: 11, boxHeight: 11, padding: 13, font: { weight: '600', size: 12.5 }, usePointStyle: true, pointStyle: 'rectRounded' } },
        tooltip: { callbacks: { label: c => c.label + ': ' + _usd(c.parsed) } } } },
  }),
  dtc: (cv) => ({
    type: 'line',
    data: { labels: window.YEARS.map(String),
      datasets: [{ data: window.DATA.dtcShare.slice(), borderColor: INK, borderWidth: 2.5, backgroundColor: _gradient(cv, 260), fill: true, tension: .34,
        pointBackgroundColor: CARD, pointBorderColor: INK, pointBorderWidth: 2.5, pointRadius: 4, pointHoverRadius: 6 }] },
    options: { responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { callbacks: { title: i => 'FY' + i[0].label, label: c => c.parsed.y + '% direct' } } },
      scales: { y: { min: 20, max: 50, ticks: { callback: v => v + '%', padding: 8 }, grid: _grid, border: { display: false } },
        x: { grid: _noGrid, border: { display: false }, ticks: { padding: 8, font: { weight: '600' } } } } },
  }),
  comp: () => ({
    type: 'bar',
    data: { labels: ['Nike','Adidas','Puma','New Balance','Under Armour'],
      datasets: [{ data: [51.4,23.7,8.6,7.5,5.7], backgroundColor: [INK,G1,G2,G2,G2], borderRadius: 6, maxBarThickness: 46 }] },
    options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => _usd(c.parsed.x) } } },
      scales: { x: { ticks: { callback: v => '$' + v + 'B', padding: 8 }, grid: _grid, border: { display: false } },
        y: { grid: _noGrid, border: { display: false }, ticks: { font: { weight: '700', size: 14 } } } } },
  }),
  mktg: () => ({
    type: 'bar',
    data: { labels: window.DATA.marketing.years.map(String),
      datasets: [{ data: window.DATA.marketing.data.slice(), backgroundColor: INK, borderRadius: 5, maxBarThickness: 38 }] },
    options: { responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => _usd(c.parsed.y) } } },
      scales: { y: { ticks: { callback: v => '$' + v + 'B', padding: 8 }, grid: _grid, border: { display: false } },
        x: { grid: _noGrid, border: { display: false }, ticks: { padding: 8, font: { weight: '600' } } } } },
  }),
  digital: (cv) => ({
    type: 'line',
    data: { labels: window.DATA.digital.years.map(String),
      datasets: [{ data: window.DATA.digital.data.slice(), borderColor: INK, borderWidth: 2.5, backgroundColor: _gradient(cv, 300), fill: true, tension: .34,
        pointBackgroundColor: CARD, pointBorderColor: INK, pointBorderWidth: 2.5, pointRadius: 4, pointHoverRadius: 6 }] },
    options: { responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => _usd(c.parsed.y) } } },
      scales: { y: { ticks: { callback: v => '$' + v + 'B', padding: 8 }, grid: _grid, border: { display: false } },
        x: { grid: _noGrid, border: { display: false }, ticks: { padding: 8, font: { weight: '600' } } } } },
  }),
  quarterly: () => ({
    type: 'bar',
    data: { labels: window.QUARTERLY.labels.slice(),
      datasets: [{ data: window.QUARTERLY.data.slice(), backgroundColor: [INK, INK, G2, G2], borderRadius: 6, maxBarThickness: 64 }] },
    options: { responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { callbacks: { title: i => 'FY2024 · ' + i[0].label, label: c => _usd(c.parsed.y) } } },
      scales: { y: { ticks: { callback: v => '$' + v + 'B', padding: 8 }, grid: _grid, border: { display: false } },
        x: { grid: _noGrid, border: { display: false }, ticks: { padding: 8, font: { weight: '700' } } } } },
  }),
  share: () => ({
    type: 'line',
    data: { labels: window.SHARE_TREND.years.map(String),
      datasets: [
        { label: 'Nike', data: window.SHARE_TREND.nike.slice(), borderColor: INK, backgroundColor: INK, borderWidth: 2.6, tension: .34, pointRadius: 3, pointHoverRadius: 6, fill: false },
        { label: 'Adidas', data: window.SHARE_TREND.adidas.slice(), borderColor: G2, backgroundColor: G2, borderWidth: 2.2, borderDash: [5, 4], tension: .34, pointRadius: 3, pointHoverRadius: 6, fill: false },
        { label: 'Others', data: window.SHARE_TREND.others.slice(), borderColor: G3, backgroundColor: G3, borderWidth: 2.2, borderDash: [2, 4], tension: .34, pointRadius: 3, pointHoverRadius: 6, fill: false },
      ] },
    options: { responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => c.dataset.label + ': ' + c.parsed.y + '%' } } },
      scales: { y: { ticks: { callback: v => v + '%', padding: 8 }, grid: _grid, border: { display: false } },
        x: { grid: _noGrid, border: { display: false }, ticks: { padding: 8, font: { weight: '600' } } } } },
  }),
};

/* Emphasise the scrubber's active year on a time-series chart. */
function highlightYear(inst, name, year) {
  const meta = window.YEAR_CHARTS[name];
  if (!meta) return;
  const idx = meta.years.indexOf(year);
  const ds = inst.data.datasets[0];
  if (inst.config.type === 'line') {
    ds.pointRadius = meta.years.map((_, i) => (i === idx ? 7 : 3.5));
    ds.pointBackgroundColor = meta.years.map((_, i) => (i === idx ? INK : CARD));
    ds.pointBorderColor = INK;
  } else {
    ds.backgroundColor = meta.years.map((_, i) => (i === idx ? INK : G3));
  }
  inst.update('none');
}

/* ---------------- <ChartBox> ---------------- */
function ChartBox({ name, className = "ch" }) {
  const ref = useRef(null);
  const instRef = useRef(null);
  const { year } = useContext(window.YearCtx);
  useEffect(() => {
    const cv = ref.current;
    if (!cv || !window.Chart) return;
    syncPalette();
    const inst = new window.Chart(cv, CHART[name](cv));
    instRef.current = inst;
    if (window.YEAR_CHARTS[name]) highlightYear(inst, name, year);
    return () => { try { inst.destroy(); } catch (e) {} instRef.current = null; };
  }, [name]);
  // re-highlight when the scrubber moves (no rebuild)
  useEffect(() => {
    if (instRef.current && window.YEAR_CHARTS[name]) highlightYear(instRef.current, name, year);
  }, [year, name]);
  return <div className={className}><canvas ref={ref}></canvas></div>;
}

/* ---------------- <SupplyMap> — custom 2D vector world map ---------------- */
let _worldCache = null;
function loadWorld() {
  if (_worldCache) return Promise.resolve(_worldCache);
  return fetch('vendor/data/countries-110m.json')
    .then(r => r.json()).then(t => { _worldCache = t; return t; });
}

function SupplyMap({ selectedId, onSelect }) {
  const ref = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({});       // id -> { marker, el }
  const moverRef = useRef(null);
  const stopLabelRef = useRef(null);   // floating name pill shown when shipment reaches a stop
  const railFillRef = useRef(null);    // progress fill in the step rail
  const animRef = useRef({ interval: null, timers: [] });
  const [phase, setPhase] = useState('idle'); // idle | playing | done
  const [cap, setCap] = useState(null);
  const [stopIdx, setStopIdx] = useState(-1);  // last route stop the shipment has reached

  const isDark = () => document.documentElement.getAttribute('data-theme') === 'dark';

  const showStopLabel = (lngLat, name) => {
    const map = mapRef.current; if (!map) return;
    if (stopLabelRef.current) { try { stopLabelRef.current.remove(); } catch (e) {} stopLabelRef.current = null; }
    const wrap = document.createElement('div'); wrap.className = 'ml-stopanchor';
    const pill = document.createElement('span'); pill.className = 'ml-stoplabel'; pill.textContent = name;
    wrap.appendChild(pill);
    stopLabelRef.current = new maplibregl.Marker({ element: wrap, anchor: 'center' }).setLngLat(lngLat).addTo(map);
  };
  const hideStopLabel = () => { if (stopLabelRef.current) { try { stopLabelRef.current.remove(); } catch (e) {} stopLabelRef.current = null; } };

  const stopAnim = () => {
    const a = animRef.current;
    if (a.interval) clearInterval(a.interval);
    a.interval = null;
    a.timers.forEach(clearTimeout); a.timers = [];
  };

  useEffect(() => {
    if (!window.maplibregl || !ref.current) return;
    const dark = isDark();
    const map = new maplibregl.Map({
      container: ref.current,
      style: dark
        ? 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
        : 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: [8, 26], zoom: 1.25, minZoom: 1, maxZoom: 12,
      attributionControl: false, dragRotate: false, renderWorldCopies: true,
    });
    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
    map.scrollZoom.disable();            // don't trap page scroll
    map.touchZoomRotate.disableRotation();
    map.dragRotate.disable();

    const sites = window.SUPPLY_SITES || [];
    sites.forEach(s => {
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'mlmk k-' + s.kind;
      el.setAttribute('aria-label', s.n);
      el.innerHTML = '<span class="mlmk-pulse"></span><span class="mlmk-pin">' + markerSvg(SITE_KIND_ICON[s.kind]) + '</span>' +
                     '<span class="mlmk-label">' + s.n + '</span>';
      el.addEventListener('click', (ev) => { ev.stopPropagation(); onSelect && onSelect(s.id); });
      const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
        .setLngLat([s.ll[1], s.ll[0]]).addTo(map);
      markersRef.current[s.id] = { marker, el };
    });

    map.on('load', () => {
      if (!map.getSource('route')) {
        map.addSource('route', { type: 'geojson', data: { type: 'Feature', geometry: { type: 'LineString', coordinates: [] } } });
        map.addLayer({
          id: 'route-line', type: 'line', source: 'route',
          layout: { 'line-cap': 'round', 'line-join': 'round' },
          paint: { 'line-color': dark ? '#FFFFFF' : '#111114', 'line-width': 3, 'line-dasharray': [1.6, 2.2] },
        });
      }
      map.resize();
    });

    const ro = new ResizeObserver(() => map.resize());
    ro.observe(ref.current);
    const t = setTimeout(() => map.resize(), 220);

    return () => {
      clearTimeout(t); ro.disconnect(); stopAnim(); hideStopLabel();
      if (moverRef.current) { try { moverRef.current.remove(); } catch (e) {} moverRef.current = null; }
      try { map.remove(); } catch (e) {}
      mapRef.current = null; markersRef.current = {};
    };
  }, []);

  // selection: highlight marker + gently fly to it
  useEffect(() => {
    Object.entries(markersRef.current).forEach(([id, m]) => m.el.classList.toggle('on', id === selectedId));
    const site = (window.SUPPLY_SITES || []).find(s => s.id === selectedId);
    if (site && mapRef.current && phase === 'idle') {
      const wide = window.innerWidth > 900;   // shift target clear of the left detail panel
      mapRef.current.flyTo({ center: [site.ll[1], site.ll[0]], zoom: Math.max(mapRef.current.getZoom(), 3.4),
        offset: wide ? [176, 0] : [0, 0], duration: 1000, essential: true });
    }
  }, [selectedId]);

  // quadratic bezier arc between two lng/lat points, lifted toward the pole
  const arc = (a, b, t) => {
    const cx = (a[0] + b[0]) / 2;
    const lift = Math.min(Math.abs(b[0] - a[0]) * 0.12, 16) + 5;
    const cy = Math.max(a[1], b[1]) + lift;
    const u = 1 - t;
    return [u * u * a[0] + 2 * u * t * cx + t * t * b[0], u * u * a[1] + 2 * u * t * cy + t * t * b[1]];
  };

  const play = () => {
    const map = mapRef.current; if (!map) return;
    stopAnim();
    setPhase('playing');
    const route = window.SUPPLY_ROUTE || [];
    // unwrap longitudes so each leg takes the natural (short) path across the dateline
    const ll = []; let prev = null;
    route.forEach(r => {
      let lng = r.ll[1];
      if (prev !== null) { while (lng - prev > 180) lng -= 360; while (lng - prev < -180) lng += 360; }
      ll.push([lng, r.ll[0]]); prev = lng;
    });
    const last = ll.length - 1;
    const FOLLOW_Z = window.innerWidth > 900 ? 2.7 : 2.1;
    const setRail = (frac) => { if (railFillRef.current) railFillRef.current.style.width = Math.max(0, Math.min(1, frac)) * 100 + '%'; };
    setCap(route[0].cap); setStopIdx(0); setRail(0);
    const setLine = (coords) => { const src = map.getSource('route'); if (src) src.setData({ type: 'Feature', geometry: { type: 'LineString', coordinates: coords } }); };
    if (moverRef.current) { try { moverRef.current.remove(); } catch (e) {} }
    const mEl = document.createElement('div'); mEl.className = 'ml-mover';
    moverRef.current = new maplibregl.Marker({ element: mEl }).setLngLat(ll[0]).addTo(map);
    let acc = [ll[0]]; setLine(acc); let leg = 0; const N = 48;
    // open the camera on the origin, name the start, then ride along WITH the shipment
    map.flyTo({ center: ll[0], zoom: FOLLOW_Z, duration: 1100, essential: true });
    animRef.current.timers.push(setTimeout(() => showStopLabel(ll[0], route[0].name), 900));
    const startLeg = () => {
      if (leg >= last) {
        setPhase('done'); setStopIdx(last); setRail(1);
        showStopLabel(ll[last], route[last].name);
        map.easeTo({ center: ll[last], zoom: Math.max(FOLLOW_Z, 3.0), duration: 1100, essential: true });
        return;
      }
      hideStopLabel();                              // leaving a stop — drop its name while in transit
      const a = ll[leg], b = ll[leg + 1];
      const span = Math.abs(b[0] - a[0]);
      const dur = Math.min(4800, Math.max(1500, span * 22));  // longer hops take longer
      const t0 = performance.now(), base = acc.slice();
      animRef.current.timers.push(setTimeout(() => setCap(route[leg + 1].cap), dur * 0.5));
      animRef.current.interval = setInterval(() => {
        const p = Math.min(1, (performance.now() - t0) / dur);
        const e2 = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        const seg = []; const upto = Math.floor(e2 * N);
        for (let i = 0; i <= upto; i++) seg.push(arc(a, b, i / N));
        const pos = arc(a, b, e2);
        seg.push(pos);
        setLine(base.concat(seg));
        if (moverRef.current) moverRef.current.setLngLat(pos);
        map.setCenter(pos);                 // camera tracks the shipment — smooth, no edge jumps
        setRail((leg + e2) / last);         // progress bar fills as the package travels
        if (p >= 1) {
          clearInterval(animRef.current.interval); animRef.current.interval = null;
          const full = []; for (let i = 0; i <= N; i++) full.push(arc(a, b, i / N));
          acc = base.concat(full); setLine(acc);
          leg++;
          setStopIdx(leg); setRail(leg / last);
          showStopLabel(ll[leg], route[leg].name);   // arrived — reveal this stop's name
          animRef.current.timers.push(setTimeout(startLeg, 700));
        }
      }, 16);
    };
    animRef.current.timers.push(setTimeout(startLeg, 1500));
  };

  const reset = () => {
    stopAnim(); setPhase('idle'); setCap(null); setStopIdx(-1); hideStopLabel();
    const map = mapRef.current; if (!map) return;
    if (map.getSource('route')) map.getSource('route').setData({ type: 'Feature', geometry: { type: 'LineString', coordinates: [] } });
    if (moverRef.current) { try { moverRef.current.remove(); } catch (e) {} moverRef.current = null; }
    map.flyTo({ center: [8, 26], zoom: 1.25, duration: 1000 });
  };

  const sites = window.SUPPLY_SITES || [];
  const sel = sites.find(s => s.id === selectedId) || sites[0] || {};
  const kindLabel = { design: 'Design & HQ', mfg: 'Manufacturing hub', dist: 'Distribution centre' };

  return (
    <div className="mlwrap">
      <div className="mlmap" ref={ref}></div>

      {phase === 'idle' && sel.id && (
        <div className="sc-panel">
          <div className="sc-detail">
            <h3 className="sc-name">{sel.n}</h3>
            <div className="sc-country">{sel.country}</div>
            <p className="sc-desc">{sel.detail}</p>
            <div className="sc-stats">
              <div><span className="k">Scale</span><span className="v">{sel.factories}</span></div>
              <div><span className="k">Makes</span><span className="v">{sel.makes}</span></div>
            </div>
          </div>
          <div className="sc-list">
            <div className="sc-list-h">All locations</div>
            {[['design', 'Design'], ['mfg', 'Manufacturing'], ['dist', 'Distribution']].map(([kind, label]) => {
              const group = sites.filter(s => s.kind === kind);
              if (!group.length) return null;
              return (
                <div className="sc-group" key={kind}>
                  <div className="sc-group-h">{label}</div>
                  {group.map(s => (
                    <button key={s.id} className={"sc-row" + (s.id === selectedId ? " on" : "")} onClick={() => onSelect && onSelect(s.id)}>
                      <span className="sc-row-n">{s.n}</span>
                      <span className="sc-row-r">{s.role}</span>
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {phase !== 'idle' && (
        <div className="ml-steprail">
          <div className="ml-steprail-inner">
            <div className="ml-rail-line"><span className="ml-rail-fill" ref={railFillRef}></span></div>
            {(window.SUPPLY_ROUTE || []).map((r, i) => (
              <div key={i} className={"ml-step" + (i === stopIdx ? " active" : "") + (i < stopIdx ? " done" : "")}>
                <span className="ml-step-ic"><Icon name={r.ic} /></span>
                <span className="ml-step-lab">{r.stage}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="ml-legend">
        <span><i className="lg-design"><Icon name="pencil" /></i>Design &amp; HQ</span>
        <span><i><Icon name="factory" /></i>Manufacturing</span>
        <span><i><Icon name="warehouse" /></i>Distribution</span>
      </div>
      <div className="ml-controls">
        {phase === 'idle'
          ? <button className="ml-btn" onClick={play}><span className="ml-play"></span>Play the journey</button>
          : <button className="ml-btn ghost" onClick={reset}>Reset map</button>}
      </div>
    </div>
  );
}

/* ---------------- <JourneyMini> — small world map that tracks the journey ---------------- */
function JourneyMini({ step }) {
  const W = 420, H = 250;
  const [feats, setFeats] = useState([]);
  const [ready, setReady] = useState(false);
  const projRef = useRef(null);
  useEffect(() => {
    let alive = true;
    loadWorld().then(topo => {
      if (!alive || !window.d3 || !window.topojson) return;
      const fc = topojson.feature(topo, topo.objects.countries);
      const proj = d3.geoNaturalEarth1().fitExtent([[8, 8], [W - 8, H - 8]], fc);
      projRef.current = proj;
      setFeats(fc.features.map(f => d3.geoPath(proj)(f)));
      setReady(true);
    }).catch(() => setReady(true));
    return () => { alive = false; };
  }, []);
  const stops = window.JOURNEY_STOPS || [];
  const pts = ready && projRef.current ? stops.map(s => projRef.current([s.ll[1], s.ll[0]])) : [];
  let d = '';
  pts.slice(0, step + 1).forEach((p, i) => { d += (i === 0 ? 'M ' : 'L ') + p[0] + ' ' + p[1] + ' '; });
  return (
    <div className="jmini">
      <svg viewBox={'0 0 ' + W + ' ' + H} preserveAspectRatio="xMidYMid meet">
        <g className="jmini-land">{feats.map((dd, i) => <path key={i} d={dd} />)}</g>
        {pts.length > 1 && step > 0 && <path className="jmini-route" d={d} fill="none" />}
        {pts.map((p, i) => (
          <circle key={i} className={'jmini-dot' + (i === step ? ' on' : i < step ? ' done' : '')}
                  cx={p[0]} cy={p[1]} r={i === step ? 5.5 : 3} />
        ))}
        {ready && pts[step] && <circle className="jmini-pulse" cx={pts[step][0]} cy={pts[step][1]} r="9" />}
      </svg>
    </div>
  );
}
window.JourneyMini = JourneyMini;

/* ---- map-marker icons (inline SVG strings — markers are built via innerHTML, not React) ---- */
const MARKER_ICON_PATHS = {
  pencil:      '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  box:         '<path d="M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.3 7L12 12l8.7-5M12 22V12"/>',
  factory:     '<path d="M3 21V10l6 4V10l6 4V6l6 3v12H3z"/><line x1="3" y1="21" x2="21" y2="21"/>',
  shieldCheck: '<path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/><polyline points="9 12 11.5 14.5 16 9.5"/>',
  truck:       '<path d="M3 6h11v9H3z"/><path d="M14 9h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.7"/><circle cx="17.5" cy="18" r="1.7"/>',
  warehouse:   '<path d="M3 21V8l9-4 9 4v13"/><path d="M7 21v-7h10v7"/><line x1="7" y1="17" x2="17" y2="17"/>',
  home:        '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/>',
};
function markerSvg(name) {
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" '
       + 'stroke-linecap="round" stroke-linejoin="round">' + (MARKER_ICON_PATHS[name] || '') + '</svg>';
}
const SITE_KIND_ICON = { design: 'pencil', mfg: 'factory', dist: 'warehouse' };

/* ---------------- <JourneyMap> — real interactive map that flies to each stop ---------------- */
function JourneyMap({ stop, ic }) {
  const ref = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const firstRef = useRef(true);

  useEffect(() => {
    if (!window.maplibregl || !ref.current) return;
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    const map = new maplibregl.Map({
      container: ref.current,
      style: dark
        ? 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
        : 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: [stop.ll[1], stop.ll[0]], zoom: stop.zoom || 4,
      minZoom: 1, maxZoom: 14, attributionControl: false, dragRotate: false, renderWorldCopies: true,
    });
    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
    map.scrollZoom.disable();
    map.dragRotate.disable();
    map.touchZoomRotate.disableRotation();
    // ensure tiles render once the style + container settle
    map.on('load', () => map.resize());
    map.once('idle', () => map.resize());

    const el = document.createElement('div');
    el.className = 'jmk';
    el.innerHTML = '<span class="jmk-pulse"></span><span class="jmk-pin">' + markerSvg(ic || 'pencil') + '</span>';
    markerRef.current = new maplibregl.Marker({ element: el, anchor: 'center' })
      .setLngLat([stop.ll[1], stop.ll[0]]).addTo(map);

    const ro = new ResizeObserver(() => map.resize());
    ro.observe(ref.current);
    const t1 = setTimeout(() => map.resize(), 240);
    const t2 = setTimeout(() => map.resize(), 700);
    return () => { clearTimeout(t1); clearTimeout(t2); ro.disconnect(); try { map.remove(); } catch (e) {} mapRef.current = null; markerRef.current = null; firstRef.current = true; };
  }, []);

  // fly to the active stop (skip the very first run — the map already opens there)
  useEffect(() => {
    const map = mapRef.current; if (!map) return;
    if (markerRef.current) markerRef.current.setLngLat([stop.ll[1], stop.ll[0]]);
    if (firstRef.current) { firstRef.current = false; return; }
    map.flyTo({ center: [stop.ll[1], stop.ll[0]], zoom: stop.zoom || 4, duration: 1500, essential: true });
  }, [stop.ll[0], stop.ll[1], stop.zoom]);

  // swap the marker icon as the journey moves from stop to stop
  useEffect(() => {
    const m = markerRef.current; if (!m) return;
    const pin = m.getElement().querySelector('.jmk-pin');
    if (pin) pin.innerHTML = markerSvg(ic || 'pencil');
  }, [ic]);

  return <div className="jmap" ref={ref}></div>;
}
window.JourneyMap = JourneyMap;

/* ---------------- <Timeline> (serpentine) ---------------- */
const MILESTONES = [
  { y: '1964', key: false, rev: '$8K', t: 'Blue Ribbon Sports', d: 'Phil Knight & Bill Bowerman start with $500 each, selling shoes from the back of a car.' },
  { y: '1971', key: true, rev: '$3M', t: 'Becomes Nike', d: 'Named for the goddess of victory. The Swoosh is designed by Carolyn Davidson for $35.' },
  { y: '1974', key: false, rev: '$5M', t: 'Waffle Trainer', d: "Bowerman's waffle-iron sole reinvents the running shoe — the first real breakthrough." },
  { y: '1980', key: true, rev: '$269M', t: 'IPO & market leader', d: 'Goes public at $22 a share, holding 50% of the U.S. athletic footwear market.' },
  { y: '1984', key: true, rev: '$920M', t: 'Signs Michael Jordan', d: 'A $2.5M deal with an NBA rookie. Air Jordan makes $100M+ in its first two months.' },
  { y: '1988', key: true, rev: '$1.2B', t: '"Just Do It"', d: 'The campaign that defined a brand. Revenue climbs from $877M to over $3B by 1991.' },
  { y: '1997', key: false, rev: '$9.2B', t: 'Jordan Brand', d: 'Spun off as its own division under the Jumpman — now a $6B+ business in its own right.' },
  { y: '2003', key: false, rev: '$10.7B', t: 'Acquires Converse', d: 'Nike buys Converse for $305M, adding the Chuck Taylor All Star to its portfolio.' },
  { y: '2006', key: false, rev: '$15B', t: 'Nike+ with Apple', d: "Pioneers digital fitness — the partnership that becomes today's Nike Run Club." },
  { y: '2012', key: false, rev: '$24B', t: 'The FuelBand', d: 'A wearable that turns movement into points — an early, bold bet on connected fitness.' },
  { y: '2017', key: true, rev: '$34B', t: '"Breaking2"', d: 'Nike stages a sub-two-hour marathon attempt, fusing elite sport, science and marketing.' },
  { y: '2021', key: true, rev: '$44.5B', t: 'Record year', d: 'Sales rebound past $44B as the direct-to-consumer push and digital sales accelerate.' },
  { y: '2024', key: true, rev: '$51.4B', t: 'Global leader', d: "The world's largest athletic brand — 190+ countries, 79,000 employees, 505 factories." },
];

function Timeline() {
  const rowsRef = useRef(null);
  const svgRef = useRef(null);
  const pathRef = useRef(null);

  const draw = useCallback(() => {
    const rows = rowsRef.current, svg = svgRef.current, path = pathRef.current;
    if (!rows || !svg || !path) return;
    const dots = [...rows.querySelectorAll('.mdot')];
    if (!dots.length) return;
    const base = rows.getBoundingClientRect();
    svg.setAttribute('viewBox', '0 0 ' + base.width + ' ' + base.height);
    const pts = dots.map(d => {
      const r = d.getBoundingClientRect();
      return { x: r.left - base.left + r.width / 2, y: r.top - base.top + r.height / 2 };
    });
    let dStr = '';
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i + 1];
      if (i === 0) dStr += 'M ' + a.x + ' ' + a.y + ' ';
      if (Math.abs(a.y - b.y) < 8) dStr += 'L ' + b.x + ' ' + b.y + ' ';
      else { const my = (a.y + b.y) / 2; dStr += 'C ' + a.x + ' ' + my + ' ' + b.x + ' ' + my + ' ' + b.x + ' ' + b.y + ' '; }
    }
    path.setAttribute('d', dStr);
  }, []);

  useEffect(() => {
    const raf = requestAnimationFrame(() => requestAnimationFrame(draw));
    const t1 = setTimeout(draw, 140);
    const onResize = () => draw();
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(raf); clearTimeout(t1); window.removeEventListener('resize', onResize); };
  }, [draw]);

  // arm the entrance BEFORE paint, independent of the global anim-ok flag,
  // so the reveal always works (and never leaves cards stuck hidden if JS stalls).
  React.useLayoutEffect(() => {
    if (rowsRef.current) rowsRef.current.classList.add('tl-armed');
  }, []);

  // reveal each milestone as it crosses into view — computed directly from
  // scroll position (robust: doesn't depend on IntersectionObserver firing).
  useEffect(() => {
    const root = document.querySelector('.scroll');
    const miles = rowsRef.current ? [...rowsRef.current.querySelectorAll('.mile')] : [];
    if (!miles.length || !root) { miles.forEach(m => m.classList.add('seen')); return; }
    const reveal = () => {
      const rb = root.getBoundingClientRect();
      const line = rb.bottom - rb.height * 0.12;
      miles.forEach(m => {
        if (m.classList.contains('seen')) return;
        if (m.getBoundingClientRect().top < line) m.classList.add('seen');
      });
    };
    reveal();
    const raf = requestAnimationFrame(reveal);
    const t1 = setTimeout(reveal, 160);
    const t2 = setTimeout(reveal, 420);
    root.addEventListener('scroll', reveal, { passive: true });
    window.addEventListener('resize', reveal);
    return () => { cancelAnimationFrame(raf); clearTimeout(t1); clearTimeout(t2); root.removeEventListener('scroll', reveal); window.removeEventListener('resize', reveal); };
  }, []);

  // chunk into rows of 3
  const groups = [];
  for (let i = 0; i < MILESTONES.length; i += 3) groups.push(MILESTONES.slice(i, i + 3));

  let idx = -1;
  return (
    <div className="snake">
      <svg className="snake-svg" ref={svgRef} preserveAspectRatio="none"><path ref={pathRef} d=""></path></svg>
      <div className="snake-rows" ref={rowsRef}>
        {groups.map((g, gi) => (
          <div className="mrow" key={gi}>
            {g.map((m) => {
              idx++;
              return (
                <div className={"mile" + (m.key ? " key" : "")} key={m.y}
                     style={{ transitionDelay: ((idx % 3) * 70) + 'ms' }}>
                  <div className="mdot"></div>
                  <div className="myear">{m.y}</div>
                  <div className="mcard">
                    <div className="mrev">{m.rev}</div>
                    <h4>{m.t}</h4><p>{m.d}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- <Gauge> (circular progress, B&W) ---------------- */
function Gauge({ value, label, sub }) {
  const R = 54, C = 2 * Math.PI * R;
  const [p, setP] = useState(0);
  useEffect(() => { const t = setTimeout(() => setP(value), 90); return () => clearTimeout(t); }, [value]);
  const off = C * (1 - p / 100);
  return (
    <div className="gauge">
      <svg viewBox="0 0 132 132" className="gauge-svg">
        <circle cx="66" cy="66" r={R} fill="none" stroke="var(--line-2)" strokeWidth="11" />
        <circle cx="66" cy="66" r={R} fill="none" stroke="var(--ink)" strokeWidth="11" strokeLinecap="round"
          strokeDasharray={C} strokeDashoffset={off} transform="rotate(-90 66 66)"
          style={{ transition: 'stroke-dashoffset 1.15s cubic-bezier(.2,.7,.2,1)' }} />
        <text x="66" y="66" textAnchor="middle" dominantBaseline="central"
          style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: '27px', letterSpacing: '-1px', fill: 'var(--ink)' }}>{value}%</text>
      </svg>
      <div className="glabel">{label}<span>{sub}</span></div>
    </div>
  );
}

Object.assign(window, { ChartBox, SupplyMap, Timeline, Gauge });
