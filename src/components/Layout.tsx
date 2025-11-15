import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, User, BarChart3 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user } = useAuth();

  return (
    <div className="calan-branded min-h-screen flex flex-col">
      <header className="w-full border-b backdrop-blur-sm" style={{
        borderColor: 'rgba(212, 175, 55, 0.2)',
        background: 'rgba(26, 11, 46, 0.8)'
      }}>
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="transition-opacity hover:opacity-100">
              <img
                src="/The Fool.png"
                alt="The Fool - Return to Home"
                className="h-12 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
              />
            </Link>
            <h1 className="text-xl font-serif calan-text-gold">Sídhe Tarot</h1>
          </div>
          <nav className="flex items-center gap-3 sm:gap-6">
            <Link
              to="/daily"
              className="flex items-center gap-2 text-amber-300/80 hover:text-amber-200 transition-colors text-sm"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Daily Reading</span>
            </Link>
            {user && (
              <>
                <Link
                  to="/saved-readings"
                  className="flex items-center gap-2 text-amber-300/80 hover:text-amber-200 transition-colors text-sm"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  <BookOpen className="w-4 h-4" />
                  <span className="hidden sm:inline">My Readings</span>
                </Link>
                <Link
                  to="/analytics"
                  className="flex items-center gap-2 text-amber-300/80 hover:text-amber-200 transition-colors text-sm"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span className="hidden sm:inline">Analytics</span>
                </Link>
              </>
            )}
            <Link
              to={user ? "/admin" : "/admin/login"}
              className="flex items-center gap-2 text-amber-300/80 hover:text-amber-200 transition-colors text-sm"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">{user ? 'Admin' : 'Sign In'}</span>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="w-full border-t backdrop-blur-sm" style={{
        borderColor: 'rgba(212, 175, 55, 0.2)',
        background: 'rgba(26, 11, 46, 0.8)'
      }}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-4 md:gap-8">
            <Link to="/" className="transition-opacity hover:opacity-100 hidden sm:block">
              <img
                src="/The Fool.png"
                alt="The Fool - Return to Home"
                className="h-12 md:h-16 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
              />
            </Link>
            <div className="text-center">
              <p className="calan-text-cream text-xs sm:text-sm" style={{ opacity: 0.7 }}>
                Journey with the wisdom of the seasons
              </p>
            </div>
            <Link to="/" className="transition-opacity hover:opacity-100 hidden sm:block">
              <img
                src="/The Fool.png"
                alt="The Fool - Return to Home"
                className="h-12 md:h-16 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity cursor-pointer transform scale-x-[-1]"
              />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
