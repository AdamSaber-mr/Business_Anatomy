/* ============================================================
   sections.jsx — the nine dashboard sections
   ============================================================ */

/* ---------------- 1 · Overview ---------------- */
/* Tappable "what is that, really?" — turns a huge number into something you can picture. */
function WhatIsThat({ headline, sub, items }) {
  const [i, setI] = useState(0);
  return (
    <div className="wit">
      <div className="wit-l">
        <div className="wit-num">{headline}</div>
        <div className="wit-sub">{sub}</div>
      </div>
      <div className="wit-r">
        <div className="wit-q">What is that, really?</div>
        <div className="wit-eq" key={i}>{items[i].text}</div>
        <div className="wit-chips">
          {items.map((it, idx) => (
            <button key={idx} className={"wit-chip" + (idx === i ? " on" : "")} onClick={() => setI(idx)}>{it.chip}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Overview() {
  const { year } = useContext(window.YearCtx);
  const k = window.overviewKPIs(year);
  const prev = year - 1;
  const earliest = year === window.YEARS[0];
  return (
    <React.Fragment>
      <div className="head">
        <h1>Overview</h1>
        <p>Nike doesn't make a single shoe itself. It designs them, adds its name, and lets factories around the world build them. That focus on ideas and brand is how it turns design into $51.4 billion a year, sold in more than 190 countries.</p>
      </div>

      <div className="grid g4">
        <KPI label="Total revenue" value={<span key={year}>$<Counter to={k.revenue.value} dec={1} />B</span>}
             hint="All the money Nike took in from sales in a year."
             change={k.revenue.delta ? k.revenue.delta.text : null} up={k.revenue.delta && k.revenue.delta.up}
             note={earliest ? 'Earliest year shown' : 'vs FY' + prev} />
        <KPI label="Net income" value={<span key={year}>$<Counter to={k.netIncome.value} dec={1} />B</span>}
             hint="The profit left over after every cost is paid."
             change={k.netIncome.delta ? k.netIncome.delta.text : null} up={k.netIncome.delta && k.netIncome.delta.up}
             note={earliest ? 'Earliest year shown' : 'vs FY' + prev} />
        <KPI label="Gross margin" value={<span key={year}><Counter to={k.grossMargin.value} dec={1} />%</span>}
             hint="Of each sale, the share left after paying to make the product."
             change={k.grossMargin.delta ? k.grossMargin.delta.text : null} up={k.grossMargin.delta && k.grossMargin.delta.up}
             note={earliest ? 'Earliest year shown' : 'vs FY' + prev} />
        <KPI label="Direct sales (DTC)" value={<span key={year}><Counter to={k.dtcShare.value} />%</span>}
             hint="How much Nike sells straight to you, through its own stores, app and site."
             change={k.dtcShare.delta ? k.dtcShare.delta.text : null} up={k.dtcShare.delta && k.dtcShare.delta.up}
             note={earliest ? 'Earliest year shown' : 'vs FY' + prev} />
      </div>

      <WhatIsThat headline="$51.4 billion" sub="Nike's yearly revenue" items={[
        { chip: 'In sneakers', text: "That's about 514 million pairs of $100 sneakers, enough for roughly one pair for every person in North and South America." },
        { chip: 'Per second', text: 'Nike takes in around $1,630 every single second, day and night, all year long.' },
        { chip: 'Versus a country', text: "It's larger than the entire yearly economy of a country like Iceland, Jamaica or Estonia." },
        { chip: 'Per person', text: 'Spread across everyone on Earth, that works out to about $6.40 from each of the 8 billion of us.' },
      ]} />

      <div className="grid g2-wide mt">
        <Card title="Revenue trajectory" sub="FY2018 to FY2024 · USD billions">
          <ChartBox name="growth" className="ch lg" />
          <YearBar />
        </Card>
        <Card title="At a glance">
          <StatLine rows={[
            { l: 'Factories worldwide', v: '505' },
            { l: 'Factories Nike owns', v: '0' },
            { l: 'Countries with retail', v: '190+' },
            { l: 'Employees worldwide', v: '79K+' },
            { l: 'Revenue added since FY18', v: '+$15.0B' },
          ]} />
        </Card>
      </div>

      <SecH>How the business works</SecH>
      <div className="flow">
        {[
          ['1', 'Design & innovate', '1,000+ engineers and designers at Nike HQ in Beaverton turn research into Air, Flyknit and React.'],
          ['2', 'Outsource production', '505 contract factories handle 100% of manufacturing, with Vietnam, Indonesia and China leading.'],
          ['3', 'Build the brand', 'Billions flow into athletes, campaigns and culture, the part rivals find hardest to copy.'],
          ['4', 'Sell to the world', '54% through wholesale partners, 42% direct via Nike.com and owned stores.'],
        ].map(([n, h, p]) => (
          <div className="step" key={n}><div className="n">{n}</div><h4>{h}</h4><p>{p}</p></div>
        ))}
      </div>
    </React.Fragment>
  );
}

/* ---------------- 2 · Supply Chain Map ---------------- */
function Supply() {
  const [selId, setSelId] = useState('vn');

  return (
    <React.Fragment>
      <div className="head head-tight">
        <h1>Supply Chain Map</h1>
        <p>From a sketch in Oregon to a box on your doorstep. Tap any point — or hit play to follow one pair the whole way.</p>
      </div>

      <div className="card map-card bigmap">
        <SupplyMap selectedId={selId} onSelect={setSelId} />
      </div>

      <SecH>How long does it take?</SecH>
      <div className="card">
        <div className="card-h"><h3>From first sketch to store shelf</h3><span className="sub">≈ 12–18 months end to end</span></div>
        <LeadTime />
      </div>

      <div className="grid g2-wide mt-l">
        <Card title="Where products are made" sub="% of units · FY2024">
          <ChartBox name="mfg" />
          <div className="legend">
            <span><i style={{ background: 'var(--solid)' }}></i>Footwear</span>
            <span><i style={{ background: 'var(--g3)' }}></i>Apparel</span>
          </div>
        </Card>
        <Card title="Sourcing footprint">
          <StatLine rows={[
            { l: 'Contract factories', v: '505' },
            { l: 'Manufacturing countries', v: '36' },
            { l: 'Tier-2 material suppliers', v: '169' },
            { l: 'Footwear from Vietnam', v: '50%' },
            { l: 'Distribution hubs', v: 'USA · EU' },
          ]} />
        </Card>
      </div>

      <DarkCallout title="An asset-light machine" stats={[
        { v: '0', k: 'Factories owned' },
        { v: '100%', k: 'Production outsourced' },
      ]}>
        Nike owns none of its 505 factories. Outsourcing manufacturing keeps fixed costs low and lets capital flow to design and brand, the two assets competitors can't easily replicate.
      </DarkCallout>
    </React.Fragment>
  );
}

/* Lead-time strip: design → shelf */
function LeadTime() {
  const steps = window.LEAD_TIME || [];
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), 90); return () => clearTimeout(t); }, []);
  return (
    <div className="leadtime">
      <div className="lt-bar">
        {steps.map((s, i) => (
          <div className="lt-seg" key={i} style={{ flexBasis: (show ? s.pct : 0) + '%' }}>
            <span className="lt-fill" data-i={i}></span>
          </div>
        ))}
      </div>
      <div className="lt-steps">
        {steps.map((s, i) => (
          <div className="lt-step" key={i}>
            <div className="lt-ic"><Icon name={s.ic} /></div>
            <div className="lt-ph">{s.ph}</div>
            <div className="lt-span">{s.span}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- 3 · Revenue ---------------- */
function Revenue() {
  return (
    <React.Fragment>
      <div className="head">
        <h1>Revenue</h1>
        <p>Here is where Nike's $51.4 billion comes from, split by product, place and how it's sold. Shoes bring in the most money, North America is the biggest region, and selling straight to you is slowly changing the mix.</p>
      </div>

      <div className="grid g2 mt">
        <Card title="By product category" sub="USD billions"><ChartBox name="cat" className="ch sm" /></Card>
        <Card title="By geography" sub="Share of revenue"><ChartBox name="region" className="ch sm" /></Card>
      </div>

      <SecH>Revenue through the year</SecH>
      <div className="grid g2-wide">
        <Card title="Revenue by quarter" sub="FY2024 · USD billions">
          <ChartBox name="quarterly" className="ch sm" />
        </Card>
        <Card title="Why it isn't even">
          <p className="lead-p">Nike's sales rise and fall with the sports calendar and shopping seasons. The first half of the fiscal year, which runs through the holidays, is the busiest, while the spring quarters are quieter.</p>
          <StatLine rows={[
            { l: 'Strongest quarter', v: 'Q1–Q2' },
            { l: 'Holiday & back-to-school', v: 'Q2' },
            { l: 'Quietest quarter', v: 'Q3' },
            { l: 'Full-year total', v: '$51.4B' },
          ]} />
        </Card>
      </div>

      <SecH>Where every $100 of revenue goes</SecH>
      <div className="card">
        <div className="card-h"><h3>From sale to profit</h3><span className="sub">FY2024 · simplified</span></div>
        <DollarFlow />
      </div>

      <SecH>Sales channels</SecH>
      <div className="grid g3">
        <Card className="tight" title="Wholesale">
          <div className="kpi" style={{ border: 'none', boxShadow: 'none', padding: 0 }}>
            <div className="val">$27.8B</div>
            <DeltaRow note="54% of revenue · Foot Locker, JD Sports & partners" />
          </div>
        </Card>
        <Card className="tight" title="Direct-to-consumer">
          <div className="kpi" style={{ border: 'none', boxShadow: 'none', padding: 0 }}>
            <div className="val">$21.5B</div>
            <DeltaRow change="growing" note="42% · Nike.com, app & stores" />
          </div>
        </Card>
        <Card className="tight" title="Other">
          <div className="kpi" style={{ border: 'none', boxShadow: 'none', padding: 0 }}>
            <div className="val">$2.1B</div>
            <DeltaRow note="4% · Licensing & corporate" />
          </div>
        </Card>
      </div>

      <Card className="mt" title="The shift to direct" sub="DTC share of revenue"><ChartBox name="dtc" className="ch sm" /><YearBar /></Card>
    </React.Fragment>
  );
}

/* "Where every $100 goes" — cost-to-profit waterfall in plain language */
function DollarFlow() {
  const split = window.DOLLAR_SPLIT || [];
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), 100); return () => clearTimeout(t); }, []);
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const shade = isDark
    ? ['#F0F0F2', '#C9C9CE', '#9A9AA2', '#6E6E76', '#4A4A52']
    : ['#111114', '#3A3A42', '#5A5A5F', '#8A8A90', '#C2C2C6'];
  return (
    <div className="dollar">
      <div className="dl-bar">
        {split.map((s, i) => (
          <div key={s.k} className="dl-seg" style={{ flexBasis: (show ? s.v : 0) + '%', background: shade[i] }}>
            <span className="dl-pct">${s.v}</span>
          </div>
        ))}
      </div>
      <div className="dl-rows">
        {split.map((s, i) => (
          <div className="dl-row" key={s.k}>
            <span className="dl-key"><i style={{ background: shade[i] }}></i>{s.k}</span>
            <span className="dl-note">{s.note}</span>
            <span className="dl-val">${s.v}</span>
          </div>
        ))}
      </div>
      <p className="dl-foot">Out of every <b>$100</b> Nike takes in, about <b>$11</b> is kept as profit. The rest pays to make, move, market and sell the product.</p>
    </div>
  );
}

/* ---------------- 4 · Market Position ---------------- */
function Market() {
  const reads = [
    ['The brand moat', 'Sixty-plus years of cultural relevance, athlete partnerships and "Just Do It" build loyalty that\'s almost impossible to replicate. The brand carries as much value as the product.'],
    ['Closest rival', 'Adidas, at $23.7B, is the clear number two, strong in football and fashion collabs. Nike outsizes them two-to-one but competes hard across Europe and streetwear.'],
    ['The DTC battleground', 'Every major brand is racing to own its channel. Whoever wins on apps, stores and data wins the next decade of sportswear. Right now, Nike leads.'],
    ['The insurgents', 'New Balance and On are growing fast on premium positioning; HOKA dominates performance running. Nike is defending several fronts at once.'],
  ];
  return (
    <React.Fragment>
      <div className="head">
        <h1>Market Position</h1>
        <p>Nike is the biggest sportswear company in the world. It sells about twice as much as Adidas, its closest rival, and far more than anyone else. Its real advantage isn't size, it's sixty years of building a brand people trust.</p>
      </div>

      <Card title="Nike vs. the field" sub="Annual revenue · USD billions"><ChartBox name="comp" className="ch lg" /></Card>

      <SecH>How they compare</SecH>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <CompareTable />
      </div>

      <SecH>Market share over time</SecH>
      <div className="grid g2-wide">
        <Card title="Share of the sportswear field" sub="% of the big-5 group">
          <ChartBox name="share" className="ch" />
          <div className="legend">
            <span><i style={{ background: 'var(--solid)', borderRadius: '2px' }}></i>Nike</span>
            <span><i style={{ background: 'var(--g2)', borderRadius: '2px' }}></i>Adidas</span>
            <span><i style={{ background: 'var(--g3)', borderRadius: '2px' }}></i>Others</span>
          </div>
        </Card>
        <Card title="The story of the gap">
          <p className="lead-p">A decade ago Nike led Adidas by roughly two-to-one. That gap has held, and even widened slightly, as Nike's direct-to-consumer push and digital membership pulled ahead.</p>
          <StatLine rows={[
            { l: 'Nike share, 2018 → 2024', v: '49% → 54%' },
            { l: 'Adidas share, 2024', v: '25%' },
            { l: 'Revenue lead over Adidas', v: '2.2×' },
            { l: 'Most valuable apparel brand', v: 'Nike' },
          ]} />
        </Card>
      </div>

      <SecH>What sets Nike apart</SecH>
      <div className="grid g2">
        {reads.map(([h, p]) => (
          <Card key={h} title={h}><p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: 'var(--muted)' }}>{p}</p></Card>
        ))}
      </div>
    </React.Fragment>
  );
}

