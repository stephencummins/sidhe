import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, X, ChevronLeft, ChevronRight, Lock, Globe, Calendar, StickyNote } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getSavedReading } from '../services/savedReadings';
import type { SavedReading } from '../types';
import TarotCardVisual from './TarotCardVisual';
import RunicSymbol from './RunicSymbol';

export default function ViewSavedReading() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [reading, setReading] = useState<SavedReading | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!id) {
      setError('No reading ID provided');
      setLoading(false);
      return;
    }

    loadReading(id);
  }, [id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedCardIndex === null || !reading) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        navigateToPreviousCard();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        navigateToNextCard();
      } else if (e.key === 'Escape') {
        setSelectedCardIndex(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCardIndex, reading]);

  const loadReading = async (readingId: string) => {
    setLoading(true);
    setError('');

    try {
      const { data, error: fetchError } = await getSavedReading(readingId);

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      if (!data) {
        setError('Reading not found');
        return;
      }

      setReading(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reading');
    } finally {
      setLoading(false);
    }
  };

  const navigateToPreviousCard = () => {
    if (selectedCardIndex === null || !reading) return;
    setSelectedCardIndex((prev) =>
      prev === 0 ? reading.cards.length - 1 : prev! - 1
    );
  };

  const navigateToNextCard = () => {
    if (selectedCardIndex === null || !reading) return;
    setSelectedCardIndex((prev) =>
      prev === reading.cards.length - 1 ? 0 : prev! + 1
    );
  };

  const getSpreadName = (spreadType: string) => {
    switch (spreadType) {
      case 'single':
        return 'Single Card Reading';
      case 'three-card':
        return 'Three Card Spread';
      case 'celtic-cross':
        return 'Celtic Cross';
      default:
        return spreadType;
    }
  };

  const getLayoutClass = () => {
    if (!reading) return '';
    switch (reading.spread_type) {
      case 'single':
        return 'grid place-items-center';
      case 'three-card':
        return 'grid grid-cols-3 gap-6';
      case 'celtic-cross':
        return 'grid grid-cols-4 gap-4';
      default:
        return 'grid grid-cols-3 gap-6';
    }
  };

  const getCelticCrossPosition = (index: number) => {
    const positions = [
      'col-start-2 row-start-2',
      'col-start-2 row-start-2 rotate-90',
      'col-start-2 row-start-1',
      'col-start-2 row-start-3',
      'col-start-1 row-start-2',
      'col-start-3 row-start-2',
      'col-start-4 row-start-4',
      'col-start-4 row-start-3',
      'col-start-4 row-start-2',
      'col-start-4 row-start-1',
    ];
    return positions[index] || '';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-900 via-amber-950 to-stone-950 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-amber-500 animate-spin mx-auto mb-4" />
          <p className="text-amber-200" style={{ fontFamily: 'Georgia, serif' }}>
            Loading reading...
          </p>
        </div>
      </div>
    );
  }

  if (error || !reading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-900 via-amber-950 to-stone-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-stone-900/70 backdrop-blur-sm border-2 border-amber-900/50 p-8">
            <h2 className="text-2xl font-bold text-amber-100 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
              Reading Not Found
            </h2>
            <p className="text-amber-200/70 mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              {error || 'This reading could not be found or you do not have permission to view it.'}
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-3 bg-gradient-to-r from-amber-700 via-orange-800 to-amber-700 text-amber-50 border-2 border-amber-600/50 hover:border-amber-500 transition-all duration-200 font-semibold"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-900 via-amber-950 to-stone-950 p-4 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <RunicSymbol variant="kenaz" className="w-12 h-16 text-amber-600/70" />
          </div>
          <h2 className="text-4xl font-bold text-amber-100 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            {reading.title || getSpreadName(reading.spread_type)}
          </h2>
          <p className="text-amber-200/80 text-lg" style={{ fontFamily: 'Georgia, serif' }}>
            {getSpreadName(reading.spread_type)}
          </p>
          {reading.question && (
            <p className="text-amber-400 mt-2 italic" style={{ fontFamily: 'Georgia, serif' }}>
              ~{reading.question}~
            </p>
          )}

          {/* Metadata */}
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-amber-300/70">
              <Calendar className="w-4 h-4" />
              <span style={{ fontFamily: 'Georgia, serif' }}>{formatDate(reading.created_at)}</span>
            </div>
            <div className="flex items-center gap-2 text-amber-300/70">
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
            {reading.reading_source && (
              <div className="text-amber-300/70" style={{ fontFamily: 'Georgia, serif' }}>
                {reading.reading_source === 'daily' ? '🌅 Daily Reading' : '🔮 Personal Reading'}
              </div>
            )}
          </div>
        </div>

        {/* Cards Display */}
        <div className={`mb-12 ${getLayoutClass()} max-w-5xl mx-auto`}>
          {reading.cards.map((sc, index) => (
            <div
              key={index}
              className={`${reading.spread_type === 'celtic-cross' ? getCelticCrossPosition(index) : ''} flex flex-col items-center`}
            >
              <div
                className="mb-4 cursor-pointer transition-transform hover:scale-105"
                onClick={() => setSelectedCardIndex(index)}
              >
                <TarotCardVisual card={sc.card} revealed={true} size="medium" isReversed={sc.isReversed} />
              </div>
              <div className="text-center">
                <p className="text-amber-500 font-semibold text-sm mb-1" style={{ fontFamily: 'Georgia, serif' }}>
                  {sc.position}
                </p>
                <p className="text-amber-100 font-medium" style={{ fontFamily: 'Georgia, serif' }}>
                  {sc.card.name}
                </p>
                {sc.isReversed && (
                  <p className="text-teal-400 text-xs font-semibold mt-1 italic" style={{ fontFamily: 'Georgia, serif' }}>
                    ⟲ Inverted
                  </p>
                )}
                <p className="text-amber-400/70 text-xs mt-1" style={{ fontFamily: 'Georgia, serif' }}>
                  {sc.card.keywords.slice(0, 2).join(', ')}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Interpretation */}
        {reading.interpretation && (
          <div className="relative max-w-4xl mx-auto bg-stone-900/70 backdrop-blur-sm border-2 border-amber-900/50 p-8 mb-8">
            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-amber-700/40"></div>
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-amber-700/40"></div>
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-amber-700/40"></div>
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-amber-700/40"></div>

            <div className="flex items-center gap-3 mb-6">
              <RunicSymbol variant="ansuz" className="w-8 h-10 text-amber-600" />
              <h3 className="text-2xl font-bold text-amber-100" style={{ fontFamily: 'Georgia, serif' }}>
                The Interpretation
              </h3>
            </div>

            <div className="prose prose-invert max-w-none markdown-interpretation">
              <ReactMarkdown
                components={{
                  h1: ({...props}) => <h1 className="text-amber-100 font-bold text-3xl mb-4 mt-6" style={{ fontFamily: 'Georgia, serif' }} {...props} />,
                  h2: ({...props}) => <h2 className="text-amber-200 font-bold text-2xl mb-3 mt-5" style={{ fontFamily: 'Georgia, serif' }} {...props} />,
                  h3: ({...props}) => <h3 className="text-amber-300 font-semibold text-xl mb-2 mt-4" style={{ fontFamily: 'Georgia, serif' }} {...props} />,
                  p: ({...props}) => <p className="text-amber-200/90 mb-4 leading-relaxed" style={{ fontFamily: 'Georgia, serif' }} {...props} />,
                  ul: ({...props}) => <ul className="text-amber-200/90 mb-4 ml-6 list-disc" style={{ fontFamily: 'Georgia, serif' }} {...props} />,
                  ol: ({...props}) => <ol className="text-amber-200/90 mb-4 ml-6 list-decimal" style={{ fontFamily: 'Georgia, serif' }} {...props} />,
                  li: ({...props}) => <li className="mb-2" {...props} />,
                  strong: ({...props}) => <strong className="text-amber-100 font-bold" {...props} />,
                  em: ({...props}) => <em className="text-amber-300 italic" {...props} />,
                }}
              >
                {reading.interpretation}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {/* Personal Notes */}
        {reading.notes && (
          <div className="relative max-w-4xl mx-auto bg-stone-900/70 backdrop-blur-sm border-2 border-amber-900/50 p-8 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <StickyNote className="w-6 h-6 text-amber-600" />
              <h3 className="text-xl font-bold text-amber-100" style={{ fontFamily: 'Georgia, serif' }}>
                Personal Notes
              </h3>
            </div>
            <p className="text-amber-200/90 leading-relaxed whitespace-pre-wrap" style={{ fontFamily: 'Georgia, serif' }}>
              {reading.notes}
            </p>
          </div>
        )}

        {/* Back Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/saved-readings')}
            className="px-8 py-3 bg-stone-800 text-amber-200 border-2 border-amber-900/50 hover:border-amber-700 hover:bg-stone-700 transition-all duration-200"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Back to Saved Readings
          </button>
        </div>
      </div>

      {/* Card Detail Modal */}
      {selectedCardIndex !== null && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4"
          onClick={() => setSelectedCardIndex(null)}
        >
          {/* Navigation Buttons */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateToPreviousCard();
            }}
            className="absolute left-2 sm:left-4 lg:left-8 top-1/2 -translate-y-1/2 z-50 text-amber-400 hover:text-amber-200 transition-all bg-stone-900/80 hover:bg-stone-900/95 rounded-full p-2 sm:p-3 hover:scale-110 shadow-lg border-2 border-amber-700/40 hover:border-amber-500"
            aria-label="Previous card"
          >
            <ChevronLeft className="w-8 h-8 sm:w-10 sm:h-10" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateToNextCard();
            }}
            className="absolute right-2 sm:right-4 lg:right-8 top-1/2 -translate-y-1/2 z-50 text-amber-400 hover:text-amber-200 transition-all bg-stone-900/80 hover:bg-stone-900/95 rounded-full p-2 sm:p-3 hover:scale-110 shadow-lg border-2 border-amber-700/40 hover:border-amber-500"
            aria-label="Next card"
          >
            <ChevronRight className="w-8 h-8 sm:w-10 sm:h-10" />
          </button>

          <div
            className="relative bg-gradient-to-br from-stone-900 via-amber-950 to-stone-950 border-2 sm:border-4 border-amber-700/60 shadow-2xl shadow-amber-900/40 p-4 sm:p-8 lg:p-12 max-w-6xl w-full max-h-[95vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedCardIndex(null)}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 text-amber-400 hover:text-amber-200 transition-colors bg-stone-900/80 rounded-full p-1.5 sm:p-2"
            >
              <X className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>

            <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10 bg-stone-900/80 px-3 py-1.5 sm:px-4 sm:py-2 border border-amber-700/40 rounded">
              <p className="text-amber-400 text-xs sm:text-sm font-semibold" style={{ fontFamily: 'Georgia, serif' }}>
                {selectedCardIndex + 1} / {reading.cards.length}
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-12 items-center lg:items-start mt-8 sm:mt-0">
              <div className="flex-shrink-0 flex items-center justify-center">
                <TarotCardVisual
                  card={reading.cards[selectedCardIndex].card}
                  revealed={true}
                  size="xlarge"
                  isReversed={reading.cards[selectedCardIndex].isReversed}
                />
              </div>

              <div className="flex-1 w-full max-w-2xl">
                <div className="mb-6 sm:mb-8">
                  <p className="text-amber-500 font-semibold text-sm sm:text-base mb-2 sm:mb-3 uppercase tracking-wide" style={{ fontFamily: 'Georgia, serif' }}>
                    {reading.cards[selectedCardIndex].position}
                  </p>
                  <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-amber-100 mb-4 sm:mb-6" style={{ fontFamily: 'Georgia, serif' }}>
                    {reading.cards[selectedCardIndex].card.name}
                  </h3>
                  <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
                    {reading.cards[selectedCardIndex].card.keywords.map((keyword, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 sm:px-4 sm:py-2 bg-amber-900/50 border border-amber-700/50 sm:border-2 text-amber-200 text-sm sm:text-base font-medium"
                        style={{ fontFamily: 'Georgia, serif' }}
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-stone-900/50 border-2 border-amber-800/40 p-4 sm:p-6">
                  <h4 className="text-amber-300 font-bold text-lg sm:text-xl mb-3 sm:mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                    {reading.cards[selectedCardIndex].isReversed ? 'Inverted Meaning' : 'Upright Meaning'}
                  </h4>
                  <p className="text-amber-200/95 text-base sm:text-lg leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                    {reading.cards[selectedCardIndex].isReversed
                      ? reading.cards[selectedCardIndex].card.reversed_meaning
                      : reading.cards[selectedCardIndex].card.upright_meaning}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
