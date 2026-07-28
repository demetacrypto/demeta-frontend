import { useEffect, useState, type ReactNode } from "react";
import {
  configuredBrainApiBase,
  loadKnowledgeOperations,
  type CandidateStage,
  type CandidateStageEvidence,
  type ConnectorOutcome,
  type KnowledgeOperationsData,
  type LatestCandidate,
  type Projection,
  type ProjectionState
} from "../brainResearch";
import { routeHref } from "../routing";

const endpointLabels = Object.freeze({ worker: "Worker", queue: "Queue", sources: "Sources", trust: "Trust" });

function readable(value: string | null | undefined, fallback = "Not recorded") {
  if (!value) return fallback;
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function dateTime(value: string | null | undefined, fallback = "Not recorded") {
  if (!value || Number.isNaN(Date.parse(value))) return fallback;
  return new Intl.DateTimeFormat("en-AU", { timeZone: "Australia/Darwin", dateStyle: "medium", timeStyle: "medium" }).format(new Date(value));
}

function exactNumber(value: number | null | undefined) {
  return typeof value === "number" && Number.isFinite(value) ? String(value) : "Not recorded";
}

function shortId(value: string | null | undefined) {
  if (!value) return "Not recorded";
  return value.length > 32 ? `${value.slice(0, 19)}…${value.slice(-9)}` : value;
}

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function atomText(value: unknown): string {
  if (value === null || value === undefined || value === "") return "Not recorded";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") return Number.isFinite(value) ? String(value) : "Not recorded";
  const text = String(value);
  return /[\s.:@/]/.test(text) ? text : readable(text);
}

function evidenceKeyLabel(key: string) {
  const exactLabels: Readonly<Record<string, string>> = Object.freeze({
    stage1: "Stage 1",
    stage_1: "Stage 1",
    stage1_5: "Stage 1.5",
    stage_1_5: "Stage 1.5",
    stage2: "Stage 2",
    stage_2: "Stage 2",
    evidence_id: "Evidence ID"
  });
  return exactLabels[key] || readable(key);
}

function formattedEvidence(value: unknown, depth: number): string {
  if (Array.isArray(value)) {
    const present = value.filter((item) => item !== null && item !== undefined && item !== "");
    return present.map((item) => formattedEvidence(item, depth + 1)).join(depth > 0 ? ", " : " · ");
  }
  if (isRecord(value)) {
    if (depth >= 3) return "Nested evidence recorded";
    return Object.entries(value)
      .filter(([, item]) => item !== null && item !== undefined && item !== "")
      .map(([key, item]) => {
        const structured = isRecord(item) || (Array.isArray(item) && item.some(isRecord));
        const rendered = formattedEvidence(item, depth + 1);
        return depth > 0 || structured ? `${evidenceKeyLabel(key)}: ${rendered}` : rendered;
      })
      .join(" · ");
  }
  return atomText(value);
}

function evidenceText(value: unknown, fallback = "Not recorded") {
  if (value === null || value === undefined || value === "") return fallback;
  const rendered = formattedEvidence(value, 0);
  return rendered || fallback;
}

function recordValue(record: Readonly<Record<string, unknown>>, ...keys: string[]) {
  return keys.map((key) => record[key]).find((value) => value !== null && value !== undefined);
}

function recordItems(value: unknown): ReadonlyArray<Readonly<Record<string, unknown>>> {
  return Array.isArray(value) ? value.filter(isRecord) : [];
}

function statusClass(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9_-]+/g, "-");
}

const stageKeys = Object.freeze({
  stage1: Object.freeze(["stage1", "stage_1"]),
  stage15: Object.freeze(["stage1_5", "stage_1_5"]),
  stage2: Object.freeze(["stage2", "stage_2"])
} as const);

function stageSignal(stageStatus: CandidateStageEvidence["status"], keys: ReadonlyArray<string>, stage: CandidateStage | null | undefined) {
  const signal = isRecord(stageStatus) ? keys.map((key) => stageStatus[key]).find((value) => value !== null && value !== undefined) : undefined;
  const signalRecord = isRecord(signal) ? signal : null;
  const status = typeof signal === "string"
    ? signal
    : typeof signalRecord?.status === "string"
      ? signalRecord.status
      : stage?.status || (typeof stageStatus === "string" && keys === stageKeys.stage1 ? stageStatus : "unavailable");
  const reason = typeof signalRecord?.reason === "string" ? signalRecord.reason : stage?.reason;
  return { status, reason } as const;
}

