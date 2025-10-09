import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import RunicSymbol from './RunicSymbol';
import CelticBorder from './CelticBorder';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleStartReading = () => {
    navigate('/reading');
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-sidhe-deep-blue via-sidhe-navy to-sidhe-deep-blue flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="cave-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="2" fill="#d4af37" opacity="0.3" />
              <path d="M40 30 Q50 25 60 30" stroke="#d4af37" strokeWidth="1" fill="none" opacity="0.2" />
              <path d="M10 60 L15 55 L20 60 L15 65 Z" stroke="#d4af37" strokeWidth="0.5" opacity="0.2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cave-pattern)" />
        </svg>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sidhe-navy/10 to-transparent"></div>

      <div className="max-w-2xl mx-auto text-center relative z-10">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <img src="/Copilot_20251009_124652.png" alt="SIDHE" className="w-48 h-48 object-contain drop-shadow-2xl" />
          </div>
        </div>

        <h1 className="text-6xl font-bold text-sidhe-cream mb-4 tracking-wide" style={{ fontFamily: 'Georgia, serif', letterSpacing: '0.05em' }}>
          SIDHE
        </h1>

        <p className="text-xl text-sidhe-moon/80 mb-12 leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
          Tarot Reading AI - Ancient wisdom channeled through modern divination
        </p>

        <button
          onClick={handleStartReading}
          className="group relative px-12 py-4 bg-gradient-to-r from-sidhe-orange via-sidhe-coral to-sidhe-orange text-sidhe-cream text-lg font-semibold border-2 border-sidhe-gold/50 hover:border-sidhe-bright-gold transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-sidhe-gold/60"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          <span className="relative z-10">Begin Your Reading</span>
          <div className="absolute inset-0 bg-sidhe-bright-gold opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-sidhe-gold/50"></div>
          <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-sidhe-gold/50"></div>
          <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-sidhe-gold/50"></div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-sidhe-gold/50"></div>
        </button>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-sidhe-moon/70">
          <div className="relative p-6 bg-sidhe-navy/60 backdrop-blur-sm border-2 border-sidhe-teal/40 hover:border-sidhe-sage/60 transition-all">
            <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-sidhe-gold/30"></div>
            <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-sidhe-gold/30"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-sidhe-gold/30"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-sidhe-gold/30"></div>
            <RunicSymbol variant="fehu" className="w-10 h-12 mb-3 text-sidhe-gold/70 mx-auto" />
            <h3 className="text-sidhe-cream font-semibold mb-2" style={{ fontFamily: 'Georgia, serif' }}>Choose Your Spread</h3>
            <p className="text-sm" style={{ fontFamily: 'Georgia, serif' }}>Select from ancient spreading patterns</p>
          </div>

          <div className="relative p-6 bg-sidhe-navy/60 backdrop-blur-sm border-2 border-sidhe-teal/40 hover:border-sidhe-sage/60 transition-all">
            <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-sidhe-gold/30"></div>
            <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-sidhe-gold/30"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-sidhe-gold/30"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-sidhe-gold/30"></div>
            <RunicSymbol variant="ansuz" className="w-10 h-12 mb-3 text-sidhe-gold/70 mx-auto" />
            <h3 className="text-sidhe-cream font-semibold mb-2" style={{ fontFamily: 'Georgia, serif' }}>Draw Your Cards</h3>
            <p className="text-sm" style={{ fontFamily: 'Georgia, serif' }}>Channel primordial energies</p>
          </div>

          <div className="relative p-6 bg-sidhe-navy/60 backdrop-blur-sm border-2 border-sidhe-teal/40 hover:border-sidhe-sage/60 transition-all">
            <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-sidhe-gold/30"></div>
            <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-sidhe-gold/30"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-sidhe-gold/30"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-sidhe-gold/30"></div>
            <RunicSymbol variant="kenaz" className="w-10 h-12 mb-3 text-sidhe-gold/70 mx-auto" />
            <h3 className="text-sidhe-cream font-semibold mb-2" style={{ fontFamily: 'Georgia, serif' }}>Receive Wisdom</h3>
            <p className="text-sm" style={{ fontFamily: 'Georgia, serif' }}>AI-guided interpretations</p>
          </div>
        </div>

        <div className="mt-12">
          <Link
            to="/admin/login"
            className="text-sidhe-gold/60 hover:text-sidhe-bright-gold text-sm transition-colors duration-200"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
}
