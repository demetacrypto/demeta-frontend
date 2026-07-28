export type BrainStage = Readonly<{
  stage: string;
  status: string;
  trades?: number | null;
  pf?: number | null;
  net_pnl?: number | null;
  drawdown?: number | null;
  reason?: string | null;
  skip_reason?: string | null;
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
  stage?: Record<string, string>;
  performance?: Readonly<{ trades?: number | null; profit_factor?: number | null; net_pnl?: number | null; drawdown?: number | null }>;
  ba7?: Readonly<{ initial_action?: string | null; final_action?: string | null; reason?: string | null; reservation_id?: string | null; reservation_release?: string | null; released?: boolean }>;
  ba8?: Readonly<{ package_id?: string | null; status?: string | null; missing_requirements?: string[]; snapshot_id?: string | null }>;
  last_updated_at?: string | null;
  stages?: BrainStage[];
  summary?: Readonly<{ hypothesis?: string | null; components?: string[]; failure_condition?: string | null }>;
  learning?: Readonly<{ reflection_id?: string | null; facts?: string[]; inferences?: string[]; unavailable_evidence?: string[]; next_research_recommendation?: string | null }>;
  improvement_history?: ReadonlyArray<Readonly<{ parent_candidate_id?: string | null; child_candidate_id?: string | null; reason?: string | null; changed_components?: string[] | null }>>;
}>;

export type BrainEvent = Readonly<{ id?: string; timestamp?: string | null; type?: string | null; candidate_id?: string | null; summary?: string | null }>;
export type BrainResearchData = Readonly<{
  status: Record<string, unknown>;
  candidates: BrainCandidate[];
  events: BrainEvent[];
  deliveryPackages: Record<string, unknown>[];
}>;

const apiBase = String(import.meta.env.VITE_BRAIN_RESEARCH_API_BASE || "").replace(/\/$/, "");

export function configuredBrainApiBase(): string | null {
  return apiBase || null;
}

async function readJson<T>(path: string): Promise<T> {
  const response = await fetch(`${apiBase}${path}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    credentials: "omit",
    cache: "no-store"
  });
  if (!response.ok) throw new Error(`brain_api_${response.status}`);
  return response.json() as Promise<T>;
}

export async function loadBrainResearch(): Promise<BrainResearchData> {
  if (!apiBase) throw new Error("brain_api_unconfigured");
  const [status, candidates, events, deliveryPackages] = await Promise.all([
    readJson<Record<string, unknown>>("/brain/research/status"),
    readJson<{ items?: BrainCandidate[] }>("/brain/research/candidates"),
    readJson<{ items?: BrainEvent[] }>("/brain/research/events"),
    readJson<{ items?: Record<string, unknown>[] }>("/brain/research/delivery-packages")
  ]);
  return {
    status,
    candidates: Array.isArray(candidates.items) ? candidates.items : [],
    events: Array.isArray(events.items) ? events.items : [],
    deliveryPackages: Array.isArray(deliveryPackages.items) ? deliveryPackages.items : []
  };
}
