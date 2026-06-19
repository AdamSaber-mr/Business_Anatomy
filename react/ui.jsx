/* ============================================================
   ui.jsx — shared presentational components & icon set
   Exports to window for cross-file (Babel) use.
   ============================================================ */
const { useState, useEffect, useRef, useCallback, useContext } = React;

/* ---------------- Icon ---------------- */
function Icon({ name, sw = 1.8, className }) {
  const P = {
    overview: <g><line x1="5" y1="20" x2="5" y2="11"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="19" y1="20" x2="19" y2="14"/></g>,
    supply: <g><path d="M9 3 3 5.5v15L9 18l6 3 6-2.5v-15L15 6 9 3z"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></g>,
    revenue: <g><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 6.5C17 4.6 14.8 3.5 12 3.5S7 4.8 7 7s2.5 3 5 3.5 5 1.2 5 3.5-2.2 3.5-5 3.5-5-1.1-5-3"/></g>,
    market: <g><polyline points="3 17 9 11 13 15 21 7"/><polyline points="15 7 21 7 21 13"/></g>,
    timeline: <g><path d="M3 12a9 9 0 1 0 3-6.7"/><polyline points="3 4 3 8 7 8"/><polyline points="12 8 12 12 15 14"/></g>,
    model: <g><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></g>,
    brand: <path d="M12 2l2.6 6.6L21 9.7l-4.8 4.5 1.3 6.8L12 17.8 6.5 21l1.3-6.8L3 9.7l6.4-1.1L12 2z"/>,
    digital: <g><rect x="6" y="2" width="12" height="20" rx="2.5"/><line x1="11" y1="18" x2="13" y2="18"/></g>,
    sustainability: <g><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2.5 1.5 5 1.5 8a8.5 8.5 0 0 1-8.5 8.5"/><path d="M2 22c2-3 5-5 9-6"/></g>,
    caretUp: <polyline points="6 14 12 8 18 14"/>,
    export: <g><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></g>,
    search: <g><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.5" y2="16.5"/></g>,
    menu: <g><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></g>,
    users: <g><circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0M17 6a3 3 0 0 1 0 5M21 20a6 6 0 0 0-3.5-5.4"/></g>,
    lock: <g><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a4 4 0 0 1 8 0v2"/></g>,
    lines: <g><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="14" y2="17"/></g>,
    run: <g><path d="M3 12a9 9 0 1 0 9-9"/><polyline points="3 3 3 8 8 8"/></g>,
    training: <g><path d="M6 2v6a6 6 0 0 0 12 0V2"/><line x1="4" y1="22" x2="20" y2="22"/></g>,
    bag: <g><path d="M4 7h16l-1.5 12.5a2 2 0 0 1-2 1.5H7.5a2 2 0 0 1-2-1.5L4 7z"/><path d="M8 7V5a4 4 0 0 1 8 0v2"/></g>,
    journey: <g><path d="M5 21V4"/><path d="M5 4h11l-2 3 2 3H5"/></g>,
    basics: <g><path d="M3 8l9-4 9 4-9 4-9-4z"/><path d="M7 10v5c0 1 2.5 2.5 5 2.5s5-1.5 5-2.5v-5"/></g>,
    pencil: <g><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></g>,
    box: <g><path d="M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.3 7L12 12l8.7-5M12 22V12"/></g>,
    factory: <g><path d="M3 21V10l6 4V10l6 4V6l6 3v12H3z"/><line x1="3" y1="21" x2="21" y2="21"/></g>,
    shieldCheck: <g><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/><polyline points="9 12 11.5 14.5 16 9.5"/></g>,
    truck: <g><path d="M3 6h11v9H3z"/><path d="M14 9h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.7"/><circle cx="17.5" cy="18" r="1.7"/></g>,
    warehouse: <g><path d="M3 21V8l9-4 9 4v13"/><path d="M7 21v-7h10v7"/><line x1="7" y1="17" x2="17" y2="17"/></g>,
    home: <g><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/></g>,
    arrowRight: <g><line x1="4" y1="12" x2="19" y2="12"/><polyline points="13 6 19 12 13 18"/></g>,
    sun: <g><circle cx="12" cy="12" r="4.2"/><line x1="12" y1="2" x2="12" y2="4.6"/><line x1="12" y1="19.4" x2="12" y2="22"/><line x1="2" y1="12" x2="4.6" y2="12"/><line x1="19.4" y1="12" x2="22" y2="12"/><line x1="4.9" y1="4.9" x2="6.8" y2="6.8"/><line x1="17.2" y1="17.2" x2="19.1" y2="19.1"/><line x1="4.9" y1="19.1" x2="6.8" y2="17.2"/><line x1="17.2" y1="6.8" x2="19.1" y2="4.9"/></g>,
    moon: <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z"/>,
  };
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw}
         strokeLinecap="round" strokeLinejoin="round" className={className}>
      {P[name] || null}
    </svg>
  );
}