function stageProgress(stageStatus: CandidateStageEvidence["status"]) {
  if (!isRecord(stageStatus)) return readable(typeof stageStatus === "string" ? stageStatus : null);
  const labels = Object.freeze([ [stageKeys.stage1, "Stage 1"], [stageKeys.stage15, "Stage 1.5"], [stageKeys.stage2, "Stage 2"] ] as const);
  const values = labels.flatMap(([keys, label]) => {
    const signal = keys.map((key) => stageStatus[key]).find((value) => value !== null && value !== undefined);
    const status = typeof signal === "string" ? signal : isRecord(signal) && typeof signal.status === "string" ? signal.status : null;
    return status ? [`${label}: ${readable(status)}`] : [];
  });
  return values.length ? values.join(" · ") : "Not recorded";
}

function StateBadge({ label, state }: Readonly<{ label: string; state: ProjectionState }>) {
  return <span className={`research-state research-state--${state}`} role="status" aria-label={`${label} state: ${readable(state)}`}><i aria-hidden="true" />{readable(state)}</span>;
}

function ProjectionHeader<T>({ label, title, titleId, projection }: Readonly<{ label: string; title: string; titleId: string; projection: Projection<T> }>) {
  return <header className="research-panel__header"><div><p>{label}</p><h2 id={titleId}>{title}</h2></div><StateBadge label={label} state={projection.state} /></header>;
}

function ProjectionMessage<T>({ projection }: Readonly<{ projection: Projection<T> }>) {
  if (projection.state === "available" && projection.data) return null;
  const fallback = projection.state === "empty" ? "No records are currently present." : `This ${projection.state} projection has no current evidence.`;
  return <p className={`research-message research-message--${projection.state}`}>{projection.reason || fallback}</p>;
}

function DataPoint({ label, value, note }: Readonly<{ label: string; value: ReactNode; note?: ReactNode }>) {
  return <div className="research-data-point"><dt>{label}</dt><dd>{value}{note ? <small>{note}</small> : null}</dd></div>;
}

function Breakdown({ title, counts }: Readonly<{ title: string; counts: Readonly<Record<string, number>> | null | undefined }>) {
  const entries = Object.entries(counts || {});
  return <section className="breakdown" aria-label={title}><h3>{title}</h3>{entries.length ? <dl>{entries.map(([label, count]) => <DataPoint key={label} label={atomText(label)} value={exactNumber(count)} />)}</dl> : <p>No breakdown recorded.</p>}</section>;
}

function StageOutcome({ name, stage, status, reason }: Readonly<{ name: string; stage: CandidateStage | null | undefined; status: string; reason?: string | null }>) {
  const metrics = [
    typeof stage?.trades === "number" ? `${stage.trades} trades` : null,
    typeof (stage?.profit_factor ?? stage?.pf) === "number" ? `PF ${stage?.profit_factor ?? stage?.pf}` : null,
    typeof stage?.net_pnl === "number" ? `PnL ${stage.net_pnl}` : null
  ].filter(Boolean).join(" · ");
  return <li className={`candidate-step candidate-step--${statusClass(status)}`}><span>{name}</span><strong>{name} — {readable(status)}</strong><p>{metrics || readable(reason, status === "skipped" || status === "not_permitted" ? "Prior gate did not pass" : "No metrics recorded")}</p>{typeof stage?.max_drawdown === "number" ? <small>Drawdown {stage.max_drawdown}</small> : null}</li>;
}

