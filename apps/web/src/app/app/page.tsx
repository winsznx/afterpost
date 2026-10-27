import Link from "next/link";
import { campaigns, fmtDate, fmtMoney, actionLabel, statusTone, AS_OF } from "@/lib/data";
import { AsOf, Pill, CoveragePill, Arrow } from "@/components/ui";

export const metadata = { title: "Overview" };

const sources = [
  {
    name: "Robinhood Chain RPC",
    state: "Synced",
    tone: "good" as const,
    detail: "Chain 4663 · synced through block 8,340,112",
  },
  {
    name: "Platform posts (X)",
    state: "Partial",
    tone: "warn" as const,
    detail: "Pin history unavailable: affects 1 deliverable",
  },
  {
    name: "Zetaris federated query",
    state: "Not connected",
    tone: "muted" as const,
    detail: "Local platform still being provisioned",
  },
  {
    name: "Language generator",
    state: "Fallback",
    tone: "warn" as const,
    detail: "No-model fallback in use, every result is labelled",
  },
];

export default function Overview() {
  const review = campaigns.filter(
    (c) => c.status === "IN_REVIEW" || (c.status === "ACTIVE" && !c.lastEvaluatedAt),
  );
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <p className="crumbs">Workspace</p>
          <h1 data-split>Good morning.</h1>
          <p className="lead" style={{ marginTop: 10, fontSize: 16 }}>
            {review.length} campaigns need your review. No blended scores, only what the evidence
            supports.
          </p>
        </div>
        <Link href="/app/campaigns" className="btn primary">
          All campaigns <Arrow />
        </Link>
      </div>

      <div className="grid g4" data-stagger="0.08" style={{ marginBottom: 24 }}>
        {[
          ["Campaigns", String(campaigns.length), "across 2 projects"],
          ["Needs review", String(review.length), "evidence or decision pending"],
          ["Spend tracked", "$31,000", "user-reported, USD"],
          ["Partners", "3", "1 on trial, 1 candidate"],
        ].map(([l, v, s]) => (
          <div key={l} className="card">
            <p className="sub">{l}</p>
            <p className="display" style={{ fontSize: 34, margin: "8px 0 2px" }}>{v}</p>
            <p className="display" style={{ fontSize: 46, margin: "8px 0 2px" }}>
              {v}
            </p>
            <p className="sub">{s}</p>
          </div>
        ))}
      </div>

      <div className="grid g-main">
        <section className="card" data-reveal>
          <h2>Needs review</h2>
          <p className="sub" style={{ marginBottom: 12 }}>
            Campaigns with a report awaiting a decision, or no evaluation yet.
          </p>
          <div className="scroll-x">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Campaign</th>
                  <th>Status</th>
                  <th>Suggested action</th>
                  <th>Window</th>
                </tr>
              </thead>
              <tbody>
                {review.map((c) => (
                  <tr key={c.id} className="row">
                    <td>
                      <Link className="link" href={`/app/campaigns/${c.id}`}>
                        {c.title}
                      </Link>
                      <br />
                      <span className="sub">
                        {c.partnerName} · {c.projectName}
                      </span>
                    </td>
                    <td>
                      <Pill tone={statusTone[c.status]}>
                        {c.status.replace("_", " ").toLowerCase()}
                      </Pill>
                    </td>
                    <td>
                      {c.suggestedAction ? (
                        <Pill tone={actionLabel[c.suggestedAction].tone}>
                          {actionLabel[c.suggestedAction].label}
                        </Pill>
                      ) : (
                        <span className="sub">Not evaluated</span>
                      )}
                    </td>
                    <td className="sub" style={{ whiteSpace: "nowrap" }}>
                      {fmtDate(c.startAt)} – {fmtDate(c.endAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="card" data-reveal data-delay="0.1">
          <h2>Source health</h2>
          <p className="sub" style={{ marginBottom: 6 }}>
            Every number depends on these. Gaps are named, not hidden.
          </p>
          {sources.map((s) => (
            <div key={s.name} className="mrow" style={{ alignItems: "flex-start" }}>
              <span style={{ color: "var(--text)" }}>
                {s.name}
                <br />
                <span className="sub">{s.detail}</span>
              </span>
              <Pill tone={s.tone}>{s.state}</Pill>
            </div>
          ))}
        </section>
      </div>

      <section className="card" style={{ marginTop: 24 }} data-reveal>
        <h2>Recent campaigns</h2>
        <p className="sub" style={{ marginBottom: 14 }}>
          Each card keeps its three lanes apart.
        </p>
        <div className="grid g3" data-stagger="0.1">
          {campaigns.slice(0, 3).map((c) => (
            <Link
              key={c.id}
              href={`/app/campaigns/${c.id}`}
              className="card"
              style={{ background: "var(--bg-2)", display: "grid", gap: 10 }}
            >
              <strong>{c.title}</strong>
              <span className="sub">
                {c.partnerName} · {fmtMoney(c.cost)}
              </span>
              <div style={{ display: "grid", gap: 6, marginTop: 4 }}>
                {(["delivery", "market", "attribution"] as const).map((k) => (
                  <div
                    key={k}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: 13,
                    }}
                  >
                    <span style={{ color: `var(--${k})` }}>
                      {k === "market" ? "Observed" : k[0]!.toUpperCase() + k.slice(1)}
                    </span>
                    <CoveragePill s={c.lanes[k].coverage} />
                  </div>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>
      <p style={{ marginTop: 20 }}>
        <AsOf at={AS_OF} />
      </p>
    </div>
  );
}
