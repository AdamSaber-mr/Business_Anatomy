/* ============================================================
   intro.jsx — company selection ("annual report cover")
   Extensible: add entries to window.COMPANIES.
   ============================================================ */

window.COMPANIES = [
  {
    id: 'nike',
    name: 'Nike, Inc.',
    ticker: 'NYSE: NKE',
    tagline: 'Footwear · Apparel · Sport',
    available: true,
    stats: [['$51.4B', 'Revenue'], ['190+', 'Markets'], ['FY24', 'Filing']],
    mark: (
      <svg viewBox="0 0 36 36" fill="none" aria-hidden="true">
        <path d="M4 14C8 24 18 27.5 23 24.5C28.5 21.2 26 15.5 21.5 17.2C18 18.5 11.5 21.5 4 14Z" fill="currentColor" />
      </svg>
    ),
  },
];

function Intro({ onEnter, onDone, theme, onTheme }) {
  const [leaving, setLeaving] = useState(false);
  const [picked, setPicked] = useState(null);

  const pick = (c) => {
    if (!c || !c.available || leaving) return;
    setPicked(c.id);
    setLeaving(true);
    setTimeout(() => onEnter(c.id), 360);  // mount dashboard once the wipe covers
    setTimeout(onDone, 900);               // remove intro after the wipe lifts away
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Enter') pick(window.COMPANIES.find((c) => c.available));
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [leaving]);

  const avail = window.COMPANIES.filter((c) => c.available).length;

  return (
    <div className={'intro' + (leaving ? ' leave' : '')} data-screen-label="Intro — company selection">
      <header className="intro-top">
        <div className="intro-brand">
          <span className="intro-mark">
            <svg viewBox="0 0 36 36" fill="none" aria-hidden="true"><path d="M4 14C8 24 18 27.5 23 24.5C28.5 21.2 26 15.5 21.5 17.2C18 18.5 11.5 21.5 4 14Z" fill="currentColor" /></svg>
          </span>
          <span className="intro-word">Business Anatomy</span>
        </div>
        <div className="intro-top-r">
          <button className="intro-theme" onClick={onTheme} aria-label="Toggle light or dark" title="Toggle light / dark">
            <span className="thicon"><Icon name={theme === 'dark' ? 'sun' : 'moon'} /></span>
          </button>
        </div>
      </header>

      <main className="intro-main">
        <div className="intro-lede">
          <h1 className="intro-h1">
            <span className="ln"><b>Look inside the</b></span>
            <span className="ln"><b>companies behind</b></span>
            <span className="ln"><b>everyday life.</b></span>
          </h1>
          <p className="intro-sub">A guided teardown of how a business actually works — revenue, supply chain and strategy, laid out like an annual report you'd actually finish.</p>
        </div>

        <div className="intro-list">
          <div className="intro-list-h">
            <span>Select a company</span>
            <span className="ilh-count">{avail} available</span>
          </div>

          {window.COMPANIES.map((c, i) => (
            <button key={c.id} className={'trow' + (picked === c.id ? ' picked' : '')} onClick={() => pick(c)}>
              <span className="trow-no">{String(i + 1).padStart(2, '0')}</span>
              <span className="trow-mark">{c.mark}</span>
              <span className="trow-id">
                <b>{c.name}</b>
                <i>{c.tagline}</i>
              </span>
              <span className="trow-stats">
                {c.stats.map(([v, l]) => (
                  <span key={l}><b>{v}</b><i>{l}</i></span>
                ))}
              </span>
              <span className="trow-tick">{c.ticker}</span>
              <span className="trow-go"><Icon name="arrowRight" /></span>
            </button>
          ))}

          <div className="trow locked" aria-hidden="true">
            <span className="trow-no">{String(window.COMPANIES.length + 1).padStart(2, '0')}</span>
            <span className="trow-mark dash">+</span>
            <span className="trow-id"><b>More companies</b><i>In development</i></span>
            <span className="trow-soon">Soon</span>
          </div>
        </div>
      </main>

      <footer className="intro-foot">
        <span className="intro-hint"><kbd>↵</kbd> Press enter to open</span>
      </footer>

      <div className="intro-wipe" aria-hidden="true">
        <span className="intro-wipe-mark">
          <svg viewBox="0 0 36 36" fill="none"><path d="M4 14C8 24 18 27.5 23 24.5C28.5 21.2 26 15.5 21.5 17.2C18 18.5 11.5 21.5 4 14Z" fill="currentColor" /></svg>
        </span>
      </div>
    </div>
  );
}

window.Intro = Intro;
