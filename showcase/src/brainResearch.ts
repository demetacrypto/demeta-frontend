export type ProjectionState = "available" | "stale" | "unavailable" | "error" | "empty";

export type Projection<T> = Readonly<{
  state: ProjectionState;
  reason: string | null;
  updatedAt: string | null;
  data: T | null;
}>;

export type SchedulerStatus = Readonly<{
  status?: string | null;
  last_run_at?: string | null;
  next_run_at?: string | null;
  pause_reason?: string | null;
}>;

export type CandidateStage = Readonly<{
  status?: string | null;
  reason?: string | null;
  trades?: number | null;
  pf?: number | null;
  profit_factor?: number | null;
  net_pnl?: number | null;
  max_drawdown?: number | null;
}>;

export type CandidateLineage = Readonly<{
  composition_id?: string | null;
  hypothesis_id?: string | null;
  research_spec_id?: string | null;
  strategy_spec_id?: string | null;
  factory_decision_id?: string | null;
  selected_bot_id?: string | null;
}>;

export type CandidateStageEvidence = Readonly<{
  status?: string | Readonly<Record<string, unknown>> | null;
  dataset_id?: string | null;
  dataset_sha256?: string | null;
  evidence_ids?: ReadonlyArray<string> | null;
  stage1_metrics?: CandidateStage | null;
  stage15_metrics?: CandidateStage | null;
  stage2_metrics?: CandidateStage | null;
}>;

export type DirectedResearch = Readonly<{
  knowledge_gap?: string | null;
  books_index_searched_first?: boolean | null;
  queries?: ReadonlyArray<string> | null;
  evidence_used_for_repairs?: Readonly<Record<string, unknown>> | null;
}>;

export type LatestCandidate = Readonly<{
  candidate_id?: string | null;
  label?: string | null;
  lineage?: CandidateLineage | null;
  stage?: CandidateStageEvidence | null;
  ba6?: Readonly<{
    failure_classification?: Readonly<Record<string, unknown>> | null;
    causal_confidence?: string | number | null;
    component_attribution?: Readonly<Record<string, unknown>> | ReadonlyArray<unknown> | null;
    regime_attribution?: Readonly<Record<string, unknown>> | ReadonlyArray<unknown> | null;
    data_limits?: ReadonlyArray<unknown> | null;
    reusable_lesson?: string | null;
  }> | null;
  ba7?: Readonly<{
    decision_id?: string | null;
    action?: string | null;
    reason_codes?: ReadonlyArray<string> | null;
    human_approval_required?: boolean | null;
  }> | null;
  ba8?: Readonly<{
    package_id?: string | null;
    status?: string | null;
    strategy_summary?: Readonly<Record<string, unknown>> | null;
    stage_evidence?: Readonly<Record<string, unknown>> | ReadonlyArray<unknown> | null;
    risks?: ReadonlyArray<unknown> | null;
    limitations?: ReadonlyArray<unknown> | null;
    evidence_confidence?: string | number | null;
    proposed_target?: Readonly<Record<string, unknown>> | null;
    package_hash?: string | null;
    expiry?: string | null;
    required_human_decision?: Readonly<Record<string, unknown>> | string | null;
    blocked_reasons?: ReadonlyArray<string> | null;
  }> | null;
  directed_research?: DirectedResearch | null;
}>;

export type WorkerProjection = Readonly<{
  version?: string | null;
  heartbeat_at?: string | null;
  last_crawl_at?: string | null;
  scheduler?: SchedulerStatus | null;
  spark?: Readonly<{
    status?: string | null;
    runtime_status?: string | null;
    variants_generated?: number | null;
    variants_admitted?: number | null;
    variant_limit?: number | null;
    fallback?: boolean | null;
  }> | null;
  latest_candidate?: LatestCandidate | null;
}>;

export type QueueProjection = Readonly<{
  counts?: Readonly<{ pending?: number | null; running?: number | null; held?: number | null }> | null;
  active_capacity?: Readonly<{
    compute?: number | null;
    time_seconds?: number | null;
    stage_runs?: number | null;
    active_candidates?: number | null;
  }> | null;
  items?: ReadonlyArray<Readonly<Record<string, unknown>>> | null;
  admission_decisions?: ReadonlyArray<Readonly<Record<string, unknown>>> | null;
}>;

export type ConnectorOutcome = Readonly<{
  id?: string | null;
  label?: string | null;
  outcome?: string | null;
  last_run_at?: string | null;
  detail?: string | null;
}>;

export type SourcesProjection = Readonly<{
  last_crawl_at?: string | null;
  counts_by_tier?: Readonly<Record<string, number>> | null;
  counts_by_domain?: Readonly<Record<string, number>> | null;
  fetch_failures?: ReadonlyArray<Readonly<Record<string, unknown>>> | null;
  quarantine_count?: number | null;
  receipt_count?: number | null;
  snapshot_count?: number | null;
  connectors?: ReadonlyArray<ConnectorOutcome> | null;
}>;

