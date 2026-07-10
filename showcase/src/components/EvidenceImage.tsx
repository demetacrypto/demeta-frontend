import { useState } from "react";

type Props = Readonly<{
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes: string;
  fallbackTitle: string;
  fallbackDetail: string;
}>;

export function EvidenceImage({ src, alt, width, height, sizes, fallbackTitle, fallbackDetail }: Props) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="evidence-image-fallback" role="img" aria-label={`${alt} ${fallbackDetail}`} data-testid="evidence-image-fallback">
        <span>Media unavailable / semantic record preserved</span>
        <strong>{fallbackTitle}</strong>
        <small>{fallbackDetail}</small>
      </div>
    );
  }

  return (
    <img
      src={src}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      sizes={sizes}
      alt={alt}
      onError={() => setFailed(true)}
    />
  );
}
