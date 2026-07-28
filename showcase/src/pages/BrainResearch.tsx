import { useEffect, useState } from "react";
import { configuredBrainApiBase, loadBrainResearch, type BrainCandidate, type BrainResearchData } from "../brainResearch";

const unavailable = "Unavailable";

function present(value: unknown): string {
  return value === null || value === undefined || value === "" ? unavailable : String(value);
}

function dateTime(value: unknown): string {
  if (!value || Number.isNaN(Date.parse(String(value)))) return unavailable;
  return new Intl.DateTimeFormat("en-AU", {
    timeZone: "Australia/Darwin",
    dateStyle: "medium",
    timeStyle: "medium"
  }).format(new Date(String(value)));
}

function stageName(value: string): string {
  return value === "stage1" ? "Stage 1" : value === "stage1_5" ? "Stage 1.5" : value === "stage2" ? "Stage 2" : value;
}

function stageStatus(value: string | null | undefined): string {
  if (String(value).startsWith("skipped")) return "Skipped: Stage 1 failed";
  return value === "failed" ? "Failed" : value === "passed" ? "Passed" : present(value);
}

function Metric({ label, value }: Readonly<{ label: string; value: unknown }>) {
  return <div className="brain-metric"><span>{label}</span><strong>{present(value)}</strong></div>;
}

function CandidateDetail({ candidate }: Readonly<{ candidate: BrainCandidate }>) {
  return (
    <section className="brain-detail" aria-labelledby="candidate-detail-title">
      <div className="brain-section-heading">
        <div>
          <p>Candidate evidence</p>
          <h2 id="candidate-detail-title">{present(candidate.label)}</h2>
        </div>
        <code>{candidate.candidate_id}</code>
      </div>
      <div className="brain-detail-grid">
        <article><h3>Hypothesis</h3><p>{present(candidate.summary?.hypothesis)}</p><h3>Modular components</h3><p>{candidate.summary?.components?.join(" · ") || unavailable}</p></article>
        <article><h3>Stage timeline</h3><ol className="brain-timeline">{(candidate.stages || []).map((stage) => <li key={stage.stage}><span>{stageName(stage.stage)}</span><strong className={`brain-state brain-state--${String(stage.status).split("_")[0]}`}>{stageStatus(stage.status)}</strong><p>{present(stage.reason || stage.skip_reason)}</p></li>)}</ol></article>
        <article><h3>BA-6 learning</h3><p>{candidate.learning?.facts?.join(" ") || unavailable}</p><p className="brain-muted">{present(candidate.learning?.next_research_recommendation)}</p><code>{present(candidate.learning?.reflection_id)}</code></article>
        <article><h3>Repair and disposition</h3><p>BA-7: {present(candidate.ba7?.initial_action)} → {present(candidate.ba7?.final_action)}</p><p>{candidate.ba7?.released ? "Capacity released" : unavailable}</p><code>{present(candidate.ba7?.reservation_id)}</code><p>{present(candidate.ba7?.reason)}</p><p>Final disposition: {present(candidate.lifecycle_status)}</p></article>
        <article className="brain-detail__wide"><h3>BA-8 limitations</h3><p>{candidate.ba8?.missing_requirements?.join(" · ") || unavailable}</p><code>{present(candidate.ba8?.package_id)}</code><code>{present(candidate.ba8?.snapshot_id)}</code></article>
      </div>
    </section>
  );
}

function ResearchContent({ data }: Readonly<{ data: BrainResearchData }>) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const candidate = data.candidates.find((item) => item.candidate_id === selectedId) || data.candidates[0];
  const sidecar = (data.status.sidecar || {}) as Record<string, unknown>;
  return (
    <>
      <section className="brain-hero" aria-labelledby="brain-title">
        <p>Read-only observability · paper research only</p>
        <h1 id="brain-title">Brain Research</h1>
        <p className="brain-hero__deck">A governed record of candidate evidence, gates, reflection and delivery disposition. This surface cannot start cycles, route stages, approve delivery, or affect trading.</p>
        <dl className="brain-status">
          <div><dt>Sidecar</dt><dd>Sidecar {present(sidecar.state)}</dd></div>
          <div><dt>Latest autonomous cycle</dt><dd>{dateTime(data.status.latest_cycle_at)}</dd></div>
          <div><dt>Authority</dt><dd>Denied for live control</dd></div>
        </dl>
      </section>
      <section className="brain-candidates" aria-labelledby="candidate-list-title">
        <div className="brain-section-heading"><div><p>Candidate ledger</p><h2 id="candidate-list-title">Strategies / candidates</h2></div><span>{data.candidates.length} recorded</span></div>
        {data.candidates.map((item) => (
          <a className="brain-candidate" href={`#${encodeURIComponent(item.candidate_id)}`} key={item.candidate_id} onClick={() => setSelectedId(item.candidate_id)}>
            <div><span>{present(item.target_bot)} · {present(item.symbol)} · {present(item.timeframe)}</span><strong>{present(item.label)}</strong><code>{item.candidate_id}</code></div>
            <div className="brain-candidate__stages">{["stage1", "stage1_5", "stage2"].map((stage) => <span key={stage}><b>{stageName(stage)}</b>{stageStatus(item.stage?.[stage])}</span>)}</div>
            <div className="brain-candidate__metrics"><Metric label="Trades" value={item.performance?.trades} /><Metric label="PF" value={item.performance?.profit_factor} /><Metric label="PnL" value={item.performance?.net_pnl} /><Metric label="Drawdown" value={item.performance?.drawdown} /></div>
            <div className="brain-candidate__decision"><span>BA-7 {present(item.ba7?.final_action)}</span><strong>BA-8 {present(item.ba8?.status)}</strong></div>
          </a>
        ))}
      </section>
      {candidate ? <CandidateDetail candidate={candidate} /> : <p className="brain-empty">No completed paper candidate is available.</p>}
      <section className="brain-activity" aria-labelledby="activity-title"><div className="brain-section-heading"><div><p>Structured audit</p><h2 id="activity-title">Activity feed</h2></div><span>Read-only</span></div><ol>{data.events.map((event, index) => <li key={event.id || `${event.timestamp}-${index}`}><time>{dateTime(event.timestamp)}</time><strong>{present(event.type)}</strong><p>{present(event.summary)}</p><code>{present(event.candidate_id)}</code></li>)}</ol></section>
    </>
  );
}

export default function BrainResearch() {
  const [data, setData] = useState<BrainResearchData | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    loadBrainResearch().then((result) => { if (active) setData(result); }).catch((reason: unknown) => { if (active) setError(reason instanceof Error ? reason.message : "brain_api_unavailable"); });
    return () => { active = false; };
  }, []);
  return <main id="main" className="brain-research">
    <a className="skip-link" href="#candidate-list-title">Skip to candidates</a>
    {!configuredBrainApiBase() ? <section className="brain-notice"><h1>Brain Research</h1><p>Brain API endpoint is not configured.</p><p>This read-only interface will remain unavailable until a sanctioned HTTPS API origin is configured.</p></section> : error ? <section className="brain-notice"><h1>Brain Research</h1><p>Read-only Brain data is unavailable.</p><code>{error}</code></section> : data ? <ResearchContent data={data} /> : <section className="brain-notice"><h1>Brain Research</h1><p>Loading read-only research evidence…</p></section>}
  </main>;
}
