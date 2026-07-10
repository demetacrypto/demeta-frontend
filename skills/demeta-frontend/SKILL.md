---
name: demeta-frontend
description: Design and build studio-grade, highly original frontends with authored art direction, expressive material motion, Three.js/WebGL/WebGPU, shaders, canvas, SVG, generated media, and rigorous browser evidence. Use for flagship landing pages, launches, portfolios, cultural/editorial experiences, immersive product stories, cinematic interfaces, creative-technology showcases, or redesigns that must escape ordinary templates. Do not use for routine CRUD screens, generic dashboards, simple brochure sites, or minor styling changes unless the user explicitly wants them elevated into a flagship experience.
---

# DEMETA Frontend

## Mission

Create an authored digital experience, not a decorated template. The result must remain useful when its enhanced graphics are unavailable and must be defensible on relevance, originality, accessibility, performance, factual integrity, and asset rights.

Never claim that a design is unprecedented or the "best in the world." Prove originality relative to the brief, references, prior artifacts, and measured visual fingerprints.

## Non-negotiable contract

- Preserve this precedence: explicit user brief → existing brand/product system → content and accessibility constraints → inferred direction.
- Keep all essential copy, controls, proof, and conversion paths in semantic DOM. Canvas and WebGL enhance meaning; they never imprison it.
- Target WCAG 2.2 AA. Keyboard, focus, contrast, reflow, reduced motion, pause/stop, and non-visual alternatives are release gates.
- Treat mobile, low-power, reduced-motion, asset-failure, and no-WebGL states as authored compositions.
- Set JavaScript/CSS/media byte, GPU, draw-call, DPR, LCP, CLS, and TBT budgets before building the enhanced visual path.
- Never invent testimonials, customer logos, certifications, statistics, prices, guarantees, results, or regulated claims.
- Ship only owned, generated, original-code, or explicitly licensed assets with provenance.
- Preserve a project's stack and lockfile. Add dependencies only when the concept justifies their cost.
- Do not redistribute scraped competitor catalogs, gated prompts, template names, or unlicensed media.

## Required references

Read only the references needed for the task, but always read the first three for a substantial build:

1. `references/art-direction.md` — concept generation, niche intelligence, fingerprints, and anti-template review.
2. `references/quality-gates.md` — hard gates, manifest lint, budgets, and release evidence.
3. `references/content-integrity.md` — claim ledger and production truth rules.
4. `references/graphics-stack.md` — required when using Three.js, WebGPU/WebGL, GLSL/TSL/WGSL, fluid, glass, cloth, canvas, or intensive motion.
5. `references/browser-qa.md` — required when code is built or modified.
6. `references/asset-provenance.md` — required when generating, searching, importing, or shipping media/fonts/models.

The final design manifest follows `references/design-manifest.schema.json`. Lint its declarations with `scripts/evaluate-manifest.mjs`, then resolve project files and hashes with `scripts/verify-project.mjs`. Neither script substitutes for browser or human review.

## Workflow

### 1. Establish truth and scope

Inspect the requested repository, existing design system, references, assets, and recent relevant artifacts before concepting. Record:

- known facts and unknowns;
- audience, context, and the one visitor action;
- brand invariants that must remain consistent;
- technical, content, localization, and delivery constraints;
- whether DEMETA is appropriate. If the request is intentionally simple, either explain the justified elevation or use a normal frontend workflow.

Do not default sparse prompts to SaaS, light mode, dark mode, a framework, or a familiar hero. Infer from the subject and existing system.

### 2. Build a niche model

Identify concrete artifacts, rituals, proof, anxieties, materials, sensory cues, before/after states, and the conversion moment. Generic abstractions such as "innovation," "connection," "growth," or "AI" do not count.

Create a claim ledger using `references/content-integrity.md`. Mark anything not supplied or verified as a visible placeholder; placeholders cannot pass a production/verified gate.

### 3. Generate competing concepts

Create three to five candidates with these reasoning roles:

- commercially safe;
- visually ambitious;
- niche-native or culturally specific;
- optionally, a counterfactual that deliberately removes the most obvious medium or layout assumption.

These are reasoning roles, not fixed visual formulas. Each candidate must differ in content architecture, header, hero frame, geometry, primary medium, typography, motion signature, scroll system, and section rhythm. Do not force every concept to contain a character, video, dashboard, or 3D scene.

For every candidate, record its domain anchor, conversion hypothesis, tradeoff, rejection risk, and the 11-field fingerprint from `references/art-direction.md`. Preserve brand invariants, but reject candidates that repeat both hero archetype + composition or header architecture + hero frame.