function WorkerPanel({ projection }: Readonly<{ projection: KnowledgeOperationsData["worker"] }>) {
  const worker = projection.data;
  const spark = worker?.spark;
  return <section className="research-panel research-panel--worker" aria-labelledby="worker-title">
    <ProjectionHeader label="Worker" title="Runtime pulse" titleId="worker-title" projection={projection} />
    <ProjectionMessage projection={projection} />
    {worker ? <>
      <dl className="research-data-grid">
        <DataPoint label="Version" value={worker.version || "Not recorded"} />
        <DataPoint label="Heartbeat" value={dateTime(worker.heartbeat_at)} note={projection.state === "stale" ? "Heartbeat is outside the current freshness window." : undefined} />
        <DataPoint label="Scheduler" value={`Scheduler ${readable(worker.scheduler?.status)}`} note={worker.scheduler?.pause_reason ? readable(worker.scheduler.pause_reason) : undefined} />
        <DataPoint label="Last cycle" value={dateTime(worker.scheduler?.last_run_at, "No completed cycle recorded")} />
        <DataPoint label="Next cycle" value={dateTime(worker.scheduler?.next_run_at, "Not scheduled")} />
        <DataPoint label="Last crawl" value={dateTime(worker.last_crawl_at, "No crawl recorded")} />
        <DataPoint label="Authority" value="Research and paper only" note="No live, capital, order, promotion, or configuration authority." />
      </dl>
      <div className="spark-block"><span>Spark advisory bridge</span><strong>Spark {readable(spark?.status)}</strong><p>{exactNumber(spark?.variants_generated)} generated · {exactNumber(spark?.variants_admitted)} admitted · limit {exactNumber(spark?.variant_limit)}</p><dl><DataPoint label="Runtime" value={readable(spark?.runtime_status)} /><DataPoint label="Deterministic fallback" value={spark?.fallback === null || spark?.fallback === undefined ? "Not recorded" : spark.fallback ? "Active" : "Not active"} /></dl></div>
    </> : null}
  </section>;
}

function QueuePanel({ projection }: Readonly<{ projection: KnowledgeOperationsData["queue"] }>) {
  const queue = projection.data;
  const items = recordItems(queue?.items);
  const decisions = recordItems(queue?.admission_decisions);
  return <section className="research-panel" aria-labelledby="queue-title">
    <ProjectionHeader label="Queue" title="Bounded work" titleId="queue-title" projection={projection} />
    <ProjectionMessage projection={projection} />
    {queue ? <>
      <dl className="queue-counts"><DataPoint label="Pending" value={exactNumber(queue.counts?.pending)} /><DataPoint label="Running" value={exactNumber(queue.counts?.running)} /><DataPoint label="Held" value={exactNumber(queue.counts?.held)} /></dl>
      <div className="capacity-block"><h3>Active paper capacity</h3><dl><DataPoint label="Compute" value={exactNumber(queue.active_capacity?.compute)} /><DataPoint label="Seconds" value={exactNumber(queue.active_capacity?.time_seconds)} /><DataPoint label="Stage runs" value={exactNumber(queue.active_capacity?.stage_runs)} /><DataPoint label="Active candidates" value={exactNumber(queue.active_capacity?.active_candidates)} /></dl></div>
      <section className="compact-ledger"><h3>Research queue</h3>{items.length ? <ul>{items.map((item, index) => <li key={String(recordValue(item, "candidate_id", "job_id", "id") || index)}><strong>{String(recordValue(item, "candidate_id", "job_id", "id") || "Unnamed job")}</strong><span>{evidenceText([recordValue(item, "kind", "job_type"), recordValue(item, "status"), recordValue(item, "priority")])}</span><p>{evidenceText(recordValue(item, "reason", "reason_codes"), "No hold reason recorded.")}</p></li>)}</ul> : <p>Queue clear — no jobs recorded.</p>}</section>
      <section className="compact-ledger"><h3>Research Admission Gate</h3>{decisions.length ? <ul>{decisions.map((decision, index) => <li key={String(recordValue(decision, "decision_id", "candidate_id", "id") || index)}><strong>{String(recordValue(decision, "candidate_id", "decision_id", "id") || "Admission decision")}</strong><span>{evidenceText([recordValue(decision, "status"), recordValue(decision, "rank")])}</span><p>{evidenceText(recordValue(decision, "reason_codes", "reasons"))}</p></li>)}</ul> : <p>No admission-gate decision recorded.</p>}</section>
    </> : null}
  </section>;
}

function ConnectorRow({ connector }: Readonly<{ connector: ConnectorOutcome }>) {
  return <li><span className={`connector-mark connector-mark--${connector.outcome || "unavailable"}`} aria-hidden="true" /><div><strong>{connector.label || connector.id || "Unnamed connector"}</strong><p>{connector.detail || "No connector detail recorded."}</p></div><div><b>{readable(connector.outcome)}</b><time>{dateTime(connector.last_run_at)}</time></div></li>;
}

