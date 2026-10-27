import Link from "next/link";
import { trackingLinks } from "@/lib/data";
import { AsOf, Pill } from "@/components/ui";

export const metadata = { title: "Tracking links" };

export default function Tracking() {
  const clicks = trackingLinks.reduce((a, l) => a + l.clicks, 0);
  const opt = trackingLinks.reduce((a, l) => a + l.optIns, 0);
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <p className="crumbs">Directory / Tracking links</p>
          <h1 data-split>Tracking links</h1>
          <p className="lead" style={{ marginTop: 10, fontSize: 16 }}>
            Only wallets that click a link and sign an opt-in can ever be attributed to a campaign.
          </p>
        </div>
        <button className="btn primary" disabled title="Needs the API">
          Create link
        </button>
      </div>
      <div className="grid g3" data-stagger="0.1" style={{ marginBottom: 24 }}>
        {[
          ["Links", String(trackingLinks.length)],
          ["Clicks", String(clicks)],
          ["Signed opt-ins", String(opt)],
        ].map(([l, v]) => (
          <div key={l} className="card" style={{ borderTop: "2px solid var(--attribution)" }}>
            <p className="sub">{l}</p>
            <p className="display" style={{ fontSize: 36, marginTop: 6 }}>{v}</p>
            <p className="display" style={{ fontSize: 48, marginTop: 6 }}>
              {v}
            </p>
          </div>
        ))}
      </div>
      <div className="card tbl-desktop" style={{ padding: 0 }} data-reveal>
        <div className="scroll-x">
          <table className="tbl">
            <thead>
              <tr>
                <th>Link</th>
                <th>Campaign</th>
                <th>Clicks</th>
                <th>Opt-ins</th>
                <th>Created</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {trackingLinks.map((l) => (
                <tr key={l.slug}>
                  <td>
                    <span className="mono">/go/{l.slug}</span>
                    <br />
                    <span className="sub">{l.label}</span>
                  </td>
                  <td>
                    <Link className="link" href={`/app/campaigns/${l.campaignId}`}>
                      {l.campaign}
                    </Link>
                  </td>
                  <td className="mono">{l.clicks}</td>
                  <td className="mono">{l.optIns}</td>
                  <td className="sub">{l.created}</td>
                  <td>
                    <Link className="btn sm" href={`/go/${l.slug}`}>
                      Preview
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="cards-m" data-stagger="0.08">
        {trackingLinks.map((l) => (
          <Link
            key={l.slug}
            href={`/go/${l.slug}`}
            className="card"
            style={{ display: "grid", gap: 8 }}
          >
            <span className="mono">/go/{l.slug}</span>
            <span className="sub">{l.campaign}</span>
            <div style={{ display: "flex", gap: 8 }}>
              <Pill tone="attribution">{l.clicks} clicks</Pill>
              <Pill tone="muted">{l.optIns} opt-ins</Pill>
            </div>
          </Link>
        ))}
      </div>
      <p style={{ marginTop: 18 }}>
        <AsOf />
      </p>
    </div>
  );
}