/* Head-to-head comparison table */
function CompareTable() {
  const rows = window.COMPETITORS || [];
  return (
    <div className="ctable-wrap">
      <table className="ctable">
        <thead>
          <tr>
            <th className="cl">Company</th>
            <th>Revenue</th>
            <th>Gross margin</th>
            <th>Brand value</th>
            <th className="hide-sm">HQ</th>
            <th className="hide-sm">Founded</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.name} className={r.lead ? 'lead' : ''}>
              <td className="cl"><span className="cname">{r.name}{r.lead && <span className="tag">Leader</span>}</span></td>
              <td><b>${r.revenue}B</b></td>
              <td>{r.margin != null ? r.margin + '%' : '—'}</td>
              <td>${r.brand}B</td>
              <td className="hide-sm">{r.home}</td>
              <td className="hide-sm">{r.founded}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------------- 5 · Growth Timeline ---------------- */
function TimelineSection() {
  return (
    <React.Fragment>
      <div className="head">
        <h1>Growth Timeline</h1>
        <p>Sixty years of small decisions that added up. A $35 logo, a rookie named Jordan, and three words that became famous worldwide. This is how Nike grew from selling shoes out of a car to $51.4 billion.</p>
      </div>
      <Timeline />
    </React.Fragment>
  );
}

/* ---------------- 6 · Business Model ---------------- */
function Model() {
  const flow = [
    ['1', 'Create demand', 'Brand, athletes and innovation generate desire long before a product reaches a shelf.'],
    ['2', 'Design the product', 'Every product is engineered in-house at HQ, protecting the IP that drives the premium.'],
    ['3', 'Outsource the build', 'Contract factories manufacture at scale, so Nike never ties up capital in plants.'],
    ['4', 'Capture the sale', 'Wholesale gives reach; direct channels give margin, price control and customer data.'],
  ];
  const blocks = [
    ['users', 'Who it serves', ['Athletes & sports enthusiasts', 'Fashion-conscious youth', 'Sneaker & streetwear culture', 'Wholesale partners (B2B)']],
    ['brand', 'What it promises', ['High-performance gear', 'Iconic identity & status', 'Celebrity endorsements', 'Air · Flyknit · React']],
    ['revenue', 'Where money comes from', ['Footwear: 69%', 'Apparel: 27%', 'Equipment: 4%', 'Growing DTC premium']],
    ['lock', 'What it owns', ['The brand & Swoosh IP', 'Design & innovation talent', 'Global supplier network', 'Athlete partnerships & data']],
    ['lines', 'What it costs', ['Cost of goods ~$28B', 'Marketing & demand creation', 'Endorsement contracts', 'Supply-chain logistics']],
    ['brand', 'Why it wins', ['60+ years of brand equity', 'Emotional storytelling', 'Jordan Brand legacy', 'DTC ecosystem: app, stores, data']],
  ];
  return (
    <React.Fragment>
      <div className="head">
        <h1>Business Model</h1>
        <p>Underneath everything, Nike runs on one simple loop: create desire, design the product, let others build it, then sell it. The trick isn't making the shoe, it's owning what the shoe means to people.</p>
      </div>

      <SecH>How value flows</SecH>
      <div className="flow">
        {flow.map(([n, h, p]) => (<div className="step" key={n}><div className="n">{n}</div><h4>{h}</h4><p>{p}</p></div>))}
      </div>

      <SecH>The building blocks</SecH>
      <div className="blocks">
        {blocks.map(([ic, h, items], i) => (
          <div className="block" key={i}>
            <div className="bt"><span className="bic"><Icon name={ic} /></span><h4>{h}</h4></div>
            <ul>{items.map((it, j) => <li key={j}>{it}</li>)}</ul>
          </div>
        ))}
      </div>

      <SecH>Follow one pair of shoes</SecH>
      <div className="grid g2-wide">
        <Card title="The economics of a $100 sneaker" sub="Roughly, in plain numbers">
          <ShoeEcon />
        </Card>
        <Card title="Why asset-light wins">
          <p className="lead-p">Most people assume Nike owns giant factories. It doesn't, and that's the whole trick. Compare the two ways to run a shoe company:</p>
          <div className="vs">
            <div className="vs-col">
              <div className="vs-h own">Owning factories</div>
              <ul>
                <li>Billions tied up in buildings</li>
                <li>Hard to change location or volume</li>
                <li>Risk sits on your balance sheet</li>
                <li>Money spent on machines, not ideas</li>
              </ul>
            </div>
            <div className="vs-col">
              <div className="vs-h light">Nike's asset-light way</div>
              <ul>
                <li>Almost no factory costs to carry</li>
                <li>Scale up or move production fast</li>
                <li>Risk shared with suppliers</li>
                <li>Capital flows to brand &amp; design</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </React.Fragment>
  );
}

/* The journey of one pair of shoes, in money — interactive bar */
function ShoeEcon() {
  const all = window.SHOE_ECON || [];
  const parts = all.filter(r => r.k !== 'Retail price').map((r, i) => ({
    ...r,
    n: Number(String(r.v).replace(/[^0-9.]/g, '')) || 0,
    ic: ['factory', 'truck', 'brand', 'revenue', 'bag'][i] || 'box',
  }));
  const total = parts.reduce((s, p) => s + p.n, 0) || 1;
  const [active, setActive] = useState(0);   // start on the first slice so the detail is filled by default
  const cur = active != null ? parts[active] : null;
  return (
    <div className="shoe2">
      <div className="shoe2-top">
        <span className="shoe2-lab">Where your $100 goes</span>
        <span className="shoe2-hint">Hover a part</span>
      </div>
      <div className="shoe2-bar" onMouseLeave={() => setActive(0)}>
        {parts.map((p, i) => (
          <button key={p.k} className={"shoe2-seg" + (active === i ? " on" : "") + (active != null && active !== i ? " dim" : "")}
                  style={{ flexBasis: (p.n / total * 100) + '%' }}
                  onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)}
                  onClick={() => setActive(i)} aria-label={p.k + ' ' + p.v}>
            <span className="shoe2-seg-v">{p.v.replace('~', '')}</span>
          </button>
        ))}
      </div>
      <div className={"shoe2-detail" + (cur ? " filled" : "")}>
        {cur ? (
          <React.Fragment>
            <span className="shoe2-ic"><Icon name={cur.ic} /></span>
            <div className="shoe2-dtxt">
              <b>{cur.k} <span>{cur.v}</span></b>
              <p>{cur.note}</p>
            </div>
          </React.Fragment>
        ) : (
          <span className="shoe2-empty">Hover a slice of the bar to see where that part of your $100 goes.</span>
        )}
      </div>
      <p className="dl-foot">When Nike sells a pair <b>directly</b> through its own app or store, it keeps the shop's slice too, so its profit roughly doubles. That gap is exactly why Nike is pushing so hard into selling direct.</p>
    </div>
  );
}

