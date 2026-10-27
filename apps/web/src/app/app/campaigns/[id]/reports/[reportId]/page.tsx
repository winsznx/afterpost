import Link from "next/link";
import { notFound } from "next/navigation";
import { getCampaign, actionLabel, fmtUtc } from "@/lib/data";
import {
  AsOf,
  CoveragePill,
  Crumbs,
  FindingPill,
  Pill,
  laneColor,
  laneName,
} from "@/components/ui";

export const metadata = { title: "Report" };

const tone = {
  DRAFT: "muted",
  NEEDS_REVIEW: "warn",
  APPROVED: "good",
  DISPUTED: "bad",
  SUPERSEDED: "muted",
} as const;

export default async function Report({
  params,
}: {
  params: Promise<{ id: string; reportId: string }>;
}) {
  const { id, reportId } = await params;
  const c = getCampaign(id);
  const r = c?.reports.find((x) => x.id === reportId);
  if (!c || !r) notFound();
  const act = actionLabel[r.suggestedAction];
  const lanes = ["delivery", "market", "attribution"] as const;

  return (
    <div className="page">
      <Crumbs
        items={[
          { label: "Campaigns", href: "/app/campaigns" },
          { label: c.title, href: `/app/campaigns/${c.id}` },
          { label: `Report v${r.version}` },
        ]}
      />
      <div className="page-head">
        <div>
          <h1 data-split>Scorecard v{r.version}</h1>
          <div className="meta-row" data-reveal>
            <Pill tone={tone[r.status]}>{r.status.replace("_", " ").toLowerCase()}</Pill>
            <span>
              Data as of <b>{fmtUtc(r.dataAsOf)}</b>
            </span>
            <span>{c.title}</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button className="btn" disabled title="Export needs the API">
            Export CSV
          </button>
          <button className="btn primary" disabled title="Export needs the API">
            Export XLSX
          </button>
        </div>
      </div>

      {r.status === "SUPERSEDED" && (
        <div className="warnbox" style={{ marginBottom: 20 }} role="status">
          <span aria-hidden>ℹ</span>
          <span>
            This version has been superseded.{" "}
            <Link
              href={`/app/campaigns/${c.id}/reports/${c.reports[0]!.id}`}
              style={{ textDecoration: "underline" }}
            >
              Open the latest (v{c.reports[0]!.version})
            </Link>
            .
          </span>
        </div>
      )}

      <section className="card" data-reveal style={{ marginBottom: 24 }}>
        <span className="eyebrow">Suggested action</span>
        <p className="display" style={{ fontSize: "clamp(32px,4.4vw,52px)", margin: "12px 0 6px" }}>{act.label}</p>
        <p className="lead" style={{ fontSize: 16 }}>{act.why} This is a suggestion drawn from the evidence below, never a single blended score.</p>
        <p className="display" style={{ fontSize: "clamp(40px,6vw,72px)", margin: "14px 0 6px" }}>
          {act.label}
        </p>
        <p className="lead" style={{ fontSize: 16 }}>
          {act.why} This is a suggestion drawn from the evidence below, never a single blended
          score.
        </p>
      </section>

      <div className="grid g3" data-stagger="0.12">
        {lanes.map((k) => {
          const l = c.lanes[k];
          return (
            <section key={k} className="card lane" style={{ ["--lane" as string]: laneColor[k] }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span className="lane-name" style={{ color: laneColor[k] }}>
                  <i className="dot" /> {laneName[k]}
                </span>
                <CoveragePill s={l.coverage} />
              </div>
              <p className="big">{l.headline}</p>
              {l.metrics.map((m) => (
                <div key={m.label} className="mrow">
                  <span>{m.label}</span>
                  <span className="mono">{m.value}</span>
                </div>
              ))}
            </section>
          );
        })}
      </div>

      <div className="grid g2" style={{ marginTop: 24 }}>
        <section className="card" data-reveal>
          <h2>Findings</h2>
          {c.findings.map((f) => (
            <div key={f.id} className="finding">
              <FindingPill s={f.status} />
              <p>{f.text}</p>
              <span className="sub mono">
                {f.evidenceIds.join(" · ") || "No supporting evidence"}
              </span>
            </div>
          ))}
        </section>
        <section className="card" data-reveal>
          <h2>Limitations</h2>
          <p className="sub" style={{ marginBottom: 12 }}>
            What this report cannot tell you.
          </p>
          <ul
            style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 10, color: "var(--muted)" }}
          >
            {r.limitations.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
          <p className="sub" style={{ marginTop: 20 }}>
            Versions
          </p>
          {c.reports.map((v) => (
            <div key={v.id} className="mrow">
              <Link
                href={`/app/campaigns/${c.id}/reports/${v.id}`}
                style={{ color: v.id === r.id ? "var(--accent)" : undefined }}
              >
                Version {v.version}
              </Link>
              <span className="sub">{v.status.replace("_", " ").toLowerCase()}</span>
            </div>
          ))}
        </section>
      </div>
      <p style={{ marginTop: 20 }}>
        <AsOf at={r.dataAsOf} />
      </p>
    </div>
  );
}
