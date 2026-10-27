"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap";
import { Arrow, Logo } from "./ui";

const links = [
  { href: "/#lanes", label: "Three lanes" },
  { href: "/#pipeline", label: "How it works" },
  { href: "/#compare", label: "Why Afterpost" },
  { href: "/#status", label: "Build status" },
  { href: "/#faq", label: "FAQ" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const drawer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let last = 0;
    const on = () => {
      const y = window.scrollY;
      setScrolled(y > 12);
      setHidden(y > last && y > 240 && !open);
      last = y;
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [open]);

  // drawer open/close with a clip-path wipe and staggered links
  useEffect(() => {
    registerGsap();
    const el = drawer.current;
    if (!el) return;
    const lenis = (window as unknown as { __lenis?: { stop(): void; start(): void } }).__lenis;
    if (open) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
      gsap.set(el, { visibility: "visible" });
      gsap.fromTo(
        el,
        { clipPath: "inset(0 0 100% 0)" },
        { clipPath: "inset(0 0 0% 0)", duration: 0.8, ease: "expo.inOut" },
      );
      gsap.fromTo(
        el.querySelectorAll(".big span"),
        { yPercent: 110 },
        { yPercent: 0, duration: 1, ease: "expo.out", stagger: 0.07, delay: 0.25 },
      );
      gsap.fromTo(
        el.querySelector(".drawer-foot"),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.6 },
      );
    } else if (el.style.visibility === "visible") {
      gsap.to(el, {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.6,
        ease: "expo.inOut",
        onComplete: () => gsap.set(el, { visibility: "hidden" }),
      });
      lenis?.start();
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className={`nav${scrolled ? " scrolled" : ""}${hidden ? " hide" : ""}`}>
        <div className="nav-in">
          <Logo />
          <nav className="nav-links" aria-label="Primary">
            {links.map((l) => (
              <Link key={l.href} href={l.href}>
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="nav-cta">
            <Link href="/sign-in" className="btn sm hide-m">
              Sign in
            </Link>
            <Link href="/app" className="btn primary sm hide-m">
              Open workspace
            </Link>
            <button
              className="burger"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="drawer"
              onClick={() => setOpen((o) => !o)}
            >
              <i />
              <i />
            </button>
          </div>
        </div>
      </header>
      <div id="drawer" ref={drawer} className="drawer" aria-hidden={!open}>
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="big"
            onClick={() => setOpen(false)}
            tabIndex={open ? 0 : -1}
          >
            <span>{l.label}</span>
          </Link>
        ))}
        <div className="drawer-foot">
          <Link href="/sign-in" className="btn" onClick={() => setOpen(false)}>
            Sign in
          </Link>
          <Link href="/app" className="btn primary" onClick={() => setOpen(false)}>
            Open workspace <Arrow />
          </Link>
        </div>
      </div>
    </>
  );
}

const liveSteps = [
  ["Checking", "4 promised posts"],
  ["Verified", "2 of 4 → checking transaction window"],
  ["Found", "214 swaps → excluding routers"],
  ["Attribution", "no tracking data → Unknown, not 0"],
  ["Scorecard", "three lanes ready"],
];
export function HeroLive() {
  const [i, setI] = useState(0);
  const el = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % liveSteps.length), 2600);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    if (el.current && !document.documentElement.classList.contains("reduced")) {
      gsap.fromTo(
        el.current,
        { y: 14, opacity: 0, filter: "blur(4px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.7, ease: "expo.out" },
      );
    }
  }, [i]);
  return (
    <div className="live-line" data-reveal data-delay="0.9" role="status" aria-live="polite">
      <i className="pulse" />
      <span ref={el}>
        <b>{liveSteps[i]![0]}</b> {liveSteps[i]![1]}
      </span>
    </div>
  );
}

const roles = [
  {
    id: "founder",
    tab: "Founders",
    title: "Decide the renewal with the evidence in front of you.",
    body: "You paid a partner. Before you pay again, see exactly which posts went live, what the chain did in the same window, and what nobody can know.",
    points: [
      "Contracted vs. published, line by line",
      "A renewal suggestion that explains itself",
      "Limitations stated up front, never buried",
    ],
    stat: ["3 of 4", "commitments fulfilled", "delivery"],
  },
  {
    id: "growth",
    tab: "Growth leads",
    title: "Run campaigns you can actually learn from.",
    body: "Add tracking links and a signed wallet opt-in before a campaign starts, and the attribution lane lights up with wallets you can stand behind.",
    points: [
      "One link per deliverable",
      "Wallet opt-ins verified by signature",
      "Untracked campaigns stay honestly Unknown",
    ],
    stat: ["17", "opted-in wallets swapped", "attribution"],
  },
  {
    id: "analyst",
    tab: "Analysts",
    title: "Audit every claim back to its source.",
    body: "Each finding links to the evidence behind it, labelled by how it was verified: onchain, platform, human, partner-reported or model-extracted.",
    points: [
      "Evidence cabinet with trust levels",
      "Versioned reports, never overwritten",
      "Recorded runs replay step by step",
    ],
    stat: ["6", "verification bases tracked", "market"],
  },
  {
    id: "community",
    tab: "BD & community",
    title: "Hold partners to the deal, fairly.",
    body: "Share a scorecard that is specific about what was missed and generous about what was unknowable, so conversations stay factual.",
    points: [
      "Exportable CSV and XLSX scorecards",
      "Partner profile across engagements",
      "Disputed payments flagged on the record",
    ],
    stat: ["1 / 3", "posts delivered in the window", "delivery"],
  },
];