/* ---------------- 7 · Brand & Marketing ---------------- */
function Brand() {
  const athletes = [
    ['ath-mj', 'Michael Jordan', 'Basketball', 'assets/athletes/mikejordan.png'],
    ['ath-lj', 'LeBron James', 'Basketball', 'assets/athletes/lebronjames.png'],
    ['ath-cr', 'C. Ronaldo', 'Football', 'assets/athletes/cristionronalde.png'],
    ['ath-sw', 'Serena Williams', 'Tennis', 'assets/athletes/seranawilliams-removebg-preview.png'],
    ['ath-km', 'Kylian Mbappé', 'Football', 'assets/athletes/mbappe.webp'],
  ];
  const campaigns = [
    ['1988', '"Just Do It" launches', 'Three simple words pitched to everyone from pro athletes to weekend joggers. It gave Nike a voice anyone could relate to.', 'Revenue $877M → $3B+ in three years'],
    ['1999', '"Failure" · Michael Jordan', 'Jordan lists every shot he missed and every game he lost, then says that is exactly why he succeeds. It reframed greatness around effort, not perfection.', 'One of the most-quoted sports ads ever'],
    ['2018', '"Dream Crazy" · Colin Kaepernick', 'Nike backed a divisive athlete on principle. Some burned shoes; far more bought them. A lesson in standing for something.', 'Reported ~$6B jump in brand value'],
    ['2020', '"You Can\'t Stop Us"', 'A split-screen film stitching two athletes into one seamless motion, a message of unity during the pandemic.', '~58M views in its first weeks'],
  ];
  return (
    <React.Fragment>
      <div className="head">
        <h1>Brand &amp; Marketing</h1>
        <p>Nike spends billions making people want its products, more than most rivals earn in profit. Famous athletes, big campaigns and cultural moments are why it can charge premium prices.</p>
      </div>

      <div className="grid g4">
        <KPI label="Marketing spend" value="$4.7B" hint="What Nike pays each year to make people want its products. Up 9% in FY2025." note="FY2025 · Nike 10-K" />
        <KPI label="Brand value" value="$33.7B" hint="What the Nike name alone is worth according to Interbrand. Down from a peak of $53B in 2023." note="Interbrand 2025" />
        <KPI label="Social following" value="300M+" hint="People following Nike across all social media platforms." note="All platforms" />
        <KPI label="Jordan Brand" value="$7B" hint="Yearly sales from the Air Jordan line at its peak in FY2024. Declined 16% in FY2025." note="FY2024 peak · Sportico" />
      </div>

      <div className="grid g2-wide mt">
        <Card title="Marketing spend over time" sub="Demand creation · USD billions"><ChartBox name="mktg" /><YearBar /></Card>
        <Card title="Signature athletes">
          <div className="athletes">
            {athletes.map(([id, n, role, src]) => (
              <div className="ath" key={id}>
                <image-slot id={id} shape="circle" placeholder="Drop photo" src={src}></image-slot>
                <div className="an">{n}</div>
                <div className="as">{role}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt" title="Campaigns that moved the brand">
        <div className="clist">
          {campaigns.map(([yr, cn, p, impact]) => (
            <div className="ci" key={yr}><span className="yr">{yr}</span><div><div className="cn">{cn}</div><p>{p}</p><div className="ci-impact"><Icon name="caretUp" sw={2.4} />{impact}</div></div></div>
          ))}
        </div>
      </Card>

      <SecH>The biggest endorsement deals</SecH>
      <div className="deals">
        {(window.DEALS || []).map((d) => (
          <div className="deal" key={d.who}>
            <div className="deal-top"><span className="deal-sport">{d.sport}</span><span className="deal-amt">{d.amount}</span></div>
            <h4>{d.who}</h4>
            <p>{d.note}</p>
          </div>
        ))}
      </div>
    </React.Fragment>
  );
}

/* ---------------- 8 · Digital Ecosystem ---------------- */
function SplitRing({ member }) {
  const R = 70, C = 2 * Math.PI * R;
  const [p, setP] = useState(0);
  useEffect(() => { const t = setTimeout(() => setP(member), 100); return () => clearTimeout(t); }, [member]);
  const memberLen = C * (p / 100);
  return (
    <div className="splitring">
      <svg viewBox="0 0 180 180">
        <circle cx="90" cy="90" r={R} fill="none" stroke="var(--line-2)" strokeWidth="22" />
        <circle cx="90" cy="90" r={R} fill="none" stroke="var(--ink)" strokeWidth="22"
          strokeDasharray={`${memberLen} ${C - memberLen}`} transform="rotate(-90 90 90)"
          style={{ transition: 'stroke-dasharray 1.15s cubic-bezier(.2,.7,.2,1)' }} />
        <text x="90" y="84" textAnchor="middle" style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: '30px', letterSpacing: '-1px', fill: 'var(--ink)' }}>{member}%</text>
        <text x="90" y="106" textAnchor="middle" style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: '12px', fill: 'var(--muted)' }}>members</text>
      </svg>
      <div className="ringlegend">
        <span><i style={{ background: 'var(--solid)' }}></i>Members</span>
        <span><i style={{ background: 'var(--line-2)' }}></i>Guests</span>
      </div>
    </div>
  );
}

