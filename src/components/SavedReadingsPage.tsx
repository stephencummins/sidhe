import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Trash2, Lock, Globe, Calendar, BookOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getUserSavedReadings, deleteSavedReading } from '../services/savedReadings';
import type { SavedReading } from '../types';
import RunicSymbol from './RunicSymbol';
import CelticBorder from './CelticBorder';

export default function SavedReadingsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [readings, setReadings] = useState<SavedReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/admin/login');
      return;
    }

    loadReadings();
  }, [user, navigate]);

  const loadReadings = async () => {
    setLoading(true);
    setError('');

    try {
      const { data, error: fetchError } = await getUserSavedReadings();

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      setReadings(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load readings');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this reading?')) {
      return;
    }

    setDeletingId(id);

    try {
      const { error: deleteError } = await deleteSavedReading(id);

      if (deleteError) {
        alert(`Failed to delete: ${deleteError.message}`);
        return;
      }

      // Remove from local state
      setReadings(readings.filter(r => r.id !== id));
    } catch (err) {
      alert('Failed to delete reading');
    } finally {
      setDeletingId(null);
    }
  };

  const handleViewReading = (id: string) => {
    navigate(`/saved/${id}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getSpreadName = (spreadType: string) => {
    switch (spreadType) {
      case 'single':
        return 'Single Card';
      case 'three-card':
        return 'Three Card Spread';
      case 'celtic-cross':
        return 'Celtic Cross';
      default:
        return spreadType;
    }
  };

  if (loading) {
    return (
      <div className="calan-branded min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-amber-400 mx-auto mb-4"></div>
          <p style={{ color: '#f5e6d3', fontFamily: 'Cinzel, serif', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
            Loading your saved readings...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="calan-branded min-h-screen relative overflow-hidden">
      {/* Background Pattern */}
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

      <div className="max-w-6xl mx-auto px-4 py-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <CelticBorder>
            <div className="p-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{
                fontFamily: 'Cinzel, serif',
                color: '#d4af37',
                textShadow: '0 0 20px rgba(212, 175, 55, 0.6), 0 2px 10px rgba(212, 175, 55, 0.3)'
              }}>
                Your Saved Readings
              </h1>
              <div className="w-48 h-1 mx-auto mb-4 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
              <p className="text-xl" style={{
                color: '#f5e6d3',
                textShadow: '0 1px 3px rgba(0,0,0,0.8)'
              }}>
                Revisit the wisdom of the cards
              </p>
            </div>
          </CelticBorder>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-8 bg-red-900/30 border border-red-700/50 p-4 text-red-200">
            {error}
          </div>
        )}

        {readings.length === 0 ? (
          <div className="max-w-2xl mx-auto text-center">
            <CelticBorder>
              <div className="p-12">
                <BookOpen className="w-16 h-16 mx-auto mb-4" style={{ color: '#d4af37', opacity: 0.7 }} />
                <h2 className="text-2xl font-bold mb-4" style={{
                  fontFamily: 'Cinzel, serif',
                  color: '#d4af37',
                  textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                }}>
                  No Saved Readings Yet
                </h2>
                <p className="mb-6" style={{
                  color: '#f5e6d3',
                  textShadow: '0 1px 2px rgba(0,0,0,0.7)'
                }}>
                  Start your journey by getting a reading and saving it for future reflection.
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="group relative px-10 py-4 text-lg font-bold transition-all duration-500 transform hover:scale-105 overflow-hidden bg-gradient-to-br from-amber-200 via-amber-300 to-amber-400 border-2 border-amber-500 shadow-xl hover:shadow-2xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                  <span className="relative z-10 tracking-wide text-amber-900 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]" style={{ fontFamily: 'Cinzel, serif' }}>
                    Get a Reading
                  </span>
                </button>
              </div>
            </CelticBorder>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
            {readings.map((reading) => (
              <div
                key={reading.id}
                className="cursor-pointer group"
                onClick={() => handleViewReading(reading.id)}
              >
                <CelticBorder className="h-full">
                  <div className="p-6 h-full flex flex-col">
                    {/* Privacy Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-sm" style={{ color: '#cd7f32' }}>
                        {reading.is_public ? (
                          <>
                            <Globe className="w-4 h-4" />
                            <span style={{ fontFamily: 'Cinzel, serif' }}>Public</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4" />
                            <span style={{ fontFamily: 'Cinzel, serif' }}>Private</span>
                          </>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(reading.id);
                        }}
                        disabled={deletingId === reading.id}
                        className="text-red-400/70 hover:text-red-300 transition-colors disabled:opacity-50"
                        aria-label="Delete reading"
                      >
                        {deletingId === reading.id ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Trash2 className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    {/* Title or Spread Type */}
                    <h3 className="text-xl font-bold mb-2 transition-colors" style={{
                      fontFamily: 'Cinzel, serif',
                      color: '#d4af37',
                      textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                    }}>
                      {reading.title || getSpreadName(reading.spread_type)}
                    </h3>

                    {/* Question if exists */}
                    {reading.question && (
                      <p className="italic text-sm mb-3" style={{
                        color: '#f5e6d3',
                        textShadow: '0 1px 2px rgba(0,0,0,0.7)'
                      }}>
                        "{reading.question}"
                      </p>
                    )}

                    {/* Metadata */}
                    <div className="space-y-2 mb-4 flex-1">
                      <div className="flex items-center gap-2 text-sm" style={{ color: '#cd7f32' }}>
                        <Calendar className="w-4 h-4" />
                        <span style={{ fontFamily: 'Cinzel, serif' }}>{formatDate(reading.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm" style={{ color: '#cd7f32' }}>
                        <RunicSymbol variant="kenaz" className="w-4 h-5" />
                        <span style={{ fontFamily: 'Cinzel, serif' }}>
                          {reading.cards.length} {reading.cards.length === 1 ? 'card' : 'cards'}
                        </span>
                      </div>
                      {reading.reading_source && (
                        <div className="text-xs" style={{ color: '#cd7f32', fontFamily: 'Cinzel, serif' }}>
                          Source: {reading.reading_source === 'daily' ? 'Daily Reading' : 'Personal Reading'}
                        </div>
                      )}
                    </div>

                    {/* Card Preview */}
                    <div className="flex gap-1 mb-3">
                      {reading.cards.slice(0, 3).map((card, idx) => (
                        <div key={idx} className="flex-1 h-2 bg-amber-700/30 border border-amber-600/40"></div>
                      ))}
                      {reading.cards.length > 3 && (
                        <div className="text-xs ml-1" style={{ color: '#cd7f32', fontFamily: 'Cinzel, serif' }}>
                          +{reading.cards.length - 3}
                        </div>
                      )}
                    </div>

                    {/* Notes Preview */}
                    {reading.notes && (
                      <p className="text-sm line-clamp-2 mb-4" style={{
                        color: '#f5e6d3',
                        opacity: 0.7,
                        textShadow: '0 1px 2px rgba(0,0,0,0.7)'
                      }}>
                        {reading.notes}
                      </p>
                    )}

                    <div className="mt-auto pt-4 border-t border-amber-900/30">
                      <span className="text-sm transition-colors" style={{
                        color: '#d4af37',
                        fontFamily: 'Cinzel, serif'
                      }}>
                        View Reading →
                      </span>
                    </div>
                  </div>
                </CelticBorder>
              </div>
            ))}
          </div>
        )}

        {/* Back Button */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigate('/')}
            className="group relative px-10 py-4 text-lg font-bold transition-all duration-500 transform hover:scale-105 overflow-hidden bg-gradient-to-br from-amber-200 via-amber-300 to-amber-400 border-2 border-amber-500 shadow-xl hover:shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
            <span className="relative z-10 tracking-wide text-amber-900 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]" style={{ fontFamily: 'Cinzel, serif' }}>
              Back to Home
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
