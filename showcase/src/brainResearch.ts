export type EvidenceState = "available" | "unavailable" | "not_applicable" | "skipped" | "not_calculated";

export type Evidence<T> = Readonly<{
  state: EvidenceState;
  value: T | null;
  reason: string | null;
}>;

export type BrainStage = Readonly<{
  stage: string;
  stage_id: Evidence<string>;
  status: string;
  started_at: Evidence<string>;
  ended_at: Evidence<string>;
  trades: Evidence<number>;
  pf: Evidence<number>;
  net_pnl: Evidence<number>;
  drawdown: Evidence<number>;
  reason: Evidence<string>;
  skip_reason: Evidence<string>;
}>;

export type BrainCandidate = Readonly<{
  candidate_id: string;
  label?: string | null;
  parent_candidate_id?: string | null;
  child_candidate_id?: string | null;
  target_bot?: string | null;
  symbol?: string | null;
  timeframe?: string | null;
  current_stage?: string | null;
  lifecycle_status?: string | null;
  created_at: Evidence<string>;
  updated_at: Evidence<string>;
  stage?: Record<string, string>;
  performance?: Readonly<{ trades: Evidence<number>; profit_factor: Evidence<number>; net_pnl: Evidence<number>; drawdown: Evidence<number> }>;
  ba7?: Readonly<{
    initial_action: Evidence<string>;
    final_action: Evidence<string>;
    reason: Evidence<string>;
    repair_thesis: Evidence<string>;
    changed_component: Evidence<string>;
    reservation_id: Evidence<string>;
    reservation_release: Evidence<string>;
    capacity: Readonly<{ reserved: Evidence<Record<string, number>>; released: Evidence<Record<string, number>> }>;
    released?: boolean;
  }>;
  ba8?: Readonly<{ package_id: Evidence<string>; status: Evidence<string>; missing_requirements: Evidence<string[]>; expiry: Evidence<string>; snapshot_id: Evidence<string> }>;
  stages?: BrainStage[];
  summary?: Readonly<{
    hypothesis: Evidence<string>;
    null_hypothesis: Evidence<string>;
    alternative_hypothesis: Evidence<string>;
    components: Evidence<string[]>;
    expected_market_condition: Evidence<string>;
    failure_condition: Evidence<string>;
  }>;
  learning?: Readonly<{ reflection_id: Evidence<string>; facts: Evidence<string[]>; inferences: Evidence<string[]>; unavailable_evidence: Evidence<string[]>; next_research_recommendation: Evidence<string> }>;
  improvement_history?: ReadonlyArray<Readonly<{ parent_candidate_id?: string | null; child_candidate_id?: string | null; reason?: string | null; changed_components?: string[] | null; final_disposition?: string | null }>>;
}>;

export type BrainEvent = Readonly<{
  id?: string;
  timestamp: Evidence<string>;
  type?: string | null;
  candidate_id?: string | null;
  stage_id?: string | null;
  package_id?: string | null;
  explanation?: string | null;
}>;

export type BrainResearchData = Readonly<{
  status: Readonly<{ service?: Record<string, unknown>; last_autonomous_cycle_at?: Evidence<string> }>;
  candidates: BrainCandidate[];
  events: BrainEvent[];
  deliveryPackages: Record<string, unknown>[];
}>;

const testApiBase = window.location.hostname === "127.0.0.1"
  ? new URLSearchParams(window.location.search).get("brainApiBase") || ""
  : "";
const apiBase = String(import.meta.env.VITE_BRAIN_RESEARCH_API_BASE || testApiBase).replace(/\/$/, "");

export function configuredBrainApiBase(): string | null {
  return apiBase || null;
}

async function readJson<T>(path: string): Promise<T> {
  const response = await fetch(`${apiBase}${path}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    credentials: "same-origin",
    cache: "no-store"
  });
  if (!response.ok) throw new Error(`brain_api_${response.status}`);
  return response.json() as Promise<T>;
}

export async function loadBrainResearch(): Promise<BrainResearchData> {
  if (!apiBase) throw new Error("brain_api_unconfigured");
  const [status, candidates, events, deliveryPackages] = await Promise.all([
    readJson<BrainResearchData["status"]>("/status"),
    readJson<{ items?: BrainCandidate[] }>("/candidates"),
    readJson<{ items?: BrainEvent[] }>("/events"),
    readJson<{ items?: Record<string, unknown>[] }>("/delivery-packages")
  ]);
  return {
    status,
    candidates: Array.isArray(candidates.items) ? candidates.items : [],
    events: Array.isArray(events.items) ? events.items : [],
    deliveryPackages: Array.isArray(deliveryPackages.items) ? deliveryPackages.items : []
  };
}