function Digital() {
  const apps = [
    ['digital', 'Nike App', '300M+ members', 'dig-nikeapp', 'Drop a Nike App screen', 'assets/app/nikeapp.png'],
    ['run', 'Run Club', 'Coaching & tracking', 'dig-runclub', 'Drop a Run Club screen', 'assets/app/runclubnike.png'],
    ['training', 'Training Club', 'Free workouts', 'dig-training', 'Drop a Training screen', 'assets/app/nike-training-club-app.png'],
    ['bag', 'SNKRS', 'Hype sneaker drops', 'dig-snkrs', 'Drop a SNKRS screen', 'assets/app/nike-snkrs-app.png'],
  ];
  return (
    <React.Fragment>
      <div className="head">
        <h1>Digital Ecosystem</h1>
        <p>Nike's apps and membership turn one-time shoppers into regulars it actually knows. With 300 million members across its ecosystem, digital is the highest-margin part of the business — even as Nike repositions it as a full-price channel.</p>
      </div>

      <div className="grid g2-wide">
        <Card title="Nike Membership">
          <div className="bignum"><Counter to={300} />M<span className="u">+</span></div>
          <div className="biglabel">members across the Nike ecosystem</div>
          <p className="bigcap">Members drive the majority of Nike.com sales and spend more than guests — up from 160M in 2024 to <b>300M+ in 2025</b>. (Nike 10-K FY2025)</p>
          <div className="splitbar">
            <div className="seg a" style={{ width: '50%' }}>Members 50%</div>
            <div className="seg b" style={{ width: '50%' }}>Guests 50%</div>
          </div>
          <div className="splitkey"><span>Share of Nike.com sales</span><span>FY2024</span></div>
        </Card>
        <Card title="Member share of digital sales">
          <SplitRing member={50} />
          <p className="ring-cap">Half of every dollar spent on Nike.com now comes from a logged-in member.</p>
        </Card>
      </div>

      <SecH>The app family</SecH>
      <div className="phones">
        {apps.map(([ic, name, metric, id, ph, src]) => (
          <div className="phone-wrap" key={id}>
            <div className="phone">
              <div className="notch"></div>
              <div className="screen">
                <image-slot id={id} shape="rect" placeholder={ph} src={src}></image-slot>
              </div>
            </div>
            <div className="phone-meta">
              <div className="pn"><Icon name={ic} />{name}</div>
              <div className="pm">{metric}</div>
            </div>
          </div>
        ))}
      </div>

      <SecH>Why people become members</SecH>
      <div className="grid g4">
        {[
          ['bag', 'Exclusive access', 'Members get first dibs on limited sneaker drops and member-only products.'],
          ['truck', 'Free shipping & returns', 'Perks that make buying direct from Nike easier than going to a shop.'],
          ['training', 'Free apps & coaching', 'Run Club and Training Club give real value for free, and keep you in the ecosystem.'],
          ['users', 'Personalised experience', 'The more you use it, the better Nike tailors products and recommendations to you.'],
        ].map(([ic, h, p]) => (
          <div className="perk" key={h}>
            <div className="perk-ic"><Icon name={ic} /></div>
            <h4>{h}</h4>
            <p>{p}</p>
          </div>
        ))}
      </div>

      <Card className="mt-l" title="Digital revenue growth" sub="USD billions"><ChartBox name="digital" /><YearBar /></Card>

      <SecH>How Nike went digital</SecH>
      <div className="dtl">
        {(window.DIGITAL_STEPS || []).map((s) => (
          <div className="dtl-item" key={s.y}>
            <div className="dtl-year">{s.y}</div>
            <div className="dtl-line"><span className="dtl-dot"></span></div>
            <div className="dtl-body"><h4>{s.t}</h4><p>{s.d}</p></div>
          </div>
        ))}
      </div>

      <DarkCallout title="Why digital wins" stats={[
        { v: '~75%', k: 'Gross margin on DTC' },
        { v: '300M+', k: 'Members in ecosystem' },
      ]}>
        A direct sale on Nike.com keeps roughly 75% gross margin versus ~44% overall, controls the price and turns an anonymous buyer into a known member. Nike is now repositioning digital as a full-price premium channel to protect those margins. (Nike 10-K FY2025)
      </DarkCallout>
    </React.Fragment>
  );
}

