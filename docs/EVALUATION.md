# Evaluation architecture

DEMETA separates four questions that are often collapsed into one misleading score.

| Layer | Question | Deterministic output |
|---|---|---|
| Package contract | Is the skill distributable, compact, linked correctly, licensed, and self-tested? | package pass/fail |
| Manifest schema + policy lint | Is the declared design plan structurally valid and free of known hard-gate violations? | schema errors, policy failures, advisory score |
| Project evidence | Do referenced files exist, match their hashes, and belong to the inspected project? | artifact pass/fail |
| Evidence binding | Do stored build and Lighthouse reports describe this exact production build, protocol, route set, run count, medians, and budgets? | semantic binding pass/fail |
| Browser behavior | Does the built interface actually work at required viewports and input/motion modes? | Playwright, axe, console, runtime, screenshot evidence |

The manifest score is advisory. It is useful for catching omissions and repeated patterns; it is not proof of beauty, originality, performance, accessibility, or deployment.

## Hard gates

A release fails when any applicable hard gate fails, regardless of score:

- missing semantic content or accessible control equivalent;
- a meaningful canvas with no authored fallback;
- automatic motion beyond five seconds with no pause control;
- a drag-only interaction with no click, tap, or step alternative;
- critical or serious axe violations;
- keyboard, focus, reduced-motion, reflow, or no-graphics failure;
- console/page errors in the tested flow;
- unbounded DPR, draw calls, triangles, media, or route payload;
- missing disposal, visibility pause, context/device-loss containment, or low-power path;
- placeholder proof in production, unsourced verified claims, or incomplete asset rights metadata.

## Evidence set

Each flagship route should retain at least:

- desktop first frame and interacted frame;
- mobile first frame at 390 px and reflow check at 320 px;
- reduced-motion frame;
- no-WebGL/GPU-disabled frame;
- keyboard flow result;
- complete Tab/Shift+Tab order, every state-control family, pause/resume, and primary CTA activation;
- axe and console result;
- renderer backend, DPR, draw calls, triangles, geometries, and textures;
- build output and bundle sizes;
- three-run Lighthouse output with individual LCP/CLS/TBT values, recomputed medians, and a current-build fingerprint;
- hashes for assets and retained captures.

Evidence strings in a manifest are declarations until the project verifier resolves them. A stale or nonexistent file must not satisfy a release gate.

## Performance interpretation

Budgets are set before implementation; measurements are collected from the production build. Zero or negative numbers are not a shortcut. A route can stay within bundle limits and still fail due to frame time, interaction latency, memory, oversized backing stores, or too many simultaneous graphics contexts.

The showcase uses a capped device pixel ratio, route-level lazy imports, offscreen/document-hidden pauses, explicit GPU-resource disposal, authored graphics fallbacks, and a persistent user pause control. Browser tests inspect renderer counters rather than trusting manifest booleans. Build evidence enforces declared initial/route JavaScript, CSS, and media ceilings. Lighthouse runs three desktop audits per route, retains every run, gates median LCP/CLS/TBT, and must match the freshly computed build fingerprint.

## Originality review

Machine checks can identify exact or near-repeated design fingerprints and familiar template vocabulary. They cannot establish worldwide novelty. A human review should compare the rendered desktop and mobile composition against the accepted fingerprint, record divergences, and answer:

1. Would changing the industry name leave the page substantially intact?
2. Is the primary object or interaction derived from the niche?
3. Do mobile and reduced-motion states preserve the thesis rather than merely remove effects?
4. Is any visual similarity likely to copy a brand, product silhouette, trade dress, or artwork?
5. Does the spectacular medium improve comprehension, emotion, or conversion enough to justify its cost?

## Adversarial corpus

The included prompts cover fluid, optical glass, deformable cloth, WebGPU fallback, RTL, regulated claims, forced-colors/reduced-motion, 320 px reflow, long copy, no-WebGL, low-power devices, and an existing design system. They test failure modes and routing. Capability is demonstrated separately by forward-built examples and their browser artifacts.
