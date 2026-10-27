import Link from "next/link";
import type {
  CoverageStatus,
  EvidenceStatus,
  VerificationBasis,
  FindingStatus,
  DeliverableStatus,
} from "@afterpost/contracts";
import { AS_OF, FIXTURE_SOURCE, fmtUtc } from "@/lib/data";

type Tone =
  "good" | "info" | "warn" | "bad" | "muted" | "accent" | "delivery" | "market" | "attribution";

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="logo" aria-label="Afterpost home">
      <svg className="logo-mark" viewBox="0 0 28 28" fill="none" aria-hidden>
        <rect width="28" height="28" rx="8" fill="#171a20" />
        <rect x="0.5" y="0.5" width="27" height="27" rx="7.5" stroke="#fff" strokeOpacity=".14" />
        <rect x="7" y="7" width="14" height="3.4" rx="1.7" fill="#6ee7b7" />
        <rect x="7" y="12.3" width="9" height="3.4" rx="1.7" fill="#7dd3fc" />
        <rect x="7" y="17.6" width="11.5" height="3.4" rx="1.7" fill="#fbbf77" />
      <svg className="logo-mark" viewBox="0 0 32 32" fill="none" aria-hidden>
        <rect x="1" y="1" width="30" height="30" rx="9" stroke="currentColor" strokeOpacity=".25" />
        <path
          d="M9 22 16 8l7 14"
          stroke="#a597ff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M11.8 17.5h8.4" stroke="#6ee7b7" strokeWidth="2" strokeLinecap="round" />
        <circle cx="16" cy="22" r="1.6" fill="#fbbf77" />
      </svg>
      Afterpost
    </Link>
  );
}

export function Pill({
  tone = "muted",
  children,
  dot = true,
}: {
  tone?: Tone;
  children: React.ReactNode;
  dot?: boolean;
}) {
  return (
    <span className={`pill ${tone}`}>
      {dot && <i className="dot" />}
      {children}
    </span>
  );
}

const coverageMap: Record<CoverageStatus, { t: Tone; l: string }> = {
  COMPLETE: { t: "good", l: "Complete" },
  PARTIAL: { t: "warn", l: "Partial" },
  STALE: { t: "warn", l: "Stale" },
  UNAVAILABLE: { t: "muted", l: "Unavailable" },
  NOT_APPLICABLE: { t: "muted", l: "Not applicable" },
};
export const CoveragePill = ({ s }: { s: CoverageStatus }) => (
  <Pill tone={coverageMap[s].t}>{coverageMap[s].l}</Pill>
);

const basisMap: Record<VerificationBasis, { t: Tone; l: string }> = {
  ONCHAIN_CANONICAL: { t: "good", l: "Onchain canonical" },
  PLATFORM_AUTHENTICATED: { t: "good", l: "Platform authenticated" },
  HUMAN_CONFIRMED: { t: "info", l: "Human confirmed" },
  PARTNER_REPORTED: { t: "warn", l: "Partner reported" },
  MODEL_EXTRACTED: { t: "warn", l: "Model extracted" },
  UNVERIFIABLE: { t: "bad", l: "Unverifiable" },
};
export const BasisPill = ({ s }: { s: VerificationBasis }) => (
  <Pill tone={basisMap[s].t}>{basisMap[s].l}</Pill>
);

const evStatus: Record<EvidenceStatus, { t: Tone; l: string }> = {
  SUBMITTED: { t: "muted", l: "Submitted" },
  RETRIEVED_FROM_SOURCE: { t: "good", l: "Retrieved from source" },
  HUMAN_CONFIRMED: { t: "info", l: "Human confirmed" },
  UNVERIFIABLE: { t: "bad", l: "Unverifiable" },
  CONTRADICTED: { t: "bad", l: "Contradicted" },
  WITHDRAWN: { t: "muted", l: "Withdrawn" },
};
export const EvidenceStatusPill = ({ s }: { s: EvidenceStatus }) => (
  <Pill tone={evStatus[s].t}>{evStatus[s].l}</Pill>
);

const findingMap: Record<FindingStatus, { t: Tone; l: string }> = {
  SUPPORTED: { t: "good", l: "Supported" },
  PARTIALLY_SUPPORTED: { t: "warn", l: "Partially supported" },
  UNRESOLVED: { t: "warn", l: "Unresolved" },
  CONTRADICTED: { t: "bad", l: "Contradicted" },
};
export const FindingPill = ({ s }: { s: FindingStatus }) => (
  <Pill tone={findingMap[s].t}>{findingMap[s].l}</Pill>
);

const dlvMap: Record<DeliverableStatus, { t: Tone; l: string }> = {
  PENDING: { t: "muted", l: "Pending" },
  VERIFIED_FULFILLED: { t: "good", l: "Verified" },
  USER_CONFIRMED_FULFILLED: { t: "info", l: "Confirmed by you" },
  UNRESOLVED: { t: "warn", l: "Unresolved" },
  LATE: { t: "warn", l: "Late" },
  MISSED: { t: "bad", l: "Missed" },
};
export const DeliverablePill = ({ s }: { s: DeliverableStatus }) => (
  <Pill tone={dlvMap[s].t}>{dlvMap[s].l}</Pill>
);

export function AsOf({ source = FIXTURE_SOURCE, at = AS_OF }: { source?: string; at?: string }) {
  return (
    <p className="asof">
      As of {fmtUtc(at)} · {source}
    </p>
  );
}

export function Crumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      {items.map((it, i) => (
        <span key={it.label} style={{ display: "contents" }}>
          {i > 0 && <span className="sep">/</span>}
          {it.href ? (
            <Link href={it.href}>{it.label}</Link>
          ) : (
            <span aria-current="page">{it.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function Empty({
  title,
  body,
  cta,
}: {
  title: string;
  body: string;
  cta?: { label: string; href: string };
}) {
  return (
    <div className="empty">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden>
        <rect
          x="5"
          y="9"
          width="30"
          height="22"
          rx="4"
          stroke="#5d636d"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />
        <path d="M13 20h14" stroke="#a597ff" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <h3>{title}</h3>
      <p>{body}</p>
      {cta && (
        <Link className="btn primary sm" href={cta.href}>
          {cta.label}
        </Link>
      )}
    </div>
  );
}

export function Arrow() {
  return (
    <svg className="arr" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3 8h10m0 0L9 4m4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const laneColor = {
  delivery: "var(--delivery)",
  market: "var(--market)",
  attribution: "var(--attribution)",
  system: "var(--dim)",
} as const;
export const laneName = {
  delivery: "Delivery",
  market: "Observed market activity",
  attribution: "Attribution",
} as const;
