type Props = Readonly<{
  title: string;
  description: string;
  variant: "pressure" | "glass" | "cloth";
}>;

export function GraphicsFallback({ title, description, variant }: Props) {
  return (
    <div className={`graphics-fallback graphics-fallback--${variant}`} data-testid="graphics-fallback" role="img" aria-label={`${title}. ${description}`}>
      {variant === "pressure" && (
        <svg viewBox="0 0 920 620" aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id="pressure-fill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#d8efea" />
              <stop offset=".52" stopColor="#6bbac0" />
              <stop offset="1" stopColor="#163d82" />
            </linearGradient>
          </defs>
          <path className="pressure-fallback__mass" d="M34 452 C154 365 222 412 320 337 S475 325 558 230 S748 184 886 72 L886 565 L34 565 Z" />
          <g className="pressure-fallback__contours">
            <path d="M34 452 C154 365 222 412 320 337 S475 325 558 230 S748 184 886 72" />
            <path d="M52 492 C165 410 243 450 347 374 S500 358 589 266 S760 222 895 119" />
            <path d="M69 528 C180 458 266 487 374 413 S532 397 620 309 S780 271 903 173" />
          </g>
          <path className="pressure-fallback__route" d="M122 418 L263 399 L402 355 L548 278 L692 224 L822 142" />
          {[[122,418,"M-01"],[263,399,"M-02"],[402,355,"M-03"],[548,278,"M-04"],[692,224,"M-05"]].map(([cx, cy, label]) => (
            <g className="pressure-fallback__marker" key={String(label)}>
              <circle cx={Number(cx)} cy={Number(cy)} r="9" />
              <text x={Number(cx) + 15} y={Number(cy) - 13}>{label}</text>
            </g>
          ))}
          <g className="pressure-fallback__scale">
            <text x="745" y="458">DEPTH / M</text>
            <path d="M746 475 H866 M746 490 H836 M746 505 H806 M746 520 H776" />
            <text x="746" y="546">0000 → 6100</text>
          </g>
          <circle className="pressure-fallback__lens" cx="548" cy="278" r="92" />
        </svg>
      )}
      {variant === "glass" && (
        <svg viewBox="0 0 920 620" aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id="glass-shell" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#f9ffff" stopOpacity=".84" />
              <stop offset=".45" stopColor="#8ed0d2" stopOpacity=".24" />
              <stop offset="1" stopColor="#2c7481" stopOpacity=".12" />
            </linearGradient>
          </defs>
          <g className="glass-fallback__device">
            <rect className="glass-fallback__shell" x="304" y="42" width="318" height="520" rx="86" />
            <rect className="glass-fallback__seal" x="328" y="67" width="270" height="470" rx="67" />
            <rect className="glass-fallback__logic" x="368" y="149" width="190" height="86" rx="19" />
            <path className="glass-fallback__trace" d="M390 177 H470 V208 H535 M413 204 H444 V257 H507 V295" />
            <rect className="glass-fallback__power" x="391" y="276" width="144" height="208" rx="26" />
            <path className="glass-fallback__connector" d="M463 235 V276" />
            {[[345,92],[581,92],[345,512],[581,512]].map(([cx,cy]) => <g className="glass-fallback__fastener" key={`${cx}-${cy}`}><circle cx={cx} cy={cy} r="8" /><path d={`M${cx - 4} ${cy} H${cx + 4}`} /></g>)}
          </g>
          <g className="glass-fallback__labels">
            <path d="M304 258 H141" /><text x="32" y="252">01 / OPTICAL SHELL</text>
            <path d="M558 190 H750" /><text x="758" y="184">02 / LOGIC PLANE</text>
            <path d="M535 376 H750" /><text x="758" y="370">03 / POWER CELL</text>
            <path d="M344 512 H151" /><text x="32" y="506">M2 REPAIR FASTENER</text>
          </g>
        </svg>
      )}
      {variant === "cloth" && (
        <svg viewBox="0 0 920 620" aria-hidden="true" focusable="false">
          <defs>
            <pattern id="cloth-weave" width="14" height="14" patternUnits="userSpaceOnUse">
              <path d="M0 2 H14 M2 0 V14" />
            </pattern>
            <linearGradient id="cloth-fold" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#e9ebe5" />
              <stop offset=".47" stopColor="#c7ccc7" />
              <stop offset=".53" stopColor="#fbfcf7" />
              <stop offset="1" stopColor="#d8ddd8" />
            </linearGradient>
          </defs>
          <path className="cloth-fallback__page" d="M124 76 H745 Q806 76 808 139 V530 H124 Z" />
          <path className="cloth-fallback__weave" d="M124 76 H745 Q806 76 808 139 V530 H124 Z" />
          <path className="cloth-fallback__fold" d="M514 76 C470 182 468 367 512 530 C566 411 568 194 514 76 Z" />
          <path className="cloth-fallback__seam" d="M155 405 C290 367 404 429 529 375 S708 340 778 300" />
          {[155,286,415,546,675,778].map((cx, index) => <line className="cloth-fallback__stitch" key={cx} x1={cx} y1={index % 2 ? 381 : 395} x2={cx + 24} y2={index % 2 ? 375 : 386} />)}
          {[155,303,451,599,747].map((cx) => <g className="cloth-fallback__pin" key={cx}><circle cx={cx} cy="76" r="9" /><path d={`M${cx} 85 V111`} /></g>)}
          <g className="cloth-fallback__notation">
            <text x="124" y="45">PINNED SELVEDGE / 05 POINTS</text>
            <text x="535" y="558">FOLD AXIS / PAGE CREASE</text>
            <text x="124" y="579">HAND-BASTED ROUTE / VERMILION</text>
          </g>
        </svg>
      )}
      <div className="graphics-fallback__copy">
        <span className="graphics-fallback__index" aria-hidden="true">{variant === "pressure" ? "TR-47" : variant === "glass" ? "CUTAWAY / 03" : "PATTERN / 01"}</span>
        <strong>{title}</strong>
        <span>{description}</span>
      </div>
    </div>
  );
}