function SourcesPanel({ projection }: Readonly<{ projection: KnowledgeOperationsData["sources"] }>) {
  const sources = projection.data;
  const connectors = recordItems(sources?.connectors) as ReadonlyArray<ConnectorOutcome>;
  const failures = recordItems(sources?.fetch_failures);
  return <section className="research-panel research-panel--sources" aria-labelledby="sources-title">
    <ProjectionHeader label="Sources" title="Connector ledger" titleId="sources-title" projection={projection} />
    <ProjectionMessage projection={projection} />
    {sources ? <>
      <dl className="source-totals"><DataPoint label="Receipts" value={exactNumber(sources.receipt_count)} /><DataPoint label="Snapshots" value={exactNumber(sources.snapshot_count)} /><DataPoint label="Quarantined" value={exactNumber(sources.quarantine_count)} /><DataPoint label="Last crawl" value={dateTime(sources.last_crawl_at, "No crawl recorded")} /></dl>
      <div className="breakdown-pair"><Breakdown title="Sources by trust tier" counts={sources.counts_by_tier} /><Breakdown title="Sources by domain" counts={sources.counts_by_domain} /></div>
      {connectors.length ? <ul className="connector-ledger">{connectors.map((connector, index) => <ConnectorRow connector={connector} key={connector.id || `${connector.label}-${index}`} />)}</ul> : <p className="research-empty-note">No connector outcomes recorded.</p>}
      <section className="compact-ledger"><h3>Fetch failures</h3>{failures.length ? <ul>{failures.map((failure, index) => <li key={String(recordValue(failure, "failure_id", "source_id") || index)}><strong>{String(recordValue(failure, "source_id", "connector_id") || "Unknown source")}</strong><span>{evidenceText(recordValue(failure, "reason", "code", "status"))}</span><p>{evidenceText([recordValue(failure, "count"), dateTime(String(recordValue(failure, "occurred_at", "last_failed_at") || ""))])}</p></li>)}</ul> : <p>No fetch failures recorded.</p>}</section>
    </> : null}
  </section>;
}

function TrustPanel({ projection }: Readonly<{ projection: KnowledgeOperationsData["trust"] }>) {
  const trust = projection.data;
  const gaps = Array.isArray(trust?.active_knowledge_gaps) ? trust.active_knowledge_gaps.filter((gap) => typeof gap === "string" || isRecord(gap)) : [];
  const skills = recordItems(trust?.skills);
  const decisions = recordItems(trust?.admission_decisions);
  return <section className="research-panel" aria-labelledby="trust-title">
    <ProjectionHeader label="Trust" title="Admission chain" titleId="trust-title" projection={projection} />
    <ProjectionMessage projection={projection} />
    {trust ? <>
      <dl className="trust-totals"><DataPoint label="Registered sources" value={exactNumber(trust.registered_source_count)} /><DataPoint label="Trusted sources" value={exactNumber(trust.trusted_source_count)} /><DataPoint label="Admitted claims" value={exactNumber(trust.admitted_claim_count)} /><DataPoint label="Validated skills" value={exactNumber(trust.validated_skill_count)} /><DataPoint label="Active gaps" value={exactNumber(trust.active_gap_count ?? gaps.length)} /></dl>
      <div className="admission-note"><span>Latest admission</span><strong>{readable(trust.latest_admission?.status)}</strong><p>{trust.latest_admission?.reason || "No admission decision recorded."}</p></div>
      <section className="compact-ledger"><h3>Active knowledge gaps</h3>{gaps.length ? <ul>{gaps.map((gap, index) => { const record = isRecord(gap) ? gap : {}; return <li key={String(recordValue(record, "gap_id", "id") || index)}><strong>{String(recordValue(record, "gap_id", "id") || gap)}</strong><span>{evidenceText([recordValue(record, "status"), recordValue(record, "priority")])}</span><p>{String(recordValue(record, "summary", "question", "query", "description") || gap)}</p></li>; })}</ul> : <p>No active knowledge gaps recorded.</p>}</section>
      <section className="compact-ledger"><h3>Validated skill versions</h3>{skills.length ? <ul>{skills.map((skill, index) => <li key={String(recordValue(skill, "skill_id", "id") || index)}><strong>{String(recordValue(skill, "skill_id") || "Unnamed skill")} · v{evidenceText(recordValue(skill, "version"))} · {readable(typeof recordValue(skill, "validation_state") === "string" ? String(recordValue(skill, "validation_state")) : null)}</strong><span>{shortId(typeof recordValue(skill, "validation_receipt_id") === "string" ? String(recordValue(skill, "validation_receipt_id")) : null)}</span><p>Registry {shortId(typeof recordValue(skill, "registry_snapshot_id") === "string" ? String(recordValue(skill, "registry_snapshot_id")) : null)}</p></li>)}</ul> : <p>No skill version records available.</p>}</section>
      <section className="compact-ledger"><h3>Claim admission decisions</h3>{decisions.length ? <ul>{decisions.map((decision, index) => <li key={String(recordValue(decision, "admission_id", "id") || index)}><strong>{String(recordValue(decision, "admission_id", "id") || "Admission decision")}</strong><span>{evidenceText([recordValue(decision, "claim_id"), recordValue(decision, "status")])}</span><p>{evidenceText(recordValue(decision, "reason_codes", "reasons"))}</p></li>)}</ul> : <p>No claim admission history recorded.</p>}</section>
    </> : null}
  </section>;
}

