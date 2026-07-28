import { expect, test } from "@playwright/test";

const apiBase = "http://127.0.0.1:4173/brain-api";
const candidateId = "research-candidate:3f1a8bd817bbe19abd79219811d9861b4ab9e24c1c487d71195b7598e4a0272a";
const routeWithMockApi = `/brain-research?brainApiBase=${encodeURIComponent(apiBase)}`;

const candidate = {
  candidate_id: candidateId,
  label: "mean_reversion · BTCUSDT · 15m",
  parent_candidate_id: "candidate-manifest:sha256:parent",
  child_candidate_id: candidateId,
  target_bot: "BotC",
  symbol: "BTCUSDT",
  timeframe: "15m",
  current_stage: "stage1",
  lifecycle_status: "retired",
  stage: { stage1: "failed", stage1_5: "skipped_prior_gate_failed", stage2: "skipped_prior_gate_failed" },
  performance: { trades: 0, profit_factor: 0, net_pnl: 0, drawdown: null },
  ba7: {
    initial_action: "repair_candidate",
    final_action: "retire_candidate",
    reason: "stage1_not_passed",
    reservation_id: "ba7-reservation:canonical",
    reservation_release: "release_capacity",
    released: true
  },
  ba8: {
    package_id: "ba8-package:sha256:blocked",
    status: "blocked",
    missing_requirements: ["stage1_not_passed", "stage1_5_not_passed", "stage2_not_passed"],
    snapshot_id: "brain-source-snapshot-c1581a50a055"
  },
  last_updated_at: "2026-07-27T23:22:52Z",
  stages: [
    { stage: "stage1", status: "failed", trades: 0, pf: 0, net_pnl: 0, drawdown: null, reason: "minimum_trades_not_met" },
    { stage: "stage1_5", status: "skipped_prior_gate_failed", reason: "stage1_not_passed" },
    { stage: "stage2", status: "skipped_prior_gate_failed", reason: "stage1_not_passed" }
  ],
  summary: {
    hypothesis: "A bounded mean-reversion candidate may improve a qualified parent.",
    components: ["entry", "risk"],
    failure_condition: "minimum_trades_not_met"
  },
  learning: {
    reflection_id: "ba6-reflection:51b28c0e",
    facts: ["Stage-1 recorded zero trades."],
    inferences: ["Do not advance after a failed gate."],
    unavailable_evidence: ["drawdown unavailable"],
    next_research_recommendation: "Hold for evidence."
  },
  improvement_history: [{
    parent_candidate_id: "candidate-manifest:sha256:parent",
    child_candidate_id: candidateId,
    reason: "stage1_not_passed",
    changed_components: null
  }]
};

async function mockBrainApi(page: import("@playwright/test").Page) {
  await page.route(`${apiBase}/**`, async (route) => {
    const path = new URL(route.request().url()).pathname.replace("/brain-api", "");
    const payload = path === "/brain/research/status"
      ? { sidecar: { state: "active", started_at: "2026-07-27T23:00:00Z" }, latest_cycle_at: "2026-07-27T23:22:52Z" }
      : path === "/brain/research/candidates"
        ? { items: [candidate] }
        : path === `/brain/research/candidates/${encodeURIComponent(candidateId)}`
          ? candidate
          : path === "/brain/research/events"
            ? { items: [{ id: "event:1", timestamp: "2026-07-27T23:22:52Z", type: "capacity_released", candidate_id: candidateId, summary: "Canonical reservation released." }] }
            : { items: [{ package_id: "ba8-package:sha256:blocked", status: "blocked", candidate_id: candidateId }] };
    await route.fulfill({ contentType: "application/json", body: JSON.stringify(payload) });
  });
}

test.describe("Brain Research", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("renders the certified failed-and-blocked paper cycle without mutation controls", async ({ page }) => {
    await mockBrainApi(page);
    await page.goto(routeWithMockApi);

    await expect(page.getByRole("heading", { name: "Brain Research" })).toBeVisible();
    await expect(page.getByText("Sidecar active")).toBeVisible();
    await expect(page.getByText("Stage 1", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Failed", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Skipped: Stage 1 failed")).toHaveCount(4);
    await expect(page.getByText("Unavailable", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("BA-6 learning")).toBeVisible();
    await expect(page.getByText("Capacity released")).toBeVisible();
    await expect(page.getByText("BA-8 blocked")).toBeVisible();
    await expect(page.getByText("Canonical reservation released.")).toBeVisible();
    await expect(page.getByRole("button")).toHaveCount(1);
    await expect(page.getByRole("button", { name: /pause ambient motion/i })).toBeVisible();
    await expect(page.locator("button[data-brain-mutation]")).toHaveCount(0);
  });

  test("opens the candidate evidence view and keeps the phone layout contained", async ({ page }) => {
    await mockBrainApi(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(routeWithMockApi);
    await page.getByRole("link", { name: /mean_reversion/i }).click();

    await expect(page.getByRole("heading", { name: /mean_reversion/i })).toBeVisible();
    await expect(page.getByText("Hypothesis")).toBeVisible();
    await expect(page.getByText("Stage timeline")).toBeVisible();
    await expect(page.getByText("BA-8 limitations")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  });

  test("shows an honest unavailable state when no API base is configured", async ({ page }) => {
    await page.goto("/brain-research");
    await expect(page.getByText("Brain API endpoint is not configured.")).toBeVisible();
  });
});
