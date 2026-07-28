import { expect, test } from "@playwright/test";

const apiBase = "/brain/research";
const candidateId = "research-candidate:3f1a8bd817bbe19abd79219811d9861b4ab9e24c1c487d71195b7598e4a0272a";
const routeWithMockApi = `/brain-research/?brainApiBase=${encodeURIComponent(apiBase)}`;
const available = (value: unknown) => ({ state: "available", value, reason: null });
const skipped = (reason: string) => ({ state: "skipped", value: null, reason });
const unavailable = (reason: string) => ({ state: "unavailable", value: null, reason });
const notCalculated = (value: unknown, reason: string) => ({ state: "not_calculated", value, reason });

const candidate = {
  candidate_id: candidateId,
  label: "trend_following · BTC/USDT · 15m",
  parent_candidate_id: "candidate-manifest:sha256:parent",
  child_candidate_id: candidateId,
  target_bot: "BotB",
  symbol: "BTC/USDT",
  timeframe: "15m",
  current_stage: "stage1",
  lifecycle_status: "retired",
  created_at: available("2026-07-28T00:00:00Z"),
  updated_at: available("2026-07-28T00:00:00Z"),
  stage: { stage1: "failed", stage1_5: "skipped_prior_gate_failed", stage2: "skipped_prior_gate_failed" },
  performance: { trades: available(0), profit_factor: available(0), net_pnl: available(0), drawdown: notCalculated(0, "Capital-normalized drawdown was not calculated; quote-unit drawdown is shown.") },
  ba7: {
    initial_action: available("repair_candidate"),
    final_action: available("retire_candidate"),
    reason: available("stage1_not_passed"),
    repair_thesis: available("The existing UP-regime guard passes unchanged gates."),
    changed_component: available("add_existing_up_regime_guard"),
    reservation_id: available("ba7-reservation:canonical"),
    reservation_release: available("release_unused_capacity"),
    capacity: { reserved: available({ compute: 40, stage_runs: 3, time_seconds: 900 }), released: available({ compute: 40, stage_runs: 3, time_seconds: 900 }) },
    released: true
  },
  ba8: {
    package_id: available("ba8-package:sha256:blocked"),
    status: available("blocked"),
    missing_requirements: available(["stage1_not_passed", "stage1_5_not_passed", "stage2_not_passed"]),
    expiry: available("2026-08-04T00:00:00Z"),
    snapshot_id: available("brain-source-snapshot-c1581a50a055")
  },
  stages: [
    { stage: "stage1", stage_id: available("stage-evidence:stage1"), status: "failed", started_at: unavailable("Not recorded in this Stage evidence artifact."), ended_at: unavailable("Not recorded in this Stage evidence artifact."), trades: available(0), pf: available(0), net_pnl: available(0), drawdown: notCalculated(0, "Capital-normalized drawdown was not calculated; quote-unit drawdown is shown."), reason: available("no_trades"), skip_reason: unavailable("Not applicable because this Stage was evaluated.") },
    { stage: "stage1_5", stage_id: available("stage-evidence:stage15"), status: "skipped_prior_gate_failed", started_at: unavailable("Not recorded in this Stage evidence artifact."), ended_at: unavailable("Not recorded in this Stage evidence artifact."), trades: skipped("prior_stage_gate_failed"), pf: skipped("prior_stage_gate_failed"), net_pnl: skipped("prior_stage_gate_failed"), drawdown: skipped("prior_stage_gate_failed"), reason: available("prior_stage_gate_failed"), skip_reason: available("prior_stage_gate_failed") },
    { stage: "stage2", stage_id: available("stage-evidence:stage2"), status: "skipped_prior_gate_failed", started_at: unavailable("Not recorded in this Stage evidence artifact."), ended_at: unavailable("Not recorded in this Stage evidence artifact."), trades: skipped("prior_stage_gate_failed"), pf: skipped("prior_stage_gate_failed"), net_pnl: skipped("prior_stage_gate_failed"), drawdown: skipped("prior_stage_gate_failed"), reason: available("prior_stage_gate_failed"), skip_reason: available("prior_stage_gate_failed") }
  ],
  summary: {
    hypothesis: available("Evaluate the unchanged setup only in the declared UP regime."),
    null_hypothesis: available("The guard does not pass unchanged gates."),
    alternative_hypothesis: available("The guard passes unchanged gates."),
    components: available(["entry: EMA_FAST cross_above", "exit: max hold 48 bars", "repair: add_existing_up_regime_guard"]),
    expected_market_condition: available("UP"),
    failure_condition: available("bounded_repair_overconstraint_zero_trades")
  },
  learning: {
    reflection_id: available("ba6-reflection:51b28c0e"),
    facts: available(["Stage-1 recorded zero trades."]),
    inferences: available(["The repair was overconstrained; retire without a second repair."]),
    unavailable_evidence: available(["Funding is not modeled."]),
    next_research_recommendation: available("Preserve the negative lesson.")
  },
  improvement_history: [{ parent_candidate_id: "candidate-manifest:sha256:parent", child_candidate_id: candidateId, reason: "stage1_not_passed", changed_components: ["repair: add_existing_up_regime_guard"], final_disposition: "retire_candidate" }]
};