function CandidateOutcome({ candidate }: Readonly<{ candidate: LatestCandidate | null | undefined }>) {
  if (!candidate) return <p className="candidate-empty">No candidate outcome recorded.</p>;
  const title = evidenceText(candidate.ba8?.strategy_summary, shortId(candidate.candidate_id));
  const ba6Status = candidate.ba6 ? "recorded" : "unavailable";
  const ba7Status = candidate.ba7?.action === "retire_candidate" ? "retired" : candidate.ba7?.action || "unavailable";
  const stage1 = stageSignal(candidate.stage?.status, stageKeys.stage1, candidate.stage?.stage1_metrics);
  const stage15 = stageSignal(candidate.stage?.status, stageKeys.stage15, candidate.stage?.stage15_metrics);
  const stage2 = stageSignal(candidate.stage?.status, stageKeys.stage2, candidate.stage?.stage2_metrics);
  return <section className="candidate-outcome" aria-labelledby="candidate-title">
    <header><div><p>Latest governed candidate</p><h2 id="candidate-title">{title}</h2></div><code>{shortId(candidate.candidate_id)}</code></header>
    <section className="candidate-evidence"><h3>Candidate lineage</h3><dl><DataPoint label="Composition" value={candidate.lineage?.composition_id || "Not recorded"} /><DataPoint label="Hypothesis" value={candidate.lineage?.hypothesis_id || "Not recorded"} /><DataPoint label="Research spec" value={candidate.lineage?.research_spec_id || "Not recorded"} /><DataPoint label="StrategySpec" value={candidate.lineage?.strategy_spec_id || "Not recorded"} /><DataPoint label="Factory decision" value={candidate.lineage?.factory_decision_id || "Not recorded"} /><DataPoint label="Selected paper bot" value={candidate.lineage?.selected_bot_id || "Not recorded"} /></dl></section>
    <section className="candidate-evidence"><h3>Exact Stage evidence</h3><dl><DataPoint label="Progress" value={stageProgress(candidate.stage?.status)} /><DataPoint label="Dataset" value={candidate.stage?.dataset_id || "Not recorded"} /><DataPoint label="Dataset SHA-256" value={candidate.stage?.dataset_sha256 || "Not recorded"} /><DataPoint label="Evidence IDs" value={evidenceText(candidate.stage?.evidence_ids)} /></dl></section>
    <ol className="candidate-stage-line" aria-label="Stage outcomes"><StageOutcome name="Stage 1" stage={candidate.stage?.stage1_metrics} status={stage1.status} reason={stage1.reason} /><StageOutcome name="Stage 1.5" stage={candidate.stage?.stage15_metrics} status={stage15.status} reason={stage15.reason} /><StageOutcome name="Stage 2" stage={candidate.stage?.stage2_metrics} status={stage2.status} reason={stage2.reason} /></ol>
    <div className="governed-outcomes">
      <article className={`governed-outcome governed-outcome--${ba6Status}`}><span>BA-6</span><strong>BA-6 {readable(ba6Status)}</strong><h3>Failure classification</h3><p>{evidenceText(candidate.ba6?.failure_classification)}</p><dl><DataPoint label="Causal confidence" value={evidenceText(candidate.ba6?.causal_confidence)} /><DataPoint label="Components" value={evidenceText(candidate.ba6?.component_attribution)} /><DataPoint label="Regimes" value={evidenceText(candidate.ba6?.regime_attribution)} /><DataPoint label="Data limits" value={evidenceText(candidate.ba6?.data_limits)} /></dl><p>{candidate.ba6?.reusable_lesson || "No reusable lesson recorded."}</p></article>
      <article className={`governed-outcome governed-outcome--${statusClass(ba7Status)}`}><span>BA-7</span><strong>BA-7 {readable(ba7Status)}</strong><p>{candidate.ba7?.action ? readable(candidate.ba7.action) : "No decision recorded."}</p><dl><DataPoint label="Decision" value={candidate.ba7?.decision_id || "Not recorded"} /><DataPoint label="Reasons" value={evidenceText(candidate.ba7?.reason_codes)} /><DataPoint label="Human boundary" value={candidate.ba7?.human_approval_required === null || candidate.ba7?.human_approval_required === undefined ? "Not recorded" : candidate.ba7.human_approval_required ? "Human approval required" : "Human approval not required"} /></dl></article>
      <article className="governed-outcome governed-outcome--research"><span>Failure-directed research</span><strong>{candidate.directed_research?.knowledge_gap || "No knowledge gap recorded"}</strong><p>{candidate.directed_research?.books_index_searched_first === null || candidate.directed_research?.books_index_searched_first === undefined ? "Books-first search not recorded" : candidate.directed_research.books_index_searched_first ? "Books index searched first" : "Books index was not searched first"}</p><dl><DataPoint label="Queries" value={evidenceText(candidate.directed_research?.queries)} /><DataPoint label="Repair evidence" value={evidenceText(candidate.directed_research?.evidence_used_for_repairs)} /></dl></article>
    </div>
    <section className={`ba8-package ba8-package--${candidate.ba8?.status || "unavailable"}`}><header><div><span>BA-8 package</span><h3>BA-8 {readable(candidate.ba8?.status)}</h3></div><code>{candidate.ba8?.package_id || "No package ID"}</code></header><dl><DataPoint label="Strategy summary" value={evidenceText(candidate.ba8?.strategy_summary)} /><DataPoint label="Stage evidence" value={evidenceText(candidate.ba8?.stage_evidence)} /><DataPoint label="Risks" value={evidenceText(candidate.ba8?.risks)} /><DataPoint label="Limitations" value={evidenceText(candidate.ba8?.limitations)} /><DataPoint label="Evidence confidence" value={evidenceText(candidate.ba8?.evidence_confidence)} /><DataPoint label="Proposed target" value={evidenceText(candidate.ba8?.proposed_target)} /><DataPoint label="Package hash" value={candidate.ba8?.package_hash || "Not recorded"} /><DataPoint label="Expiry" value={dateTime(candidate.ba8?.expiry)} /><DataPoint label="Required human decision" value={evidenceText(candidate.ba8?.required_human_decision)} /><DataPoint label="Blocked reasons" value={evidenceText(candidate.ba8?.blocked_reasons)} /></dl></section>
  </section>;
}

