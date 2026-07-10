import { useEffect, useState } from "react";
import PressureAtlas from "./pages/PressureAtlas";
import Vitreum from "./pages/Vitreum";
import Foldline from "./pages/Foldline";
import MaterialIndex from "./pages/MaterialIndex";
import { currentRoute, routeHref } from "./routing";

const studies = Object.freeze([
  { path: "/pressure-atlas", short: "Flow", label: "Pressure Atlas" },
  { path: "/vitreum", short: "Glass", label: "Vitreum" },
  { path: "/foldline", short: "Cloth", label: "Foldline" }
]);

function CurrentPage() {
  const path = currentRoute();
  if (path === "/pressure-atlas") return <PressureAtlas />;
  if (path === "/vitreum") return <Vitreum />;
  if (path === "/foldline") return <Foldline />;
  return <MaterialIndex />;
}

export function App() {
  const current = currentRoute();
  const [motionPaused, setMotionPaused] = useState(false);
  const currentStudy = studies.find(({ path }) => path === current);

  useEffect(() => {
    document.documentElement.dataset.userMotion = motionPaused ? "paused" : "running";
    window.dispatchEvent(new CustomEvent("demeta-motion-toggle", {
      detail: { paused: motionPaused }
    }));
  }, [motionPaused]);

  return (
    <>
      <CurrentPage />
      <footer className={`study-footer study-footer--${currentStudy?.short.toLowerCase() || "index"}`}>
        <div className="study-footer__identity">
          <span>DEMETA / Material systems</span>
          <strong>{currentStudy?.label || "Study index"}</strong>
        </div>
        <nav className="study-footer__routes" aria-label="Material studies">
          <a className={current === "/" ? "is-current" : ""} href={routeHref("/")} aria-current={current === "/" ? "page" : undefined}>
            <span>00</span> Index
          </a>
          {studies.map((study, index) => (
            <a key={study.path} className={current === study.path ? "is-current" : ""} href={routeHref(study.path)} aria-current={current === study.path ? "page" : undefined}>
              <span>0{index + 1}</span> {study.label}
            </a>
          ))}
        </nav>
        <button
          className="study-footer__motion"
          type="button"
          aria-label={motionPaused ? "Resume ambient motion" : "Pause ambient motion"}
          aria-pressed={motionPaused}
          onClick={() => setMotionPaused((paused) => !paused)}
        >
          <span aria-hidden="true">{motionPaused ? "▶" : "Ⅱ"}</span>
          <span>{motionPaused ? "Resume motion" : "Pause motion"}</span>
        </button>
      </footer>
    </>
  );
}
