import Link from "next/link";
import { notFound } from "next/navigation";
import { getCampaign, fmtDate, fmtUtc, actionLabel, statusTone } from "@/lib/data";
import type { Lane } from "@/lib/data";
import {
  Arrow,
  AsOf,
  CoveragePill,
  Crumbs,
  DeliverablePill,
  Empty,
  FindingPill,
  Pill,
  laneColor,
  laneName,
} from "@/components/ui";

export default async function CampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = getCampaign(id);
  if (!c) notFound();
  const evaluated = !!c.lastEvaluatedAt;
  const act = c.suggestedAction ? actionLabel[c.suggestedAction] : null;
  const report = c.reports[0];

  const LaneCard = ({ k, lane }: { k: "delivery" | "market" | "attribution"; lane: Lane }) => (
    <section className="card lane" style={{ ["--lane" as string]: laneColor[k] }}>
      <div
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}
      >
        <span className="lane-name" style={{ color: laneColor[k] }}>
          <i className="dot" /> {laneName[k]}
        </span>
        <CoveragePill s={lane.coverage} />
      </div>
      {k === "attribution" && lane.coverage === "NOT_APPLICABLE" ? (
        <div className="quiet">
          <b>Unknown</b>
          {lane.detail}
        </div>
      ) : (
        <>
          <p className="big">{lane.headline}</p>
          <p className="sub">{lane.detail}</p>
        </>
      )}
      <div>
        {lane.metrics.map((m) => (
          <div key={m.label} className="mrow">
            <span>{m.label}</span>
            <span className="mono">{m.value}</span>
          </div>
        ))}
      </div>
      {lane.gap && (
        <div className="warnbox" role="note">
          <span aria-hidden>⚠</span>
          <span>
            <b>Missing source:</b> {lane.gap}
          </span>
        </div>
      )}
    </section>
  );

  return (
    <div className="page">
      <Crumbs items={[{ label: "Campaigns", href: "/app/campaigns" }, { label: c.title }]} />
      <div className="page-head">
        <div style={{ maxWidth: 760 }}>
          <h1 data-split>{c.title}</h1>
          <div className="meta-row" data-reveal>
            <span>
              Partner{" "}
              <b>
                <Link href={`/app/partners/${c.partnerId}`}>{c.partnerName}</Link>
              </b>
            </span>
            <span>
              Project{" "}
              <b>
                <Link href={`/app/projects/${c.projectId}`}>{c.projectName}</Link>
              </b>
            </span>
            <span>
              Dates{" "}
              <b>
                {fmtDate(c.startAt)} – {fmtDate(c.endAt)}
              </b>
            </span>
            <span>
              Fee <b>{c.feeLabel}</b>
            </span>
            <Pill tone={statusTone[c.status]}>{c.status.replace("_", " ").toLowerCase()}</Pill>
          </div>
        </div>
        <Link href={`/app/campaigns/${c.id}/investigate`} className="btn primary lg" data-magnetic>
          {evaluated ? "Re-investigate" : "Investigate"} <Arrow />
        </Link>
      </div>

      {!evaluated && (
        <div className="warnbox" style={{ marginBottom: 20 }} role="status">
          <span aria-hidden>ℹ</span>
          <span>
            This campaign hasn&apos;t been evaluated yet. Lane cards below show what is known so
            far, with no placeholder numbers.
          </span>
        </div>
      )}

      <div className="grid g3" data-stagger="0.12">
        <LaneCard k="delivery" lane={c.lanes.delivery} />
        <LaneCard k="market" lane={c.lanes.market} />
        <LaneCard k="attribution" lane={c.lanes.attribution} />
      </div>

      <div className="grid g-main" style={{ marginTop: 24 }}>
        <section className="card" data-reveal>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <h2>Evidence reconciliation timeline</h2>
            <Link className="btn sm" href={`/app/campaigns/${c.id}/evidence`}>
              Evidence cabinet
            </Link>
          </div>
          <p className="sub" style={{ marginBottom: 16 }}>
            What happened, in order, tagged by lane.
          </p>
          {c.timeline.length === 0 ? (
            <Empty
              title="No timeline yet"
              body="Once evidence is added or an investigation runs, events from all three lanes appear here in order."
              cta={{ label: "Run first investigation", href: `/app/campaigns/${c.id}/investigate` }}
            />
          ) : (
            <div className="tl">
              {c.timeline.map((t) => (
                <div
                  key={t.at + t.text}
                  className="tl-item"
                  style={{ ["--c" as string]: laneColor[t.lane] }}
                >
                  <small>{fmtUtc(t.at)}</small>
                  <p>{t.text}</p>
                  <Pill tone={t.lane === "system" ? "muted" : t.lane}>
                    {t.lane === "system" ? "System" : laneName[t.lane]}
                  </Pill>
                </div>
              ))}
            </div>
          )}
        </section>

        <div style={{ display: "grid", gap: 24, alignContent: "start" }}>
          <section className="card" data-reveal>
            <h2>Commitments</h2>
            <p className="sub" style={{ marginBottom: 6 }}>
              As contracted
            </p>
            {c.deliverables.length === 0 ? (
              <p className="sub" style={{ padding: "12px 0" }}>
                No deliverables added yet.
              </p>
            ) : (
              c.deliverables.map((d) => (
                <div key={d.id} className="mrow" style={{ alignItems: "center" }}>
                  <span style={{ color: "var(--text)" }}>
                    {d.label}
                    <br />
                    <span className="sub">
                      {d.channel} · due {fmtDate(d.dueAt)}
                    </span>
                  </span>
                  <DeliverablePill s={d.status} />
                </div>
              ))
            )}
          </section>

          <section
            className="card"
            data-reveal
            style={{ borderColor: act ? "var(--border-strong)" : undefined }}
          >
            <h2>Assessment &amp; renewal</h2>
            {act ? (
              <>
                <p className="sub" style={{ marginBottom: 12 }}>Suggested action, not a verdict. You decide.</p>
                <p className="display" style={{ fontSize: 30, lineHeight: 1.1 }}>{act.label}</p>
                <p className="sub" style={{ margin: "8px 0 14px" }}>{act.why}</p>
                <p className="sub" style={{ marginBottom: 12 }}>
                  Suggested action, not a verdict. You decide.
                </p>
                <p className="display" style={{ fontSize: 40, lineHeight: 1 }}>
                  {act.label}
                </p>
                <p className="sub" style={{ margin: "8px 0 14px" }}>
                  {act.why}
                </p>
                {report && (
                  <>
                    <p className="sub" style={{ marginBottom: 6 }}>
                      Limitations
                    </p>
                    <ul
                      style={{
                        margin: "0 0 16px",
                        paddingLeft: 18,
                        color: "var(--muted)",
                        fontSize: 13.5,
                      }}
                    >
                      {report.limitations.map((l) => (
                        <li key={l}>{l}</li>
                      ))}
                    </ul>
                  </>
                )}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {report && (
                    <Link
                      href={`/app/campaigns/${c.id}/reports/${report.id}`}
                      className="btn primary sm"
                    >
                      Open report v{report.version}
                    </Link>
                  )}
                  <button className="btn sm" disabled title="Export needs the API">
                    Export CSV
                  </button>
                  <button className="btn sm" disabled title="Export needs the API">
                    Export XLSX
                  </button>
                </div>
              </>
            ) : (
              <p className="sub" style={{ paddingTop: 8 }}>
                No suggestion yet. A recommendation is only produced from evidence, so run an
                investigation first.
              </p>
            )}
          </section>
        </div>
      </div>

      {c.findings.length > 0 && (
        <section className="card" style={{ marginTop: 24 }} data-reveal>
          <h2>Findings</h2>
          <p className="sub" style={{ marginBottom: 8 }}>
            Every claim links to the evidence behind it.
          </p>
          {c.findings.map((f) => (
            <div key={f.id} className="finding">
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                <Pill
                  tone={
                    f.claimType === "DELIVERY"
                      ? "delivery"
                      : f.claimType === "MARKET_OBSERVATION"
                        ? "market"
                        : f.claimType === "ATTRIBUTED_ACQUISITION"
                          ? "attribution"
                          : "muted"
                  }
                >
                  {f.claimType.replace("_", " ").toLowerCase()}
                </Pill>
                <FindingPill s={f.status} />
              </div>
              <p>{f.text}</p>
              <span className="sub mono">
                {f.evidenceIds.length ? f.evidenceIds.join(" · ") : "No supporting evidence"}
              </span>
            </div>
          ))}
        </section>
      )}
      <p style={{ marginTop: 20 }}>
        <AsOf at={c.lastEvaluatedAt ?? undefined} />
      </p>
    </div>
  );
}
