import { spawn } from "node:child_process";
import { mkdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const baseURL = "http://127.0.0.1:4173";
const output = join(process.cwd(), "public", "screenshots");
const routes = Object.freeze([
  { slug: "pressure-atlas", path: "/pressure-atlas", evidence: "#dive-47", action: async (page) => page.getByRole("button", { name: /M-03.*2930 m.*midnight/i }).click() },
  { slug: "vitreum", path: "/vitreum", evidence: "#layer-map", action: async (page) => page.getByRole("button", { name: /03 power cell/i }).click() },
  { slug: "foldline", path: "/foldline", evidence: "#construction", action: async (page) => page.getByRole("button", { name: "Fold" }).click() }
]);

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

async function assertPortAvailable() {
  try {
    await fetch(baseURL, { signal: AbortSignal.timeout(600) });
  } catch {
    return;
  }
  throw new Error(`${baseURL} is already serving content. Stop that process before capturing evidence.`);
}

async function waitForServer(preview) {
  const expectedIndex = await readFile(join(process.cwd(), "dist", "index.html"), "utf8");
  for (let attempt = 0; attempt < 40; attempt += 1) {
    if (preview.exitCode !== null) throw new Error(`Preview exited before screenshot capture (code ${preview.exitCode}).`);
    try {
      const response = await fetch(baseURL);
      if (response.ok && await response.text() === expectedIndex) return;
    } catch {
      // Preview is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error("Preview did not serve the exact current dist/index.html");
}

async function captureRoute(route, config) {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: config.viewport,
    reducedMotion: config.reducedMotion || "no-preference",
    colorScheme: "light",
    locale: "en-AU"
  });
  try {
    const page = await context.newPage();
    await page.goto(`${baseURL}${route.path}${config.query || ""}`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    if (config.action) await route.action(page);
    if (config.evidence) {
      await page.locator(route.evidence).evaluate((element) => {
        window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY, behavior: "instant" });
      });
    }
    await page.waitForTimeout(config.reducedMotion === "reduce" ? 100 : 650);
    await page.screenshot({ path: join(output, `${route.slug}-${config.name}.png`), fullPage: config.fullPage ?? false });
  } finally {
    await context.close();
    await browser.close();
  }
}

await mkdir(output, { recursive: true });
await assertPortAvailable();
const preview = spawn("npm", ["run", "preview"], { detached: true, stdio: "ignore" });
try {
  await waitForServer(preview);
  for (const route of routes) {
    await captureRoute(route, { name: "desktop", viewport: { width: 1440, height: 900 } });
    await captureRoute(route, { name: "interaction", viewport: { width: 1440, height: 900 }, action: true });
    await captureRoute(route, { name: "below-hero", viewport: { width: 1440, height: 900 }, evidence: true });
    await captureRoute(route, { name: "mobile", viewport: { width: 390, height: 844 } });
    await captureRoute(route, { name: "reduced-motion", viewport: { width: 1280, height: 720 }, reducedMotion: "reduce" });
    await captureRoute(route, { name: "no-webgl", viewport: { width: 1280, height: 720 }, query: "?noWebgl=1" });
  }
} finally {
  stopPreview(preview);
}
