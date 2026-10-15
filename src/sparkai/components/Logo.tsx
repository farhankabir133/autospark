// The Intelligent Spark — original geometric brand mark (custom vector paths).
export function SparkMark({ size = 36, title = 'SparkPilot symbol' }: { size?: number; title?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" role="img" aria-label={title} aria-hidden={title ? undefined : true}>
      <defs>
        <linearGradient id="spark-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#22D3EE" />
          <stop offset="0.55" stopColor="#2563EB" />
          <stop offset="1" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="44" height="44" rx="13" fill="#0B1220" />
      <rect x="2" y="2" width="44" height="44" rx="13" fill="none" stroke="url(#spark-g)" strokeWidth="2" opacity="0.9" />
      {/* spark bolt */}
      <path d="M27 8 L15 27 h8 L21 40 L33 21 h-8 Z" fill="url(#spark-g)" />
      {/* forward-motion road chevrons */}
      <path d="M33 30 l4 4 -4 4" fill="none" stroke="#22D3EE" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      {/* intelligent node */}
      <circle cx="27" cy="8.5" r="3" fill="#fff" />
      <circle cx="27" cy="8.5" r="1.3" fill="#2563EB" />
    </svg>
  );
}

export function SparkPilotLogo({ dark = true, compact = false }: { dark?: boolean; compact?: boolean }) {
  if (compact) return <SparkMark size={32} />;
  const fg = dark ? '#FFFFFF' : '#0B1220';
  const sub = dark ? '#93A4BC' : '#5B6B82';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }} role="img" aria-label="SparkPilot by AutoSpark">
      <SparkMark size={36} />
      <span style={{ lineHeight: 1.05 }}>
        <span style={{ display: 'block', fontWeight: 800, fontSize: 19, letterSpacing: '-0.02em', color: fg }}>
          Spark<span style={{ color: '#22D3EE' }}>AI</span>
        </span>
        <span style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: sub }}>
          by AutoSpark
        </span>
      </span>
    </span>
  );
}