Choose one candidate by audience fit, comprehension, conversion, feasibility, fallback quality, and memorable signature—not by spectacle alone.

### 4. Choose the expressive medium

For flagship work, use at least one authored visual medium whose removal would change the idea: Three.js, WebGL/WebGPU, GLSL/TSL/WGSL, Canvas 2D, SVG, procedural typography, generated imagery, Web Audio, or another justified technology.

Material simulations are first-class options:

- water, ink, viscosity, caustics, ripples, and refractive flow;
- transparent optical glass, internal layers, dispersion, and see-through product cutaways;
- cloth, silk, paper, elastic surfaces, folds, and physically responsive page transitions;
- particles, fields, organic growth, morphing geometry, and spatial typography.

Do not add Three.js just to satisfy a trend. Read `references/graphics-stack.md`, name the comprehension/conversion benefit, and define a static or low-cost equivalent first.

### 5. Write the manifest before implementation

Create `demeta.manifest.json` with:

- brief, thesis, niche intelligence, candidates, selected fingerprint;
- design tokens, architecture, graphics, motion, accessibility, and performance budgets;
- claim ledger and asset provenance;
- intended desktop, mobile, reduced-motion, low-power, asset-failure, and no-WebGL states.

Use schema version 2.0.0 as the contract. Evidence may be marked `planned` during plan/draft stages. Production/verified stages require collected, hashed evidence; schema-valid declarations still do not prove that those files exist or that browser checks passed.

### 6. Implement the base experience first

Build a complete semantic experience before enabling enhancement:

- real headings, landmarks, links, buttons, labels, errors, and focus order;
- exact CTA vocabulary across copy and controls;
- working responsive layout at 320 px and 400% zoom;
- a non-drag alternative for every dragging interaction required by WCAG 2.2 Success Criterion 2.5.7;
- intentional poster/SVG/static state for reduced motion and graphics failure.

Then lazy-load the enhanced visual. Cap DPR, pause offscreen/hidden work, avoid per-frame allocations/state writes, and dispose owned GPU resources. Keep automated motion stoppable when it lasts more than five seconds.

### 7. Art-direct every section

The hero is not the entire design. At least one later section must advance the subject through a different architecture—pinned explanation, tactile comparison, spatial cutaway, route, sequence, material change, interactive specimen, or other meaningful mechanism.

Reject work that can be summarized as:

- headline left, interchangeable picture/device right;
- giant headline over wallpaper media;
- pill nav + floating cards + glow;
- repeated rounded rectangles posing as premium design;
- motion that only animates an ordinary layout;
- a 3D object unrelated to the visitor decision;
- a beautiful canvas hiding inaccessible or unverified content.

### 8. Verify the real build

Follow `references/browser-qa.md`. At minimum verify:

- production build/typecheck/tests;
- 1440×900, 1280×720, 390×844, and 320×720;
- keyboard-only flow and visible focus;
- reduced motion, no-WebGL/context loss, asset failure, and low-power fallback;
- zero unexpected console/page errors and failed local assets;
- no overflow, clipping, hidden CTA, or essential canvas-only content;
- at least two meaningful interaction or animation states;
- accessibility scan and performance/bundle evidence.

Screenshots are visual evidence, not the whole truth. Interaction, semantics, fallbacks, performance, and cleanup require separate checks.

### 9. Run the release gate

Complete evidence in `demeta.manifest.json`. Commands must be independent of the current working directory: use the absolute installed skill path, the absolute manifest path, and an explicit project root.

```bash
node /absolute/path/to/demeta-frontend/scripts/evaluate-manifest.mjs /absolute/path/to/project/demeta.manifest.json
node /absolute/path/to/demeta-frontend/scripts/verify-project.mjs /absolute/path/to/project/demeta.manifest.json /absolute/path/to/project
node /absolute/path/to/demeta-frontend/scripts/verify-skill.mjs
```

Require `schemaValid: true`, `manifestLintPass: true`, and `projectEvidencePass: true` before the remaining browser gates. The advisory aesthetic score is a prompt-level heuristic only; it is never release proof. Aesthetic acceptance needs independent human-style review using the anchored questions in `references/quality-gates.md`.

## Delivery

Return:

- runnable source and exact commands;
- the selected thesis and signature element in two or three sentences;
- `demeta.manifest.json` and asset/claim records;
- desktop, mobile, reduced-motion, and fallback evidence;
- build, test, accessibility, and performance results;
- honest remaining gaps. Do not call a plan, prompt, mockup, or submitted build "complete" without current evidence.
