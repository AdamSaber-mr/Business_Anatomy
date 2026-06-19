/* ============================================================
   app.jsx — App shell: sidebar, topbar (search / export / theme),
   routing, keyboard nav, scroll memory
   ============================================================ */

function Sidebar({ active, onNavigate, open, onSwitchCompany }) {
  return (
    <aside className={"sidebar" + (open ? " open" : "")}>
      <button className="logo" onClick={onSwitchCompany} title="Switch company">
        <span className="smile">
          <svg viewBox="0 0 36 36" fill="none"><path d="M4 14C8 24 18 27.5 23 24.5C28.5 21.2 26 15.5 21.5 17.2C18 18.5 11.5 21.5 4 14Z" fill="#fff" /></svg>
        </span>
        <b>Business<br />Anatomy</b>
      </button>
      <div className="nav-h">Dashboard</div>
      <nav className="nav">
        {SECTIONS.map((s) => (
          <button key={s.id} className={"nav-item" + (active === s.id ? " active" : "")} onClick={() => onNavigate(s.id)}>
            <span className="ic"><Icon name={s.icon} /></span>{s.label}
          </button>
        ))}
      </nav>
      <div className="side-foot">
        <div className="av">FY</div>
        <div className="who"><b>Fiscal Year 2024</b><span>Annual report &amp; SEC filings</span></div>
      </div>
    </aside>
  );
}

