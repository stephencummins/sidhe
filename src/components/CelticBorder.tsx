export default function CelticBorder({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M100 20 L110 30 L100 40 L90 30 Z M80 30 L90 40 L80 50 L70 40 Z M120 30 L130 40 L120 50 L110 40 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M40 60 Q50 50 60 60 T80 60"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        opacity="0.4"
      />
      <path
        d="M120 60 Q130 50 140 60 T160 60"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        opacity="0.4"
      />
      <circle cx="100" cy="100" r="70" stroke="currentColor" strokeWidth="2" opacity="0.3" />
      <circle cx="100" cy="100" r="65" stroke="currentColor" strokeWidth="1" opacity="0.2" />
      <path
        d="M100 30 Q120 50 100 70 Q80 50 100 30 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        opacity="0.5"
      />
    </svg>
  );
}
