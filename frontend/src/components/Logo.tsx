export function LinusLogo({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label="Logotipo Linus: Lira e Clave de Sol integradas com Teclas de Piano"
    >
      <defs>
        <linearGradient id="linus-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#D4AF37" />
        </linearGradient>
        <linearGradient id="linus-blue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E3A8A" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
      </defs>

      {/* Forma base estrutural (Escudo / Lira) */}
      <path
        d="M32 4 C 45 4, 54 12, 54 26 C 54 42, 44 52, 32 60 C 20 52, 10 42, 10 26 C 10 12, 19 4, 32 4 Z"
        fill="url(#linus-blue)"
        stroke="url(#linus-gold)"
        strokeWidth="2"
      />

      {/* Cordas da Lira */}
      <line x1="20" y1="20" x2="20" y2="44" stroke="#FFD700" strokeWidth="1" opacity="0.4" />
      <line x1="24" y1="18" x2="24" y2="44" stroke="#FFD700" strokeWidth="1" opacity="0.4" />
      <line x1="40" y1="18" x2="40" y2="44" stroke="#FFD700" strokeWidth="1" opacity="0.4" />
      <line x1="44" y1="20" x2="44" y2="44" stroke="#FFD700" strokeWidth="1" opacity="0.4" />

      {/* Teclas de Piano na base */}
      <g transform="translate(18, 44)">
        <rect x="0" y="0" width="5.5" height="12" rx="1" fill="#F8FAFC" />
        <rect x="6" y="0" width="5.5" height="12" rx="1" fill="#F8FAFC" />
        <rect x="12" y="0" width="5.5" height="12" rx="1" fill="#F8FAFC" />
        <rect x="18" y="0" width="5.5" height="12" rx="1" fill="#F8FAFC" />
        <rect x="24" y="0" width="5.5" height="12" rx="1" fill="#F8FAFC" />
        {/* Teclas pretas */}
        <rect x="4" y="0" width="3.5" height="7" rx="0.5" fill="#0F172A" />
        <rect x="10" y="0" width="3.5" height="7" rx="0.5" fill="#0F172A" />
        <rect x="22" y="0" width="3.5" height="7" rx="0.5" fill="#0F172A" />
      </g>

      {/* Clave de Sol central */}
      <path
        d="M32 14c-2.5 0-4.5 2-4.5 4.5 0 2.8 1.8 4.5 3.5 6.2 1.5 1.4 2.5 2.4 2.5 4 0 1.7-1.3 2.8-2.8 2.8-1.3 0-2.3-.7-2.6-1.8 1.2.3 2.4-.3 2.4-1.6 0-1-.8-1.8-1.8-1.8-1.4 0-2.5 1.2-2.5 2.8 0 2.2 1.9 4 4.5 4 3 0 5-2 5-4.8 0-2.2-1.3-3.7-3.2-5.4-1.6-1.5-2.8-2.5-2.8-4.2 0-1.7 1-3 2.2-3 1.1 0 1.9.8 1.9 2 0 1-.5 1.8-1.2 2.7l1.2 1.2c1.5-1.4 2.2-2.8 2.2-4.5 0-2.8-2-4.5-4.5-4.5z"
        fill="url(#linus-gold)"
      />
    </svg>
  );
}