/* ---------------- Topbar search (sections + glossary) ---------------- */
function SearchBox({ onGo }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const inputRef = useRef(null);
  const boxRef = useRef(null);

  useEffect(() => { if (open && inputRef.current) inputRef.current.focus(); }, [open]);

  // close on outside click
  useEffect(() => {
    const onDoc = (e) => { if (boxRef.current && !boxRef.current.contains(e.target)) { setOpen(false); } };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  // Cmd/Ctrl+K opens search
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setOpen(true); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const results = React.useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    const secs = window.SECTIONS
      .filter((x) => x.label.toLowerCase().includes(s))
      .map((x) => ({ kind: 'Section', label: x.label, def: null, id: x.id, icon: x.icon }));
    const terms = (window.TERMS || [])
      .filter(([w, alt, def]) => (w + ' ' + (alt || '') + ' ' + def).toLowerCase().includes(s))
      .map(([w, alt, def, target]) => ({ kind: 'Glossary', label: w, def: def, id: target, icon: 'basics' }));
    return [...secs, ...terms].slice(0, 8);
  }, [q]);

  useEffect(() => { setSel(0); }, [q]);

  const pick = (r) => {
    if (r) { onGo(r.id); setQ(''); setOpen(false); }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Escape') { setQ(''); setOpen(false); }
    else if (e.key === 'Enter') { pick(results[sel] || results[0]); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); setSel((v) => Math.min(v + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSel((v) => Math.max(v - 1, 0)); }
    e.stopPropagation();
  };

  return (
    <div className={"searchwrap" + (open ? " open" : "")} ref={boxRef}>
      <input
        ref={inputRef}
        type="text"
        value={q}
        placeholder="Search sections &amp; terms…"
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={onKeyDown}
        aria-label="Search sections and glossary terms"
      />
      <button className="tbtn" onClick={() => setOpen((v) => !v)} aria-label="Search" title="Search (⌘K)"><Icon name="search" /></button>
      {open && q.trim() && (
        <div className="search-pop">
          {results.length === 0 && <div className="sr-empty">No matches for “{q.trim()}”</div>}
          {results.map((r, i) => (
            <button key={r.kind + r.label} className={"sr-item" + (i === sel ? " sel" : "")} onClick={() => pick(r)} onMouseEnter={() => setSel(i)}>
              <span className="sic"><Icon name={r.icon} /></span>
              <span className="stxt">
                <b>{r.label}</b>
                {r.def && <span className="sdef">{r.def}</span>}
              </span>
              <span className="sr-kind">{r.kind}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Topbar({ onMenu, theme, onTheme, onExport, onGo }) {
  return (
    <div className="topbar">
      <div className="co">
        <button className="mob-menu" onClick={onMenu} aria-label="Menu"><Icon name="menu" sw={2} /></button>
        <b>Nike, Inc.</b>
        <span className="badge">NYSE: NKE</span>
      </div>
      <div className="tools">
        <SearchBox onGo={onGo} />
        <button className="tbtn" onClick={onExport} title="Print or save as PDF"><Icon name="export" /><span>Export</span></button>
        <button className="tbtn" onClick={onTheme} aria-label="Toggle dark mode" title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
          <span className="thicon"><Icon name={theme === 'dark' ? 'sun' : 'moon'} /></span>
        </button>
      </div>
    </div>
  );
}

const SCROLL_KEY = 'nba_scrollpos';
const readScrollMap = () => { try { return JSON.parse(localStorage.getItem(SCROLL_KEY) || '{}'); } catch (e) { return {}; } };

function App() {
  const getInitial = () => {
    const hash = location.hash.replace('#', '');
    if (hash && SECTIONS.some(s => s.id === hash)) return hash;
    try { const s = localStorage.getItem('nba_sec'); if (s && SECTIONS.some(x => x.id === s)) return s; } catch (e) {}
    return 'overview';
  };
  const getInitialTheme = () => {
    try { const t = localStorage.getItem('nba_theme'); if (t === 'dark' || t === 'light') return t; } catch (e) {}
    return 'light';
  };

  const [active, setActive] = useState(getInitial);
  const [theme, setTheme] = useState(getInitialTheme);
  const [company, setCompany] = useState(() => {
    try { return localStorage.getItem('nba_company'); } catch (e) { return null; }
  });
  const [introVisible, setIntroVisible] = useState(() => {
    try { return !localStorage.getItem('nba_company'); } catch (e) { return true; }
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [year, setYear] = useState(2024);
  const scrollRef = useRef(null);

  const enterCompany = useCallback((id) => {
    try { localStorage.setItem('nba_company', id); } catch (e) {}
    setCompany(id);
  }, []);

  const switchCompany = useCallback(() => {
    try { localStorage.removeItem('nba_company'); } catch (e) {}
    setMenuOpen(false);
    setCompany(null);
    setIntroVisible(true);
  }, []);

  const navigate = useCallback((id) => {
    setActive(id);
    setMenuOpen(false);
    try { localStorage.setItem('nba_sec', id); } catch (e) {}
    history.replaceState(null, '', '#' + id);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, []);

  // expose navigation so deep-linked components (e.g. Business Basics) can jump sections
  useEffect(() => { window.dashboardNav = navigate; return () => { delete window.dashboardNav; }; }, [navigate]);

  /* ---- theme toggle with circular-reveal animation ---- */
  const toggleTheme = useCallback((e) => {
    const next = (document.documentElement.getAttribute('data-theme') === 'dark') ? 'light' : 'dark';
    const apply = () => {
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('nba_theme', next); } catch (err) {}
      if (ReactDOM.flushSync) ReactDOM.flushSync(() => setTheme(next)); else setTheme(next);
    };
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (document.startViewTransition && !reduced) {
      const x = (e && e.clientX) || window.innerWidth - 60;
      const y = (e && e.clientY) || 40;
      const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
      const vt = document.startViewTransition(apply);
      vt.ready.then(() => {
        document.documentElement.animate(
          { clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + r + 'px at ' + x + 'px ' + y + 'px)'] },
          { duration: 650, easing: 'cubic-bezier(.2,.7,.2,1)', pseudoElement: '::view-transition-new(root)' }
        );
      }).catch(() => {});
    } else {
      document.documentElement.classList.add('theme-anim');
      apply();
      setTimeout(() => document.documentElement.classList.remove('theme-anim'), 550);
    }
  }, []);

  /* ---- export: print to PDF (always in light, restore after) ---- */
  const exportPdf = useCallback(() => {
    const wasDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (wasDark) {
      document.documentElement.setAttribute('data-theme', 'light');
      if (ReactDOM.flushSync) ReactDOM.flushSync(() => setTheme('light')); else setTheme('light');
      setTimeout(() => {
        window.print();
        document.documentElement.setAttribute('data-theme', 'dark');
        setTheme('dark');
      }, 500);
    } else {
      window.print();
    }
  }, []);

  /* ---- scroll memory: restore on load, save while scrolling ---- */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const pos = readScrollMap()[active];
    if (pos > 0) {
      const t = setTimeout(() => { el.scrollTop = pos; }, 280);
      return () => clearTimeout(t);
    }
    // restore once, on first mount only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let t = null;
    const onScroll = () => {
      if (t) return;
      t = setTimeout(() => {
        t = null;
        const m = readScrollMap();
        m[active] = el.scrollTop;
        try { localStorage.setItem(SCROLL_KEY, JSON.stringify(m)); } catch (e) {}
      }, 220);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => { el.removeEventListener('scroll', onScroll); if (t) clearTimeout(t); };
  }, [active]);

  // keyboard nav
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.matches('input,textarea')) return;
      const order = SECTIONS.map(s => s.id);
      const cur = order.indexOf(active);
      if ((e.key === 'ArrowRight' || e.key === 'ArrowDown') && cur < order.length - 1) navigate(order[cur + 1]);
      if ((e.key === 'ArrowLeft' || e.key === 'ArrowUp') && cur > 0) navigate(order[cur - 1]);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [active, navigate]);

  const cur = SECTIONS.find(s => s.id === active) || SECTIONS[0];
  const Active = cur.Comp;

  return (
    <window.YearCtx.Provider value={{ year, setYear }}>
      {company && (
      <div className="app">
        <Sidebar active={active} onNavigate={navigate} open={menuOpen} onSwitchCompany={switchCompany} />
        <div className={"scrim" + (menuOpen ? " show" : "")} onClick={() => setMenuOpen(false)}></div>
        <div className="main">
          <Topbar onMenu={() => setMenuOpen(true)} theme={theme} onTheme={toggleTheme} onExport={exportPdf} onGo={navigate} />
          <div className="scroll" ref={scrollRef}>
            <div className="wrap">
              <section className="panel is-active" key={active + '·' + theme} data-screen-label={cur.label}>
                <Active />
              </section>
            </div>
          </div>
        </div>
      </div>
      )}
      {introVisible && <Intro onEnter={enterCompany} onDone={() => setIntroVisible(false)} theme={theme} onTheme={toggleTheme} />}
    </window.YearCtx.Provider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
