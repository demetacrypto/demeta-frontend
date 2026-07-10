import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

type RendererInfo = Readonly<{
  calls: number;
  triangles: number;
  pixelRatio: number;
  renderPixels: number;
  maxRenderPixels: number;
  frames: number;
  lowPower: boolean;
  policyReason: string;
  animationRunning: boolean;
  visible: boolean;
  contextLost: boolean;
}>;

async function readRendererInfo(page: Page) {
  return page.getByTestId("primary-canvas").evaluate((canvas) => {
    const withMetrics = canvas as HTMLCanvasElement & { __demetaRendererInfo?: () => RendererInfo };
    return withMetrics.__demetaRendererInfo?.() || null;
  });
}

const studies = Object.freeze([
  { path: "/pressure-atlas", heading: /ocean remembers pressure/i, cta: /open dive 47/i, ctaHash: "#dive-47", controls: [/M-03.*2930 m.*midnight/i, /M-04.*6100 m.*abyss/i, /M-01.*0000 m.*surface/i, /M-02.*0930 m.*twilight/i, "West", "East", "Centre"], sections: ["#top", "#dive-47", ".pressure-coda"] },
  { path: "/vitreum", heading: /nothing inside/i, cta: /inspect the layer map/i, ctaHash: "#layer-map", controls: [/02 logic plane/i, /03 power cell/i, /01 optical shell/i], sections: ["#vitreum-top", "#layer-map", ".glass-principles"] },
  { path: "/foldline", heading: /page that/i, cta: /open the construction notes/i, ctaHash: "#construction", controls: ["Fold", "Inspect", "Drape"], sections: ["#foldline-top", "#construction", ".construction-sequence"] }
]);

async function expectUsableZoomTargets(page: Page, study: (typeof studies)[number]) {
  const targets = [
    page.getByRole("heading", { level: 1, name: study.heading }),
    ...await page.locator('a[href], button:not([disabled])').all()
  ];
  for (const target of targets) {
    await target.evaluate((element) => {
      if (element.matches("a, button")) (element as HTMLElement).focus({ preventScroll: true });
      element.scrollIntoView({ block: "center", inline: "nearest", behavior: "instant" as ScrollBehavior });
    });
    const result = await target.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      const viewportWidth = document.documentElement.clientWidth;
      let clippedByAncestor = false;
      for (let ancestor = element.parentElement; ancestor && ancestor !== document.body; ancestor = ancestor.parentElement) {
        const style = getComputedStyle(ancestor);
        if (!["hidden", "clip", "auto", "scroll"].includes(style.overflowX)) continue;
        const boundary = ancestor.getBoundingClientRect();
        if (rect.left < boundary.left - 1 || rect.right > boundary.right + 1) clippedByAncestor = true;
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
    expect(result.horizontallyContained, `${study.path} ${result.label} horizontal containment`).toBe(true);
    expect(result.clippedByAncestor, `${study.path} ${result.label} ancestor clipping`).toBe(false);
    expect(result.targetSize, `${study.path} ${result.label} 24x24 target size`).toBe(true);
    expect(result.hitTarget, `${study.path} ${result.label} hit target`).toBe(true);
  }
}

for (const study of studies) {
  test(`${study.path} renders authored graphics without breaking the semantic experience`, async ({ page }) => {
    const pageErrors: string[] = [];
    const consoleErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });

    await page.goto(study.path);
    await expect(page.getByRole("heading", { level: 1, name: study.heading })).toBeVisible();
    await expect(page.getByRole("link", { name: study.cta }).first()).toBeVisible();
    await expect(page.getByTestId("primary-visual")).toBeVisible();
    await expect(page.getByTestId("primary-canvas")).toBeVisible();
    await page.waitForTimeout(550);

    const rendererInfo = await readRendererInfo(page);
    expect(rendererInfo).not.toBeNull();
    expect(rendererInfo?.calls).toBeGreaterThan(0);
    expect(rendererInfo?.triangles).toBeGreaterThan(0);
    expect(rendererInfo?.pixelRatio).toBeLessThanOrEqual(1.5);
    expect(rendererInfo?.renderPixels).toBeLessThanOrEqual(rendererInfo?.maxRenderPixels ?? 0);

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    expect(pageErrors).toEqual([]);
    expect(consoleErrors).toEqual([]);

    const accessibility = await new AxeBuilder({ page }).analyze();
    const releaseBlocking = accessibility.violations.filter(({ impact }) => impact === "critical" || impact === "serious");
    expect(releaseBlocking).toEqual([]);
  });

  test(`${study.path} has a complete reduced-motion state`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(study.path);
    await expect(page.locator("html")).toHaveAttribute("data-motion", "reduced");
    await expect(page.getByRole("heading", { level: 1, name: study.heading })).toBeVisible();
    await expect(page.getByRole("link", { name: study.cta }).first()).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test(`${study.path} survives a forced no-WebGL path`, async ({ page }) => {
    await page.goto(`${study.path}?noWebgl=1`);
    await expect(page.getByTestId("graphics-fallback")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1, name: study.heading })).toBeVisible();
    await expect(page.getByRole("link", { name: study.cta }).first()).toBeVisible();
  });
}

