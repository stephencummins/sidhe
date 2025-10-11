import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
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
    <div className="calan-branded min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 opacity-15">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="calan-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
              <path d="M60 20 Q75 35 60 50 Q45 35 60 20" stroke="#d4af37" strokeWidth="1.5" fill="none" opacity="0.4" />
              <path d="M20 60 Q35 45 50 60 Q35 75 20 60" stroke="#cd7f32" strokeWidth="1.5" fill="none" opacity="0.4" />
              <circle cx="60" cy="60" r="15" stroke="#d4af37" strokeWidth="1" fill="none" opacity="0.3" />
              <path d="M100 60 Q85 75 70 60 Q85 45 100 60" stroke="#cd7f32" strokeWidth="1.5" fill="none" opacity="0.4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#calan-pattern)" />
        </svg>
      </div>

      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent" />

      <div className="max-w-4xl mx-auto px-4 py-16 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-block mb-8">
            <img
              src="/Copilot_20251009_124652.png"
              alt="SIDHE"
              className="w-56 h-56 object-contain drop-shadow-2xl filter brightness-110 contrast-110"
            />
          </div>

          <div className="mb-6">
            <h1 className="text-7xl font-bold mb-2 text-shadow-lg" style={{
              fontFamily: 'Cinzel, serif',
              color: 'var(--calan-accent-gold)',
              textShadow: '0 0 20px rgba(212, 175, 55, 0.4), 0 2px 10px rgba(212, 175, 55, 0.3)'
            }}>
              CALAN
            </h1>
            <div className="w-48 h-1 mx-auto bg-gradient-to-r from-transparent via-[var(--calan-accent-gold)] to-transparent" />
          </div>

          <p className="text-2xl mb-4 leading-relaxed italic" style={{ color: 'var(--calan-cream)' }}>
            Celtic Seasonal Tarot
          </p>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--calan-cream)', opacity: 0.9 }}>
            Where ancient Celtic wisdom meets the turning of the seasons
          </p>
        </div>

        <div className="flex justify-center mb-16">
          <button
            onClick={handleStartReading}
            className="calan-btn calan-btn-primary group relative px-16 py-5 text-xl font-bold transition-all duration-500 transform hover:scale-105 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
            <span className="relative z-10 tracking-wide" style={{ fontFamily: 'Cinzel, serif' }}>Begin Your Journey</span>

            <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4" style={{ borderColor: 'var(--calan-accent-gold)' }} />
            <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4" style={{ borderColor: 'var(--calan-accent-gold)' }} />
            <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4" style={{ borderColor: 'var(--calan-accent-gold)' }} />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4" style={{ borderColor: 'var(--calan-accent-gold)' }} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <CelticBorder className="transform hover:scale-105 transition-transform duration-300">
            <div className="p-8 text-center">
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-600 to-orange-700 flex items-center justify-center shadow-lg">
                  <span className="text-3xl text-amber-50">I</span>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 calan-text-gold" style={{ fontFamily: 'Cinzel, serif' }}>Choose Your Spread</h3>
              <p className="calan-text-cream leading-relaxed">Select from sacred spreading patterns passed down through ages</p>
            </div>
          </CelticBorder>

          <CelticBorder className="transform hover:scale-105 transition-transform duration-300">
            <div className="p-8 text-center">
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-600 to-red-700 flex items-center justify-center shadow-lg">
                  <span className="text-3xl text-amber-50">II</span>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 calan-text-gold" style={{ fontFamily: 'Cinzel, serif' }}>Draw Your Cards</h3>
              <p className="calan-text-cream leading-relaxed">Channel the ancient energies through mystical cards</p>
            </div>
          </CelticBorder>

          <CelticBorder className="transform hover:scale-105 transition-transform duration-300">
            <div className="p-8 text-center">
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-600 to-amber-700 flex items-center justify-center shadow-lg">
                  <span className="text-3xl text-amber-50">III</span>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 calan-text-gold" style={{ fontFamily: 'Cinzel, serif' }}>Receive Wisdom</h3>
              <p className="calan-text-cream leading-relaxed">Discover insights illuminated by divine guidance</p>
            </div>
          </CelticBorder>
        </div>

        <div className="max-w-3xl mx-auto">
          <CelticBorder>
            <div className="p-8">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="grid grid-cols-2 gap-4 flex-shrink-0">
                  <img src="/The_Star copy.gif" alt="The Star" className="w-24 h-36 object-cover rounded shadow-lg border-2 border-amber-700" />
                  <img src="/The_Moon copy.gif" alt="The Moon" className="w-24 h-36 object-cover rounded shadow-lg border-2 border-amber-700" />
                  <img src="/The_Sun copy.gif" alt="The Sun" className="w-24 h-36 object-cover rounded shadow-lg border-2 border-amber-700" />
                  <img src="/The_World copy.gif" alt="The World" className="w-24 h-36 object-cover rounded shadow-lg border-2 border-amber-700" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold calan-text-gold mb-3" style={{ fontFamily: 'Cinzel, serif' }}>
                    Illuminated by Celtic Art
                  </h3>
                  <p className="calan-text-cream leading-relaxed mb-4">
                    Each card is a masterwork inspired by the intricate beauty of Celtic tradition,
                    blending ancient artistry with the turning of the seasons.
                  </p>
                  <p className="calan-text-bronze italic text-sm">
                    "In every season, a story. In every turn, wisdom eternal."
                  </p>
                </div>
              </div>
            </div>
          </CelticBorder>
        </div>

        <div className="mt-16 flex flex-col items-center gap-6">
          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-white text-slate-800 rounded-lg hover:bg-amber-50 transition-all duration-300 font-semibold shadow-xl hover:shadow-2xl border-2 border-amber-200 hover:border-amber-400"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
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
            className="text-amber-800 hover:text-orange-700 font-medium transition-colors duration-200 underline decoration-amber-600/30 hover:decoration-orange-600"
          >
            Admin Portal
          </Link>
        </div>

        <div className="mt-16 text-center">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[var(--calan-accent-gold)] to-transparent opacity-50 mb-8" />
          <p className="calan-text-cream opacity-60 text-sm italic">
            "The threads of fate are woven through the seasons of the soul"
          </p>
        </div>
      </div>
    </div>
  );
}
