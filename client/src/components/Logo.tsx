export default function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <div className={`${className} relative`}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Gradient definitions */}
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#3b82f6", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "#1d4ed8", stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#06b6d4", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "#0891b2", stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        
        {/* Main circle with data nodes */}
        <circle cx="50" cy="50" r="35" fill="url(#logoGradient)" opacity="0.1"/>
        <circle cx="50" cy="50" r="25" fill="none" stroke="url(#logoGradient)" strokeWidth="2"/>
        
        {/* Data points representing analytics */}
        <circle cx="30" cy="35" r="3" fill="url(#accentGradient)"/>
        <circle cx="70" cy="35" r="3" fill="url(#accentGradient)"/>
        <circle cx="35" cy="65" r="3" fill="url(#accentGradient)"/>
        <circle cx="65" cy="65" r="3" fill="url(#accentGradient)"/>
        
        {/* Connecting lines */}
        <path d="M30,35 L50,50 L70,35" stroke="url(#logoGradient)" strokeWidth="1.5" fill="none" opacity="0.7"/>
        <path d="M35,65 L50,50 L65,65" stroke="url(#logoGradient)" strokeWidth="1.5" fill="none" opacity="0.7"/>
        
        {/* Central initials */}
        <text x="50" y="57" textAnchor="middle" className="text-xs font-bold" fill="url(#logoGradient)">
          LSV
        </text>
      </svg>
    </div>
  );
}