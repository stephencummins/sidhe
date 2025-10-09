import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import RunicSymbol from './RunicSymbol';
import CelticBorder from './CelticBorder';
import { useAuth } from '../contexts/AuthContext';

export default function LandingPage() {
  const navigate = useNavigate();
  const { signInWithGoogle } = useAuth();

  const handleStartReading = () => {
    navigate('/reading');
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Login error:', error);
    }
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

        <div className="mt-12 flex flex-col items-center gap-4">
          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-3 px-6 py-3 bg-white text-slate-800 rounded-lg hover:bg-slate-100 transition-all duration-300 font-medium shadow-lg hover:shadow-sidhe-gold/30"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </button>
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
