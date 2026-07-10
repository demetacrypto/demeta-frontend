#!/usr/bin/env node
import { createHash } from "node:crypto";
import { gzipSync } from "node:zlib";
import { readFile, readdir, stat } from "node:fs/promises";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const showcaseRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const distAssets = join(showcaseRoot, "dist", "assets");
const evidenceRoot = process.env.DEMETA_EVIDENCE_ROOT
  ? resolve(showcaseRoot, process.env.DEMETA_EVIDENCE_ROOT)
  : join(showcaseRoot, "evidence");
// Node/zlib releases can produce slightly different gzip streams for identical
// bytes. Node 22 and 25 measurements for this build differ by at most 0.5%.
const gzipRelativeTolerance = 0.01;
const gzipAbsoluteToleranceBytes = 32;
const routes = Object.freeze([
  Object.freeze({ slug: "pressure-atlas", path: "/pressure-atlas", sceneChunk: /^PressureAtlasScene-.*\.js$/, media: Object.freeze(["pressure-atlas-specimen.webp"]) }),
  Object.freeze({ slug: "vitreum", path: "/vitreum", sceneChunk: /^VitreumScene-.*\.js$/, media: Object.freeze([]) }),
  Object.freeze({ slug: "foldline", path: "/foldline", sceneChunk: /^FoldlineScene-.*\.js$/, media: Object.freeze(["foldline-textile.webp"]) })
]);

function rounded(value, digits = 2) {
  return Number(value.toFixed(digits));
}

function median(values) {
  const sorted = [...values].sort((left, right) => left - right);
  return sorted[Math.floor(sorted.length / 2)];
}

