import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const apiBase = "/brain/research";
const routeWithMockApi = `/brain-research/?brainApiBase=${encodeURIComponent(apiBase)}`;

const availablePayloads = Object.freeze({
  worker: {
    state: "available",
    updated_at: "2026-07-28T04:42:00Z",
    data: {
      version: "knowledge-worker@1.0.0",
      heartbeat_at: "2026-07-28T04:42:00Z",
      scheduler: {
        status: "idle",
        last_run_at: "2026-07-28T04:40:00Z",
        next_run_at: "2026-07-28T05:00:00Z"
      },
      last_crawl_at: "2026-07-28T04:39:00Z",
      spark: { status: "integration_ready", runtime_status: "unavailable", variants_generated: 3, variants_admitted: 1, variant_limit: 5, fallback: true },
      latest_candidate: {
        candidate_id: "knowledge-candidate:sha256:72e48ad5cfd0",
        lineage: {
          composition_id: "composition:ema-atr",
          hypothesis_id: "hypothesis:trend-costs",
          research_spec_id: "research-spec:17",
          strategy_spec_id: "strategy-spec:72e48",
          factory_decision_id: "factory-decision:valid",
          selected_bot_id: "bot:B"
        },
        stage: {
          status: { stage1: "failed", stage1_5: "not_permitted", stage2: "not_permitted" },
          dataset_id: "dataset:sha256:ec4293",
          dataset_sha256: "442b30b1ac3664501cada449fb7f22f319b93ec3e03c619f9ec1f202f4c4cc82",
          evidence_ids: ["stage-evidence:stage1", "stage-evidence:stage15-skipped", "stage-evidence:stage2-skipped"],
          stage1_metrics: { trades: 260, profit_factor: 0.6095, net_pnl: -12489.3, max_drawdown: 12472.25, reason: "low_pf" },
          stage15_metrics: { reason: "prior_stage_gate_failed" },
          stage2_metrics: { reason: "prior_stage_gate_failed" }
        },
        ba6: {
          failure_classification: { category: "strategy_evidence", code: "low_pf" },
          causal_confidence: "medium",
          component_attribution: ["entry:ema_cross"],
          regime_attribution: ["2022_downtrend"],
          data_limits: ["Funding not modelled"],
          reusable_lesson: "Trend setup did not overcome declared costs in this window."
        },
        ba7: { decision_id: "ba7-decision:retire", action: "retire_candidate", reason_codes: ["stage1_not_passed"], human_approval_required: false },
        ba8: {
          package_id: "ba8-package:blocked",
          status: "blocked",
          strategy_summary: { family: "EMA Trend", risk_control: "ATR" },
          stage_evidence: {
            stage1: { status: "failed", passed: false, metrics: { trades: 260, profit_factor: 0.6095 }, evidence_id: "stage-evidence:stage1" },
            stage1_5: { status: "not_permitted", passed: false, evidence_id: "stage-evidence:stage15-skipped" },
            stage2: { status: "not_permitted", passed: false, evidence_id: "stage-evidence:stage2-skipped" }
          },
          risks: ["Negative net PnL", "Fee sensitivity"],
          limitations: ["Funding not modelled", "Single historical window"],
          evidence_confidence: "medium",
          proposed_target: { bot_id: "bot:B", lane: "paper" },
          package_hash: "bf53d2a15ce9",
          expiry: "2026-08-04T04:42:00Z",
          required_human_decision: "Reject or request materially new evidence",
          blocked_reasons: ["stage1_not_passed"]
        },
        directed_research: {
          knowledge_gap: "trend_cost_robustness",
          books_index_searched_first: false,
          queries: ["books:first:trend following transaction costs", "web:public trend evidence after fees"],
          evidence_used_for_repairs: { claim_ids: ["claim:cost-model-1"], skill_ids: ["skill:execution-costs@2"] }
        }
      }
    }
  },
  queue: {
    state: "available",
    updated_at: "2026-07-28T04:42:00Z",
    data: {
      counts: { pending: 0, running: 0, held: 1 },
      active_capacity: { compute: 0, time_seconds: 0, stage_runs: 0, active_candidates: 0 },
      items: [{ candidate_id: "knowledge-candidate:queue-17", kind: "directed_research", status: "held", priority: 90, reason: "cooldown_active" }],
      admission_decisions: [{ candidate_id: "knowledge-candidate:72e48", status: "admitted", rank: 1, reason_codes: ["complete_lineage", "density_passed"] }]
    }
  },
  sources: {
    state: "available",
    updated_at: "2026-07-28T04:41:00Z",
    data: {
      receipt_count: 3,
      snapshot_count: 2,
      last_crawl_at: "2026-07-28T04:39:00Z",
      counts_by_tier: { tier_1: 2, tier_2: 1 },
      counts_by_domain: { "github.com": 2, "arxiv.org": 1 },
      fetch_failures: [{ source_id: "arxiv-public", reason: "robots_denied", count: 1, occurred_at: "2026-07-28T04:38:00Z" }],
      quarantine_count: 2,
      connectors: [
        { id: "github-public", label: "GitHub public web", outcome: "success", last_run_at: "2026-07-28T04:39:00Z", detail: "Immutable public source captured." },
        { id: "arxiv-public", label: "arXiv public web", outcome: "held", last_run_at: "2026-07-28T04:38:00Z", detail: "Robots policy held this source." }
      ]
    }
  },
  trust: {
    state: "available",
    updated_at: "2026-07-28T04:41:00Z",
    data: {
      registered_source_count: 4,
      trusted_source_count: 2,
      admitted_claim_count: 1,
      validated_skill_count: 1,
      latest_admission: { status: "admitted", reason: "Cited excerpt bound to an immutable source receipt." },
      active_knowledge_gaps: [{ gap_id: "knowledge-gap:trend-costs", status: "active", priority: "high", summary: "Does the trend setup remain valid after declared costs?" }],
      skills: [{ skill_id: "skill:execution-costs", version: 2, validation_state: "validated", validation_receipt_id: "skill-validation:costs-v2", registry_snapshot_id: "skill-registry:20260728" }],
      admission_decisions: [{ admission_id: "claim-admission:costs", claim_id: "claim:cost-model-1", status: "admitted", reason_codes: ["trusted_source", "exact_excerpt"], occurred_at: "2026-07-28T04:39:30Z" }]
    }
  }
});