export type TrustProjection = Readonly<{
  registered_source_count?: number | null;
  trusted_source_count?: number | null;
  admitted_claim_count?: number | null;
  validated_skill_count?: number | null;
  active_gap_count?: number | null;
  active_knowledge_gaps?: ReadonlyArray<Readonly<Record<string, unknown>> | string> | null;
  skills?: ReadonlyArray<Readonly<{
    skill_id?: string | null;
    version?: string | number | null;
    validation_state?: string | null;
    validation_receipt_id?: string | null;
    registry_snapshot_id?: string | null;
  }>> | null;
  admission_decisions?: ReadonlyArray<Readonly<Record<string, unknown>>> | null;
  latest_admission?: Readonly<{ status?: string | null; reason?: string | null }> | null;
}>;

export type KnowledgeOperationsData = Readonly<{
  worker: Projection<WorkerProjection>;
  queue: Projection<QueueProjection>;
  sources: Projection<SourcesProjection>;
  trust: Projection<TrustProjection>;
}>;

const testApiBase = window.location.hostname === "127.0.0.1"
  ? new URLSearchParams(window.location.search).get("brainApiBase") || ""
  : "";
const apiBase = String(import.meta.env.VITE_BRAIN_RESEARCH_API_BASE || testApiBase).replace(/\/$/, "");
const projectionStates = new Set<ProjectionState>(["available", "stale", "unavailable", "error", "empty"]);

export function configuredBrainApiBase(): string | null {
  return apiBase || null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function optionalString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

function normalizeProjection<T>(payload: unknown): Projection<T> {
  const invalid = (): Projection<T> => ({ state: "error", reason: "research_api_invalid_envelope", updatedAt: null, data: null });
  if (!isRecord(payload) || !Object.hasOwn(payload, "state") || !Object.hasOwn(payload, "data")) return invalid();
  const declaredState = optionalString(payload.state);
  if (!declaredState || !projectionStates.has(declaredState as ProjectionState)) return invalid();
  if (payload.data !== null && !isRecord(payload.data)) return invalid();
  if ((declaredState === "available" || declaredState === "stale") && !isRecord(payload.data)) return invalid();
  if (Object.hasOwn(payload, "reason") && payload.reason !== null && typeof payload.reason !== "string") return invalid();
  if (Object.hasOwn(payload, "updated_at") && payload.updated_at !== null && typeof payload.updated_at !== "string") return invalid();
  return {
    state: declaredState as ProjectionState,
    reason: optionalString(payload.reason),
    updatedAt: optionalString(payload.updated_at),
    data: payload.data as T | null
  };
}

async function readProjection<T>(endpoint: "worker" | "queue" | "sources" | "trust"): Promise<Projection<T>> {
  try {
    const response = await fetch(`${apiBase}/${endpoint}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "same-origin",
      cache: "no-store"
    });
    if (!response.ok) return { state: "error", reason: `research_api_${response.status}`, updatedAt: null, data: null };
    return normalizeProjection<T>(await response.json());
  } catch (error) {
    return {
      state: "error",
      reason: error instanceof Error && error.message ? error.message : "research_api_unavailable",
      updatedAt: null,
      data: null
    };
  }
}

let operationsEtag: string | null = null;
let operationsCache: KnowledgeOperationsData | null = null;

export async function loadKnowledgeOperations(): Promise<KnowledgeOperationsData> {
  if (!apiBase) throw new Error("research_api_unconfigured");
  try {
    const response = await fetch(`${apiBase}/operations`, {
      method: "GET",
      headers: { Accept: "application/json", ...(operationsEtag ? { "If-None-Match": operationsEtag } : {}) },
      credentials: "same-origin",
      cache: "no-store"
    });
    if (response.status === 304 && operationsCache) return operationsCache;
    if (response.ok) {
      const envelope = await response.json();
      const data = isRecord(envelope) && isRecord(envelope.data) ? envelope.data : null;
      if (data) {
        const next = {
          worker: normalizeProjection<WorkerProjection>(data.worker),
          queue: normalizeProjection<QueueProjection>(data.queue),
          sources: normalizeProjection<SourcesProjection>(data.sources),
          trust: normalizeProjection<TrustProjection>(data.trust)
        };
        operationsEtag = response.headers.get("ETag") || null;
        operationsCache = next;
        return next;
      }
    }
  } catch {
    // Fall through to the independently bounded legacy projections.
  }
  const [worker, queue, sources, trust] = await Promise.all([
    readProjection<WorkerProjection>("worker"), readProjection<QueueProjection>("queue"),
    readProjection<SourcesProjection>("sources"), readProjection<TrustProjection>("trust")
  ]);
  return { worker, queue, sources, trust };
}