function same(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function sourceBoundInventory(files) {
  return files.map(({ name, bytes, sha256 }) => ({ name, bytes, sha256 }));
}

function gzipInventoriesCompatible(storedFiles, currentFiles) {
  const currentByName = new Map(currentFiles.map((file) => [file.name, file]));
  return storedFiles.length === currentFiles.length && storedFiles.every((stored) => {
    const current = currentByName.get(stored.name);
    if (!current) return false;
    const portabilityAllowance = Math.max(
      gzipAbsoluteToleranceBytes,
      Math.ceil(current.gzipBytes * gzipRelativeTolerance)
    );
    return Math.abs(stored.gzipBytes - current.gzipBytes) <= portabilityAllowance;
  });
}

function uniqueMatch(files, pattern) {
  const matches = files.filter(({ name }) => pattern.test(name));
  return matches.length === 1 ? matches[0] : undefined;
}

function expectedBuildSummary(files) {
  const initial = uniqueMatch(files, /^index-.*\.js$/);
  const three = uniqueMatch(files, /^three-.*\.js$/);
  const runtime = uniqueMatch(files, /^runtime-.*\.js$/);
  return Object.freeze({
    initialJsGzipKiB: initial ? rounded(initial.gzipBytes / 1024) : null,
    enhancedSharedGzipKiB: three && runtime ? rounded((three.gzipBytes + runtime.gzipBytes) / 1024) : null
  });
}

async function inventory() {
  const names = (await readdir(distAssets)).sort();
  return Promise.all(names.map(async (name) => {
    const bytes = await readFile(join(distAssets, name));
    return Object.freeze({
      name,
      bytes: bytes.byteLength,
      gzipBytes: gzipSync(bytes).byteLength,
      sha256: createHash("sha256").update(bytes).digest("hex")
    });
  }));
}

async function expectedRouteBundle(route, files, manifest) {
  const initial = uniqueMatch(files, /^index-.*\.js$/);
  const three = uniqueMatch(files, /^three-.*\.js$/);
  const runtime = uniqueMatch(files, /^runtime-.*\.js$/);
  const css = uniqueMatch(files, /^index-.*\.css$/);
  const scene = uniqueMatch(files, route.sceneChunk);
  const mediaBytes = (await Promise.all(route.media.map((name) => stat(join(showcaseRoot, "public", "assets", name)))))
    .reduce((total, entry) => total + entry.size, 0);
  const budget = manifest.performanceBudget;
  const initialJsGzipKiB = initial ? rounded(initial.gzipBytes / 1024) : null;
  const routeJsGzipKiB = initial && three && runtime && scene
    ? rounded((initial.gzipBytes + three.gzipBytes + runtime.gzipBytes + scene.gzipBytes) / 1024)
    : null;
  const cssGzipKiB = css ? rounded(css.gzipBytes / 1024) : null;
  const mediaMiB = rounded(mediaBytes / 1024 / 1024, 3);
  const pass = initialJsGzipKiB !== null && routeJsGzipKiB !== null && cssGzipKiB !== null
    && initial.gzipBytes <= budget.initialJsKbGzip * 1024
    && initial.gzipBytes + three.gzipBytes + runtime.gzipBytes + scene.gzipBytes <= budget.routeJsKbGzip * 1024
    && css.gzipBytes <= 100 * 1024
    && mediaBytes <= budget.mediaMbDesktop * 1024 * 1024
    && mediaBytes <= budget.mediaMbMobile * 1024 * 1024;
  return Object.freeze({
    route: route.path,
    pass,
    initialJsGzipKiB,
    routeJsGzipKiB,
    cssGzipKiB,
    mediaMiB,
    budget: Object.freeze({
      initialJsKbGzip: budget.initialJsKbGzip,
      routeJsKbGzip: budget.routeJsKbGzip,
      cssKbGzip: 100,
      mediaMbDesktop: budget.mediaMbDesktop,
      mediaMbMobile: budget.mediaMbMobile
    })
  });
}

async function run() {
  const failures = [];
  const manifests = Object.fromEntries(await Promise.all(routes.map(async ({ slug }) => [
    slug,
    JSON.parse(await readFile(join(showcaseRoot, "manifests", `${slug}.json`), "utf8"))
  ])));
  const [build, lighthouse, browser, accessibility, assetManifest] = await Promise.all([
    readFile(join(evidenceRoot, "build.json"), "utf8").then(JSON.parse),
    readFile(join(evidenceRoot, "lighthouse.json"), "utf8").then(JSON.parse),
    readFile(join(evidenceRoot, "browser.json"), "utf8").then(JSON.parse),
    readFile(join(evidenceRoot, "accessibility.json"), "utf8").then(JSON.parse),
    readFile(join(showcaseRoot, "assets.manifest.json"), "utf8").then(JSON.parse)
  ]);
  const files = await inventory();
  const fingerprint = createHash("sha256").update(files.map(({ name, sha256 }) => `${name}:${sha256}`).join("\n")).digest("hex");

  const storedFiles = Array.isArray(build.files) ? build.files : [];
  const storedGzipInventoryPass = storedFiles.length === files.length
    && storedFiles.every(({ gzipBytes }) => Number.isSafeInteger(gzipBytes) && gzipBytes > 0);
  if (!same(sourceBoundInventory(storedFiles), sourceBoundInventory(files))) {
    failures.push("build-inventory-does-not-match-current-dist");
  }
  if (!storedGzipInventoryPass) failures.push("stored-build-gzip-inventory-invalid");
  if (!gzipInventoriesCompatible(storedFiles, files)) {
    failures.push("stored-build-gzip-measurements-outside-portability-tolerance");
  }
  if (build.buildFingerprint !== fingerprint) failures.push("build-report-fingerprint-mismatch");
  if (lighthouse.buildFingerprint !== fingerprint) failures.push("lighthouse-fingerprint-mismatch");

  // gzip output can differ slightly between zlib versions. Keep exact name/byte/SHA
  // source binding, prove the stored report is internally derived, then enforce
  // every budget again with gzip measurements from the current runner.
  const storedRouteBundles = await Promise.all(routes.map((route) => expectedRouteBundle(route, storedFiles, manifests[route.slug])));
  const currentRouteBundles = await Promise.all(routes.map((route) => expectedRouteBundle(route, files, manifests[route.slug])));
  const storedBuildSummary = expectedBuildSummary(storedFiles);
  const storedRouteBudgetsPass = storedRouteBundles.every(({ pass }) => pass);
  const currentRouteBudgetsPass = currentRouteBundles.every(({ pass }) => pass);
  if (!same({
    initialJsGzipKiB: build.initialJsGzipKiB,
    enhancedSharedGzipKiB: build.enhancedSharedGzipKiB
  }, storedBuildSummary)) failures.push("stored-build-summary-calculation-mismatch");
  if (!same(build.routeBundles, storedRouteBundles)) failures.push("stored-build-route-budget-calculation-mismatch");
  if (!storedRouteBudgetsPass) failures.push("stored-build-route-budget-failure");
  if (!currentRouteBudgetsPass) failures.push("current-build-route-budget-failure");
  if (build.pass !== storedRouteBudgetsPass || build.pass !== true) {
    failures.push("build-pass-is-not-derived-from-stored-route-budgets");
  }

  const protocolPass = lighthouse.reportVersion === "1.0.0"
    && lighthouse.tool === "Lighthouse 13.4.0"
    && same(lighthouse.protocol, { preset: "desktop", runsPerRoute: 3, statistic: "median" });
  if (!protocolPass) failures.push("lighthouse-protocol-mismatch");
  if (lighthouse.routes?.length !== routes.length || new Set(lighthouse.routes?.map(({ route }) => route)).size !== routes.length) {
    failures.push("lighthouse-route-set-mismatch");
  }

  const lighthouseRoutePass = routes.every((route) => {
    const report = lighthouse.routes?.find(({ route: candidate }) => candidate === route.path);
    const budget = manifests[route.slug].performanceBudget;
    if (!report || report.runs?.length !== 3) return false;
    const finiteRuns = report.runs.every(({ performanceScore, lcpMs, tbtMs, cls }) => (
      [performanceScore, lcpMs, tbtMs, cls].every(Number.isFinite)
    ));
    if (!finiteRuns) return false;
    const expectedMedians = {
      performanceScore: median(report.runs.map(({ performanceScore }) => performanceScore)),
      lcpMs: median(report.runs.map(({ lcpMs }) => lcpMs)),
      tbtMs: median(report.runs.map(({ tbtMs }) => tbtMs)),
      cls: median(report.runs.map(({ cls }) => cls))
    };
    const expectedBudget = { lcpMs: budget.lcpMs, tbtMs: budget.tbtMs, cls: budget.cls };
    const pass = expectedMedians.lcpMs <= budget.lcpMs && expectedMedians.tbtMs <= budget.tbtMs && expectedMedians.cls <= budget.cls;
    return same(report.medians, expectedMedians) && same(report.budget, expectedBudget) && report.pass === pass && pass;
  });
  if (!lighthouseRoutePass) failures.push("lighthouse-route-metrics-or-budgets-invalid");
  if (lighthouse.pass !== (protocolPass && lighthouseRoutePass)) failures.push("lighthouse-overall-pass-invalid");

  const browserBindingPass = browser.pass === true
    && browser.lighthouseGate?.pass === true
    && browser.lighthouseGate?.report === "evidence/lighthouse.json"
    && browser.lighthouseGate?.buildFingerprintMatches === true
    && browser.lighthouseGate?.protocolPass === true
    && browser.lighthouseGate?.routeBudgetsPass === true;
  if (!browserBindingPass) failures.push("browser-report-is-not-bound-to-lighthouse");
  if (accessibility.pass !== true || !accessibility.keyboardAndZoom?.every(({ pass }) => pass === true)) {
    failures.push("accessibility-keyboard-or-zoom-report-failed");
  }

  const assetsById = new Map(assetManifest.assets?.map((asset) => [asset.id, asset]));
  if (assetManifest.version !== "1.0.0" || assetsById.size !== assetManifest.assets?.length) {
    failures.push("asset-manifest-version-or-unique-id-failure");
  }
  for (const asset of assetManifest.assets || []) {
    const assetPath = resolve(showcaseRoot, asset.path);
    const relativeAssetPath = relative(showcaseRoot, assetPath);
    const escapesShowcase = relativeAssetPath === ".."
      || relativeAssetPath.startsWith(`..${sep}`)
      || isAbsolute(relativeAssetPath);
    if (escapesShowcase) {
      failures.push(`asset-path-escapes-showcase:${asset.id}`);
      continue;
    }
    const digest = createHash("sha256").update(await readFile(assetPath)).digest("hex");
    if (digest !== asset.sha256) failures.push(`asset-hash-mismatch:${asset.id}`);
  }
  for (const manifest of Object.values(manifests)) {
    for (const asset of manifest.assets) {
      const ledgerAsset = assetsById.get(asset.id);
      if (!ledgerAsset || ledgerAsset.path !== asset.path || ledgerAsset.sha256 !== asset.sha256) {
        failures.push(`design-manifest-asset-ledger-mismatch:${asset.id}`);
      }
    }
  }

  if (failures.length) {
    process.stderr.write(`${JSON.stringify({ pass: false, failures }, null, 2)}\n`);
    process.exitCode = 1;
    return;
  }
  process.stdout.write(`Stored evidence is bound to the current build: ${routes.length} route budgets, 9 Lighthouse runs, complete keyboard/zoom reports, and ${assetsById.size} provenance hashes.\n`);
}

await run();
