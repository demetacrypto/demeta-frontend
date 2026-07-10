# Browser QA

Use a real browser for every built interface. Prefer the repository's existing E2E stack; otherwise use Playwright CLI for manual verification and add project-local Playwright tests when the artifact is intended to be maintained.

## Viewport matrix

- 1440×900: art direction and full hero composition.
- 1280×720: strict first-viewport gate.
- 768×1024: tablet/layout transition.
- 390×844: modern mobile.
- 320×720: narrow/long-copy stress.
- Optional DPR 2 smoke: sharpness without changing the performance cap.

Also verify 200% text zoom, 400% reflow, reduced motion, dark/light preference when supported, and forced colors for control visibility when relevant.

## Base browser loop

1. Start the production preview, not only the dev server.
2. Open the target route and wait for local fonts/assets.
3. Record page errors, console errors, unhandled rejections, and failed requests.
4. Capture semantic structure/accessible snapshot.
5. Verify offer, exact CTA, and primary evidence in the first viewport.
6. Measure horizontal overflow and key element boxes.
7. Traverse interactive controls by keyboard; record focus order and visible focus. For every drag interaction, complete the same outcome through its non-drag alternative.
8. Activate the primary CTA and signature interaction.
9. Capture at least two deterministic interaction/motion states.
10. Scroll through the entire page and verify the below-hero system.
11. Repeat on mobile, reduced motion, and no-WebGL/failure paths.

## Hard assertions

- `document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1`.
- No unexpected console or page error.
- All local assets return success and no external network is required for a committed baseline.
- Buttons/CTAs remain one line unless their language genuinely requires a multi-line control design.
- Heading and text boxes are not clipped.
- Sticky/canvas layers do not cover focused elements or primary actions.
- Navigation/menu/dialog focus behavior is predictable and restorable.
- Hover, focus, and active states produce a visible change without relying on color alone.
- Hiding or failing the canvas does not remove offer, proof, action, or instructions.

## Reduced motion

Emulate `prefers-reduced-motion: reduce` before navigation.

- Core content is visible immediately.
- No perpetual camera, parallax, pointer chase, cloth, fluid, or ambient loop continues after settling.
- User-triggered state changes still work without interpolated motion.
- Use discrete tabs/steps, a static render, SVG, poster, or authored frame—not a blank canvas.
- Automatic audio remains off.
- Capture a reduced-motion screenshot and note the interaction replacement.

For maintained Playwright tests:

```ts
await page.emulateMedia({ reducedMotion: "reduce" });
await page.goto(route);
```

## WebGL/WebGPU checks

- Confirm the primary canvas has nonzero size and visible output; an imported-but-unused `three` package is not a pass.
- Expose read-only test metrics such as renderer calls, triangles, geometries, and textures when practical.
- Force WebGL context loss through `WEBGL_lose_context` or inject a capability-disabled path.
- The fallback must appear while semantic content and CTA remain usable.
- Restore/reload and confirm the scene can initialize again.
- Mount/unmount repeated scene instances and look for rising owned geometries/textures/listeners.
- Verify the canvas backing store and effective DPR remain under budget.

## Asset and network failure

- Block or rename one noncritical visual asset.
- Verify the fallback preserves layout and does not produce broken-image chrome.
- Block enhancement chunks or force a thrown initialization error.
- Confirm the DOM experience and CTA survive.
- Do not silently replace failed licensed/generated evidence with a generic stock image.

## Accessibility scan

Use axe when the repository can support it, but do not treat an automated scan as full accessibility proof. Require:

- zero critical/serious axe violations;
- keyboard-only completion of the primary action;
- semantic canvas alternative;
- visible focus and logical focus order;
- contrast and reflow checks;
- form/error announcement checks when forms exist.

## Performance and bundle evidence

- Build with the lockfile and record output chunk sizes.
- Confirm Three.js/graphics code is lazy when the poster/DOM can render first.
- Run Lighthouse or the project's performance harness three times when practical; record median LCP, CLS, TBT, transfer size, and request count.
- Record renderer statistics at a representative motion frame.
- Test a low-power path by reducing DPR/quality or skipping enhancement.

## Screenshot set

At minimum:

1. desktop initial;
2. desktop signature-interaction state;
3. desktop below-hero/scroll-depth state;
4. mobile initial;
5. reduced motion;
6. no-WebGL/context-loss fallback.

Seed randomness, freeze time, vendor fonts, and wait for `document.fonts.ready` before visual regression. Golden screenshots protect an accepted design from regressions; they are not a template to imitate.