/* ---------------- 9 · Sustainability ---------------- */
function Countdown({ targetYear }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 60000); return () => clearInterval(t); }, []);
  const target = new Date(targetYear, 0, 1);
  const start = new Date(2020, 0, 1);
  const days = Math.max(0, Math.floor((target - now) / 86400000));
  const years = Math.floor(days / 365);
  const months = Math.floor((days - years * 365) / 30);
  const [prog, setProg] = useState(0);
  useEffect(() => {
    const pct = Math.min(100, Math.max(0, (now - start) / (target - start) * 100));
    const t = setTimeout(() => setProg(pct), 120);
    return () => clearTimeout(t);
  }, [now, targetYear]);
  return (
    <div className="countdown">
      <div className="cd-days"><Counter to={days} /><span className="u">days to go</span></div>
      <div className="cd-sub">about {years} years, {months} months until the {targetYear} science-based targets</div>
      <div className="cd-decade">
        <div className="cd-track"><i style={{ width: prog.toFixed(1) + '%' }}></i></div>
        <div className="cd-ends"><span>2020 baseline</span><span>{targetYear} target</span></div>
      </div>
      <p className="cd-note">Nike's <b>2025 "Move to Zero" targets</b> are largely met, and the journey now runs toward a <b>{targetYear}</b> interim goal and <b>net-zero carbon by 2050</b>.</p>
    </div>
  );
}

