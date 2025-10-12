export default function CelticBorder({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      {/* Main border background - darker */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-900/80 via-orange-900/70 to-amber-900/80 rounded-sm shadow-2xl" />

      {/* Teal interior background - MOVED UP */}
      <div className="absolute inset-3 bg-gradient-to-br from-teal-950/90 via-teal-900/80 to-teal-950/90 rounded-sm" />

      {/* Triple border layers */}
      <div className="absolute inset-0 border-4 border-double border-amber-400 rounded-sm" />
      <div className="absolute inset-1 border-2 border-orange-500 rounded-sm" />
      <div className="absolute inset-2 border border-amber-300/50 rounded-sm" />

      {/* Corner decorations - Top Left */}
      <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-amber-300 rounded-tl-lg">
        <div className="absolute top-0 left-0 w-2 h-2 bg-amber-200 rounded-full" />
      </div>
      
      {/* Corner decorations - Top Right */}
      <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-amber-300 rounded-tr-lg">
        <div className="absolute top-0 right-0 w-2 h-2 bg-amber-200 rounded-full" />
      </div>
      
      {/* Corner decorations - Bottom Left */}
      <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-amber-300 rounded-bl-lg">
        <div className="absolute bottom-0 left-0 w-2 h-2 bg-amber-200 rounded-full" />
      </div>
      
      {/* Corner decorations - Bottom Right */}
      <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-amber-300 rounded-br-lg">
        <div className="absolute bottom-0 right-0 w-2 h-2 bg-amber-200 rounded-full" />
      </div>

      {/* Top Celtic knot medallion */}
      <svg className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 text-amber-300 z-10" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" fill="#78350f" />
        <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="1" fill="#92400e" />
        <path d="M24 8 Q32 16 24 24 Q16 16 24 8 M8 24 Q16 16 24 24 Q16 32 8 24 M24 40 Q16 32 24 24 Q32 32 24 40 M40 24 Q32 32 24 24 Q32 16 40 24" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <circle cx="24" cy="24" r="3" fill="currentColor" />
      </svg>

      {/* Bottom Celtic knot medallion */}
      <svg className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-14 h-14 text-amber-300 z-10" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" fill="#78350f" />
        <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="1" fill="#92400e" />
        <path d="M24 8 Q32 16 24 24 Q16 16 24 8 M8 24 Q16 16 24 24 Q16 32 8 24 M24 40 Q16 32 24 24 Q32 32 24 40 M40 24 Q32 32 24 24 Q32 16 40 24" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <circle cx="24" cy="24" r="3" fill="currentColor" />
      </svg>

      {/* Left Celtic knot medallion */}
      <svg className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-14 h-14 text-amber-300 z-10" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" fill="#78350f" />
        <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="1" fill="#92400e" />
        <path d="M24 8 Q32 16 24 24 Q16 16 24 8 M8 24 Q16 16 24 24 Q16 32 8 24 M24 40 Q16 32 24 24 Q32 32 24 40 M40 24 Q32 32 24 24 Q32 16 40 24" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <circle cx="24" cy="24" r="3" fill="currentColor" />
      </svg>

      {/* Right Celtic knot medallion */}
      <svg className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-14 h-14 text-amber-300 z-10" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" fill="#78350f" />
        <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="1" fill="#92400e" />
        <path d="M24 8 Q32 16 24 24 Q16 16 24 8 M8 24 Q16 16 24 24 Q16 32 8 24 M24 40 Q16 32 24 24 Q32 32 24 40 M40 24 Q32 32 24 24 Q32 16 40 24" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <circle cx="24" cy="24" r="3" fill="currentColor" />
      </svg>

      {/* Decorative lines */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
      <div className="absolute top-3/4 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-transparent via-amber-400 to-transparent" />
      <div className="absolute top-1/2 left-3/4 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-transparent via-amber-400 to-transparent" />

      {/* Content layer */}
      <div className="relative">
        {children}
      </div>
    </div>
  ); 
}