function BrainDecisionFlow({ data }: Readonly<{ data: KnowledgeOperationsData }>) {
  const candidate = data.worker.data?.latest_candidate;
  const stage = candidate?.stage;
  const stage1 = stageSignal(stage?.status || null, stageKeys.stage1, stage?.stage1_metrics);
  const stage15 = stageSignal(stage?.status || null, stageKeys.stage15, stage?.stage15_metrics);
  const stage2 = stageSignal(stage?.status || null, stageKeys.stage2, stage?.stage2_metrics);
  const nodes = [
    ["BA-0", "Thinking boundary", "available", "Immutable authority contract; read/derive only, no runtime or order authority."],
    ["BA-1", "Memory spine", candidate?.lineage?.hypothesis_id ? "recorded" : "not_recorded", "Requires a descriptive, immutable event; it never grants execution authority."],
    ["BA-2", "Source & claim admission", data.trust.data?.admitted_claim_count ? "admitted" : "unavailable", "Requires receipt-bound source evidence and fail-closed claim admission."],
    ["BA-3", "Skill validation", data.trust.data?.validated_skill_count ? "validated" : "unavailable", "Requires a validated skill version and immutable receipt lineage."],
    ["BA-4", "Hypothesis & protocol", candidate?.lineage?.hypothesis_id ? "recorded" : "unavailable", "Requires an observable contract and bounded experiment protocol."],
    ["BA-5", "StrategySpec creation", candidate?.lineage?.strategy_spec_id ? "created" : "unavailable", "Requires an admitted BA-4 hypothesis and fixed strategy lineage."],
    ["Stage 1", "Sealed evaluation", stage1.status || "unavailable", "Requires canonical declared-scope evidence; pass is required before Stage 1.5."],
    ["Stage 1.5", "Robustness gate", stage15.status || "not_permitted", "Runs only after Stage 1 passes; otherwise it remains skipped/not permitted."],
    ["Stage 2", "Paper shadow gate", stage2.status || "not_permitted", "Runs only after upstream gates pass; it is not live authority or auto-apply."],
    ["BA-6", "Reflection", candidate?.ba6?.failure_classification ? "recorded" : "unavailable", "Requires immutable Stage evidence; records diagnosis and reusable research learning only."],
    ["BA-7", "Bounded decision", candidate?.ba7?.action || "unavailable", "Requires BA-6 evidence and capacity accounting; selects only a bounded research action."],
    ["BA-8", "Human-governed package", candidate?.ba8?.status || "unavailable", "Requires complete evidence and remains non-executable pending the explicit human boundary."],
  ] as const;
  return <section className="brain-flow" aria-labelledby="brain-flow-title" data-live-updated={data.worker.updatedAt || "unavailable"}>
    <header><div><p>Live evidence path · 15 second visible refresh</p><h2 id="brain-flow-title">DEMETA thinking → governed strategy outcome</h2></div><span>{dateTime(data.worker.updatedAt, "No current worker projection")}</span></header>
    <p className="brain-flow__intro">The diagram renders persisted evidence where it exists. Contractual steps stay explicitly contractual; absent evidence is never inferred as a pass.</p>
    <ol className="brain-flow__nodes">
      {nodes.map(([id, title, state, condition]) => <li key={id} className={`brain-flow__node brain-flow__node--${statusClass(String(state))}`}>
        <span>{id}</span><strong>{title}</strong><b>{readable(String(state))}</b><p>{condition}</p>
      </li>)}
    </ol>
  </section>;
}