test("every interactive follows a visible tab order and every control family is keyboard complete", async ({ page }) => {
  for (const study of studies) {
    await page.goto(study.path);
    await page.evaluate(() => document.activeElement instanceof HTMLElement && document.activeElement.blur());
    const interactives = page.locator('a[href], button:not([disabled])');
    const interactiveCount = await interactives.count();
    expect(interactiveCount).toBeGreaterThan(0);
    for (let index = 0; index < interactiveCount; index += 1) {
      await page.keyboard.press("Tab");
      const focusedIndex = await interactives.evaluateAll((elements) => document.activeElement ? elements.indexOf(document.activeElement as HTMLElement) : -1);
      expect(focusedIndex, `${study.path} tab index ${index}`).toBe(index);
      expect(await interactives.nth(index).evaluate((element) => getComputedStyle(element).outlineStyle), `${study.path} focus ${index}`).not.toBe("none");
    }
    await page.keyboard.press("Shift+Tab");
    expect(await interactives.evaluateAll((elements) => document.activeElement ? elements.indexOf(document.activeElement as HTMLElement) : -1), `${study.path} reverse traversal`).toBe(interactiveCount - 2);

    for (const name of study.controls) {
      const control = page.getByRole("button", { name });
      await control.focus();
      await expect(control).toBeFocused();
      expect(await control.evaluate((element) => getComputedStyle(element).outlineStyle)).not.toBe("none");
      await expect(control).toHaveAttribute("aria-pressed", "false");
      await page.keyboard.press("Enter");
      await expect(control).toHaveAttribute("aria-pressed", "true");
    }

    const motion = page.locator(".study-footer__motion");
    await motion.focus();
    expect(await motion.evaluate((element) => getComputedStyle(element).outlineStyle)).not.toBe("none");
    await page.keyboard.press("Space");
    await expect(motion).toHaveAttribute("aria-pressed", "true");
    await page.keyboard.press("Space");
    await expect(motion).toHaveAttribute("aria-pressed", "false");

    const action = page.getByRole("link", { name: study.cta }).first();
    await action.focus();
    await expect(action).toBeFocused();
    expect(await action.evaluate((element) => getComputedStyle(element).outlineStyle)).not.toBe("none");
    await page.keyboard.press("Enter");
    await expect.poll(() => new URL(page.url()).hash).toBe(study.ctaHash);
  }
});

test("every study survives 200% text zoom and 400% equivalent reflow", async ({ page }) => {
  for (const study of studies) {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(study.path);
    await page.addStyleTag({ content: "html { font-size: 200% !important; }" });
    await expect(page.getByRole("heading", { level: 1, name: study.heading })).toBeVisible();
    await expect(page.getByRole("link", { name: study.cta }).first()).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), `${study.path} 200% text zoom`).toBeLessThanOrEqual(1);
    await expectUsableZoomTargets(page, study);

    await page.setViewportSize({ width: 320, height: 720 });
    await page.goto(study.path);
    await expect(page.getByRole("heading", { level: 1, name: study.heading })).toBeVisible();
    await expect(page.getByRole("link", { name: study.cta }).first()).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), `${study.path} 400% equivalent reflow`).toBeLessThanOrEqual(1);
    await expectUsableZoomTargets(page, study);
  }
});

test("ambient motion has a persistent pause and resume control", async ({ page }) => {
  await page.goto("/pressure-atlas");
  await expect.poll(async () => (await readRendererInfo(page))?.frames ?? 0).toBeGreaterThan(0);
  const beforePause = await readRendererInfo(page);
  const pause = page.getByRole("button", { name: "Pause ambient motion" });
  await expect(pause).toBeVisible();
  await pause.click();
  await expect(page.locator("html")).toHaveAttribute("data-user-motion", "paused");
  await expect.poll(async () => (await readRendererInfo(page))?.animationRunning).toBe(false);
  const pausedAt = (await readRendererInfo(page))!.frames;
  await page.waitForTimeout(220);
  expect((await readRendererInfo(page))?.frames).toBe(pausedAt);
  const resume = page.getByRole("button", { name: "Resume ambient motion" });
  await expect(resume).toHaveAttribute("aria-pressed", "true");
  await resume.click();
  await expect(page.locator("html")).toHaveAttribute("data-user-motion", "running");
  if (!beforePause?.lowPower) {
    await expect.poll(async () => (await readRendererInfo(page))?.animationRunning).toBe(true);
    await expect.poll(async () => (await readRendererInfo(page))?.frames ?? 0).toBeGreaterThan(pausedAt);
  }
});

