#!/usr/bin/env node
import { createHash } from "node:crypto";
import { spawn } from "node:child_process";
import { gzipSync } from "node:zlib";
import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import AxeBuilder from "@axe-core/playwright";
import { chromium, devices } from "playwright";

const showcaseRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const evidenceRoot = process.env.DEMETA_EVIDENCE_ROOT
  ? resolve(showcaseRoot, process.env.DEMETA_EVIDENCE_ROOT)
  : join(showcaseRoot, "evidence");
const distAssets = join(showcaseRoot, "dist", "assets");
const baseURL = "http://127.0.0.1:4173";
const generatedAt = new Date().toISOString();
const routes = Object.freeze([
  Object.freeze({
    slug: "pressure-atlas", path: "/pressure-atlas", heading: /ocean remembers pressure/i, cta: /open dive 47/i, ctaHash: "#dive-47",
    controls: Object.freeze([/M-03.*2930 m.*midnight/i, /M-04.*6100 m.*abyss/i, /M-01.*0000 m.*surface/i, /M-02.*0930 m.*twilight/i, "West", "East", "Centre"]),
    sceneChunk: /^PressureAtlasScene-.*\.js$/, media: Object.freeze(["pressure-atlas-specimen.webp"])
  }),
  Object.freeze({
    slug: "vitreum", path: "/vitreum", heading: /nothing inside/i, cta: /inspect the layer map/i, ctaHash: "#layer-map",
    controls: Object.freeze([/02 logic plane/i, /03 power cell/i, /01 optical shell/i]),
    sceneChunk: /^VitreumScene-.*\.js$/, media: Object.freeze([])
  }),
  Object.freeze({
    slug: "foldline", path: "/foldline", heading: /page that/i, cta: /open the construction notes/i, ctaHash: "#construction",
    controls: Object.freeze(["Fold", "Inspect", "Drape"]),
    sceneChunk: /^FoldlineScene-.*\.js$/, media: Object.freeze(["foldline-textile.webp"])
  })
]);
const profiles = Object.freeze([
  Object.freeze({ name: "desktop", options: Object.freeze({ viewport: Object.freeze({ width: 1280, height: 720 }), deviceScaleFactor: 1 }) }),
  Object.freeze({ name: "mobile", options: Object.freeze({ ...devices["iPhone 13"], viewport: Object.freeze({ width: 390, height: 844 }) }) })
]);