function compactMetric(value: number | null | undefined, fractionDigits = 2) {
  return typeof value === "number" && Number.isFinite(value)
    ? new Intl.NumberFormat("en-AU", { maximumFractionDigits: fractionDigits }).format(value)
    : "Not recorded";
}

function OperatorSummary({ data }: Readonly<{ data: KnowledgeOperationsData }>) {
  const candidate = data.worker.data?.latest_candidate;
  const stage = candidate?.stage;
  const stage1 = stageSignal(stage?.status || null, stageKeys.stage1, stage?.stage1_metrics);
  const queue = data.queue.data?.counts;
  const source = data.sources.data;
  const query = candidate?.directed_research?.queries?.filter((item): item is string => typeof item === "string" && item.trim().length > 0)[0];
  const noChange = candidate?.ba8?.status === "blocked" || stage1.status === "failed";
  return <section className="operator-summary" aria-labelledby="operator-summary-title">
    <header><div><p>Operator summary · live persisted evidence</p><h2 id="operator-summary-title">What happened — simply</h2></div><span>{dateTime(data.worker.updatedAt, "No current update")}</span></header>
    <div className="operator-summary__status">
      <strong>{noChange ? "No strategy was applied" : "Research outcome needs review"}</strong>
      <p>{noChange ? "This was paper research only. No live trade, capital, configuration, or bot change was made." : "This page reports evidence only; it cannot apply a strategy or change a bot."}</p>
    </div>
    <div className="operator-summary__cards">
      <article><span>1 · What ran</span><strong>Automatic research cycle</strong><p>Last completed: {dateTime(data.worker.data?.scheduler?.last_run_at, "Not recorded")}.</p><small>{exactNumber(source?.receipt_count)} source receipt · {exactNumber(data.trust.data?.admitted_claim_count)} claim admitted · {exactNumber(data.trust.data?.validated_skill_count)} skill validated</small></article>
      <article className={stage1.status === "failed" ? "operator-summary__card--bad" : ""}><span>2 · Result</span><strong>Stage 1 — {readable(stage1.status)}</strong><p>{typeof stage?.stage1_metrics?.trades === "number" ? `${stage.stage1_metrics.trades} historical paper trades` : "No Stage-1 trade count recorded"}.</p><small>PF {compactMetric(stage?.stage1_metrics?.profit_factor ?? stage?.stage1_metrics?.pf, 2)} · PnL {compactMetric(stage?.stage1_metrics?.net_pnl, 0)}</small></article>
      <article><span>3 · Why it stopped</span><strong>{stage1.status === "failed" ? "Stage 1 did not pass" : "Awaiting Stage evidence"}</strong><p>{stage1.status === "failed" ? "Stage 1.5 and Stage 2 were not run because the first gate failed." : "No downstream gate result is available yet."}</p><small>BA-8: {readable(candidate?.ba8?.status, "not recorded")}</small></article>
      <article><span>4 · What happens next</span><strong>{readable(candidate?.ba7?.action, "no decision recorded")}</strong><p>{query ? `Research focus: ${query}.` : "No next research question recorded."}</p><small>Queue: {exactNumber(queue?.pending)} pending · {exactNumber(queue?.running)} running</small></article>
    </div>
  </section>;
}

