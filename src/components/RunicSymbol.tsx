interface RunicSymbolProps {
  variant?: 'fehu' | 'ansuz' | 'kenaz' | 'algiz' | 'othala';
  className?: string;
}

export default function RunicSymbol({ variant = 'fehu', className = "" }: RunicSymbolProps) {
  const paths = {
    fehu: "M20 10 L20 50 M20 15 L35 10 M20 25 L35 20",
    ansuz: "M20 10 L20 50 M20 10 L35 25 M20 50 L35 35",
    kenaz: "M20 10 L20 50 M20 20 L32 30 M20 40 L32 30",
    algiz: "M25 50 L25 25 M25 25 L15 15 M25 25 L35 15 M25 10 L25 25",
    othala: "M15 35 L15 50 L35 50 L35 35 M15 35 L25 25 L35 35 M10 45 L15 50 M35 50 L40 45"
  };

  return (
    <svg className={className} viewBox="0 0 50 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d={paths[variant]}
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
