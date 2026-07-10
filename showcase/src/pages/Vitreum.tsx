import { lazy, Suspense, useState } from "react";
import type { VitreumLayer } from "../scenes/VitreumScene";
import { SceneBoundary } from "../components/SceneBoundary";

const VitreumScene = lazy(() => import("../scenes/VitreumScene"));

const layers = Object.freeze([
  { id: "shell" as const, index: "01", name: "Optical shell", detail: "Transmission reveals structure without hiding the interface." },
  { id: "logic" as const, index: "02", name: "Logic plane", detail: "One removable board carries the demonstration signal route." },
  { id: "power" as const, index: "03", name: "Power cell", detail: "The warm internal block makes replacement physically legible." }
]);

export default function Vitreum() {
  const [activeLayer, setActiveLayer] = useState<VitreumLayer>("shell");
  const active = layers.find(({ id }) => id === activeLayer)!;

  return (
    <main id="main" className="experience vitreum-page">
      <header className="vitreum-rail">
        <a href="#vitreum-top" className="vitreum-wordmark" aria-label="Vitreum home">Vitreum</a>
        <span>Original concept device</span>
        <a href="#layer-map">Inspect layers</a>
      </header>

      <section id="vitreum-top" className="vitreum-hero" aria-labelledby="vitreum-title">
        <p className="vitreum-overline">A transparent handset study · not an existing product</p>
        <h1 id="vitreum-title">
          <span>Nothing inside</span>
          <span>is hidden from repair.</span>
        </h1>
        <SceneBoundary
          containerClass="vitreum-visual"
          title="Repairable layer map"
          description="A static optical cutaway labels the shell, logic plane, and replaceable power cell."
          variant="glass"
        >
          <Suspense fallback={<div className="vitreum-visual scene-loading" aria-hidden="true" />}>
            <VitreumScene activeLayer={activeLayer} />
          </Suspense>
        </SceneBoundary>
        <div className="vitreum-callouts" aria-hidden="true">
          <span>01 / gasket seam</span>
          <span>02 / board clasp</span>
          <span>03 / cell latch</span>
        </div>
        <p className="vitreum-deck">Optical glass is not decoration here. It turns shell, logic, and power into a readable repair sequence.</p>
        <a className="vitreum-action" href="#layer-map">Inspect the layer map <span aria-hidden="true">↓</span></a>
      </section>

      <section id="layer-map" className="layer-map" aria-labelledby="layer-map-title">
        <div className="layer-map__heading">
          <p>Three visible systems</p>
          <h2 id="layer-map-title">Transparency as product evidence.</h2>
        </div>
        <div className="layer-selector" role="group" aria-label="Repair layers">
          {layers.map((layer) => (
            <button key={layer.id} type="button" aria-pressed={activeLayer === layer.id} onClick={() => setActiveLayer(layer.id)}>
              <span>{layer.index}</span>
              <strong>{layer.name}</strong>
              <small>{layer.detail}</small>
            </button>
          ))}
        </div>
        <p className="layer-status" aria-live="polite"><span>{active.index}</span> {active.name}: {active.detail}</p>
      </section>

      <section className="glass-principles" aria-labelledby="glass-principles-title">
        <div className="glass-principles__lens" aria-hidden="true"><span>1.46</span><small>index of refraction</small></div>
        <div>
          <p className="vitreum-overline">Material discipline</p>
          <h2 id="glass-principles-title">Refraction stops where reading begins.</h2>
          <p>All copy and controls remain semantic HTML. The transmissive object enhances the internal story, while the static layer map preserves it on reduced-motion, low-power, and no-WebGL paths.</p>
          <a className="vitreum-action vitreum-action--dark" href="#vitreum-top">Return to the device</a>
        </div>
      </section>
    </main>
  );
}