function json(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

async function waitForServer(preview) {
  const expectedIndex = await readFile(join(showcaseRoot, "dist", "index.html"), "utf8");
  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (preview.exitCode !== null) throw new Error(`Preview exited before browser evidence collection (code ${preview.exitCode}).`);
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
  throw new Error(`${baseURL} is already serving content. Stop that process before collecting browser evidence.`);
}

function startPreview() {
  return spawn("npm", ["run", "preview"], {
    cwd: showcaseRoot,
    detached: true,
    stdio: "ignore"
  });
}

function stopPreview(preview) {
  if (!preview.pid) return;
  if (process.platform === "win32") {
    spawn("taskkill", ["/pid", String(preview.pid), "/t", "/f"], { stdio: "ignore" });
    return;
  }
  try {
    process.kill(-preview.pid, "SIGTERM");
  } catch {
    preview.kill("SIGTERM");
  }
}

async function buildReport(manifests) {
  const names = (await readdir(distAssets)).sort();
  const files = await Promise.all(names.map(async (name) => {
    const path = join(distAssets, name);
    const bytes = await readFile(path);
    return Object.freeze({
      name,
      bytes: bytes.byteLength,
      gzipBytes: gzipSync(bytes).byteLength,
      sha256: createHash("sha256").update(bytes).digest("hex")
    });
  }));
  const uniqueMatch = (pattern) => {
    const matches = files.filter(({ name }) => pattern.test(name));
    return matches.length === 1 ? matches[0] : undefined;
  };
  const initialJs = uniqueMatch(/^index-.*\.js$/);
  const three = uniqueMatch(/^three-.*\.js$/);
  const runtime = uniqueMatch(/^runtime-.*\.js$/);
  const css = uniqueMatch(/^index-.*\.css$/);
  const routeBundles = await Promise.all(routes.map(async (route) => {
    const scene = uniqueMatch(route.sceneChunk);
    const mediaBytes = (await Promise.all(route.media.map(async (name) => (
      stat(join(showcaseRoot, "public", "assets", name))
    )))).reduce((total, entry) => total + entry.size, 0);
    const initialJsGzipKiB = initialJs ? Number((initialJs.gzipBytes / 1024).toFixed(2)) : null;
    const routeJsGzipKiB = initialJs && three && runtime && scene
      ? Number(((initialJs.gzipBytes + three.gzipBytes + runtime.gzipBytes + scene.gzipBytes) / 1024).toFixed(2))
      : null;
    const cssGzipKiB = css ? Number((css.gzipBytes / 1024).toFixed(2)) : null;
    const mediaMiB = Number((mediaBytes / 1024 / 1024).toFixed(3));
    const budget = manifests[route.slug].performanceBudget;
    const pass = initialJsGzipKiB !== null && routeJsGzipKiB !== null && cssGzipKiB !== null
      && initialJs.gzipBytes <= budget.initialJsKbGzip * 1024
      && initialJs.gzipBytes + three.gzipBytes + runtime.gzipBytes + scene.gzipBytes <= budget.routeJsKbGzip * 1024
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
  }));
  return Object.freeze({
    reportVersion: "1.0.0",
    generatedAt,
    command: "npm run build",
    node: process.version,
    pass: Boolean(initialJs && three && runtime && css) && routeBundles.every(({ pass }) => pass),
    buildFingerprint: createHash("sha256").update(files.map(({ name, sha256 }) => `${name}:${sha256}`).join("\n")).digest("hex"),
    initialJsGzipKiB: initialJs ? Number((initialJs.gzipBytes / 1024).toFixed(2)) : null,
    enhancedSharedGzipKiB: three && runtime ? Number(((three.gzipBytes + runtime.gzipBytes) / 1024).toFixed(2)) : null,
    routeBundles,
    files
  });
}

async function installPerformanceObservers(context) {
  await context.addInitScript(() => {
    const metrics = { lcpMs: 0, cls: 0, longTasks: [] };
    Object.defineProperty(window, "__demetaLabMetrics", { configurable: true, value: metrics });
    if (PerformanceObserver.supportedEntryTypes.includes("largest-contentful-paint")) {
      new PerformanceObserver((list) => {
        const last = list.getEntries().at(-1);
        if (last) metrics.lcpMs = last.startTime;
      }).observe({ type: "largest-contentful-paint", buffered: true });
    }
    if (PerformanceObserver.supportedEntryTypes.includes("layout-shift")) {
      new PerformanceObserver((list) => {
        metrics.cls = list.getEntries().reduce((total, entry) => (
          entry.hadRecentInput ? total : total + entry.value
        ), metrics.cls);
      }).observe({ type: "layout-shift", buffered: true });
    }
    if (PerformanceObserver.supportedEntryTypes.includes("longtask")) {
      new PerformanceObserver((list) => {
        metrics.longTasks = [
          ...metrics.longTasks,
          ...list.getEntries().map(({ startTime, duration }) => ({ startTime, duration }))
        ];
      }).observe({ type: "longtask", buffered: true });
    }
  });
}

async function auditRoute(browser, route, profile, manifest) {
  const context = await browser.newContext({
    ...profile.options,
    locale: "en-AU",
    timezoneId: "Australia/Darwin",
    colorScheme: "light"
  });
  await installPerformanceObservers(context);
  const page = await context.newPage();
  let consoleErrors = [];
  let pageErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors = [...consoleErrors, message.text()];
  });
  page.on("pageerror", (error) => {
    pageErrors = [...pageErrors, error.message];
  });
  const started = performance.now();
  await page.goto(`${baseURL}${route.path}`, { waitUntil: "networkidle" });
  await page.getByRole("heading", { level: 1, name: route.heading }).waitFor({ state: "visible" });
  await page.waitForFunction(() => {
    const canvas = document.querySelector('[data-testid="primary-canvas"]');
    return canvas?.__demetaRendererInfo?.()?.frames > 0;
  });
  const enhancementReadyMs = Number((performance.now() - started).toFixed(1));
  await page.waitForTimeout(650);
  const runtime = await page.locator('[data-testid="primary-canvas"]').evaluate((canvas) => canvas.__demetaRendererInfo?.() || null);
  const lab = await page.evaluate(() => {
    const metrics = window.__demetaLabMetrics || { lcpMs: 0, cls: 0, longTasks: [] };
    const navigation = performance.getEntriesByType("navigation")[0];
    return {
      lcpMs: Number(metrics.lcpMs.toFixed(1)),
      cls: Number(metrics.cls.toFixed(4)),
      longTaskCount: metrics.longTasks.length,
      longTaskTotalMs: Number(metrics.longTasks.reduce((total, task) => total + task.duration, 0).toFixed(1)),
      observerBlockingProxyMs: Number(metrics.longTasks.reduce((total, task) => total + Math.max(0, task.duration - 50), 0).toFixed(1)),
      domContentLoadedMs: navigation ? Number(navigation.domContentLoadedEventEnd.toFixed(1)) : null,
      loadMs: navigation ? Number(navigation.loadEventEnd.toFixed(1)) : null
    };
  });
  const overflowPx = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  const axe = await new AxeBuilder({ page }).analyze();
  const blockingViolations = axe.violations.filter(({ impact }) => impact === "critical" || impact === "serious");
  const budget = manifest.performanceBudget;
  const failures = [
    ...(consoleErrors.length ? ["console-errors"] : []),
    ...(pageErrors.length ? ["page-errors"] : []),
    ...(overflowPx > 1 ? ["horizontal-overflow"] : []),
    ...(blockingViolations.length ? ["axe-critical-or-serious"] : []),
    ...(!runtime ? ["missing-renderer-metrics"] : []),
    ...(runtime && runtime.calls > budget.maxDrawCalls ? ["draw-call-budget"] : []),
    ...(runtime && runtime.triangles > budget.maxTriangles ? ["triangle-budget"] : []),
    ...(runtime && runtime.pixelRatio > (profile.name === "mobile" ? budget.maxDprMobile : budget.maxDprDesktop) ? ["dpr-budget"] : []),
    ...(runtime && runtime.renderPixels > runtime.maxRenderPixels ? ["render-pixel-budget"] : []),
    ...(lab.lcpMs > budget.lcpMs ? ["lcp-budget"] : []),
    ...(lab.cls > budget.cls ? ["cls-budget"] : [])
  ];
  const result = Object.freeze({
    route: route.path,
    profile: profile.name,
    viewport: `${profile.options.viewport.width}x${profile.options.viewport.height}`,
    pass: failures.length === 0,
    failures,
    enhancementReadyMs,
    overflowPx,
    consoleErrors,
    pageErrors,
    renderer: runtime,
    performance: lab,
    axe: Object.freeze({
      violations: axe.violations.length,
      critical: blockingViolations.filter(({ impact }) => impact === "critical").length,
      serious: blockingViolations.filter(({ impact }) => impact === "serious").length,
      blockingIds: blockingViolations.map(({ id }) => id)
    })
  });
  await context.close();
  return result;
}

