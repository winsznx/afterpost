"use client";

import { use, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { gsap, registerGsap } from "@/lib/gsap";
import { getCampaign, runSteps } from "@/lib/data";
import { Crumbs, FindingPill, Pill, BasisPill } from "@/components/ui";

type Mode = "recorded" | "live";

export default function Investigate({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const c = getCampaign(id);
  const [mode, setMode] = useState<Mode>("recorded");
  const [done, setDone] = useState(0);
  const [playing, setPlaying] = useState(true);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const feed = useRef<HTMLDivElement>(null);

  const restart = useCallback(() => {
    setDone(0);
    setPlaying(true);
  }, []);

  useEffect(() => {
    if (!playing) return;
    timer.current = setInterval(() => {
      setDone((d) => {
        if (d >= runSteps.length) {
          setPlaying(false);
          return d;
        }
        return d + 1;
      });
    }, 1300);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [playing, mode]);

  useEffect(() => {
    registerGsap();
    if (!feed.current || document.documentElement.classList.contains("reduced")) return;
    const items = feed.current.querySelectorAll("[data-new]");
    gsap.fromTo(
      items,
      { y: 18, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "expo.out", stagger: 0.05 },
    );
  }, [done]);

  if (!c) notFound();
  const finished = done >= runSteps.length;
  const current = runSteps[Math.min(done, runSteps.length - 1)]!;
  const pct = Math.round((done / runSteps.length) * 100);
  const sources = c.evidence.slice(
    0,
    Math.min(c.evidence.length, Math.ceil((done / runSteps.length) * c.evidence.length)),
  );
  const findings = finished
    ? c.findings
    : c.findings.slice(0, Math.floor((done / runSteps.length) * c.findings.length));

  return (
    <div className="page">
      <Crumbs
        items={[
          { label: "Campaigns", href: "/app/campaigns" },
          { label: c.title, href: `/app/campaigns/${c.id}` },
          { label: "Investigation" },
        ]}
      />
      <div className="page-head">
        <div>
          <h1 data-split>Investigation</h1>
          <div className="meta-row">
            {mode === "recorded" ? (
              <Pill tone="info">Recorded run</Pill>
            ) : (
              <Pill tone="muted">Live runs need the API</Pill>
            )}
            <span>
              Run <b className="mono">run_{c.id.slice(4, 10)}_02</b>
            </span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <div className="seg" role="group" aria-label="Run mode">
            <button aria-pressed={mode === "recorded"} onClick={() => setMode("recorded")}>
              Recorded
            </button>
            <button aria-pressed={mode === "live"} onClick={() => setMode("live")}>
              Live
            </button>
          </div>
          <button className="btn sm" onClick={restart}>
            Replay
          </button>
        </div>
      </div>

      {mode === "live" ? (
        <div className="empty" role="status">
          <h3>Live investigation isn&apos;t available yet</h3>
          <p>
            The event stream (run_state, source, finding, report_ready) isn&apos;t implemented on
            the server. Only an active run may be labelled Live, so this view stays on the recorded
            run.
          </p>
          <button className="btn primary sm" onClick={() => setMode("recorded")}>
            Back to recorded run
          </button>
        </div>
      ) : (
        <>
          <div className="sticky-bar" role="status" aria-live="polite">
            <i
              className={finished ? "dot" : "pulse"}
              style={finished ? { color: "var(--good)" } : undefined}
            />
            <span style={{ minWidth: 0 }}>
              {finished
                ? "Run complete → scorecard ready, three lanes kept separate."
                : current.sentence}
            </span>
            <span className="mono" style={{ marginLeft: "auto", color: "var(--dim)" }}>
              {pct}%
            </span>
          </div>
          <div className="progress" aria-hidden>
            <i style={{ width: `${pct}%` }} />
          </div>

          <div className="split" ref={feed}>
            <div style={{ display: "grid", gap: 24 }}>
              <section className="card">
                <h2>Run steps</h2>
                <p className="sub" style={{ marginBottom: 10 }}>
                  State, duration and origin of each step.
                </p>
                {runSteps.map((s, i) => {
                  const state = i < done ? "done" : i === done && !finished ? "run" : "wait";
                  return (
                    <div key={s.id} className={`step ${state}`}>
                      <i
                        className="check"
                        style={
                          state === "done"
                            ? { background: "var(--good)", borderColor: "var(--good)" }
                            : state === "run"
                              ? { borderColor: "var(--accent)", animation: "pulse 1.6s infinite" }
                              : undefined
                        }
                      />
                      <div>
                        {s.label}
                        <small>{s.origin}</small>
                      </div>
                      <span className="mono" style={{ fontSize: 12, color: "var(--dim)" }}>
                        {state === "done" ? s.duration : state === "run" ? "running" : "queued"}
                      </span>
                    </div>
                  );
                })}
              </section>
              <section className="card">
                <h2>Sources &amp; evidence</h2>
                <p className="sub" style={{ marginBottom: 10 }}>
                  Each labelled by how it was verified.
                </p>
                {sources.length === 0 && (
                  <p className="sub" style={{ padding: "10px 0" }}>
                    Nothing retrieved yet…
                  </p>
                )}
                {sources.map((e) => (
                  <div key={e.id} className="finding" data-new>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 8,
                        flexWrap: "wrap",
                      }}
                    >
                      <strong style={{ fontSize: 14 }}>{e.title}</strong>
                      <BasisPill s={e.verificationBasis} />
                    </div>
                    <span className="sub mono" style={{ overflowWrap: "anywhere" }}>
                      {e.sourceRef}
                    </span>
                  </div>
                ))}
              </section>
            </div>

            <div style={{ display: "grid", gap: 24 }}>
              <section className="card">
                <h2>Findings</h2>
                <p className="sub" style={{ marginBottom: 10 }}>
                  Drafted only from linked evidence.
                </p>
                {findings.length === 0 && (
                  <p className="sub" style={{ padding: "10px 0" }}>
                    Findings appear once enough evidence is in.
                  </p>
                )}
                {findings.map((f) => (
                  <div key={f.id} className="finding" data-new>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <Pill
                        tone={
                          f.claimType === "DELIVERY"
                            ? "delivery"
                            : f.claimType === "MARKET_OBSERVATION"
                              ? "market"
                              : "muted"
                        }
                      >
                        {f.claimType.replace("_", " ").toLowerCase()}
                      </Pill>
                      <FindingPill s={f.status} />
                    </div>
                    <p>{f.text}</p>
                  </div>
                ))}
              </section>
              <section className="card">
                <h2>Decision</h2>
                {finished ? (
                  <div data-new style={{ display: "grid", gap: 12, marginTop: 8 }}>
                    <p className="display" style={{ fontSize: 28, lineHeight: 1.1 }}>{c.suggestedAction === "conditional_trial" ? "Conditional trial" : "See report"}</p>
                    <p className="sub">Generated with the no-model fallback, so this wording is labelled <span className="mono">isFallback: true</span>.</p>
                    <p className="display" style={{ fontSize: 38, lineHeight: 1 }}>
                      {c.suggestedAction === "conditional_trial"
                        ? "Conditional trial"
                        : "See report"}
                    </p>
                    <p className="sub">
                      Generated with the no-model fallback, so this wording is labelled{" "}
                      <span className="mono">isFallback: true</span>.
                    </p>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {c.reports[0] && (
                        <Link
                          className="btn primary sm"
                          href={`/app/campaigns/${c.id}/reports/${c.reports[0].id}`}
                        >
                          Open report
                        </Link>
                      )}
                      <Link className="btn sm" href={`/app/campaigns/${c.id}`}>
                        Back to campaign
                      </Link>
                    </div>
                  </div>
                ) : (
                  <p className="sub" style={{ padding: "10px 0" }}>
                    Decision is held until the run completes. Unknown stays Unknown.
                  </p>
                )}
              </section>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
