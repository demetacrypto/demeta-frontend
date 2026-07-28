import { useEffect, useId, useRef, useState } from "react";
import { configuredBrainApiBase, loadBrainResearch, type BrainCandidate, type BrainEvent, type BrainResearchData, type BrainStage, type Evidence } from "../brainResearch";
import { routeHref } from "../routing";

const helpCopy = {
  "Brain Research": "Read-only evidence from the deployed paper-research sidecar. This page cannot start cycles, run Stages, approve BA-8, or affect trading.",
  Sidecar: "The isolated paper-research service that records certified evidence. Its status is operational health, not strategy profitability.",
  "Latest Autonomous Cycle": "The latest completed paper cycle timestamp from persisted certified evidence; it does not refresh or start a cycle.",
  Authority: "All live order, capital, risk, configuration, promotion, deployment, and process-control authority is denied.",
  "Strategies / Candidates": "Candidate records preserve their evidence and immutable identifiers. A retired candidate is a governed outcome, not a pass.",
  Hypothesis: "The paper-only statement under test, plus its null and alternative statements when the artifact records them.",
  "Modular Components": "The specific entry, exit, and bounded repair elements recorded in the StrategySpec lineage.",
  "Stage Timeline": "Stages are shown as failed, skipped, or passed exactly as persisted. A skipped Stage never implies a pass.",
  Trades: "Closed trade count recorded by the Stage evaluator. A real zero remains zero, not unavailable.",
  PF: "Profit factor from the recorded Stage metrics.",
  PnL: "Net PnL from the recorded Stage metrics.",
  Drawdown: "Capital-normalized drawdown is shown only when calculated; quote-unit drawdown is labelled separately.",
  "BA-6 Learning": "Measured findings and bounded lessons stored by the reflection artifact.",
  "BA-7 Decision": "The controller-selected paper action and final disposition; it never grants live control.",
  Capacity: "Reserved and released paper-only compute, time, and Stage-run capacity using the canonical reservation ID.",
  "BA-8 Delivery": "A truthful blocked or ready-for-human-review package only. This page cannot approve or deliver it.",
  "Activity Feed": "Newest-first, structured events derived from persisted cycle, Stage, reflection, capacity, and BA-8 artifacts."
} as const;

type HelpLabel = keyof typeof helpCopy;

function Help({ label }: Readonly<{ label: HelpLabel }>) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const root = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    const closeOnOutsidePointer = (event: PointerEvent) => { if (root.current && !root.current.contains(event.target as Node)) setOpen(false); };
    window.addEventListener("keydown", closeOnEscape);
    window.addEventListener("pointerdown", closeOnOutsidePointer);
    return () => { window.removeEventListener("keydown", closeOnEscape); window.removeEventListener("pointerdown", closeOnOutsidePointer); };
  }, []);
  return <span ref={root} className="brain-help">
    <button type="button" aria-label={`Help: ${label}`} aria-describedby={open ? id : undefined} aria-expanded={open} onMouseEnter={() => setOpen(true)} onFocus={() => setOpen(true)} onMouseLeave={() => setOpen(false)} onBlur={() => setOpen(false)} onClick={() => setOpen(true)}>?</button>
    {open ? <span id={id} role="tooltip">{helpCopy[label]}</span> : null}
  </span>;
}