async function auditAlternative(browser, route) {
  const fallbackContext = await browser.newContext({ viewport: { width: 1280, height: 720 }, reducedMotion: "no-preference" });
  const fallbackPage = await fallbackContext.newPage();
  await fallbackPage.goto(`${baseURL}${route.path}?noWebgl=1`, { waitUntil: "networkidle" });
  const noWebGL = await fallbackPage.locator('[data-testid="graphics-fallback"]').isVisible();
  await fallbackContext.close();

  const reducedContext = await browser.newContext({ viewport: { width: 1280, height: 720 }, reducedMotion: "reduce" });
  const reducedPage = await reducedContext.newPage();
  await reducedPage.goto(`${baseURL}${route.path}`, { waitUntil: "networkidle" });
  await reducedPage.waitForFunction(() => {
    const canvas = document.querySelector('[data-testid="primary-canvas"]');
    return canvas?.__demetaRendererInfo?.()?.frames > 0;
  });
  await reducedPage.waitForTimeout(150);
  const reduced = await reducedPage.evaluate(() => {
    const canvas = document.querySelector('[data-testid="primary-canvas"]');
    const runtime = canvas?.__demetaRendererInfo?.() || null;
    return { dataMotion: document.documentElement.dataset.motion, animationRunning: runtime?.animationRunning ?? null };
  });
  await reducedContext.close();
  return Object.freeze({
    route: route.path,
    noWebGL,
    reducedMotion: reduced.dataMotion === "reduced" && reduced.animationRunning === false
  });
}

