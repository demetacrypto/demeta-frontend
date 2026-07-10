#!/usr/bin/env node
import { createHash } from "node:crypto";
import { spawn, spawnSync } from "node:child_process";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const LIGHTHOUSE_VERSION = "13.4.0";
const RUNS_PER_ROUTE = 3;
const baseURL = "http://127.0.0.1:4173";
const showcaseRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const rawRoot = join(showcaseRoot, "test-results", "lighthouse");
const evidenceRoot = process.env.DEMETA_EVIDENCE_ROOT
  ? resolve(showcaseRoot, process.env.DEMETA_EVIDENCE_ROOT)
  : join(showcaseRoot, "evidence");
const evidencePath = join(evidenceRoot, "lighthouse.json");
const routes = Object.freeze([
  Object.freeze({ slug: "pressure-atlas", path: "/pressure-atlas" }),
  Object.freeze({ slug: "vitreum", path: "/vitreum" }),
  Object.freeze({ slug: "foldline", path: "/foldline" })
]);

function json(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function startPreview() {
  return spawn("npm", ["run", "preview"], { cwd: showcaseRoot, detached: true, stdio: "ignore" });
}

function stopPreview(preview) {
  if (!preview.pid) return;
  try {
    process.kill(-preview.pid, "SIGTERM");
  } catch {
    preview.kill("SIGTERM");
  }
}

async function waitForServer(preview) {
  const expectedIndex = await readFile(join(showcaseRoot, "dist", "index.html"), "utf8");
  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (preview.exitCode !== null) throw new Error(`Preview exited before Lighthouse collection (code ${preview.exitCode}).`);
    try {
      const response = await fetch(baseURL);
      if (response.ok && await response.text() === expectedIndex) return;
    } catch {
      // Preview is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error("Preview did not serve the exact current dist/index.html within 20 seconds.");
}

async function assertPortAvailable() {
  try {
    await fetch(baseURL, { signal: AbortSignal.timeout(600) });
  } catch {
    return;
  }
  throw new Error(`${baseURL} is already serving content. Stop that process before collecting Lighthouse evidence.`);
}

async function sha256(path) {
  return createHash("sha256").update(await readFile(path)).digest("hex");
}

async function buildFingerprint() {
  const assetRoot = join(showcaseRoot, "dist", "assets");
  const names = (await readdir(assetRoot)).sort();
  const entries = await Promise.all(names.map(async (name) => `${name}:${await sha256(join(assetRoot, name))}`));
  return createHash("sha256").update(entries.join("\n")).digest("hex");
}

function median(values) {
  const sorted = [...values].sort((left, right) => left - right);
  return sorted[Math.floor(sorted.length / 2)];
}

function runLighthouse(route, run) {
  const outputPath = join(rawRoot, `${route.slug}-${run}.json`);
  const executable = process.platform === "win32" ? "npx.cmd" : "npx";
  const result = spawnSync(executable, [
    "--yes",
    `lighthouse@${LIGHTHOUSE_VERSION}`,
    `${baseURL}${route.path}`,
    "--only-categories=performance",
    "--preset=desktop",
    "--output=json",
    `--output-path=${outputPath}`,
    "--chrome-flags=--headless --no-sandbox",
    "--quiet"
  ], {
    cwd: showcaseRoot,
    encoding: "utf8",
    env: { ...process.env, CHROME_PATH: process.env.CHROME_PATH || chromium.executablePath() }
  });
  if (result.status !== 0) {
    throw new Error(`Lighthouse failed for ${route.path} run ${run}: ${result.stderr || result.stdout}`);
  }
  return outputPath;
}

function extractRun(report, run) {
  const audit = (id) => report.audits[id]?.numericValue;
  return Object.freeze({
    run,
    performanceScore: Math.round((report.categories.performance.score || 0) * 100),
    fcpMs: Number(audit("first-contentful-paint").toFixed(1)),
    lcpMs: Number(audit("largest-contentful-paint").toFixed(1)),
    tbtMs: Number(audit("total-blocking-time").toFixed(1)),
    cls: Number(audit("cumulative-layout-shift").toFixed(4)),
    speedIndexMs: Number(audit("speed-index").toFixed(1)),
    ttiMs: Number(audit("interactive").toFixed(1))
  });
}

async function run() {
  await Promise.all([mkdir(rawRoot, { recursive: true }), mkdir(evidenceRoot, { recursive: true })]);
  const manifests = Object.fromEntries(await Promise.all(routes.map(async ({ slug }) => [
    slug,
    JSON.parse(await readFile(join(showcaseRoot, "manifests", `${slug}.json`), "utf8"))
  ])));
  await assertPortAvailable();
  const preview = startPreview();
  try {
    await waitForServer(preview);
    const outputPaths = Object.fromEntries(routes.map(({ slug }) => [slug, []]));
    for (let runIndex = 1; runIndex <= RUNS_PER_ROUTE; runIndex += 1) {
      for (const route of routes) outputPaths[route.slug].push(runLighthouse(route, runIndex));
    }
    const routeReports = await Promise.all(routes.map(async (route) => {
      const runs = await Promise.all(outputPaths[route.slug].map(async (path, index) => (
        extractRun(JSON.parse(await readFile(path, "utf8")), index + 1)
      )));
      const budget = manifests[route.slug].performanceBudget;
      const medians = Object.freeze({
        performanceScore: median(runs.map(({ performanceScore }) => performanceScore)),
        lcpMs: median(runs.map(({ lcpMs }) => lcpMs)),
        tbtMs: median(runs.map(({ tbtMs }) => tbtMs)),
        cls: median(runs.map(({ cls }) => cls))
      });
      return Object.freeze({
        route: route.path,
        pass: medians.lcpMs <= budget.lcpMs && medians.tbtMs <= budget.tbtMs && medians.cls <= budget.cls,
        budget: Object.freeze({ lcpMs: budget.lcpMs, tbtMs: budget.tbtMs, cls: budget.cls }),
        medians,
        runs
      });
    }));
    const report = Object.freeze({
      reportVersion: "1.0.0",
      generatedAt: new Date().toISOString(),
      tool: `Lighthouse ${LIGHTHOUSE_VERSION}`,
      protocol: Object.freeze({ preset: "desktop", runsPerRoute: RUNS_PER_ROUTE, statistic: "median" }),
      buildFingerprint: await buildFingerprint(),
      pass: routeReports.every(({ pass }) => pass),
      routes: routeReports,
      limitations: [
        "Local Lighthouse is lab evidence, not field telemetry.",
        "Three runs and the median reduce one-run shader, process-startup, and host-load variance; individual runs remain visible."
      ]
    });
    await writeFile(evidencePath, json(report));
    if (!report.pass) throw new Error("Lighthouse median budget failed; inspect evidence/lighthouse.json.");
    process.stdout.write(`Lighthouse evidence passed: ${routeReports.length} routes × ${RUNS_PER_ROUTE} desktop runs.\n`);
  } finally {
    stopPreview(preview);
  }
}

await run();