test("pause control also stops the CSS-only index animation", async ({ page }) => {
  await page.goto("/");
  const orb = page.locator(".index-orb");
  await expect(orb).toHaveCSS("animation-play-state", "running");
  await page.getByRole("button", { name: "Pause ambient motion" }).click();
  await expect(orb).toHaveCSS("animation-play-state", "paused");
});

test("persistent motion control remains fully inside the viewport while scrolling", async ({ page }) => {
  for (const study of studies) {
    await page.goto(study.path);
    const control = page.getByRole("button", { name: "Pause ambient motion" });
    for (const section of study.sections) {
      await page.locator(section).scrollIntoViewIfNeeded();
      await page.waitForTimeout(80);
      const box = await control.boundingBox();
      const viewport = page.viewportSize();
      expect(box, `${study.path} motion-control box`).not.toBeNull();
      expect(viewport).not.toBeNull();
      expect(box!.x, `${study.path} x`).toBeGreaterThanOrEqual(0);
      expect(box!.y, `${study.path} y`).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width, `${study.path} right edge`).toBeLessThanOrEqual(viewport!.width);
      expect(box!.y + box!.height, `${study.path} bottom edge`).toBeLessThanOrEqual(viewport!.height);
      const collisions = await page.evaluate(() => {
        const motion = document.querySelector<HTMLButtonElement>(".study-footer__motion");
        if (!motion) return ["missing-motion-control"];
        const controlRect = motion.getBoundingClientRect();
        return [...document.querySelectorAll<HTMLElement>("main h1, main h2, main h3, main p, main a, main button, main figcaption, main label")]
          .filter((element) => element !== motion && !motion.contains(element))
          .filter((element) => {
            const style = getComputedStyle(element);
            const rect = element.getBoundingClientRect();
            if (style.visibility === "hidden" || style.display === "none" || rect.width === 0 || rect.height === 0) return false;
            return controlRect.left < rect.right && controlRect.right > rect.left
              && controlRect.top < rect.bottom && controlRect.bottom > rect.top;
          })
          .map((element) => `${element.tagName.toLowerCase()}:${element.textContent?.trim().slice(0, 32)}`);
      });
      expect(collisions, `${study.path} ${section} content collisions`).toEqual([]);
    }
  }
});

test("a failed scene chunk degrades to the authored composition", async ({ page }) => {
  await page.route("**/PressureAtlasScene-*.js", (route) => route.abort());
  await page.goto("/pressure-atlas");
  await expect(page.getByTestId("graphics-fallback")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1, name: /ocean remembers pressure/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /open dive 47/i }).first()).toBeVisible();
});

test("failed raster evidence keeps the semantic record and action", async ({ page }) => {
  await page.route("**/*.webp", (route) => route.abort());
  for (const study of [
    { path: "/pressure-atlas", section: "#dive-47", heading: /whole chain of custody/i, cta: /open dive 47/i },
    { path: "/foldline", section: "#construction", heading: /edge tells you/i, cta: /open the construction notes/i }
  ]) {
    await page.goto(study.path);
    await page.locator(study.section).scrollIntoViewIfNeeded();
    await expect(page.getByTestId("evidence-image-fallback")).toBeVisible();
    await expect(page.getByRole("heading", { name: study.heading })).toBeVisible();
    await expect(page.getByRole("link", { name: study.cta }).first()).toBeVisible();
    await expect(page.locator("img[src$='.webp']")).toHaveCount(0);
  }
});

test("reduced motion redraws discrete controls once, then stays still", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/pressure-atlas");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduced");
  await expect.poll(async () => (await readRendererInfo(page))?.frames ?? 0).toBeGreaterThan(0);
  await page.waitForTimeout(120);
  const before = (await readRendererInfo(page))!.frames;

  await page.getByRole("button", { name: "East" }).click();
  await expect.poll(async () => (await readRendererInfo(page))?.frames ?? 0).toBeGreaterThan(before);
  await page.waitForTimeout(100);
  const settled = (await readRendererInfo(page))!.frames;
  await page.waitForTimeout(220);
  expect((await readRendererInfo(page))?.frames).toBe(settled);
  expect((await readRendererInfo(page))?.animationRunning).toBe(false);
});