function Sustainability() {
  const gauges = [
    [96, 'Renewable energy', 'Owned facilities'],
    [99, 'Waste diverted', 'From landfill in manufacturing'],
    [48, 'Carbon reduction', 'Owned operations vs 2015'],
    [60, 'Sustainable materials', 'Recycled key materials'],
  ];
  return (
    <React.Fragment>
      <div className="head">
        <h1>Sustainability</h1>
        <p>"Move to Zero" is Nike's journey toward zero carbon and zero waste. Each dial shows how far along Nike is against its public environmental targets.</p>
      </div>

      <div className="explain">
        <div className="explain-ic"><Icon name="sustainability" /></div>
        <p>In plain terms: Nike is trying to make shoes and clothes <b>without adding carbon to the air or sending waste to the dump</b>. "Move to Zero" is the name for everything it does to get there — cleaner energy, recycled materials and giving old products a second life.</p>
      </div>

      <div className="gauges">
        {gauges.map(([v, label, sub]) => <Gauge key={label} value={v} label={label} sub={sub} />)}
      </div>

      <SecH>Ideas you can actually see</SecH>
      <div className="grid g2">
        {(window.INITIATIVES || []).map((it) => (
          <div className="init" key={it.name}>
            <div className="init-ic"><Icon name={it.ic} /></div>
            <div><h4>{it.name}</h4><p>{it.d}</p></div>
          </div>
        ))}
      </div>

      <div className="grid g2-wide mt-l">
        <Card title="The road ahead">
          <Countdown targetYear={2030} />
        </Card>
        <Card title="Move to Zero pillars">
          <StatLine rows={[
            { l: 'Shoes refurbished & resold', v: 'Nike Refurbished' },
            { l: 'Recycled-material program', v: 'Nike Grind' },
            { l: 'Manufacturing waste recycled', v: '99%+' },
            { l: 'Net-zero carbon target', v: '2050' },
          ]} />
        </Card>
      </div>
    </React.Fragment>
  );
}

