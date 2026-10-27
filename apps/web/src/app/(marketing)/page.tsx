import Link from "next/link";
import { Faq, HeroLive, Pipeline, UseCases } from "@/components/marketing-client";
import { Arrow } from "@/components/ui";

const marquee = [
  "Robinhood Chain",
  "pons launchpad",
  "Zetaris",
  "World Model",
  "H-MEM",
  "Platform posts",
  "Tracking links",
  "Signed wallets",
  "Domain engine",
];

function HeroVisual() {
  return (
    <div className="stack">
      <div className="lane-card" data-parallax="-0.06">
        <div data-reveal data-delay="0.35">
          <div className="lane-top">
            <span className="lane-name" style={{ color: "var(--delivery)" }}>
              <i className="dot" /> Delivery
            </span>
            <span className="pill good">2 verified</span>
          </div>
          <div className="lane-big">3 of 4 commitments fulfilled</div>
          <p className="lane-sub">Pinned post rests on a partner screenshot only.</p>
          <div className="bars" style={{ color: "var(--delivery)" }}>
            {[100, 100, 45, 100].map((h, i) => (
              <i key={i} style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
      </div>
      <div className="lane-card" data-parallax="0.05">
        <div data-reveal data-delay="0.55">
          <div className="lane-top">
            <span className="lane-name" style={{ color: "var(--market)" }}>
              <i className="dot" /> Observed activity
            </span>
            <span className="pill info">Onchain</span>
          </div>
          <div className="lane-big">214 swaps in the window</div>
          <p className="lane-sub">Descriptive. Not attributed to the campaign.</p>
          <div className="bars" style={{ color: "var(--market)" }}>
            {[20, 35, 28, 60, 44, 90, 52, 38, 66, 48, 30, 40].map((h, i) => (
              <i key={i} style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
      </div>
      <div className="lane-card" data-parallax="-0.03">
        <div data-reveal data-delay="0.75">
          <div className="lane-top">
            <span className="lane-name" style={{ color: "var(--attribution)" }}>
              <i className="dot" /> Attribution
            </span>
            <span className="pill warn">No tracking</span>
          </div>
          <div className="lane-big">Unknown, not zero</div>
          <p className="lane-sub">Nothing can honestly be tied to this campaign.</p>
        </div>
      </div>
    </div>
  );
}

function Frame() {
  const rows = [
    ["done", "Validate inputs", "0.2s"],
    ["done", "Fetch post evidence", "3.1s"],
    ["done", "Sync chain window", "5.8s"],
    ["run", "Federated query", "…"],
    ["", "Compute metrics", ""],
    ["", "Validate language", ""],
  ];
  return (
    <div className="frame" data-zoom>
      <div className="frame-bar">
        <i />
        <i />
        <i />
        <span className="url">afterpost.app/campaigns/launch-week/investigate</span>
      </div>
      <div className="frame-body">
        <div>
          <span className="eyebrow">Campaign</span>
          <p style={{ marginTop: 12, fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 20, lineHeight: 1.1 }}>Launch week amplification</p>
          <p className="lane-sub" style={{ marginTop: 10 }}>Northwind Signals · 6–20 Oct</p>
          <span className="pill info" style={{ marginTop: 16 }}>Recorded run</span>
          <p
            style={{
              marginTop: 12,
              fontFamily: "var(--font-display)",
              fontSize: 26,
              lineHeight: 1.1,
            }}
          >
            Launch week amplification
          </p>
          <p className="lane-sub" style={{ marginTop: 10 }}>
            Northwind Signals · 6–20 Oct
          </p>
          <span className="pill info" style={{ marginTop: 16 }}>
            Recorded run
          </span>
        </div>
        <div>
          <span className="eyebrow">Run trace</span>
          <div className="trace">
            {rows.map(([s, l, d]) => (
              <div key={l} className={`trace-row ${s}`}>
                <i className="check" />
                <span>{l}</span>
                <span className="mono">{d}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <span className="eyebrow">Findings</span>
          <div style={{ display: "grid", gap: 12, marginTop: 14 }}>
            {[
              ["delivery", "Two posts retrieved from platform and match the terms."],
              ["delivery", "Pinned post: partner screenshot only. Unresolved."],
              ["market", "214 swaps observed. Not attributed."],
            ].map(([l, t]) => (
              <div key={t} className="mini-card" style={{ padding: 14 }}>
                <span className={`pill ${l}`} style={{ height: 22, fontSize: 11 }}>
                  {l === "delivery" ? "Delivery" : "Observed"}
                </span>
                <p style={{ fontSize: 13.5, marginTop: 8, color: "var(--muted)" }}>{t}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const lanes = [
  {
    k: "delivery",
    n: "01",
    t: "Delivery",
    d: "Were the contracted posts, threads and spaces actually published? Each is checked against the platform, then marked verified, confirmed by a person, or only partner-reported.",
    f: ["Fulfilment per deliverable", "Late and missed tracked separately"],
  },
  {
    k: "market",
    n: "02",
    t: "Observed activity",
    d: "Real swaps, transfers and holder behaviour from the chain in the same window. Useful context, never claimed as the campaign's doing.",
    f: ["Routers never counted as buyers", "Future horizons shown as PENDING"],
  },
  {
    k: "attribution",
    n: "03",
    t: "Attribution",
    d: "Only for campaigns with tracking links and signed wallet opt-in. Everything else is Unknown, because a missing measurement is not a measurement of zero.",
    f: ["Wallet-signed opt-in required", "Unknown is never shown as 0"],
  },
] as const;

const compare = [
  [
    "Posts delivered?",
    "Screenshots in a chat thread",
    "Retrieved from the platform, labelled by trust level",
  ],
  [
    "What the market did",
    "A price chart and a feeling",
    "Swaps and holders from the chain, routers excluded",
  ],
  ["What the campaign caused", "A confident guess", "Tracked wallets only, otherwise Unknown"],
  ["Renew or not?", "Gut call in a call", "A suggestion with its reasons and limitations"],
  ["Audit trail", "Whoever remembers", "Every finding linked to evidence, versioned"],
];

export default function Landing() {
  return (
    <>
      <section className="hero">
        <div className="glow a" style={{ width: 700, height: 700, top: "-10%", right: "-8%" }} />
        <div className="glow b" style={{ width: 520, height: 520, bottom: "-12%", left: "-10%" }} />
        <div className="wrap hero-grid">
          <div>
            <span className="eyebrow" data-reveal>
              Campaign forensics for token teams
            </span>
            <h1 className="display h-xl" data-split>
              Know what your promoters <em>actually</em> delivered.
            </h1>
            <p className="lead" data-reveal data-delay="0.35">
              Afterpost investigates one paid campaign against real evidence: the posts that went
              live, the transactions you can verify, and everything that stays unknown, kept apart
              so nothing is blended into a made-up score.
            </p>
            <div className="hero-actions" data-reveal data-delay="0.5">
              <Link href="/app" className="btn primary lg" data-magnetic>
                Open the workspace <Arrow />
              </Link>
              <Link href="/app/campaigns/cmp_launch/investigate" className="btn lg">
                Watch a sample run
              </Link>
            </div>
            <p className="hero-note" data-reveal data-delay="0.6">
              <span className="pill muted" style={{ height: 22, fontSize: 11 }}>
                Fixture data
              </span>{" "}
              Sample campaigns, no account needed.
            </p>
            <HeroLive />
          </div>
          <HeroVisual />
        </div>
      </section>

      <div className="marquee" aria-label="Sources Afterpost reads from">
        <div className="marquee-track" data-marquee>
          {[...marquee, ...marquee].map((m, i) => (
            <span key={i}>{m}</span>
          ))}
        </div>
      </div>

      <section className="sec zoom-sec">
        <div className="wrap">
          <div className="sec-head center">
            <span className="eyebrow" data-reveal>
              The investigation
            </span>
            <h2 className="display h-lg" data-split>
              From screenshots and hunches to a sourced case file.
            </h2>
            <p className="lead" data-reveal>
              Watch the agent work through each source. Every step is timestamped, labelled with
              where it came from, and replayable.
            </p>
          </div>
          <div className="zoom-stage">
            <Frame />
          </div>
        </div>
      </section>

      <section
        className="sec"
        id="roles"
        style={{ background: "var(--bg-2)", borderBlock: "1px solid var(--border)" }}
      >
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow" data-reveal>
              Who it&apos;s for
            </span>
            <h2 className="display h-lg" data-split>
              One case file, four ways to use it.
            </h2>
          </div>
          <UseCases />
        </div>
      </section>

      <section className="sec" id="lanes" style={{ overflow: "clip" }}>
        <div className="glow c" style={{ width: 600, height: 600, top: "20%", left: "-14%" }} />
        <div className="wrap">
          <div className="sec-head center">
            <span className="eyebrow" data-reveal>
              Three lanes, never merged
            </span>
            <h2 className="display h-lg" data-split>
              Different evidence deserves different <em>certainty</em>.
            </h2>
            <p className="lead" data-reveal>
              Each lane carries its own coverage and its own limits. Afterpost refuses to average
              them into one number.
            </p>
          </div>
          <div className="lanes3" data-stagger="0.14">
            {lanes.map((l) => (
              <article
                className="lane-panel"
                key={l.k}
                style={{ ["--lane" as string]: `var(--${l.k})` }}
              >
                <span className="lane-name" style={{ color: `var(--${l.k})` }}>
                  <i className="dot" /> Lane {l.n}
                </span>
                <h3>{l.t}</h3>
                <p>{l.d}</p>
                <div className="foot">
                  {l.f.map((x) => (
                    <span key={x}>→ {x}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
          <div className="no-score" data-reveal>
            <s>Score: 78/100</s>
            <span>That number does not exist here, and never will.</span>
          </div>
        </div>
      </section>

      <section
        className="sec"
        id="pipeline"
        style={{
          background: "var(--bg-2)",
          borderBlock: "1px solid var(--border)",
          paddingBottom: 60,
        }}
      >
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow" data-reveal>
              How it works
            </span>
            <h2 className="display h-lg" data-split>
              Eight steps, each one you can inspect.
            </h2>
          </div>
          <Pipeline />
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="sec-head center">
            <span className="eyebrow" data-reveal>
              Built on principles
            </span>
            <h2 className="display h-lg" data-split>
              What the product refuses to do.
            </h2>
          </div>
          <div className="stats" data-stagger="0.12">
            {[
              [
                0,
                "blended scores",
                "Delivery, market activity and attribution are always reported apart.",
              ],
              [
                6,
                "verification bases",
                "From onchain canonical to partner-reported, always shown beside the evidence.",
              ],
              [3, "evidence lanes", "Each with its own coverage status, gaps and limitations."],
              [
                5,
                "renewal outcomes",
                "Renew, conditional trial, request evidence, do not renew, insufficient data.",
              ],
            ].map(([n, t, d]) => (
              <div className="stat" key={t as string}>
                <span className="eyebrow">{t}</span>
                <div className="n">
                  <span data-count={n as number}>0</span>
                </div>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="sec"
        id="compare"
        style={{ background: "var(--bg-2)", borderBlock: "1px solid var(--border)" }}
      >
        <div className="wrap">
          <div className="sec-head center">
            <span className="eyebrow" data-reveal>
              Why Afterpost
            </span>
            <h2 className="display h-lg" data-split>
              Before and after the case file.
            </h2>
          </div>
          <div className="cmp" data-reveal>
            <div className="cmp-row head">
              <div>Question</div>
              <div>Today</div>
              <div>With Afterpost</div>
            </div>
            {compare.map(([q, a, b]) => (
              <div className="cmp-row" key={q}>
                <div>{q}</div>
                <div>
                  <span className="x">✕ </span>
                  {a}
                </div>
                <div>
                  <span className="ok">✓ </span>
                  {b}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec" id="status">
        <div className="wrap">
          <div className="sec-head center">
            <span className="eyebrow" data-reveal>
              Honest build status
            </span>
            <h2 className="display h-lg" data-split>
              What runs today, and what doesn&apos;t yet.
            </h2>
            <p className="lead" data-reveal>
              Nothing here is claimed that hasn&apos;t actually run.
            </p>
          </div>
          <div className="status-grid" data-stagger="0.14">
            <div className="status-col">
              <span className="pill good">Verified, live</span>
              <h3>Working core</h3>
              <ul>
                <li>
                  <b>Chain adapter:</b> read-only, confirmed live against Robinhood Chain.
                </li>
                <li>
                  <b>Domain engine:</b> swap direction, fulfilment, retention, attribution, renewal
                  policy, with adversarial tests.
                </li>
                <li>
                  <b>World Model &amp; H-MEM:</b> idempotent ingest, tiered memory, trust ledger.
                </li>
                <li>
                  <b>Data model:</b> full relational schema and shared contracts.
                </li>
              </ul>
            </div>
            <div className="status-col">
              <span className="pill warn">In progress</span>
              <h3>Still being connected</h3>
              <ul>
                <li>
                  <b>Zetaris federated layer:</b> local platform being provisioned, no live query
                  yet.
                </li>
                <li>
                  <b>Nightshift / Nemotron:</b> connector built, endpoint unconfirmed, so runs use
                  the labelled fallback.
                </li>
                <li>
                  <b>API, auth, live runner:</b> not built. This interface runs on fixtures.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section
        className="sec"
        id="faq"
        style={{ background: "var(--bg-2)", borderBlock: "1px solid var(--border)" }}
      >
        <div className="wrap">
          <div className="sec-head center">
            <span className="eyebrow" data-reveal>
              Questions
            </span>
            <h2 className="display h-lg" data-split>
              Things people ask first.
            </h2>
          </div>
          <Faq />
        </div>
      </section>

      <section className="sec" style={{ paddingBottom: 0 }}>
        <div className="wrap">
          <div className="cta" data-reveal>
            <div
              className="glow a"
              style={{
                width: 600,
                height: 600,
                left: "50%",
                top: "50%",
                marginLeft: -300,
                marginTop: -300,
                opacity: 0.8,
              }}
            />
            <div style={{ position: "relative", zIndex: 2 }}>
              <span className="eyebrow">Open a case file</span>
              <h2 className="display h-lg">
                See what they <em>really</em> delivered.
              </h2>
              <p className="lead">
                Explore a sample campaign end to end, from the three lanes to the renewal
                suggestion.
              </p>
              <div className="row">
                <Link href="/app/campaigns/cmp_launch" className="btn primary lg" data-magnetic>
                  Explore a sample campaign <Arrow />
                </Link>
                <Link href="/sign-in" className="btn lg">
                  Sign in
                </Link>
              </div>
              <p className="asof" style={{ marginTop: 22 }}>
                No account needed to explore fixtures.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
