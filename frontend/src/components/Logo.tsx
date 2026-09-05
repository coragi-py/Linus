export function LinusLogo({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label="Logotipo Linus: escudo com lira, clave de sol e teclas de piano"
    >
      <defs>
        <linearGradient id="linus-shield" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.78" />
        </linearGradient>
      </defs>
      <path
        d="M32 3.5 55 11v22.5C55 47 45.6 56.6 32 60.5 18.4 56.6 9 47 9 33.5V11L32 3.5Z"
        fill="url(#linus-shield)"
        rx="12"
      />
      {/* teclas de piano */}
      <g opacity="0.95">
        <rect x="19" y="42" width="7.5" height="11" rx="2.5" fill="#F4F7F6" />
        <rect x="28.25" y="42" width="7.5" height="11" rx="2.5" fill="#F4F7F6" />
        <rect x="37.5" y="42" width="7.5" height="11" rx="2.5" fill="#F4F7F6" />
        <rect x="25" y="42" width="4" height="7" rx="1.6" fill="#2D3748" />
        <rect x="34.3" y="42" width="4" height="7" rx="1.6" fill="#2D3748" />
      </g>
      {/* braços da lira */}
      <path
        d="M21 34c-3-7-2.5-14 2-18M43 34c3-7 2.5-14-2-18"
        stroke="#FFB703"
        strokeWidth="3.2"
        strokeLinecap="round"
        fill="none"
      />
      {/* clave de sol estilizada fundida ao centro */}
      <path
        d="M32 12c-3.6 0-6 3-6 6.6 0 4 2.6 6.4 5.2 8.8 2.2 2 3.6 3.4 3.6 5.6 0 2.4-1.8 4-4 4-1.8 0-3.2-1-3.6-2.6 1.7.5 3.4-.5 3.4-2.3 0-1.4-1.1-2.5-2.6-2.5-2 0-3.5 1.7-3.5 4 0 3.2 2.7 5.7 6.4 5.7 4.2 0 7.2-2.9 7.2-7 0-3.2-1.8-5.3-4.6-7.8-2.4-2.2-4-3.6-4-6 0-2.4 1.3-4 3.1-4 1.5 0 2.6 1.1 2.6 2.8 0 1.4-.6 2.6-1.7 3.9l1.7 1.7c2.1-2 3.1-4 3.1-6.4 0-4-2.6-6.2-6.3-6.2Z"
        fill="#F4F7F6"
      />
    </svg>
  );
}
