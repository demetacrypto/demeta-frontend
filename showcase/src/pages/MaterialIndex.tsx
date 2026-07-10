const studies = Object.freeze([
  {
    number: "01",
    title: "Pressure Atlas",
    medium: "Fluid / GLSL",
    path: "/pressure-atlas",
    copy: "A refractive pressure lens moves through one synthetic ocean transect.",
    className: "material-card--flow"
  },
  {
    number: "02",
    title: "Vitreum",
    medium: "Optical glass / Three.js",
    path: "/vitreum",
    copy: "A transparent original handset turns internal repair layers into evidence.",
    className: "material-card--glass"
  },
  {
    number: "03",
    title: "Foldline",
    medium: "Cloth / Verlet",
    path: "/foldline",
    copy: "A simulated textile becomes page, transition, and construction record.",
    className: "material-card--cloth"
  }
]);

export default function MaterialIndex() {
  return (
    <main id="main" className="material-index">
      <header className="material-index__header">
        <span>DEMETA / Material studies</span>
        <span>Fluid · glass · cloth</span>
      </header>
      <section className="material-index__intro" aria-labelledby="index-title">
        <p>Three original, fictional demonstrations</p>
        <h1 id="index-title">Interfaces should feel made of something.</h1>
        <div className="index-orb" aria-hidden="true"><span /></div>
      </section>
      <section className="material-grid" aria-label="Material studies">
        {studies.map((study) => (
          <a className={`material-card ${study.className}`} href={study.path} key={study.path}>
            <span className="material-card__number">{study.number}</span>
            <span className="material-card__medium">{study.medium}</span>
            <strong>{study.title}</strong>
            <span className="material-card__copy">{study.copy}</span>
            <span className="material-card__arrow" aria-hidden="true">↗</span>
          </a>
        ))}
      </section>
      <footer className="material-index__footer">
        <p>Every study keeps meaning and controls in semantic HTML, with reduced-motion and no-WebGL compositions.</p>
        <a href="/pressure-atlas">Enter the first study</a>
      </footer>
    </main>
  );
}
