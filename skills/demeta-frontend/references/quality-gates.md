# Quality and release gates

"Premium" is not a pass condition. A release passes only when every hard gate is green, project evidence resolves, browser checks are current, and the anchored aesthetic review finds no unresolved template-level defect. Schema validity and the advisory aesthetic score are not release proof.

## Hard gates

### 1. Contract and build

- Production install/build exits 0 from the documented lockfile.
- Typecheck, tests, and lint/check commands exit 0 when present.
- `demeta.manifest.json` validates against JSON Schema 2020-12 and selects one of three to five fully reasoned candidates.
- No unexpected page/console errors, unhandled rejections, or failed local assets.
- No secret, credential, private data, unsafe HTML injection, or unreviewed remote script is added.

### 2. Subject and truth

- Niche artifacts, rituals, proof, sensory cues, and exact conversion action are visible in the interface.
- Production claims are `verified` or `user_supplied`; placeholders remain visibly marked and cannot pass production.
- Regulated medical, legal, financial, safety, or environmental claims have supplied/authoritative evidence.
- No invented testimonials, logos, certifications, awards, prices, metrics, guarantees, availability, or outcomes.

### 3. Originality and architecture

- Three to five concept candidates record domain anchor, conversion hypothesis, tradeoff, rejection risk, and complete fingerprints.
- Candidate pairs do not reuse hero archetype + composition or header + hero frame.
- The accepted build is not a generic split hero, wallpaper hero, pill-nav SaaS shell, card wall, or fade-only page.
- One signature element is tied to evidence, process, product, place, or conversion.
- At least one later section develops the concept through a different content architecture.
- Brand invariants are preserved; novelty is measured in concept-specific dimensions.

### 4. Graphics and fallbacks

- The primary medium is named and justified by comprehension/conversion.
- Critical meaning and controls remain in semantic DOM.
- Mobile, low-power, reduced-motion, asset-failure, and no-WebGL fallback states are intentional and tested.
- Three.js/WebGL/WebGPU work caps DPR, pauses when hidden/offscreen, avoids per-frame allocations, cleans listeners/loops, disposes owned GPU resources, and handles context loss.
- Continuous automatic motion over five seconds has pause/stop/hide.
- No autoplay audio.

### 5. WCAG 2.2 AA

- Native landmarks, heading order, controls, labels, names, and roles.
- Complete keyboard flow, logical focus order, visible focus, no trap, and focus restoration.
- Text contrast at least 4.5:1 (3:1 for large text); meaningful UI/focus indicators at least 3:1.
- Text works at 200%; content reflows at 400% without horizontal reading scroll.
- Pointer targets meet 24×24 CSS px minimum or spacing exception; important actions aim larger.
- Reduced-motion and pause controls work; device motion is never the only input.
- Informative canvas/3D has an equivalent DOM explanation/control path.
- Every drag-dependent action has a non-drag alternative that works with a pointer and keyboard.
- Forms identify instructions and errors; dynamic errors/status are announced.
- Automated scan has zero critical/serious violations, with keyboard and manual checks still required.

### 6. Responsive integrity

- 1440×900, 1280×720, 390×844, and 320×720 are verified.
- Offer, specific CTA, and meaningful visual evidence appear in the first desktop viewport.
- Mobile shows offer, CTA, and an early visual/evidence cue without requiring enhancement.
- `scrollWidth <= clientWidth + 1` at target widths.
- No clipped headings, wrapped action labels, obscured focus, unreachable controls, or accidental overlaps.
- Mobile is recomposed when desktop spatial behavior cannot survive.

### 7. Performance budget

- Performance budget is declared before implementation and measured after build.
- Default ceilings: initial JS 250 KiB gzip, enhanced route JS 450 KiB gzip, CSS 100 KiB gzip, mobile media 2 MB, desktop media 6 MB.
- Default GPU ceilings: one context, DPR 2 desktop/1.5 mobile, 4 MP backing store, 120 draw calls, 250k triangles.
- Target Core Web Vitals: LCP ≤2.5 s, CLS ≤0.10; target TBT ≤200 ms in local Lighthouse evidence.
- Static LCP content is not blocked on WebGL, a giant model, or an image generator.

### 8. Asset provenance

- Every shipped asset records source type, creator, license, path, and SHA-256.
- Generated assets retain the final prompt and tool/path metadata.
- Licensed assets retain source URL and required attribution/license files.
- No scraped competitor dataset, gated prompt, template asset, trademarked catalog example, or unlicensed font/media is redistributed.

## Manifest schema and lint

Invoke the installed skill scripts by absolute path so the commands work from any project directory:

```bash
node /absolute/path/to/demeta-frontend/scripts/evaluate-manifest.mjs /absolute/path/to/project/demeta.manifest.json
node /absolute/path/to/demeta-frontend/scripts/verify-project.mjs /absolute/path/to/project/demeta.manifest.json /absolute/path/to/project
```

The first command runs the committed JSON Schema 2020-12 validator and semantic manifest lint. It returns `schemaValid`, `manifestLintPass`, and an `advisoryAestheticScore`. That score only evaluates declared prompt-level signals; it cannot prove visual quality.

The second command resolves asset/evidence paths inside the explicit project root and checks regular-file existence plus SHA-256. It never executes `buildCommand` or any other manifest command. `projectEvidencePass` still does not prove that a report is truthful, current, accessible, performant, legally owned, or visually strong.

Preconditions for browser release review:

- `schemaValid: true`;
- `manifestLintPass: true`;
- `projectEvidencePass: true`;
- no unresolved browser, accessibility, build, fallback, or provenance failure;
- no aesthetic review answer below acceptable.

Never present the advisory score, a self-declared boolean, a screenshot hash, or a stored report as real browser verification.

## Required evidence

Keep relative paths and SHA-256 hashes in the manifest. Evidence identifiers must be unique:

- build/typecheck/test output;
- bundle/resource sizes;
- desktop, mobile, reduced-motion, and no-WebGL/context-loss screenshots;
- at least two meaningful animation/interaction checkpoints;
- keyboard traversal notes or trace;
- accessibility scan output;
- console/page/network error count;
- fallback and asset-failure checks;
- performance evidence and measured GPU statistics when applicable.

Screenshots validate composition only. They do not prove semantics, focus, animation smoothness, cleanup, context recovery, or performance.

## Anchored aesthetic review

Two independent reviewers are ideal for a flagship. Each records observable answers:

1. **Niche recognition:** Can the subject be recognized before the logo? What visible artifact proves it?
2. **Hierarchy:** Do offer, action, and evidence read in under five seconds?
3. **Signature:** What will be remembered after ten seconds, and what job does it do?
4. **Material coherence:** Do type, color, geometry, imagery, lighting, interaction, and motion belong to one world?
5. **Originality:** Which known template pattern is closest, and what structural decision makes this different?
6. **Restraint:** Which decoration could be removed? If none can be named, inspect again.
7. **Scroll development:** Does the lower page evolve the idea rather than collapse into cards?
8. **Mobile:** Is it a designed mutation or a squeezed desktop?
9. **Fallback:** Would the static/reduced-motion state still be portfolio-worthy?
10. **Trust:** Are claims, controls, and failure states clear rather than theatrically vague?

Reject vague reviews such as "looks great" or "premium." Name the visible evidence or defect.