/* ---------------- 10 · The Journey ---------------- */
const JOURNEY = [
  ['pencil', 'On a designer\'s desk · Oregon', 'It starts as a sketch',
    "Long before a shoe exists, it's just an idea on paper. At Nike's headquarters in Oregon, designers draw the shape, choose the colours and decide how it should feel to run in. Engineers then turn those drawings into a precise digital blueprint — a recipe that the factories will follow exactly."],
  ['box', 'Suppliers around the world', 'The materials come together',
    "A single sneaker is made of dozens of parts: rubber for the sole, foam for cushioning, fabric and laces for the top. Nike doesn't make any of these itself. Specialist suppliers, mostly across Asia, produce the raw materials and ship them to the factory that will assemble the shoe."],
  ['factory', 'A contract factory · Vietnam', 'It gets built',
    "At a factory, and Nike owns none of them, workers cut, stitch and glue the parts into a finished shoe. This is where the blueprint becomes a real, physical product, often thousands of identical pairs flowing down a single production line every day."],
  ['shieldCheck', 'On the factory floor', 'Every pair is checked',
    "Before anything leaves the building, Nike's quality and compliance teams inspect both the shoes and the conditions they were made in. A pair that doesn't meet the standard never makes it into a box — and factories are held to rules on safety and fair work."],
  ['truck', 'Ships, planes and trucks', 'The long trip begins',
    "The finished shoes are packed into boxes and loaded onto huge cargo ships or planes. They cross oceans and continents, a journey of thousands of kilometres, heading toward the part of the world where they'll eventually be sold."],
  ['warehouse', 'A distribution centre · USA or Europe', 'Sorted and stored',
    "At a giant distribution centre, every box is scanned, sorted and stored on towering shelves. The instant someone places an order online, or a shop runs low on stock, the right pair is picked and sent off on its very last leg."],
  ['home', 'A store shelf or your front door', 'It reaches you',
    "Finally, the shoe arrives. It's either on the wall of a Nike store or a partner like Foot Locker, or in a parcel handed to you at your door after you tapped \u2018buy\u2019 on Nike.com. The journey that began with a single pencil line ends on your feet."],
];

function Journey() {
  const total = JOURNEY.length;
  const [step, setStep] = useState(() => {
    const n = parseInt(localStorage.getItem('nba_journey') || '0', 10);
    return Number.isFinite(n) && n >= 0 && n < total ? n : 0;
  });
  const go = (n) => {
    const c = Math.max(0, Math.min(total - 1, n));
    setStep(c);
    try { localStorage.setItem('nba_journey', String(c)); } catch (e) {}
  };
  const [ic, scene, title, story] = JOURNEY[step];
  const meta = (window.JOURNEY_STOPS || [])[step] || {};
  const atEnd = step === total - 1;

  return (
    <React.Fragment>
      <div className="head">
        <h1>The Journey</h1>
        <p>Ever wondered how a pair of trainers actually reaches you? Follow one product all the way, from a blank sheet of paper in Oregon to the box at your front door. Tap through each stop below.</p>
      </div>

      <div className="jx">
        <div className="jx-track">
          <div className="jx-rail"><span className="jx-rail-fill" style={{ width: (step / (total - 1)) * 100 + '%' }}></span></div>
          {JOURNEY.map(([sic], i) => {
            const last = i === total - 1;
            return (
              <button key={i} className={"jx-node" + (i === step ? " active" : "") + (i < step ? " done" : "")}
                      onClick={() => go(i)} aria-label={"Stop " + (i + 1)} title={JOURNEY[i][2]}>
                <span className="jx-node-ic"><Icon name={last ? 'home' : sic} /></span>
              </button>
            );
          })}
        </div>

        <div className="jx-stage" key={step}>
          <div className="jx-card">
            <span className="jx-count">Stop {step + 1} of {total}</span>
            <span className="jx-scene"><Icon name={ic} />{scene}</span>
            <h3>{title}</h3>
            <p>{story}</p>
          </div>
          <div className={"jx-side" + (atEnd ? " arrived" : "")} aria-hidden="true">
            <div className="jx-map">
              {meta.ll && <JourneyMap stop={meta} ic={ic} />}
              <div className="jx-art-tag"><Icon name={ic} /><span>{meta.place}</span></div>
              {atEnd && <span className="jx-art-badge">Delivered</span>}
            </div>
            <div className="jx-facts">
              <div><span className="jf-k">Where</span><span className="jf-v">{meta.place}</span></div>
              <div><span className="jf-k">Distance</span><span className="jf-v">{meta.far}</span></div>
              <div><span className="jf-k">Time</span><span className="jf-v">{meta.dur}</span></div>
            </div>
          </div>
        </div>

        <div className="jx-ctrl">
          <button className="jx-btn ghost" onClick={() => go(step - 1)} disabled={step === 0}>
            <Icon name="arrowRight" /><span>Back</span>
          </button>
          <span className="jx-progress">{step + 1} / {total}</span>
          {atEnd
            ? <button className="jx-btn" onClick={() => go(0)}><span>Start over</span><Icon name="timeline" /></button>
            : <button className="jx-btn" onClick={() => go(step + 1)}><span>Next stop</span><Icon name="arrowRight" /></button>}
        </div>
      </div>
    </React.Fragment>
  );
}