async function inspectUsableTargets(page, route) {
  const targets = [
    page.getByRole("heading", { level: 1, name: route.heading }),
    ...await page.locator('a[href], button:not([disabled])').all()
  ];
  const results = [];
  for (const target of targets) {
    await target.evaluate((element) => {
      if (element.matches("a, button")) element.focus({ preventScroll: true });
      element.scrollIntoView({ block: "center", inline: "nearest", behavior: "instant" });
    });
    const result = await target.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      const viewportWidth = document.documentElement.clientWidth;
      let clippedByAncestor = false;
      for (let ancestor = element.parentElement; ancestor && ancestor !== document.body; ancestor = ancestor.parentElement) {
        const style = getComputedStyle(ancestor);
        if (!["hidden", "clip", "auto", "scroll"].includes(style.overflowX)) continue;
        const boundary = ancestor.getBoundingClientRect();
        if (rect.left < boundary.left - 1 || rect.right > boundary.right + 1) {
          clippedByAncestor = true;
          break;
        }
      }
      const interactive = element.matches("a, button");
      const pointX = Math.min(viewportWidth - 1, Math.max(0, rect.left + rect.width / 2));
      const pointY = Math.min(window.innerHeight - 1, Math.max(0, rect.top + rect.height / 2));
      const hit = document.elementFromPoint(pointX, pointY);
      return {
        label: element.getAttribute("aria-label") || element.textContent?.trim().replace(/\s+/g, " ").slice(0, 80) || element.tagName,
        horizontallyContained: rect.left >= -1 && rect.right <= viewportWidth + 1,
        clippedByAncestor,
        targetSize: !interactive || (rect.width >= 24 && rect.height >= 24),
        hitTarget: !interactive || Boolean(hit && (element === hit || element.contains(hit)))
      };
    });
    results.push(result);
  }
  return Object.freeze(results);
}

