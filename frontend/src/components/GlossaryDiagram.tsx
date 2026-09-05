import type { GlossaryTerm } from "@/data/glossary";

const INK = "#2D3748";
const BLUE = "#2B6CB0";

function Lines() {
  return (
    <g stroke={INK} strokeWidth="1.4" opacity="0.55">
      {[0, 1, 2, 3, 4].map((i) => (
        <line key={i} x1="6" y1={20 + i * 12} x2="154" y2={20 + i * 12} />
      ))}
    </g>
  );
}

/** Diagramas vetoriais — apenas visual, sem áudio. */
export function GlossaryDiagram({ diagram }: { diagram: GlossaryTerm["diagram"] }) {
  return (
    <svg viewBox="0 0 160 92" className="h-24 w-full" role="img" aria-label="Diagrama do símbolo musical">
      {(diagram === "stave" || diagram === "treble" || diagram === "bass") && <Lines />}

      {diagram === "stave" && (
        <g fill={BLUE}>
          <ellipse cx="60" cy="44" rx="7" ry="5" transform="rotate(-18 60 44)" />
          <rect x="66" y="16" width="2.4" height="28" />
        </g>
      )}

      {diagram === "treble" && (
        <path
          d="M40 52c-4 0-7-3-7-7 0-3 1.5-6 4-8 2-2 3-3 3-5 0-2-1.5-3.5-3.5-3.5S33 30 33 32c0 1.5 1 3 2.5 3 1 0 2-1 2-2.5 0-1.5-1-2.5-2.5-2.5-2.5 0-4.5 2-4.5 5 0 3.5 2 6 5.5 9 3 2.5 4.5 4.5 4.5 7.5 0 3.5-2.5 6-6 6s-6-2.5-6-5.5c0-1 0.5-2 1-3 0.5-0.5 1-1 2-1 1.5 0 2.5 1 2.5 2s-1 2-2.5 2c-0.5 0-1-0.5-1-1 0-2.5 2-4.5 4-4.5 2 0 3.5 1.5 3.5 3.5s-1.5 3.5-3.5 3.5c-4 0-7-3-7-7 0-4.5 3.5-8.5 8.5-8.5 4 0 7 3 7 7 0 5-4.5 9-9 9z"
          fill={BLUE}
          transform="translate(42 -10) scale(1.4)"
        />
      )}

      {diagram === "bass" && (
        <g fill={BLUE} transform="translate(38 12) scale(1.1)">
          <path d="M6 6c12 0 22 8 22 22 0 16-14 26-26 32l-2-3c9-5 18-14 18-27 0-12-6-18-12-18-4 0-7 2-7 5 0 2 1 3 3 3 1 0 2-.4 2-1.6C4 17 3 16 2 16c0-6 2-10 4-10Z" />
          <circle cx="36" cy="14" r="3" />
          <circle cx="36" cy="26" r="3" />
        </g>
      )}

      {diagram === "whole" && (
        <g transform="translate(56 30)">
          <ellipse cx="20" cy="16" rx="18" ry="11" fill="none" stroke={BLUE} strokeWidth="6" />
        </g>
      )}

      {diagram === "half" && (
        <g transform="translate(52 14)">
          <ellipse cx="20" cy="50" rx="14" ry="9.5" fill="none" stroke={BLUE} strokeWidth="4.5" transform="rotate(-18 20 50)" />
          <rect x="32" y="8" width="3.5" height="42" fill={BLUE} />
        </g>
      )}

      {diagram === "quarter" && (
        <g transform="translate(52 14)">
          <ellipse cx="20" cy="50" rx="14" ry="9.5" fill={BLUE} transform="rotate(-18 20 50)" />
          <rect x="32" y="8" width="3.5" height="42" fill={BLUE} />
        </g>
      )}

      {diagram === "eighth" && (
        <g transform="translate(52 14)">
          <ellipse cx="20" cy="50" rx="14" ry="9.5" fill={BLUE} transform="rotate(-18 20 50)" />
          <rect x="32" y="8" width="3.5" height="42" fill={BLUE} />
          <path d="M35.5 8c9 4 13 10 11 20-1-7-5-11-11-13Z" fill={BLUE} />
        </g>
      )}

      {diagram === "sharp" && (
        <g stroke={BLUE} strokeWidth="5" strokeLinecap="round" transform="translate(58 16)">
          <line x1="10" y1="6" x2="10" y2="58" />
          <line x1="28" y1="2" x2="28" y2="54" />
          <line x1="0" y1="24" x2="38" y2="18" />
          <line x1="0" y1="42" x2="38" y2="36" />
        </g>
      )}

      {diagram === "flat" && (
        <g transform="translate(64 12)">
          <rect x="4" y="4" width="4.5" height="56" fill={BLUE} rx="2" />
          <path
            d="M8.5 32c8-8 22-5 22 6 0 9-13 14-22 20V32Z"
            fill="none"
            stroke={BLUE}
            strokeWidth="4.5"
          />
        </g>
      )}

      {diagram === "natural" && (
        <g stroke={BLUE} strokeWidth="4.5" strokeLinecap="round" transform="translate(66 12)">
          <line x1="4" y1="4" x2="4" y2="52" />
          <line x1="24" y1="16" x2="24" y2="64" />
          <line x1="4" y1="22" x2="24" y2="17" />
          <line x1="4" y1="44" x2="24" y2="39" />
        </g>
      )}
    </svg>
  );
}
