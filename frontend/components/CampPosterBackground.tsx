export default function CampPosterBackground() {
  return (
    <svg
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMax slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* sky */}
      <rect x="0" y="0" width="1200" height="800" fill="#1B3A2F" />
      <rect x="0" y="0" width="1200" height="800" fill="url(#skyFade)" />

      {/* sun */}
      <circle cx="600" cy="230" r="120" fill="#F4B942" opacity="0.9" />
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i * 360) / 16;
        return (
          <rect
            key={i}
            x="597"
            y="60"
            width="6"
            height="46"
            fill="#F4B942"
            opacity="0.55"
            transform={`rotate(${angle} 600 230)`}
          />
        );
      })}

      {/* far mountains */}
      <polygon points="0,420 220,260 430,420" fill="#234A3A" />
      <polygon points="330,420 560,240 820,420" fill="#234A3A" />
      <polygon points="700,420 940,270 1200,420" fill="#234A3A" />

      {/* mid mountains */}
      <polygon points="0,480 260,300 560,480" fill="#2F5D46" />
      <polygon points="480,480 760,290 1080,480" fill="#2F5D46" />
      <polygon points="900,480 1080,340 1200,480" fill="#2F5D46" />

      {/* tree line */}
      {Array.from({ length: 22 }).map((_, i) => {
        const x = (1200 / 22) * i + (i % 2 === 0 ? 10 : 40);
        const scale = i % 3 === 0 ? 1.15 : 0.9;
        return (
          <g key={i} transform={`translate(${x} 470) scale(${scale})`}>
            <polygon points="0,0 -22,55 22,55" fill="#3D7257" />
            <polygon points="0,20 -18,65 18,65" fill="#2F5D46" />
            <rect x="-4" y="63" width="8" height="14" fill="#1B3A2F" />
          </g>
        );
      })}

      {/* foreground hill */}
      <path d="M0,620 Q300,540 600,600 T1200,580 L1200,800 L0,800 Z" fill="#122A21" />

      <defs>
        <linearGradient id="skyFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#12271f" stopOpacity="0" />
          <stop offset="1" stopColor="#0f2018" stopOpacity="0.65" />
        </linearGradient>
      </defs>
    </svg>
  );
}