async function mockResearchApi(page: Page, payloads: Record<string, unknown> = availablePayloads) {
  await page.route("**/brain/research/**", async (route) => {
    const endpoint = new URL(route.request().url()).pathname.split("/").at(-1) || "";
    const payload = payloads[endpoint];
    if (payload === "HTTP_503") {
      await route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ detail: "source_projection_unavailable" }) });
      return;
    }
    await route.fulfill({ contentType: "application/json", body: JSON.stringify(payload) });
  });
}

test.describe("Knowledge research observability", () => {
  test("renders the autonomous worker truth from exactly four GET-only projections", async ({ page }) => {
    page.on("pageerror", (error) => { throw error; });
    const researchRequests: string[] = [];
    await mockResearchApi(page);
    page.on("request", (request) => {
      const url = new URL(request.url());
      if (url.pathname.startsWith("/brain/research/")) researchRequests.push(`${request.method()} ${url.pathname}`);
    });

    await page.goto(routeWithMockApi);

    await expect(page.getByRole("heading", { level: 1, name: "Knowledge operations" })).toBeVisible();
    await expect(page.getByRole("status", { name: "Worker state: Available" })).toBeVisible();
    await expect(page.getByText("knowledge-worker@1.0.0")).toBeVisible();
    await expect(page.getByText("Scheduler idle")).toBeVisible();
    await expect(page.getByText("Spark integration ready")).toBeVisible();
    await expect(page.getByText("3 generated · 1 admitted · limit 5")).toBeVisible();
    await expect(page.getByText("Stage 1 — Failed")).toBeVisible();
    await expect(page.getByText("260 trades · PF 0.6095 · PnL -12489.3")).toBeVisible();
    await expect(page.getByText("Stage 1.5 — Not Permitted")).toBeVisible();
    await expect(page.getByText("Stage 2 — Not Permitted")).toBeVisible();
    await expect(page.getByText("Stage 1: Failed · Stage 1.5: Not Permitted · Stage 2: Not Permitted")).toBeVisible();
    await expect(page.getByText("BA-6 Recorded")).toBeVisible();
    await expect(page.getByText("BA-7 Retired")).toBeVisible();
    await expect(page.getByText("BA-8 Blocked")).toBeVisible();
    await expect(page.getByText("Pending").locator("..").getByText("0", { exact: true })).toBeVisible();
    await expect(page.getByText("Active candidates").locator("..").getByText("0", { exact: true })).toBeVisible();
    await expect(page.getByText("knowledge-candidate:queue-17")).toBeVisible();
    await expect(page.getByText("Complete Lineage · Density Passed")).toBeVisible();
    await expect(page.getByText("GitHub public web")).toBeVisible();
    await expect(page.getByText("Robots policy held this source.")).toBeVisible();
    await expect(page.getByText("Tier 1").locator("..").getByText("2", { exact: true })).toBeVisible();
    await expect(page.getByText("github.com").locator("..").getByText("2", { exact: true })).toBeVisible();
    await expect(page.getByText("Quarantined").locator("..").getByText("2", { exact: true })).toBeVisible();
    await expect(page.getByText("Robots Denied")).toBeVisible();
    await expect(page.getByText("Admitted claims").locator("..").getByText("1", { exact: true })).toBeVisible();
    await expect(page.getByText("Validated skills").locator("..").getByText("1", { exact: true })).toBeVisible();
    await expect(page.getByText("Does the trend setup remain valid after declared costs?")).toBeVisible();
    await expect(page.getByText("skill:execution-costs · v2 · Validated")).toBeVisible();
    await expect(page.getByText("claim-admission:costs")).toBeVisible();
    await expect(page.getByText("composition:ema-atr")).toBeVisible();
    await expect(page.getByText("dataset:sha256:ec4293")).toBeVisible();
    await expect(page.getByText("Drawdown 12472.25")).toBeVisible();
    await expect(page.getByText("Strategy Evidence · Low Pf")).toBeVisible();
    await expect(page.getByText("Trend setup did not overcome declared costs in this window.")).toBeVisible();
    await expect(page.getByText("books:first:trend following transaction costs")).toBeVisible();
    await expect(page.getByText("skill:execution-costs@2")).toBeVisible();
    await expect(page.getByText("Human approval not required")).toBeVisible();
    await expect(page.getByText("Books index was not searched first")).toBeVisible();
    await expect(page.getByRole("heading", { name: "EMA Trend · ATR" })).toBeVisible();
    await expect(page.getByText("Negative net PnL · Fee sensitivity")).toBeVisible();
    await expect(page.getByText("Funding not modelled · Single historical window")).toBeVisible();
    await expect(page.getByText(/Stage 1: Status: Failed.*Trades: 260.*Profit Factor: 0.6095/)).toBeVisible();
    await expect(page.getByText("bot:B · Paper")).toBeVisible();
    await expect(page.getByText("bf53d2a15ce9")).toBeVisible();
    await expect(page.getByText("Reject or request materially new evidence")).toBeVisible();
    await expect(page.getByText("[object Object]")).toHaveCount(0);
    await expect(page.getByRole("button", { name: /run|retry|approve|deliver|apply|promote|config/i })).toHaveCount(0);
    expect(researchRequests.sort()).toEqual([
      "GET /brain/research/queue",
      "GET /brain/research/sources",
      "GET /brain/research/trust",
      "GET /brain/research/worker"
    ]);
  });

  test("keeps stale, empty, unavailable, and request-error states distinct", async ({ page }) => {
    await mockResearchApi(page, {
      worker: {
        state: "stale",
        reason: "heartbeat_age_exceeded",
        updated_at: "2026-07-28T01:00:00Z",
        data: {
          version: "knowledge-worker@1.0.0",
          heartbeat_at: "2026-07-28T01:00:00Z",
          scheduler: { status: "paused", last_run_at: null, next_run_at: null, pause_reason: "disk_floor" },
          latest_candidate: null
        }
      },
      queue: { state: "empty", reason: "No research jobs have been persisted.", updated_at: "2026-07-28T04:42:00Z", data: null },
      sources: "HTTP_503",
      trust: { state: "unavailable", reason: "No current trust snapshot was found.", updated_at: null, data: null }
    });

    await page.goto(routeWithMockApi);

    await expect(page.getByRole("status", { name: "Worker state" })).toContainText("Stale");
    await expect(page.getByText("heartbeat_age_exceeded")).toBeVisible();
    await expect(page.getByRole("status", { name: "Queue state" })).toContainText("Empty");
    await expect(page.getByText("No research jobs have been persisted.")).toBeVisible();
    await expect(page.getByRole("status", { name: "Sources state" })).toContainText("Error");
    await expect(page.getByText("research_api_503")).toBeVisible();
    await expect(page.getByRole("status", { name: "Trust state" })).toContainText("Unavailable");
    await expect(page.getByText("No current trust snapshot was found.")).toBeVisible();
    await expect(page.getByText("No candidate outcome recorded.")).toBeVisible();
  });

  test("fails malformed and unknown envelopes closed instead of showing them as current", async ({ page }) => {
    await mockResearchApi(page, {
      worker: { state: "healthy", data: { version: "untrusted-version" } },
      queue: { state: "available", counts: { pending: 99 } },
      sources: { state: "available", data: ["not-an-object"] },
      trust: { registered_source_count: 99 }
    });

    await page.goto(routeWithMockApi);

    for (const label of ["Worker", "Queue", "Sources", "Trust"]) {
      await expect(page.getByRole("status", { name: `${label} state` })).toContainText("Error");
    }
    await expect(page.getByText("research_api_invalid_envelope")).toHaveCount(4);
    await expect(page.getByText("untrusted-version")).toHaveCount(0);
    await expect(page.getByText("99", { exact: true })).toHaveCount(0);
  });

  test("ignores malformed nested collection items without blanking valid evidence", async ({ page }) => {
    await mockResearchApi(page, {
      worker: { state: "available", data: { version: "nested-guard@1", scheduler: { status: "idle" } } },
      queue: { state: "available", data: { items: [null, 17, { candidate_id: "candidate:valid", status: "held" }], admission_decisions: [false] } },
      sources: { state: "available", data: { connectors: [null, "invalid", { id: "connector:valid", label: "Valid connector", outcome: "success" }], fetch_failures: [7] } },
      trust: { state: "available", data: { active_knowledge_gaps: [null, 4, { gap_id: "gap:valid", summary: "Valid summary" }], skills: [null, { skill_id: "skill:valid", version: 1, validation_state: "validated" }], admission_decisions: ["invalid"] } }
    });

    await page.goto(routeWithMockApi);

    await expect(page.getByText("nested-guard@1")).toBeVisible();
    await expect(page.getByText("candidate:valid")).toBeVisible();
    await expect(page.getByText("Valid connector")).toBeVisible();
    await expect(page.getByText("Valid summary")).toBeVisible();
    await expect(page.getByText("skill:valid · v1 · Validated")).toBeVisible();
    await expect(page.getByText("[object Object]")).toHaveCount(0);
  });

  test("is keyboard-readable, serious-axe-clean, and reflows at narrow and 200% text zoom", async ({ page }) => {
    await mockResearchApi(page);
    await page.goto(routeWithMockApi);
    await expect(page.getByRole("link", { name: "Dashboard" })).toBeVisible();

    await page.evaluate(() => document.activeElement instanceof HTMLElement && document.activeElement.blur());
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Dashboard" })).toBeFocused();
    expect(await page.getByRole("link", { name: "Dashboard" }).evaluate((element) => getComputedStyle(element).outlineStyle)).not.toBe("none");

    const accessibility = await new AxeBuilder({ page }).analyze();
    expect(accessibility.violations.filter(({ impact }) => impact === "critical" || impact === "serious")).toEqual([]);

    await page.addStyleTag({ content: "html { font-size: 200% !important; }" });
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
    await expect(page.getByRole("heading", { level: 1, name: "Knowledge operations" })).toBeVisible();

    await page.setViewportSize({ width: 320, height: 720 });
    await page.goto(routeWithMockApi);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
    await expect(page.getByText("Active paper capacity")).toBeVisible();
    await expect(page.getByText("Latest governed candidate")).toBeVisible();
  });
});