async function mockBrainApi(page: import("@playwright/test").Page) {
  await page.route("**/brain/research/**", async (route) => {
    const path = new URL(route.request().url()).pathname.replace("/brain/research", "");
    const payload = path === "/status"
      ? { service: { state: "active", started_at: "2026-07-27T23:00:00Z" }, last_autonomous_cycle_at: available("2026-07-28T00:00:00Z") }
      : path === "/candidates"
        ? { items: [candidate] }
        : path === "/events"
          ? { items: [{ id: "event:1", timestamp: available("2026-07-28T00:00:00Z"), type: "capacity_released", candidate_id: candidateId, stage_id: "stage-evidence:stage1", package_id: "ba8-package:sha256:blocked", explanation: "Capacity released — 40 compute, 900 seconds, 3 Stage runs." }] }
          : { items: [{ package_id: "ba8-package:sha256:blocked", status: "blocked", candidate_id: candidateId }] };
    await route.fulfill({ contentType: "application/json", body: JSON.stringify(payload) });
  });
}

test.describe("Brain Research", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("uses the canonical route, shows the certified cycle, and never sends a mutation", async ({ page }) => {
    const brainRequests: string[] = [];
    await mockBrainApi(page);
    page.on("request", (request) => {
      const url = new URL(request.url());
      if (url.pathname.startsWith("/brain/research/")) {
        brainRequests.push(`${request.method()} ${url.pathname}`);
      }
    });
    await page.goto(routeWithMockApi);

    await expect(page).toHaveURL(/\/brain-research\//);
    await expect(page.getByRole("link", { name: "Dashboard" })).toHaveAttribute("href", "/");
    await expect(page.locator('a[href*="brain-research/brain-research"]')).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Brain Research" })).toBeVisible();
    await expect(page.getByText("Sidecar active")).toBeVisible();
    await expect(page.getByText("Stage 1 — Failed")).toBeVisible();
    await expect(page.getByText("Stage 1.5 — Skipped")).toBeVisible();
    await expect(page.getByText("prior_stage_gate_failed").first()).toBeVisible();
    await expect(page.getByText("0", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("The repair was overconstrained; retire without a second repair.")).toBeVisible();
    await expect(page.getByText("Capacity released — 40 compute, 900 seconds, 3 Stage runs.")).toBeVisible();
    await expect(page.getByText("ba8-packag…locked")).toBeVisible();
    await expect(page.getByText("BA-8 blocked")).toBeVisible();
    await expect(page.getByText(/Capital-normalized drawdown was not calculated/)).toBeVisible();
    await expect(page.getByRole("button", { name: /start|run|approve|deploy/i })).toHaveCount(0);
    expect(brainRequests.sort()).toEqual([
      "GET /brain/research/candidates",
      "GET /brain/research/delivery-packages",
      "GET /brain/research/events",
      "GET /brain/research/status"
    ]);
  });

  test("opens accessible help with keyboard and mobile tap", async ({ page }) => {
    await mockBrainApi(page);
    await page.goto(routeWithMockApi);
    const help = page.getByRole("button", { name: "Help: Latest Autonomous Cycle" });
    await help.focus();
    await expect(page.getByRole("tooltip")).toContainText("latest completed paper cycle");
    await page.keyboard.press("Escape");
    await expect(page.getByRole("tooltip")).toHaveCount(0);
    await page.setViewportSize({ width: 390, height: 844 });
    await help.click();
    await expect(page.getByRole("tooltip")).toContainText("latest completed paper cycle");
  });

  test("keeps desktop and phone evidence readable without overflow", async ({ page }) => {
    await mockBrainApi(page);
    await page.goto(routeWithMockApi);
    await page.getByRole("link", { name: /trend_following/i }).click();
    await expect(page.getByRole("heading", { name: /trend_following/i })).toBeVisible();
    await expect(page.getByText("Hypothesis")).toBeVisible();
    await expect(page.getByText("Modular components")).toBeVisible();
    await expect(page.getByText("Stage timeline")).toBeVisible();
    await expect(page.getByText("BA-8 limitations")).toBeVisible();
    await expect(page.getByText("Improvement lineage")).toBeVisible();
    await expect(page.getByText("Parent: candidate-…parent")).toBeVisible();
    await page.setViewportSize({ width: 390, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  });
});
