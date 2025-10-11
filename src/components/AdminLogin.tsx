import { Lock } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import CelticBorder from './CelticBorder';

export default function AdminLogin() {
  const { signInWithGoogle, user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/admin', { replace: true });
    }
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="calan-branded min-h-screen flex items-center justify-center">
        <p style={{ 
          color: '#d4af37',
          textShadow: '0 1px 2px rgba(0,0,0,0.8)',
          fontFamily: 'Cinzel, serif',
          fontSize: '1.25rem'
        }}>
          Loading...
        </p>
      </div>
    );
  }

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="calan-branded min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Celtic Pattern Background */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="admin-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
              <path d="M60 20 Q75 35 60 50 Q45 35 60 20" stroke="#d4af37" strokeWidth="1.5" fill="none" opacity="0.4" />
              <circle cx="60" cy="60" r="15" stroke="#d4af37" strokeWidth="1" fill="none" opacity="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#admin-pattern)" />
        </svg>
      </div>

      <div className="w-full max-w-md relative z-10">
        <CelticBorder>
          <div className="p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 border-2"
                style={{
                  background: 'rgba(212, 175, 55, 0.2)',
                  borderColor: 'rgba(212, 175, 55, 0.6)'
                }}>
                <Lock className="w-8 h-8" style={{ color: '#d4af37' }} />
              </div>
              <h1 className="text-3xl font-bold" style={{ 
                fontFamily: 'Cinzel, serif',
                color: '#d4af37',
                textShadow: '0 1px 2px rgba(0,0,0,0.8)'
              }}>
                Admin Portal
              </h1>
              <p style={{
                color: '#f5e6d3',
                textShadow: '0 1px 2px rgba(0,0,0,0.7)'
              }}>
                Sign in to manage tarot decks
              </p>
            </div>

            <button
              onClick={handleLogin}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white text-slate-800 rounded-lg hover:bg-amber-50 transition-all duration-300 font-semibold shadow-xl hover:shadow-2xl border-2 border-amber-200 hover:border-amber-400"
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
          </div>
        </CelticBorder>
      </div>
    </div>
  );
}