async function auditKeyboardAndZoom(browser, route) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();
  await page.goto(`${baseURL}${route.path}`, { waitUntil: "networkidle" });

  await page.evaluate(() => document.activeElement instanceof HTMLElement && document.activeElement.blur());
  const interactives = page.locator('a[href], button:not([disabled])');
  const interactiveCount = await interactives.count();
  const tabOrder = [];
  for (let index = 0; index < interactiveCount; index += 1) {
    await page.keyboard.press("Tab");
    const focusedIndex = await interactives.evaluateAll((elements) => elements.indexOf(document.activeElement));
    const focused = interactives.nth(focusedIndex);
    tabOrder.push(Object.freeze({
      expectedIndex: index,
      focusedIndex,
      label: focusedIndex >= 0 ? await focused.evaluate((element) => element.getAttribute("aria-label") || element.textContent?.trim().replace(/\s+/g, " ").slice(0, 80) || element.tagName) : "none",
      focusVisible: focusedIndex >= 0 && await focused.evaluate((element) => getComputedStyle(element).outlineStyle !== "none")
    }));
  }
  await page.keyboard.press("Shift+Tab");
  const reverseTraversal = await interactives.evaluateAll((elements) => elements.indexOf(document.activeElement)) === interactiveCount - 2;
  const tabTraversal = interactiveCount > 0 && reverseTraversal && tabOrder.every(({ expectedIndex, focusedIndex, focusVisible }) => expectedIndex === focusedIndex && focusVisible);

  const controlResults = [];
  for (const name of route.controls) {
    const control = page.getByRole("button", { name });
    await control.focus();
    const focusVisible = await control.evaluate((element) => getComputedStyle(element).outlineStyle !== "none");
    const pressedBefore = await control.getAttribute("aria-pressed");
    await page.keyboard.press("Enter");
    const pressedAfter = await control.getAttribute("aria-pressed");
    controlResults.push(Object.freeze({ name: String(name), focusVisible, pressedBefore, pressedAfter, pass: focusVisible && pressedBefore === "false" && pressedAfter === "true" }));
  }

  const motion = page.locator(".study-footer__motion");
  await motion.focus();
  const motionFocusVisible = await motion.evaluate((element) => getComputedStyle(element).outlineStyle !== "none");
  await page.keyboard.press("Space");
  const motionPaused = await motion.getAttribute("aria-pressed") === "true";
  await page.keyboard.press("Space");
  const motionResumed = await motion.getAttribute("aria-pressed") === "false";

  const cta = page.getByRole("link", { name: route.cta }).first();
  await cta.focus();
  const ctaFocusVisible = await cta.evaluate((element) => getComputedStyle(element).outlineStyle !== "none");
  await page.keyboard.press("Enter");
  await page.waitForFunction((hash) => window.location.hash === hash, route.ctaHash);
  const ctaActivated = new URL(page.url()).hash === route.ctaHash;

  await page.addStyleTag({ content: "html { font-size: 200% !important; }" });
  await page.waitForTimeout(80);
  const textZoomTargets = await inspectUsableTargets(page, route);
  const textZoom = Object.freeze({
    headingVisible: await page.getByRole("heading", { level: 1, name: route.heading }).isVisible(),
    ctaVisible: await cta.isVisible(),
    overflowPx: await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth),
    targets: textZoomTargets
  });

  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto(`${baseURL}${route.path}`, { waitUntil: "networkidle" });
  const reflowTargets = await inspectUsableTargets(page, route);
  const reflow = Object.freeze({
    headingVisible: await page.getByRole("heading", { level: 1, name: route.heading }).isVisible(),
    ctaVisible: await page.getByRole("link", { name: route.cta }).first().isVisible(),
    overflowPx: await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth),
    targets: reflowTargets
  });
  await context.close();
  const targetPass = (targets) => targets.every(({ horizontallyContained, clippedByAncestor, targetSize, hitTarget }) => horizontallyContained && !clippedByAncestor && targetSize && hitTarget);
  return Object.freeze({
    route: route.path,
    tabTraversal,
    tabOrder,
    controls: controlResults,
    motion: Object.freeze({ focusVisible: motionFocusVisible, paused: motionPaused, resumed: motionResumed }),
    ctaFocusVisible,
    ctaActivated,
    textZoom200Percent: textZoom,
    reflowEquivalent400Percent: reflow,
    pass: tabTraversal && controlResults.every(({ pass }) => pass)
      && motionFocusVisible && motionPaused && motionResumed && ctaFocusVisible && ctaActivated
      && textZoom.headingVisible && textZoom.ctaVisible && textZoom.overflowPx <= 1 && targetPass(textZoom.targets)
      && reflow.headingVisible && reflow.ctaVisible && reflow.overflowPx <= 1 && targetPass(reflow.targets)
  });
}

