import { lazy, Suspense, useState } from "react";
import type { ClothMode } from "../scenes/FoldlineScene";
import { EvidenceImage } from "../components/EvidenceImage";
import { SceneBoundary } from "../components/SceneBoundary";
import { routeHref } from "../routing";

const FoldlineScene = lazy(() => import("../scenes/FoldlineScene"));

const clothStates = Object.freeze([
  { id: "drape" as const, step: "Drape", description: "Gravity and a restrained field show the textile's weight." },
  { id: "fold" as const, step: "Fold", description: "Pinned points pull the surface into an authored page turn." },
  { id: "inspect" as const, step: "Inspect", description: "Motion rests so weave, edge, and basting become evidence." }
]);

export default function Foldline() {
  const [mode, setMode] = useState<ClothMode>("drape");
  const active = clothStates.find(({ id }) => id === mode)!;

  return (
    <main id="main" className="experience foldline-page">
      <header className="selvedge-rail">
        <a href="#foldline-top" aria-label="Foldline home">FL / 01</a>
        <span>Material archive</span>
        <a href="#construction">Construction</a>
      </header>

      <section id="foldline-top" className="foldline-hero" aria-labelledby="foldline-title">
        <SceneBoundary
          containerClass="foldline-visual"
          title="Four authored fabric states"
          description="The static composition preserves drape, fold, seam, and inspection states without continuous physics."
          variant="cloth"
        >
          <Suspense fallback={<div className="foldline-visual scene-loading" aria-hidden="true" />}>
            <FoldlineScene mode={mode} />
          </Suspense>
        </SceneBoundary>
        <div className="foldline-hero__copy">
          <p className="foldline-overline">Textile study 01 · fictional archive</p>
          <h1 id="foldline-title"><span>A page that</span><em>drapes</em><span>before it turns.</span></h1>
          <p>Cloth becomes navigation, explanation, and proof—while the actual archive remains readable HTML.</p>
          <a className="foldline-action" href="#construction">Open the construction notes</a>
        </div>
        <div className="cloth-console">
          <span className="cloth-console__label">Construction state</span>
          <div className="cloth-state-control" role="group" aria-label="Textile states">
            {clothStates.map((state) => (
              <button key={state.id} type="button" aria-pressed={mode === state.id} onClick={() => setMode(state.id)}>
                {state.step}
              </button>
            ))}
          </div>
          <p className="cloth-state-status" aria-live="polite"><strong>{active.step}.</strong> {active.description}</p>
        </div>
      </section>

      <section id="construction" className="textile-evidence" aria-labelledby="textile-evidence-title">
        <div className="textile-evidence__copy">
          <p className="foldline-overline">Evidence, not atmosphere</p>
          <h2 id="textile-evidence-title">The edge tells you how it was made.</h2>
          <p>The generated demonstration photograph records thread density, hand basting, translucency, and selvedge. It is labeled as fictional showcase media and carries provenance in the repository.</p>
          <dl>
            <div><dt>Structure</dt><dd>Open plain weave</dd></div>
            <div><dt>Finish</dt><dd>Hand-basted edge</dd></div>
            <div><dt>Record</dt><dd>Generated demo</dd></div>
          </dl>
        </div>
        <figure>
          <EvidenceImage
            src={routeHref("/assets/foldline-textile.webp")}
            width={1600}
            height={900}
            sizes="(max-width: 900px) 100vw, 50vw"
            alt="A translucent gray textile sample forming a soft fold, with a hand-finished edge and short vermilion basting stitches."
            fallbackTitle="Foldline specimen image"
            fallbackDetail="The weave, finish, and generated-demo record remain available in the adjacent semantic evidence list."
          />
          <figcaption>Foldline specimen image · generated for this open-source demonstration</figcaption>
        </figure>
      </section>

      <section className="construction-sequence" aria-labelledby="sequence-title">
        <p className="foldline-overline">The page behaves like the craft</p>
        <h2 id="sequence-title">Drape → fold → set → inspect</h2>
        <ol>
          <li><span>01</span><strong>Drape</strong><p>Weight establishes the first hierarchy.</p></li>
          <li><span>02</span><strong>Fold</strong><p>Tension reveals the page transition.</p></li>
          <li><span>03</span><strong>Set</strong><p>The animated system comes to rest.</p></li>
          <li><span>04</span><strong>Inspect</strong><p>Semantic evidence remains without motion.</p></li>
        </ol>
        <a className="foldline-action foldline-action--light" href="#foldline-top">Return to the textile</a>
      </section>
    </main>
  );
}
