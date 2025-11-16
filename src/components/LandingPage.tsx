import { useNavigate } from 'react-router-dom';
import CelticBorder from './CelticBorder';
import { useAuth } from '../contexts/AuthContext';
import DailyReadingSubscription from './DailyReadingSubscription';
import TestimonialSection from './TestimonialSection';

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
        <div className="mb-12">
          <CelticBorder>
            <div className="p-8 flex flex-col md:flex-row items-center justify-center gap-8">
              <div className="flex-shrink-0">
                <img
                  src="/SIDHE_LOGO.png"
                  alt="SIDHE Celtic Tarot"
                  className="w-48 md:w-56 h-auto object-contain drop-shadow-2xl filter brightness-110 contrast-110"
                />
              </div>

              <div className="text-center md:text-left">
                <h1 className="text-6xl md:text-7xl font-bold mb-2 text-shadow-lg" style={{
                  fontFamily: 'Cinzel, serif',
                  color: '#d4af37',
                  textShadow: '0 0 20px rgba(212, 175, 55, 0.6), 0 2px 10px rgba(212, 175, 55, 0.3)'
                }}>
                  SÍDHE
                </h1>
                <div className="w-48 h-1 mx-auto md:mx-0 mb-4 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />

                <p className="text-2xl mb-2 leading-relaxed italic" style={{
                  color: '#f5e6d3',
                  textShadow: '0 1px 3px rgba(0,0,0,0.8)'
                }}>
                  Celtic Seasonal Tarot
                </p>
                <p className="text-base" style={{
                  color: '#f5e6d3',
                  textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                }}>
                  Where ancient Celtic wisdom meets the turning of the seasons
                </p>
              </div>
            </div>
          </CelticBorder>
        </div>

        {/* Primary CTA - Get Your Reading */}
        <div className="flex flex-col items-center gap-4 mb-16">
          <button
            onClick={handleStartReading}
            className="calan-btn calan-btn-primary group relative px-20 py-6 text-2xl font-bold transition-all duration-500 transform hover:scale-105 overflow-hidden bg-gradient-to-br from-amber-200 via-amber-300 to-amber-400 border-2 border-amber-500 shadow-xl hover:shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
            <span className="relative z-10 tracking-wide text-amber-900 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]" style={{ fontFamily: 'Cinzel, serif' }}>Get Your Free Reading</span>

            <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-amber-600" />
            <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-amber-600" />
            <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-amber-600" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-amber-600" />
          </button>

          {/* Secondary CTA - Daily Reading */}
          <button
            onClick={() => navigate('/daily')}
            className="group relative px-8 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 bg-purple-900/30 border border-purple-500/50 hover:bg-purple-800/40 hover:border-purple-400/70 shadow-lg hover:shadow-xl rounded"
          >
            <span className="relative z-10 tracking-wide text-purple-200" style={{ fontFamily: 'Cinzel, serif' }}>
              ✨ Or Try Today's Daily Reading
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-14 mb-16">
          <button onClick={handleStartReading} className="h-full text-left transform hover:scale-105 transition-transform duration-300 cursor-pointer">
            <CelticBorder className="h-full">
              <div className="p-10 text-center h-full flex flex-col justify-center">
                <div className="mb-4 flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg border-2 border-amber-300">
                    <span className="text-3xl font-bold text-amber-950">I</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3" style={{
                  fontFamily: 'Cinzel, serif',
                  color: '#d4af37',
                  textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                }}>
                  Choose Your Spread
                </h3>
                <p className="leading-relaxed" style={{
                  color: '#f5e6d3',
                  textShadow: '0 1px 2px rgba(0,0,0,0.7)'
                }}>
                  Select from sacred spreading patterns passed down through ages
                </p>
              </div>
            </CelticBorder>
          </button>

          <button onClick={handleStartReading} className="h-full text-left transform hover:scale-105 transition-transform duration-300 cursor-pointer">
            <CelticBorder className="h-full">
              <div className="p-10 text-center h-full flex flex-col justify-center">
                <div className="mb-4 flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg border-2 border-amber-300">
                    <span className="text-3xl font-bold text-amber-50">II</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3" style={{
                  fontFamily: 'Cinzel, serif',
                  color: '#d4af37',
                  textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                }}>
                  Draw Your Cards
                </h3>
                <p className="leading-relaxed" style={{
                  color: '#f5e6d3',
                  textShadow: '0 1px 2px rgba(0,0,0,0.7)'
                }}>
                  Channel the ancient energies through mystical cards
                </p>
              </div>
            </CelticBorder>
          </button>

          <button onClick={handleStartReading} className="h-full text-left transform hover:scale-105 transition-transform duration-300 cursor-pointer">
            <CelticBorder className="h-full">
              <div className="p-10 text-center h-full flex flex-col justify-center">
                <div className="mb-4 flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-amber-600 flex items-center justify-center shadow-lg border-2 border-amber-300">
                    <span className="text-3xl font-bold text-amber-50">III</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3" style={{
                  fontFamily: 'Cinzel, serif',
                  color: '#d4af37',
                  textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                }}>
                  Receive Wisdom
                </h3>
                <p className="leading-relaxed" style={{
                  color: '#f5e6d3',
                  textShadow: '0 1px 2px rgba(0,0,0,0.7)'
                }}>
                  Discover insights illuminated by divine guidance
                </p>
              </div>
            </CelticBorder>
          </button>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <TestimonialSection />
        </div>

        {/* Experience the Magic Section */}
        <div className="max-w-6xl mx-auto">
          <CelticBorder>
            <div className="px-6 py-8">
              <h3 className="text-3xl md:text-4xl font-bold mb-8 text-center" style={{
                fontFamily: 'Cinzel, serif',
                color: '#d4af37',
                textShadow: '0 0 20px rgba(212, 175, 55, 0.6)'
              }}>
                Experience the Magic
              </h3>
              <div className="w-48 h-1 mx-auto mb-12 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />

              {/* Video Demo Placeholder - You can add your video here */}
              <div className="mb-12">
                <div className="relative rounded-lg overflow-hidden shadow-2xl border-4 border-amber-600/40 bg-stone-900/50 aspect-video flex items-center justify-center">
                  <p className="text-xl italic" style={{ color: '#d4af37', fontFamily: 'Cinzel, serif' }}>
                    Video Demo Coming Soon
                  </p>
                </div>
                <p className="mt-6 text-center leading-relaxed max-w-3xl mx-auto" style={{
                  color: '#f5e6d3',
                  textShadow: '0 1px 2px rgba(0,0,0,0.7)'
                }}>
                  Each card is a masterwork inspired by the intricate beauty of Celtic tradition,
                  blending ancient artistry with the turning of the seasons.
                </p>
              </div>

              {/* Subscription Section */}
              <div className="max-w-2xl mx-auto">
                <DailyReadingSubscription />
              </div>
            </div>
          </CelticBorder>
        </div>

        <div className="mt-16 flex flex-col items-center gap-6">
          <button
            onClick={handleGoogleLogin}
            className="px-4 py-2 text-xs border border-amber-700/30 bg-teal-900/30 hover:bg-teal-900/50 hover:border-amber-600/50 transition-all duration-300"
            style={{
              fontFamily: 'Cinzel, serif',
              color: '#f5e6d3',
              opacity: 0.7
            }}
          >
            Administrator Sign in
          </button>
        </div>

        <div className="mt-16 text-center">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-50 mb-8" />
          <p className="text-sm italic" style={{
            color: '#f5e6d3',
            opacity: 0.7,
            textShadow: '0 1px 2px rgba(0,0,0,0.8)'
          }}>
            "The threads of fate are woven through the seasons of the soul"
          </p>
        </div>
      </div>
    </div>
  );
}