async function run() {
  await mkdir(evidenceRoot, { recursive: true });
  const manifests = Object.fromEntries(await Promise.all(routes.map(async ({ slug }) => [
    slug,
    JSON.parse(await readFile(join(showcaseRoot, "manifests", `${slug}.json`), "utf8"))
  ])));
  const build = await buildReport(manifests);
  const lighthouse = JSON.parse(await readFile(join(evidenceRoot, "lighthouse.json"), "utf8"));
  const lighthouseProtocolPass = lighthouse.reportVersion === "1.0.0"
    && lighthouse.tool === "Lighthouse 13.4.0"
    && lighthouse.protocol?.preset === "desktop"
    && lighthouse.protocol?.runsPerRoute === 3
    && lighthouse.protocol?.statistic === "median"
    && lighthouse.routes?.length === routes.length
    && new Set(lighthouse.routes?.map(({ route }) => route)).size === routes.length;
  const lighthouseRoutePass = routes.every((route) => {
    const result = lighthouse.routes?.find(({ route: candidate }) => candidate === route.path);
    const budget = manifests[route.slug].performanceBudget;
    return result?.pass === true
      && result?.runs?.length === 3
      && result?.budget?.tbtMs === budget.tbtMs
      && result?.budget?.lcpMs === budget.lcpMs
      && result?.budget?.cls === budget.cls
      && result?.medians?.tbtMs <= budget.tbtMs
      && result?.medians?.lcpMs <= budget.lcpMs
      && result?.medians?.cls <= budget.cls
      && result.runs.every(({ lcpMs, tbtMs, cls }) => [lcpMs, tbtMs, cls].every(Number.isFinite));
  });
  const lighthouseGate = Object.freeze({
    pass: lighthouse.pass === true && lighthouse.buildFingerprint === build.buildFingerprint && lighthouseProtocolPass && lighthouseRoutePass,
    report: "evidence/lighthouse.json",
    buildFingerprintMatches: lighthouse.buildFingerprint === build.buildFingerprint,
    protocolPass: lighthouseProtocolPass,
    routeBudgetsPass: lighthouseRoutePass
  });
  await assertPortAvailable();
  const preview = startPreview();
  try {
    await waitForServer(preview);
    const browser = await chromium.launch();
    try {
      const routeProfiles = routes.flatMap((route) => profiles.map((profile) => ({ route, profile })));
      const browserRuns = [];
      for (const { route, profile } of routeProfiles) {
        browserRuns.push(await auditRoute(browser, route, profile, manifests[route.slug]));
      }
      const alternatives = [];
      for (const route of routes) alternatives.push(await auditAlternative(browser, route));
      const keyboardAndZoom = [];
      for (const route of routes) keyboardAndZoom.push(await auditKeyboardAndZoom(browser, route));
      const browserReport = Object.freeze({
        reportVersion: "1.0.0",
        generatedAt,
        browser: `Chromium ${browser.version()}`,
        pass: browserRuns.every(({ pass }) => pass)
          && alternatives.every(({ noWebGL, reducedMotion }) => noWebGL && reducedMotion)
          && keyboardAndZoom.every(({ pass }) => pass)
          && lighthouseGate.pass,
        runs: browserRuns,
        alternatives,
        keyboardAndZoom,
        lighthouseGate,
        limitations: [
          "Headless local lab results vary by hardware and are not field telemetry.",
          "PerformanceObserver long-task blocking is retained as a diagnostic proxy; the release TBT gate comes from the separate three-run Lighthouse median."
        ]
      });
      const accessibilityReport = Object.freeze({
        reportVersion: "1.0.0",
        generatedAt,
        engine: "axe-core via @axe-core/playwright",
        target: "WCAG 2.2 AA",
        pass: browserRuns.every(({ axe }) => axe.critical === 0 && axe.serious === 0) && keyboardAndZoom.every(({ pass }) => pass),
        routes: browserRuns.map(({ route, profile, axe, overflowPx }) => ({ route, profile, axe, overflowPx })),
        keyboardAndZoom,
        limitations: ["Automated axe checks, route-complete signature keyboard flows, and zoom/reflow checks do not replace a full assistive-technology audit."]
      });
      await Promise.all([
        writeFile(join(evidenceRoot, "build.json"), json(build)),
        writeFile(join(evidenceRoot, "browser.json"), json(browserReport)),
        writeFile(join(evidenceRoot, "accessibility.json"), json(accessibilityReport))
      ]);
      if (!build.pass || !browserReport.pass || !accessibilityReport.pass) {
        throw new Error("Evidence audit failed; inspect showcase/evidence before promotion.");
      }
      process.stdout.write(`Evidence audit passed: ${browserRuns.length} browser profiles, ${alternatives.length} fallback/reduced-motion pairs, ${keyboardAndZoom.length} keyboard/zoom flows, and Lighthouse median budgets.\n`);
    } finally {
      await browser.close();
    }
  } finally {
    stopPreview(preview);
  }
}

await run();