export function UseCases() {
  const [active, setActive] = useState(0);
  const panel = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  const r = roles[active]!;
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (!panel.current || document.documentElement.classList.contains("reduced")) return;
    const tl = gsap.timeline();
    tl.fromTo(
      panel.current.querySelectorAll("[data-sw]"),
      { y: 28, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "expo.out", stagger: 0.07 },
    );
    tl.fromTo(
      panel.current.querySelector(".mini-card"),
      { scale: 0.94, opacity: 0, rotate: -2 },
      { scale: 1, opacity: 1, rotate: 0, duration: 1, ease: "expo.out" },
      0,
    );
    return () => {
      tl.kill();
    };
  }, [active]);
  return (
    <div>
      <div className="tabs" role="tablist" aria-label="Audience" data-reveal>
        {roles.map((x, i) => (
          <button
            key={x.id}
            role="tab"
            id={`t-${x.id}`}
            aria-selected={i === active}
            aria-controls="role-panel"
            className="tab"
            onClick={() => setActive(i)}
          >
            {x.tab}
          </button>
        ))}
      </div>
      <div
        className="panel-lg"
        id="role-panel"
        role="tabpanel"
        aria-labelledby={`t-${r.id}`}
        ref={panel}
        data-reveal
      >
        <div>
          <h3 className="display h-md" data-sw>
            {r.title}
          </h3>
          <p className="lead" style={{ marginTop: 18 }} data-sw>
            {r.body}
          </p>
          <ul className="checks" data-sw>
            {r.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <Link href="/app" className="btn primary" data-sw>
            See it on a sample campaign <Arrow />
          </Link>
        </div>
        <div className="mini-card">
          <div className="lane-name" style={{ color: `var(--${r.stat[2]})` }}>
            <i className="dot" /> {r.stat[2]}
          </div>
          <div className="display" style={{ fontSize: 64, margin: "14px 0 4px" }}>
            {r.stat[0]}
          </div>
          <p className="lead" style={{ fontSize: 15 }}>
            {r.stat[1]}
          </p>
          <div className="bars" style={{ color: `var(--${r.stat[2]})`, marginTop: 28, height: 70 }}>
            {[40, 62, 35, 80, 55, 92, 48, 70, 60, 85].map((h, k) => (
              <i key={k} style={{ height: `${h}%` }} />
            ))}
          </div>
          <p className="asof" style={{ marginTop: 14 }}>
            Illustrative sample figures
          </p>
        </div>
      </div>
    </div>
  );
}

const steps = [
  {
    t: "Validate & recall",
    d: "Inputs are checked, then H-MEM recalls what earlier runs learned about this partner, filtered by relevance so stale notes can't leak in.",
    o: "System + H-MEM",
    out: ["Campaign window", "Prior notes: 2"],
  },
  {
    t: "Fetch the evidence",
    d: "Agreements and post evidence are retrieved from their sources. A screenshot a partner sends is stored as partner-reported, never as proof.",
    o: "Platform API",
    out: ["Posts retrieved: 2", "Partner-reported: 1"],
  },
  {
    t: "Sync the chain",
    d: "Read-only sync of swaps and transfers on Robinhood Chain. Pools are re-verified onchain; routers are never counted as buyers.",
    o: "Robinhood Chain RPC",
    out: ["Chain ID 4663", "Pool re-verified"],
  },
  {
    t: "Federated query",
    d: "Commitments, evidence and chain events live in separate sources. Zetaris joins them at query time without copying everything into one blob.",
    o: "Zetaris",
    out: ["3 sources", "1 join"],
  },
  {
    t: "Assess the gaps",
    d: "If a deliverable is still unresolved, the agent looks for another source before drafting anything. Otherwise the gap is recorded.",
    o: "Agent loop",
    out: ["Unresolved: 1", "Extra sources: 1"],
  },
  {
    t: "Compute, don't guess",
    d: "Fulfilment ratios, swap direction, holder retention and attribution qualification come from deterministic, tested code, not from a model.",
    o: "Domain engine",
    out: ["Fulfilment 3/4", "Retention PENDING"],
  },
  {
    t: "Draft & validate",
    d: "Findings are drafted only from linked evidence. A language validator rejects any sentence that claims more than the evidence supports.",
    o: "Generator + validator",
    out: ["Findings: 4", "Rejected: 0"],
  },
  {
    t: "Remember & report",
    d: "Provenance-linked state is written to the World Model, then a versioned scorecard is built with three lanes and one clear limitations list.",
    o: "World Model",
    out: ["Report v2", "Needs review"],
  },
];

