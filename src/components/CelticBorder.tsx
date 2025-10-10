export default function CelticBorder({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 border-4 border-double border-amber-700/40 rounded-sm" />
      <div className="absolute inset-1 border border-orange-600/30 rounded-sm" />

      <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-amber-700 rounded-tl-lg" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-amber-700 rounded-tr-lg" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-amber-700 rounded-bl-lg" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-amber-700 rounded-br-lg" />

      <div className="absolute top-2 left-2 w-3 h-3 bg-orange-600 rounded-full" />
      <div className="absolute top-2 right-2 w-3 h-3 bg-orange-600 rounded-full" />
      <div className="absolute bottom-2 left-2 w-3 h-3 bg-orange-600 rounded-full" />
      <div className="absolute bottom-2 right-2 w-3 h-3 bg-orange-600 rounded-full" />

      <svg className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-amber-700" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2" fill="#fef3c7" />
        <path d="M24 8 Q32 16 24 24 Q16 16 24 8 M8 24 Q16 16 24 24 Q16 32 8 24 M24 40 Q16 32 24 24 Q32 32 24 40 M40 24 Q32 32 24 24 Q32 16 40 24" stroke="currentColor" strokeWidth="1.5" />
      </svg>

      <div className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 rounded-sm">
        {children}
      </div>
    </div>
  );
}