test("a live reduced-motion preference change stops and restarts the loop", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Mobile uses the low-power static policy.");
  await page.goto("/pressure-atlas");
  await expect.poll(async () => (await readRendererInfo(page))?.animationRunning).toBe(true);

  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduced");
  await expect.poll(async () => (await readRendererInfo(page))?.animationRunning).toBe(false);
  await page.waitForTimeout(120);
  const stoppedAt = (await readRendererInfo(page))!.frames;
  await page.waitForTimeout(220);
  expect((await readRendererInfo(page))?.frames).toBe(stoppedAt);

  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator("html")).toHaveAttribute("data-motion", "full");
  await expect.poll(async () => (await readRendererInfo(page))?.animationRunning).toBe(true);
  await expect.poll(async () => (await readRendererInfo(page))?.frames ?? 0).toBeGreaterThan(stoppedAt);
});

test("forced low-power mode honors its pixel budget and remains static", async ({ page }) => {
  await page.setViewportSize({ width: 2560, height: 1440 });
  await page.goto("/pressure-atlas?lowPower=1");
  await expect.poll(async () => (await readRendererInfo(page))?.frames ?? 0).toBeGreaterThan(0);
  const info = (await readRendererInfo(page))!;
  expect(info.lowPower).toBe(true);
  expect(info.policyReason).toBe("forced");
  expect(info.renderPixels).toBeLessThanOrEqual(info.maxRenderPixels);
  expect(info.maxRenderPixels).toBe(720_000);
  expect(info.animationRunning).toBe(false);
  await page.waitForTimeout(220);
  expect((await readRendererInfo(page))?.frames).toBe(info.frames);
});

test("save-data selects the low-power static policy", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "connection", {
      configurable: true,
      value: Object.freeze({ saveData: true })
    });
  });
  await page.goto("/vitreum");
  await expect.poll(async () => (await readRendererInfo(page))?.policyReason).toBe("save-data");
  expect((await readRendererInfo(page))?.animationRunning).toBe(false);
});

test("renderer creation failure is contained by the authored fallback", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, contextId: string, ...args: unknown[]) {
      if (String(contextId).startsWith("webgl")) return null;
      return (original as Function).apply(this, [contextId, ...args]);
    } as typeof HTMLCanvasElement.prototype.getContext;
  });
  await page.goto("/pressure-atlas");
  await expect(page.getByTestId("graphics-fallback")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1, name: /ocean remembers pressure/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /open dive 47/i }).first()).toBeVisible();
});

test("context loss falls back and context restoration rebuilds cleanly", async ({ page }) => {
  await page.goto("/pressure-atlas");
  await expect.poll(async () => (await readRendererInfo(page))?.frames ?? 0).toBeGreaterThan(0);
  await page.getByTestId("primary-canvas").evaluate((canvas) => {
    canvas.dispatchEvent(new Event("webglcontextlost", { cancelable: true }));
  });
  await expect(page.getByTestId("graphics-fallback")).toBeVisible();
  expect((await readRendererInfo(page))?.contextLost).toBe(true);

  await page.getByTestId("primary-canvas").evaluate((canvas) => {
    canvas.dispatchEvent(new Event("webglcontextrestored"));
  });
  await expect(page.getByTestId("graphics-fallback")).toHaveCount(0);
  await expect.poll(async () => (await readRendererInfo(page))?.frames ?? 0).toBeGreaterThan(0);
  expect((await readRendererInfo(page))?.contextLost).toBe(false);
});

test("offscreen graphics stop their animation loop and restart on return", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Mobile uses the low-power static policy.");
  await page.goto("/pressure-atlas");
  await expect.poll(async () => (await readRendererInfo(page))?.animationRunning).toBe(true);
  await page.locator(".pressure-coda").scrollIntoViewIfNeeded();
  await expect.poll(async () => (await readRendererInfo(page))?.visible).toBe(false);
  await expect.poll(async () => (await readRendererInfo(page))?.animationRunning).toBe(false);
  const stoppedAt = (await readRendererInfo(page))!.frames;
  await page.waitForTimeout(220);
  expect((await readRendererInfo(page))?.frames).toBe(stoppedAt);

  await page.locator("#top").scrollIntoViewIfNeeded();
  await expect.poll(async () => (await readRendererInfo(page))?.visible).toBe(true);
  await expect.poll(async () => (await readRendererInfo(page))?.animationRunning).toBe(true);
});

test("the 320px experience does not overflow", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  for (const study of studies) {
    await page.goto(study.path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, `${study.path} overflow`).toBeLessThanOrEqual(1);
    await expect(page.getByRole("link", { name: study.cta }).first()).toBeVisible();
  }
});
