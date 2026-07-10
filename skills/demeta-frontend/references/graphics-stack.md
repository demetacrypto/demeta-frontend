# Expressive graphics stack

Use this reference for Three.js, WebGPU/WebGL 2, shaders, canvas, material simulations, Web Audio, or intensive motion. Choose the lowest-cost medium that makes the concept legible.

## Contents

- [Medium selection](#medium-selection)
- [Renderer strategy](#renderer-strategy)
- [Fluid and water](#fluid-and-water)
- [Optical glass](#optical-glass)
- [Cloth and deformable pages](#cloth-and-deformable-pages)
- [Shaders and procedural fields](#shaders-and-procedural-fields)
- [DOM, SVG, Canvas 2D, and audio](#dom-svg-canvas-2d-and-audio)
- [Runtime contract](#runtime-contract)
- [Accessibility contract](#accessibility-contract)
- [Performance budgets](#performance-budgets)
- [Official references](#official-references)

## Medium selection

| Need | Preferred starting medium | Upgrade only when |
|---|---|---|
| Typography, layout, state transitions | semantic HTML + CSS + Web Animations/View Transitions | spatial deformation materially improves the story |
| Precise diagrams, paths, accessible labels | SVG + DOM controls | thousands of marks or continuous simulation make SVG costly |
| 2D particles, rope, ink, charts, compositing | Canvas 2D + Worker when needed | true depth, lighting, or GPU compute is essential |
| Product cutaway, spatial object, terrain | Three.js WebGLRenderer | WebGPU/TSL adds a proven feature or performance benefit |
| New cross-backend shader work | Three.js WebGPURenderer + TSL | browser/device support and fallback have been verified |
| Existing custom GLSL pipeline | Three.js WebGLRenderer + ShaderMaterial | a migration to TSL is budgeted and tested |
| Photographic evidence or impossible scene | generated/owned/licensed raster/video | code-native graphics would be less credible or more expensive |

No-WebGL can still be premium. A strong SVG, Canvas 2D, typographic, photo, or DOM-native concept should beat unjustified 3D.

## Renderer strategy

### Stable WebGL path

Use `WebGLRenderer` for established WebGL 2 work, custom `ShaderMaterial`, existing post-processing, and broad compatibility.

### WebGPU path

`WebGPURenderer` is a progressive option. Current Three.js can target WebGPU and fall back to WebGL 2, while TSL can generate WGSL or GLSL. Treat it as an enhanced path because the renderer remains experimental and differs from the WebGL stack:

- import from `three/webgpu`;
- initialize asynchronously or use `setAnimationLoop`;
- use TSL/node materials rather than `ShaderMaterial` or `onBeforeCompile`;
- do not assume WebGL `EffectComposer` passes work;
- implement device/context loss UI and a tested static fallback;
- keep a `forceWebGL` test lane when using the universal renderer.

Do not write two unrelated visual systems. The DOM and poster fallback remain the same source of truth.

## Fluid and water

Pick one fidelity tier and name it honestly.

### Tier 1: surface illusion

Use for art-directed water, silk-like flow, ink, heat haze, or a refractive lens:

- vertex displacement from low-frequency waves or curl noise;
- fragment normal distortion and Fresnel/refraction;
- pointer/scroll uniforms that perturb a bounded region;
- a small deterministic noise texture or procedural function;
- one render pass when possible.

This is visually fluid, not a fluid dynamics simulation. Do not label it physically accurate.

### Tier 2: flow map or ripple field

Use a low-resolution render target or data texture for interaction memory:

- write pointer velocity/pressure into a field;
- advect or diffuse over time with ping-pong render targets;
- sample the field to distort color, normals, typography masks, or particles;
- cap simulation resolution independently of display DPR;
- dispose every render target and texture.

### Tier 3: GPU fluid solver

Use only when viscosity, advection, or currents are the signature and the budget permits it:

- velocity, dye, divergence, pressure, and gradient-subtraction passes;
- half-float or compatible fallback after capability checks;
- fixed simulation timestep and low-res buffers;
- deterministic seed/test mode;
- static image or discrete-state fallback;
- no essential text inside the simulation.

Avoid full-resolution multipass simulation on mobile. Honor reduced motion, `saveData`, visibility, and low-power mode by freezing or replacing it.

## Optical glass

For a transparent phone-like product, lens, vessel, or layered cutaway:

- model an original silhouette; do not clone protected product geometry, logos, or trade dress;
- keep internal evidence visible: components, layer names, airflow, repair route, or data—not empty glass;
- use `MeshPhysicalMaterial` transmission, thickness, IOR, roughness, clearcoat, and restrained dispersion;
- keep `opacity: 1` when using physical transmission;
- provide a suitable environment/reflection source; glass without context reads invisible;
- limit transmissive layers and overlapping transparent meshes;
- use a simpler opaque/translucent material on low-power paths;
- watch depth sorting, color management, tone mapping, and text contrast behind glass;
- never place essential DOM text under moving refraction.

`MeshPhysicalMaterial` costs more per pixel as features are enabled. Enable only visible properties and budget them.

## Cloth and deformable pages

Choose the lightest model that produces believable folds.

### Authored deformation

Use shader displacement, bones, morph targets, or CSS/SVG masks when the motion can be art-directed. This is the most reliable choice for page transitions, silk headers, and product drapes.

### CPU Verlet or position-based cloth

Use for pointer-reactive fabric or paper:

- grid of current and previous positions;
- structural constraints, optional shear/bend constraints;
- pinned edge/corners;
- fixed timestep with bounded solver iterations;
- pointer force, gravity, and restrained wind;
- update a buffer geometry and recompute normals at a controlled rate;
- use a Worker when the solver threatens the main thread;
- keep 24–48 segments for typical web heroes, fewer on mobile.

### WebGPU compute cloth

Use for a true flagship when capability, fallback, and performance evidence justify it. Three.js includes a WebGPU compute cloth example using a Verlet system. Keep the same semantic DOM and ship an authored static/SVG or morph-state fallback.

For reduced motion, expose discrete states such as folded, open, draped, or inspected. Do not merely slow continuous cloth motion.

## Shaders and procedural fields

- Use GLSL `ShaderMaterial` with WebGLRenderer.
- Use TSL for WebGPURenderer when cross-backend WGSL/GLSL output is desired.
- Keep uniforms bounded and derived from trusted application state.
- Never execute untrusted shader/code strings or generated dependencies.
- Avoid allocations, React state updates, layout reads, and shader recompilation inside frame loops.
- Precompile/warm critical shaders where practical to avoid first-interaction stutter.
- Seed noise and time for screenshots/tests.
- Provide an inspectable static `renderAt(ms)` or deterministic test hook for complex scenes.

Good field applications include pressure, heat, sound, airflow, tension, depth, growth, magnetic/route fields, and product states. Decorative particles or glow storms are rejection signals.

## DOM, SVG, Canvas 2D, and audio

- Keep navigation, headlines, body copy, forms, labels, and CTA in HTML.
- Put accessible labels and ordered explanations beside informative SVG/canvas.
- Decorative canvases use `aria-hidden="true"`; informative canvases need a name/description plus DOM equivalent.
- Canvas 2D is excellent for rope, ink, fiber, charts, sprite sequences, and deterministic 2D physics.
- Use OffscreenCanvas/Worker only when measurement shows main-thread pressure.
- Web Audio starts only after explicit user activation. Provide mute/stop, persist state accessibly, and mirror audio events visually or textually.
- Never autoplay sound.

## Runtime contract

Every enhanced scene must implement:

1. **Progressive loading:** render semantic content and an intentional poster first; lazy-load graphics.
2. **Capability policy:** check WebGPU/WebGL and required texture/float features before loading heavy assets.
3. **Responsive sizing:** size from the element, cap internal resolution, and avoid blindly multiplying by unbounded `devicePixelRatio`.
4. **Visibility:** pause when the document is hidden and when the scene is offscreen.
5. **Demand rendering:** stop the loop when nothing changes; React Three Fiber supports `frameloop="demand"`.
6. **Stable frames:** avoid per-frame object creation, DOM layout thrashing, and application-state writes.
7. **Cleanup:** cancel animation frames, observers, timers, events, audio, workers, and controls.
8. **GPU disposal:** dispose owned geometry, materials, textures, render targets, controls, and renderer; close owned `ImageBitmap` objects.
9. **Context loss:** show the fallback on WebGL context loss or WebGPU device loss; restore only after a clean reinitialization.
10. **Failure containment:** the offer and CTA remain usable when shader compilation, assets, or enhancement fail.

Use `renderer.info` in development/test mode to inspect calls, triangles, geometries, textures, and programs. Mount/unmount tests should return owned resources close to baseline.

## Accessibility contract

- `prefers-reduced-motion: reduce` disables parallax, continuous camera motion, pointer-chasing deformation, ambient loops, and simulated physics unless essential and user-started.
- Automatic motion lasting more than five seconds needs a pause, stop, or hide mechanism.
- Reduced motion is a recomposed static/discrete experience, not `animation-duration: 0.01ms` applied blindly.
- All pointer interactions need keyboard/touch equivalents that preserve the outcome.
- Do not rely on device tilt or motion without normal controls and an off switch.
- Focus must never be obscured by a canvas, sticky layer, or transition.
- Text remains readable at 200% zoom and content reflows at 400% without two-dimensional scrolling.

## Performance budgets

Use these as starting maximums, then tighten for the project:

| Metric | Default maximum |
|---|---:|
| Initial JS | 250 KiB gzip |
| Enhanced route JS | 450 KiB gzip |
| CSS | 100 KiB gzip |
| Mobile media | 2 MB |
| Desktop media | 6 MB |
| DPR | 2 desktop / 1.5 mobile |
| Canvas backing store | 4 megapixels |
| WebGL contexts | 1 |
| Draw calls | 120/frame |
| Triangles | 250k/frame |
| Textures | 12 concurrent unless justified |
| LCP | 2.5 s |
| CLS | 0.10 |
| TBT | 200 ms |
| Reduced-motion idle rendering | 0–2 frames/s after settling |

Prefer a static LCP poster and delayed interactive enhancement. Set texture dimensions and compression deliberately; do not ship desktop textures to mobile.

## Official references

- [Three.js WebGPURenderer manual](https://threejs.org/manual/en/webgpurenderer)
- [Three.js responsive rendering and HD-DPI guidance](https://threejs.org/manual/en/responsive.html)
- [Three.js disposal guide](https://threejs.org/manual/en/how-to-dispose-of-objects.html)
- [Three.js MeshPhysicalMaterial](https://threejs.org/docs/pages/MeshPhysicalMaterial.html)
- [Three.js ShaderMaterial](https://threejs.org/docs/pages/ShaderMaterial.html)
- [Three.js TSL](https://threejs.org/docs/pages/TSL.html)
- [Three.js GPUComputationRenderer](https://threejs.org/docs/pages/GPUComputationRenderer.html)
- [React Three Fiber performance scaling](https://r3f.docs.pmnd.rs/advanced/scaling-performance)
- [MDN WebGL best practices](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices)
- [WCAG 2.2 animation from interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions)
- [WCAG 2.2 pause, stop, hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide)