function readable(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function shortId(value: string | null | undefined) {
  if (!value) return "Not recorded";
  return value.length > 18 ? `${value.slice(0, 10)}…${value.slice(-6)}` : value;
}

function evidenceText(value: Evidence<unknown> | null | undefined, fallback = "Not recorded in this candidate artifact") {
  if (!value) return fallback;
  if (value.state === "available") {
    if (Array.isArray(value.value)) return value.value.join(" · ");
    if (typeof value.value === "object" && value.value) return Object.entries(value.value).map(([key, item]) => `${item} ${readable(key)}`).join(", ");
    return value.value === null ? fallback : String(value.value);
  }
  return `${readable(value.state)} — ${value.reason || fallback}`;
}

function dateTime(value: Evidence<string> | null | undefined) {
  if (!value || value.state !== "available" || !value.value || Number.isNaN(Date.parse(value.value))) return evidenceText(value);
  return new Intl.DateTimeFormat("en-AU", { timeZone: "Australia/Darwin", dateStyle: "medium", timeStyle: "medium" }).format(new Date(value.value));
}

function stageName(value: string) {
  return value === "stage1" ? "Stage 1" : value === "stage1_5" ? "Stage 1.5" : value === "stage2" ? "Stage 2" : readable(value);
}

function stageStatus(value: string | null | undefined): "failed" | "skipped" | "passed" | "unavailable" {
  if (String(value).startsWith("skipped")) return "skipped";
  if (value === "failed") return "failed";
  if (value === "passed") return "passed";
  return "unavailable";
}

function Metric({ label, value, help }: Readonly<{ label: string; value: Evidence<unknown> | undefined; help: HelpLabel }>) {
  return <div className="brain-metric"><span>{label} <Help label={help} /></span><strong>{evidenceText(value)}</strong></div>;
}

function StageRow({ stage }: Readonly<{ stage: BrainStage }>) {
  const status = stageStatus(stage.status);
  const reason = status === "skipped" ? evidenceText(stage.skip_reason) : evidenceText(stage.reason);
  return <li>
    <span>{stageName(stage.stage)}</span>
    <strong className={`brain-state brain-state--${status}`}>{stageName(stage.stage)} — {readable(status)}</strong>
    <p>{reason}</p>
    <small>{dateTime(stage.ended_at)}</small>
  </li>;
}

function Metadata({ candidate }: Readonly<{ candidate: BrainCandidate }>) {
  return <details className="brain-metadata"><summary>Evidence IDs and provenance</summary><dl>
    <div><dt>Candidate</dt><dd>{candidate.candidate_id}</dd></div>
    <div><dt>Parent</dt><dd>{candidate.parent_candidate_id || "Not recorded in this candidate artifact"}</dd></div>
    <div><dt>Stage 1</dt><dd>{evidenceText(candidate.stages?.[0]?.stage_id)}</dd></div>
    <div><dt>Reservation</dt><dd>{evidenceText(candidate.ba7?.reservation_id)}</dd></div>
    <div><dt>Snapshot</dt><dd>{evidenceText(candidate.ba8?.snapshot_id)}</dd></div>
    <div><dt>BA-8 package</dt><dd>{evidenceText(candidate.ba8?.package_id)}</dd></div>
  </dl></details>;
}

function CandidateDetail({ candidate }: Readonly<{ candidate: BrainCandidate }>) {
  return <section className="brain-detail" aria-labelledby="candidate-detail-title">
    <div className="brain-section-heading"><div><p>Candidate evidence</p><h2 id="candidate-detail-title">{candidate.label || shortId(candidate.candidate_id)}</h2></div><span>{shortId(candidate.candidate_id)}</span></div>
    <p className="brain-detail__meta">Created {dateTime(candidate.created_at)} · Updated {dateTime(candidate.updated_at)}</p>
    <div className="brain-detail-grid">
      <article><h3>Hypothesis <Help label="Hypothesis" /></h3><p>{evidenceText(candidate.summary?.hypothesis)}</p><p><b>Null:</b> {evidenceText(candidate.summary?.null_hypothesis)}</p><p><b>Alternative:</b> {evidenceText(candidate.summary?.alternative_hypothesis)}</p></article>
      <article><h3>Modular components <Help label="Modular Components" /></h3><p>{evidenceText(candidate.summary?.components)}</p><p><b>Expected regime:</b> {evidenceText(candidate.summary?.expected_market_condition)}</p><p><b>Failure condition:</b> {evidenceText(candidate.summary?.failure_condition)}</p></article>
      <article><h3>Stage timeline <Help label="Stage Timeline" /></h3><ol className="brain-timeline">{(candidate.stages || []).map((stage) => <StageRow key={stage.stage} stage={stage} />)}</ol></article>
      <article><h3>BA-6 learning <Help label="BA-6 Learning" /></h3><p>{evidenceText(candidate.learning?.facts)}</p><p>{evidenceText(candidate.learning?.inferences)}</p><p className="brain-muted">{evidenceText(candidate.learning?.next_research_recommendation)}</p></article>
      <article><h3>BA-7 decision <Help label="BA-7 Decision" /></h3><p>{evidenceText(candidate.ba7?.initial_action)} → {evidenceText(candidate.ba7?.final_action)}</p><p>{evidenceText(candidate.ba7?.reason)}</p><p><b>Repair:</b> {evidenceText(candidate.ba7?.changed_component)}</p><p>{evidenceText(candidate.ba7?.repair_thesis)}</p></article>
      <article><h3>Capacity <Help label="Capacity" /></h3><p><b>Reserved:</b> {evidenceText(candidate.ba7?.capacity?.reserved)}</p><p><b>Released:</b> {evidenceText(candidate.ba7?.capacity?.released)}</p><p>{candidate.ba7?.released ? "Terminal capacity released." : "No terminal capacity release recorded."}</p></article>
      <article className="brain-detail__wide"><h3>BA-8 limitations <Help label="BA-8 Delivery" /></h3><p><b>{evidenceText(candidate.ba8?.status)}</b></p><p>{evidenceText(candidate.ba8?.missing_requirements)}</p><p><b>Expiry:</b> {dateTime(candidate.ba8?.expiry)}</p><Metadata candidate={candidate} /></article>
    </div>
  </section>;
}

function ActivityFeed({ events }: Readonly<{ events: BrainEvent[] }>) {
  return <section className="brain-activity" aria-labelledby="activity-title"><div className="brain-section-heading"><div><p>Structured audit</p><h2 id="activity-title">Activity feed <Help label="Activity Feed" /></h2></div><span>Newest first</span></div><ol>{events.map((event, index) => <li key={event.id || `${event.type}-${index}`}><time>{dateTime(event.timestamp)}</time><strong>{readable(event.type || "event")}</strong><p>{event.explanation || "No explanation recorded."}</p><span>{shortId(event.candidate_id)}{event.stage_id ? ` · ${shortId(event.stage_id)}` : ""}</span></li>)}</ol></section>;
}

function ResearchContent({ data }: Readonly<{ data: BrainResearchData }>) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const candidate = data.candidates.find((item) => item.candidate_id === selectedId) || data.candidates[0];
  const sidecar = data.status.service || {};
  return <>
    <nav className="brain-nav" aria-label="Operations Console"><a href={routeHref("/")}>Dashboard</a><a aria-current="page" href={routeHref("/brain-research")}>Brain Research</a></nav>
    <section className="brain-hero" aria-labelledby="brain-title"><p>Read-only observability · paper research only</p><h1 id="brain-title">Brain Research <Help label="Brain Research" /></h1><p className="brain-hero__deck">Governed candidate evidence, gates, reflection and delivery disposition. This surface cannot start cycles, route Stages, approve delivery, or affect trading.</p><dl className="brain-status"><div><dt>Sidecar <Help label="Sidecar" /></dt><dd>Sidecar {String(sidecar.state || "unavailable")}</dd></div><div><dt>Latest autonomous cycle <Help label="Latest Autonomous Cycle" /></dt><dd>{dateTime(data.status.last_autonomous_cycle_at)}</dd></div><div><dt>Authority <Help label="Authority" /></dt><dd>Denied for live control</dd></div></dl></section>
    <section className="brain-candidates" aria-labelledby="candidate-list-title"><div className="brain-section-heading"><div><p>Candidate ledger</p><h2 id="candidate-list-title">Strategies / candidates <Help label="Strategies / Candidates" /></h2></div><span>{data.candidates.length} recorded</span></div>{data.candidates.map((item) => <a className="brain-candidate" href={`#${encodeURIComponent(item.candidate_id)}`} key={item.candidate_id} onClick={() => setSelectedId(item.candidate_id)}><div><span>{item.target_bot || "Not recorded"} · {item.symbol || "Not recorded"} · {item.timeframe || "Not recorded"}</span><strong>{item.label || shortId(item.candidate_id)}</strong><small>{shortId(item.candidate_id)}</small></div><div className="brain-candidate__stages">{["stage1", "stage1_5", "stage2"].map((stage) => <span key={stage}><b>{stageName(stage)}</b>{readable(stageStatus(item.stage?.[stage]))}</span>)}</div><div className="brain-candidate__metrics"><Metric label="Trades" value={item.performance?.trades} help="Trades" /><Metric label="PF" value={item.performance?.profit_factor} help="PF" /><Metric label="PnL" value={item.performance?.net_pnl} help="PnL" /><Metric label="Drawdown" value={item.performance?.drawdown} help="Drawdown" /></div><div className="brain-candidate__decision"><span>BA-7 {evidenceText(item.ba7?.final_action)}</span><strong>BA-8 {evidenceText(item.ba8?.status)}</strong></div></a>)}</section>
    {candidate ? <CandidateDetail candidate={candidate} /> : <p className="brain-empty">No completed paper candidate is available.</p>}
    <ActivityFeed events={data.events} />
  </>;
}

export default function BrainResearch() {
  const [data, setData] = useState<BrainResearchData | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { let active = true; loadBrainResearch().then((result) => { if (active) setData(result); }).catch((reason: unknown) => { if (active) setError(reason instanceof Error ? reason.message : "brain_api_unavailable"); }); return () => { active = false; }; }, []);
  return <main id="main" className="brain-research"><a className="skip-link" href="#candidate-list-title">Skip to candidates</a>{!configuredBrainApiBase() ? <section className="brain-notice"><h1>Brain Research</h1><p>Brain API endpoint is not configured.</p><p>This read-only interface remains unavailable until its authenticated same-origin API route is configured.</p></section> : error ? <section className="brain-notice"><h1>Brain Research</h1><p>Read-only Brain data is unavailable.</p><code>{error}</code></section> : data ? <ResearchContent data={data} /> : <section className="brain-notice"><h1>Brain Research</h1><p>Loading read-only research evidence…</p></section>}</main>;
}