/* ---------------- 11 · Business Basics ---------------- */
const TERMS = [
  ['Revenue', 'also "turnover"', 'All the money a company brings in from selling its products, before any costs are subtracted. Nike took in $51.4 billion last year, and that figure is its revenue.', 'overview', 'See it in Overview'],
  ['Supply chain', null, 'The full path a product travels to exist and reach you: raw materials, factory, quality checks, shipping and storage. Every step it takes to get made and delivered.', 'supply', 'See it in Supply Chain Map'],
  ['Business model', null, 'The simple logic of how a company makes money: what it sells, who it sells to, and how it keeps more than it spends. Nike\u2019s model is to design and sell, but never manufacture.', 'model', 'See it in Business Model'],
  ['Market share', 'or "market position"', 'How big a slice of an industry one company holds compared to its rivals. Nike sells more than twice as much as its nearest competitor, Adidas.', 'market', 'See it in Market Position'],
  ['Direct-to-Consumer', 'DTC', 'When a brand sells straight to you, through its own website, app or stores, instead of through another shop. It keeps more profit and lets the brand learn who its customers are.', 'revenue', 'See it in Revenue'],
  ['Wholesale', null, 'Selling in bulk to other shops (like Foot Locker), who then sell to you. It reaches far more places, but the brand earns less on each pair than selling direct.', 'revenue', 'See it in Revenue'],
  ['Branding', null, 'Everything that makes people feel something about a name: the logo, the athletes, the adverts. Strong branding is why Nike can charge more than an unknown maker for a similar shoe.', 'brand', 'See it in Brand & Marketing'],
  ['Gross margin', null, 'Out of every dollar earned from a sale, how much is left after paying to make the product. A higher margin means more money to reinvest in design and marketing.', 'overview', 'See it in Overview'],
  ['Asset-light', null, 'A company that avoids owning expensive things like factories. Nike designs and sells, but lets other companies own the plants, so its money flows into ideas and brand instead.', 'supply', 'See it in Supply Chain Map'],
  ['Outsourcing', null, 'Paying another company to do a job for you, such as manufacturing. Nike outsources 100% of its production to contract factories it does not own.', 'supply', 'See it in Supply Chain Map'],
];

function Basics() {
  const go = (id) => { if (window.dashboardNav) window.dashboardNav(id); };
  return (
    <React.Fragment>
      <div className="head">
        <h1>Business Basics</h1>
        <p>A plain-language glossary of the ideas this dashboard is built on. No background needed. Read these and every other section will make complete sense. Tap a term to jump straight to where it shows up.</p>
      </div>

      <div className="glossary">
        {TERMS.map(([word, alt, def, target, refLabel]) => (
          <div className="term" key={word}>
            <div className="tword"><h3>{word}</h3>{alt && <span className="alt">{alt}</span>}</div>
            <p>{def}</p>
            <button className="ref" onClick={() => go(target)}>
              <span className="lbl">{refLabel}</span><Icon name="arrowRight" />
            </button>
          </div>
        ))}
      </div>
    </React.Fragment>
  );
}

const SECTIONS = [
  { id: 'overview', label: 'Overview', icon: 'overview', Comp: Overview, yearAware: true },
  { id: 'supply', label: 'Supply Chain Map', icon: 'supply', Comp: Supply },
  { id: 'revenue', label: 'Revenue', icon: 'revenue', Comp: Revenue, yearAware: true },
  { id: 'market', label: 'Market Position', icon: 'market', Comp: Market },
  { id: 'timeline', label: 'Growth Timeline', icon: 'timeline', Comp: TimelineSection },
  { id: 'model', label: 'Business Model', icon: 'model', Comp: Model },
  { id: 'brand', label: 'Brand & Marketing', icon: 'brand', Comp: Brand, yearAware: true },
  { id: 'digital', label: 'Digital Ecosystem', icon: 'digital', Comp: Digital, yearAware: true },
  { id: 'sustainability', label: 'Sustainability', icon: 'sustainability', Comp: Sustainability },
  { id: 'journey', label: 'The Journey', icon: 'journey', Comp: Journey },
  { id: 'basics', label: 'Business Basics', icon: 'basics', Comp: Basics },
];

Object.assign(window, { SECTIONS, TERMS });