export function Pipeline() {
  const [on, setOn] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const prev = useRef(0);

  useEffect(() => {
    registerGsap();
    if (document.documentElement.classList.contains("reduced")) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 901px)", () => {
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top 14%",
        end: `+=${steps.length * 55}%`,
        pin: true,
        scrub: true,
        onUpdate: (self) =>
          setOn(Math.min(steps.length - 1, Math.floor(self.progress * steps.length))),
      });
      return () => st.kill();
    });
    return () => mm.revert();
  }, []);

  useEffect(() => {
    if (
      prev.current === on ||
      !panel.current ||
      document.documentElement.classList.contains("reduced")
    ) {
      prev.current = on;
      return;
    }
    const dir = on > prev.current ? 1 : -1;
    prev.current = on;
    const tl = gsap.timeline();
    tl.fromTo(
      panel.current.querySelectorAll("[data-pw]"),
      { y: 36 * dir, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: "expo.out", stagger: 0.06 },
    );
    tl.fromTo(
      panel.current.querySelector(".big-n"),
      { yPercent: 20 * dir, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 1.2, ease: "expo.out" },
      0,
    );
    return () => {
      tl.kill();
    };
  }, [on]);

  const s = steps[on]!;
  return (
    <div className="pipe" ref={root}>
      <div className="pipe-grid">
        <div className="pipe-list" role="tablist" aria-label="Investigation steps">
          {steps.map((x, i) => (
            <button
              key={x.t}
              role="tab"
              aria-selected={i === on}
              className={`pipe-item${i === on ? " on" : ""}`}
              onClick={() => setOn(i)}
            >
              <span className="n">{String(i + 1).padStart(2, "0")}</span>
              <b>{x.t}</b>
            </button>
          ))}
        </div>
        <div className="pipe-panel" ref={panel} role="tabpanel">
          <span className="big-n" aria-hidden>
            {on + 1}
          </span>
          <span className="eyebrow" data-pw>
            Step {on + 1} of {steps.length} · {s.o}
          </span>
          <h3 data-pw>{s.t}</h3>
          <p className="lead" data-pw>
            {s.d}
          </p>
          <div className="kv" data-pw>
            {s.out.map((o, i) => (
              <div key={o}>
                <small>{i === 0 ? "Output" : "Signal"}</small>
                {o}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const faqs = [
  {
    q: "Why is there no single score or ROI figure?",
    a: "Because it would be invented. Delivery, observed market activity and attribution are different kinds of evidence with different levels of certainty. Blending them hides exactly what you need to see, so Afterpost never does.",
  },
  {
    q: "What does “Unknown” mean on attribution?",
    a: "It means the campaign had no tracking links or signed wallet opt-ins, so no activity can honestly be tied to it. It is deliberately not shown as zero: zero would claim the campaign did nothing, which we can't know.",
  },
  {
    q: "Can a partner just send screenshots?",
    a: "They can, and Afterpost will store them, but as partner-reported evidence. Only platform-authenticated, onchain or human-confirmed sources count as verified. The label is always shown next to the evidence.",
  },
  {
    q: "Which chains are supported?",
    a: "Robinhood Chain (chain ID 4663) and the pons launchpad, via a read-only adapter. Pools are re-verified with onchain token0/token1 reads rather than trusted from event data.",
  },
  {
    q: "What is real today and what is still in progress?",
    a: "The chain adapter, the metrics and renewal engine, and both Meterless engines run and are tested. The API, auth and live agent runner are still being built, so this interface currently shows fixture data and says so on every screen.",
  },
];

export function Faq() {
  const [open, setOpen] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    refs.current.forEach((el, i) => {
      if (!el) return;
      const reduced = document.documentElement.classList.contains("reduced");
      gsap.to(el, {
        height: i === open ? "auto" : 0,
        duration: reduced ? 0 : 0.7,
        ease: "expo.out",
      });
    });
  }, [open]);
  return (
    <div className="faq" data-stagger="0.08">
      {faqs.map((f, i) => (
        <div key={f.q} className={`faq-item${open === i ? " open" : ""}`}>
          <h3>
            <button
              className="faq-q"
              aria-expanded={open === i}
              aria-controls={`fa-${i}`}
              onClick={() => setOpen(open === i ? -1 : i)}
            >
              {f.q}
              <span className="faq-ic" aria-hidden />
            </button>
          </h3>
          <div
            className="faq-a"
            id={`fa-${i}`}
            role="region"
            ref={(el) => {
              refs.current[i] = el;
            }}
            style={{ height: i === 0 ? "auto" : 0 }}
          >
            <p>{f.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