/* ---------------- Counter (animated number) ---------------- */
function Counter({ to, dec = 0, dur = 1000 }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf, t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      setV(to * e);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setV(to);
    };
    raf = requestAnimationFrame(tick);
    const safety = setTimeout(() => setV(to), dur + 280);
    return () => { cancelAnimationFrame(raf); clearTimeout(safety); };
  }, [to, dur]);
  return <>{v.toFixed(dec)}</>;
}

/* ---------------- Section header rule ---------------- */
function SecH({ children }) {
  return <div className="sec-h">{children}</div>;
}

/* ---------------- Card ---------------- */
function Card({ title, sub, className = "", children }) {
  return (
    <div className={"card " + className}>
      {(title || sub) && (
        <div className="card-h">
          {title && <h3>{title}</h3>}
          {sub && <span className="sub">{sub}</span>}
        </div>
      )}
      {children}
    </div>
  );
}

/* ---------------- Delta row (B&W only) ---------------- */
function DeltaRow({ change, up = true, note }) {
  return (
    <div className="delta">
      {change != null && (
        <span className={"d " + (up ? "up" : "down")}>
          <Icon name="caretUp" sw={2.4} />{change}
        </span>
      )}
      {note && <span className="cmp">{note}</span>}
    </div>
  );
}

/* ---------------- KPI tile ---------------- */
/* `hint` is a plain-language, one-line explanation of the metric — shown in
   normal text under the number so a non-business reader knows what it means. */
function KPI({ label, value, change, up, note, hint }) {
  return (
    <div className="kpi">
      <div className="lab">{label}</div>
      <div className="val">{value}</div>
      {hint && <div className="kpi-hint">{hint}</div>}
      <DeltaRow change={change} up={up} note={note} />
    </div>
  );
}

/* ---------------- Stat list ---------------- */
function StatLine({ rows }) {
  return (
    <div className="statline">
      {rows.map((r, i) => (
        <div className="si" key={i}>
          <span className="l">{r.l}</span>
          <span className="v">{r.v}</span>
        </div>
      ))}
    </div>
  );
}

/* ---------------- Dark callout ---------------- */
function DarkCallout({ title, children, stats }) {
  return (
    <div className="dark mt">
      <div className="darkrow">
        <div>
          <h3>{title}</h3>
          <p>{children}</p>
        </div>
        <div className="dstats">
          {stats.map((s, i) => (
            <div className="dstat" key={i}>
              <div className="v">{s.v}</div>
              <div className="k">{s.k}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Year scrubber (reads shared YearCtx) ---------------- */
/* Sits directly under the chart it controls. Drives that chart + (on
   Overview) the KPIs above it. */
function YearBar() {
  const { year, setYear } = useContext(window.YearCtx);
  const min = window.YEARS[0], max = window.YEARS[window.YEARS.length - 1];
  return (
    <div className="yearbar">
      <div className="yb-label">
        <span className="yb-k">Fiscal year</span>
        <span className="yb-v">FY{year}</span>
      </div>
      <div className="yb-track">
        <input type="range" min={min} max={max} step={1} value={year}
          onChange={(e) => setYear(parseInt(e.target.value, 10))} aria-label="Fiscal year" />
        <div className="yb-ticks">
          {window.YEARS.map((y) => (
            <button key={y} className={"yb-tick" + (y === year ? " on" : "")} onClick={() => setYear(y)}>{String(y).slice(2)}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Icon, Counter, SecH, Card, DeltaRow, KPI, StatLine, DarkCallout, YearBar });
