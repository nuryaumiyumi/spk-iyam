import { useId } from "react";

export type TomatPalette = {
  /** Warna tubuh tomat, terang ke gelap. */
  from: string;
  to: string;
  leaf: string;
};

interface TomatIllustrationProps {
  palette?: TomatPalette;
  className?: string;
}

const DEFAULT_PALETTE: TomatPalette = {
  from: "#E85D4A",
  to: "#9F1239",
  leaf: "#3F6B35",
};

/** Ilustrasi tomat vektor — dipakai galeri & elemen dekoratif. */
export default function TomatIllustration({
  palette = DEFAULT_PALETTE,
  className,
}: TomatIllustrationProps) {
  const uid = useId();
  const bodyId = `body-${uid}`;
  const shineId = `shine-${uid}`;

  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      role="img"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={bodyId} cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor={palette.from} />
          <stop offset="100%" stopColor={palette.to} />
        </radialGradient>
        <radialGradient id={shineId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Tubuh tomat */}
      <ellipse cx="60" cy="66" rx="46" ry="42" fill={`url(#${bodyId})`} />

      {/* Lekukan halus */}
      <path
        d="M38 32 C30 48 30 84 40 100"
        stroke="#000000"
        strokeOpacity="0.08"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M82 32 C90 48 90 84 80 100"
        stroke="#000000"
        strokeOpacity="0.08"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />

      {/* Kilau */}
      <ellipse cx="44" cy="48" rx="16" ry="11" fill={`url(#${shineId})`} />

      {/* Kelopak daun */}
      <g fill={palette.leaf}>
        <path d="M60 30 C56 22 52 18 45 16 C52 14 57 16 60 20 C63 16 68 14 75 16 C68 18 64 22 60 30 Z" />
        <path d="M60 28 C50 24 38 26 32 32 C42 32 50 34 56 38 Z" />
        <path d="M60 28 C70 24 82 26 88 32 C78 32 70 34 64 38 Z" />
        <path d="M58 30 C52 36 50 42 52 48 C56 42 60 38 62 34 Z" />
        <path d="M62 30 C68 36 70 42 68 48 C64 42 60 38 58 34 Z" />
      </g>

      {/* Tangkai */}
      <path
        d="M59 22 C59 14 61 10 65 7"
        stroke={palette.leaf}
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
