import { lazy, Suspense, useState } from "react";
import { EvidenceImage } from "../components/EvidenceImage";
import { SceneBoundary } from "../components/SceneBoundary";
import { routeHref } from "../routing";

const PressureAtlasScene = lazy(() => import("../scenes/PressureAtlasScene"));

const depthStates = Object.freeze([
  { marker: "M-01", label: "Surface", metres: "0000 m", value: 0.05 },
  { marker: "M-02", label: "Twilight", metres: "0930 m", value: 0.36 },
  { marker: "M-03", label: "Midnight", metres: "2930 m", value: 0.67 },
  { marker: "M-04", label: "Abyss", metres: "6100 m", value: 1 }
]);

const lensPositions = Object.freeze([
  { label: "West", coordinates: [0.34, 0.54] as const },
  { label: "Centre", coordinates: [0.58, 0.48] as const },
  { label: "East", coordinates: [0.76, 0.42] as const }
]);

export default function PressureAtlas() {
  const [activeDepth, setActiveDepth] = useState(1);
  const [activeLens, setActiveLens] = useState(1);
  const state = depthStates[activeDepth];
  const lens = lensPositions[activeLens];

  return (
    <main id="main" className="experience pressure-page">
      <header className="pressure-masthead">
        <a className="brand-lockup" href="#top" aria-label="Pressure Atlas home">
          <span className="brand-mark" aria-hidden="true">◌</span>
          <span>Pressure Atlas</span>
        </a>
        <p>Fictional public expedition archive</p>
        <a className="text-action" href="#dive-47">Open dive 47 <span aria-hidden="true">↘</span></a>
      </header>

      <section id="top" className="pressure-hero" aria-labelledby="pressure-title">
        <div className="pressure-hero__copy">
          <p className="kicker">Transect 47 · Southern fictional basin</p>
          <h1 id="pressure-title">The ocean remembers pressure.</h1>
          <p className="hero-deck">Choose a depth and lens position to cross one synthetic trench. Every marker explains how a demonstration specimen was observed, collected, and catalogued.</p>
          <a className="primary-action primary-action--coral" href="#dive-47">Open dive 47</a>
        </div>
        <SceneBoundary
          containerClass="pressure-visual"
          title="Depth transect"
          description="A static bathymetric route preserves the four depth states and specimen locations."
          variant="pressure"
        >
          <Suspense fallback={<div className="pressure-visual scene-loading" aria-hidden="true" />}>
            <PressureAtlasScene depth={state.value} lens={lens.coordinates} />
          </Suspense>
        </SceneBoundary>
        <aside className="transect-instrument" aria-label="Current transect instrument readings">
          <p><span>Route</span><strong>47—B / S03</strong></p>
          <p><span>Marker</span><strong>{state.marker}</strong></p>
          <p><span>Lens</span><strong>{lens.label} / {String(activeLens + 1).padStart(2, "0")}</strong></p>
        </aside>
        <div className="depth-readout" aria-live="polite">
          <span>{state.metres}</span>
          <span>{state.marker} · {state.label}</span>
        </div>
      </section>

      <section className="depth-controller" aria-label="Choose a depth state">
        <p>Depth is the navigation.</p>
        <div className="depth-controller__track" role="group" aria-label="Depth states">
          {depthStates.map((item, index) => (
            <button key={item.label} type="button" aria-pressed={activeDepth === index} onClick={() => setActiveDepth(index)}>
              <span>{item.marker} / {item.metres}</span>
              <strong>{item.label}</strong>
            </button>
          ))}
        </div>
        <div className="pressure-lens-control">
          <span>Lens position</span>
          <div role="group" aria-label="Pressure lens positions">
            {lensPositions.map((position, index) => (
              <button key={position.label} type="button" aria-pressed={activeLens === index} onClick={() => setActiveLens(index)}>
                <strong>{position.label}</strong>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="dive-47" className="accession-story" aria-labelledby="specimen-title">
        <figure className="specimen-figure">
          <EvidenceImage
            src={routeHref("/assets/pressure-atlas-specimen.webp")}
            width={1600}
            height={900}
            sizes="(max-width: 900px) 100vw, 68vw"
            alt="A fictional translucent shell-like abyssal specimen in a clear glass accession dish."
            fallbackTitle="Demonstration specimen 47-β"
            fallbackDetail="The fictional accession label, depth, method, and status remain available beside this media region."
          />
          <figcaption>Demonstration specimen 47-β · Generated fictional evidence image · not a real species record</figcaption>
        </figure>
        <div className="accession-copy">
          <p className="kicker">Collection method</p>
          <h2 id="specimen-title">One marker. The whole chain of custody.</h2>
          <dl className="accession-data">
            <div><dt>Observed</dt><dd>2930 m</dd></div>
            <div><dt>Method</dt><dd>Imaging pass</dd></div>
            <div><dt>Status</dt><dd>Fictional demo</dd></div>
          </dl>
          <p>The interface never substitutes spectacle for evidence. The semantic record, collection method, and route remain available without the shader.</p>
        </div>
      </section>

      <section className="pressure-coda" aria-labelledby="pressure-coda-title">
        <p>Surface → twilight → midnight → abyss</p>
        <h2 id="pressure-coda-title">Open the dive as a sequence, not a dashboard.</h2>
        <a className="primary-action primary-action--ink" href="#top">Return to the transect</a>
      </section>
    </main>
  );
}
