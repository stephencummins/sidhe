import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Trash2, Lock, Globe, Calendar, BookOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getUserSavedReadings, deleteSavedReading } from '../services/savedReadings';
import type { SavedReading } from '../types';
import RunicSymbol from './RunicSymbol';

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
      <div className="min-h-screen bg-gradient-to-br from-stone-900 via-amber-950 to-stone-950 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-amber-500 animate-spin mx-auto mb-4" />
          <p className="text-amber-200" style={{ fontFamily: 'Georgia, serif' }}>
            Loading your saved readings...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-900 via-amber-950 to-stone-950 p-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <RunicSymbol variant="ansuz" className="w-12 h-16 text-amber-600/70" />
          </div>
          <h1 className="text-4xl font-bold text-amber-100 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            Your Saved Readings
          </h1>
          <p className="text-amber-200/80 text-lg" style={{ fontFamily: 'Georgia, serif' }}>
            Revisit the wisdom of the cards
          </p>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-8 bg-red-900/30 border border-red-700/50 p-4 text-red-200">
            {error}
          </div>
        )}

        {readings.length === 0 ? (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-stone-900/70 backdrop-blur-sm border-2 border-amber-900/50 p-12">
              <BookOpen className="w-16 h-16 text-amber-600/50 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-amber-100 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                No Saved Readings Yet
              </h2>
              <p className="text-amber-200/70 mb-6" style={{ fontFamily: 'Georgia, serif' }}>
                Start your journey by getting a reading and saving it for future reflection.
              </p>
              <button
                onClick={() => navigate('/')}
                className="px-8 py-3 bg-gradient-to-r from-amber-700 via-orange-800 to-amber-700 text-amber-50 border-2 border-amber-600/50 hover:border-amber-500 transition-all duration-200 font-semibold"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Get a Reading
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {readings.map((reading) => (
              <div
                key={reading.id}
                className="bg-stone-900/70 backdrop-blur-sm border-2 border-amber-900/50 hover:border-amber-700/70 transition-all duration-200 p-6 cursor-pointer group"
                onClick={() => handleViewReading(reading.id)}
              >
                {/* Privacy Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-amber-400/70 text-sm">
                    {reading.is_public ? (
                      <>
                        <Globe className="w-4 h-4" />
                        <span style={{ fontFamily: 'Georgia, serif' }}>Public</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span style={{ fontFamily: 'Georgia, serif' }}>Private</span>
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
                <h3 className="text-xl font-bold text-amber-100 mb-2 group-hover:text-amber-50 transition-colors" style={{ fontFamily: 'Georgia, serif' }}>
                  {reading.title || getSpreadName(reading.spread_type)}
                </h3>

                {/* Question if exists */}
                {reading.question && (
                  <p className="text-amber-300/90 italic text-sm mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                    "{reading.question}"
                  </p>
                )}

                {/* Metadata */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-amber-200/60 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span style={{ fontFamily: 'Georgia, serif' }}>{formatDate(reading.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-amber-200/60 text-sm">
                    <RunicSymbol variant="kenaz" className="w-4 h-5" />
                    <span style={{ fontFamily: 'Georgia, serif' }}>
                      {reading.cards.length} {reading.cards.length === 1 ? 'card' : 'cards'}
                    </span>
                  </div>
                  {reading.reading_source && (
                    <div className="text-amber-200/60 text-xs" style={{ fontFamily: 'Georgia, serif' }}>
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
                    <div className="text-amber-400/50 text-xs ml-1" style={{ fontFamily: 'Georgia, serif' }}>
                      +{reading.cards.length - 3}
                    </div>
                  )}
                </div>

                {/* Notes Preview */}
                {reading.notes && (
                  <p className="text-amber-200/50 text-sm line-clamp-2" style={{ fontFamily: 'Georgia, serif' }}>
                    {reading.notes}
                  </p>
                )}

                <div className="mt-4 pt-4 border-t border-amber-900/30">
                  <span className="text-amber-400/70 text-sm group-hover:text-amber-300 transition-colors" style={{ fontFamily: 'Georgia, serif' }}>
                    View Reading →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back Button */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-stone-800 text-amber-200 border-2 border-amber-900/50 hover:border-amber-700 hover:bg-stone-700 transition-all duration-200"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