function OperationsContent({ data }: Readonly<{ data: KnowledgeOperationsData }>) {
  return <><nav className="brain-nav" aria-label="Operations Console"><a href={routeHref("/")}>Dashboard</a><a aria-current="page" href={routeHref("/brain-research")}>Knowledge operations</a></nav><header className="research-hero"><div><p>Autonomous research · read-only evidence</p><h1>Knowledge operations</h1><p className="research-hero__deck">A private-console view of bounded paper research. Start with the summary; technical evidence is available below when needed.</p></div><div className="authority-seal" aria-label="Authority boundary"><span>Authority boundary</span><strong>Zero live control</strong><p>No action on this page can run, retry, approve, deliver, apply, promote, or configure anything.</p></div></header><OperatorSummary data={data} /><details className="technical-audit"><summary>Technical audit details <small>IDs, flow map, source ledger, and full evidence</small></summary><div className="technical-audit__content"><BrainDecisionFlow data={data} /><div id="operations-evidence" className="research-layout"><WorkerPanel projection={data.worker} /><QueuePanel projection={data.queue} /><SourcesPanel projection={data.sources} /><TrustPanel projection={data.trust} /></div><CandidateOutcome candidate={data.worker.data?.latest_candidate} /></div></details><footer className="research-footer"><span>Last projection updates</span><p>{Object.entries(data).map(([key, projection]) => `${endpointLabels[key as keyof typeof endpointLabels]} ${dateTime(projection.updatedAt)}`).join(" · ")}</p></footer></>;
}

export default function BrainResearch() {
  const [data, setData] = useState<KnowledgeOperationsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    let timer = 0;
    const refresh = () => loadKnowledgeOperations().then((result) => {
      if (active) { setData(result); setError(null); }
    }).catch((reason: unknown) => {
      if (active) setError(reason instanceof Error ? reason.message : "research_api_unavailable");
    });
    const schedule = () => {
      window.clearInterval(timer);
      timer = window.setInterval(refresh, document.hidden ? 60000 : 15000);
    };
    refresh(); schedule(); document.addEventListener("visibilitychange", schedule);
    return () => { active = false; window.clearInterval(timer); document.removeEventListener("visibilitychange", schedule); };
  }, []);
  return <main id="main" className="brain-research">{!configuredBrainApiBase() ? <section className="brain-notice"><p>Read-only private console</p><h1>Knowledge operations</h1><p>Brain research projections are not configured for this origin.</p></section> : error ? <section className="brain-notice"><p>Read-only private console</p><h1>Knowledge operations</h1><p>Research observability could not initialise.</p><code>{error}</code></section> : data ? <OperationsContent data={data} /> : <section className="brain-notice" aria-live="polite"><p>Read-only private console</p><h1>Knowledge operations</h1><p>Loading bounded research evidence…</p></section>}</main>;
}
