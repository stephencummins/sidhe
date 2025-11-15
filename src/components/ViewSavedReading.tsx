import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, X, ChevronLeft, ChevronRight, Lock, Globe, Calendar, StickyNote } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getSavedReading, updateSavedReading } from '../services/savedReadings';
import type { SavedReading } from '../types';
import TarotCardVisual from './TarotCardVisual';
import RunicSymbol from './RunicSymbol';
import CelticBorder from './CelticBorder';
import { supabase } from '../lib/supabase';

export default function ViewSavedReading() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [reading, setReading] = useState<SavedReading | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const [interpretation, setInterpretation] = useState<string>('');
  const [generatingInterpretation, setGeneratingInterpretation] = useState(false);

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

      // Set interpretation if it exists, or generate one
      if (data.interpretation) {
        setInterpretation(data.interpretation);
      } else {
        // Generate interpretation
        generateInterpretation(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reading');
    } finally {
      setLoading(false);
    }
  };

  const generateInterpretation = async (readingData: SavedReading) => {
    setGeneratingInterpretation(true);

    try {
      const cards = readingData.cards.map(sc => ({
        name: sc.card.name,
        position: sc.position,
        isReversed: sc.isReversed
      }));

      const spreadName = getSpreadName(readingData.spread_type);

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-tarot-interpretation`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          cards,
          question: readingData.question,
          spreadName,
          meaningType: 'celtic'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate interpretation');
      }

      const data = await response.json();
      const generatedInterpretation = data.interpretation;

      setInterpretation(generatedInterpretation);

      // Save the interpretation to the database so it persists
      try {
        await updateSavedReading(readingData.id, {
          interpretation: generatedInterpretation
        });

        // Update the reading state with the saved interpretation
        setReading(prev => prev ? { ...prev, interpretation: generatedInterpretation } : null);
      } catch (saveErr) {
        console.error('Error saving interpretation:', saveErr);
        // Continue even if save fails - user still sees the interpretation
      }
    } catch (err) {
      console.error('Error generating interpretation:', err);
      setInterpretation('Unable to generate interpretation at this time.');
    } finally {
      setGeneratingInterpretation(false);
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
        return 'grid grid-cols-3 gap-24';
      case 'celtic-cross':
        return 'grid grid-cols-4 gap-20';
      default:
        return 'grid grid-cols-3 gap-24';
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
      <div className="calan-branded min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-amber-400 mx-auto mb-4"></div>
          <p style={{ color: '#f5e6d3', fontFamily: 'Cinzel, serif', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
            Loading reading...
          </p>
        </div>
      </div>
    );
  }

  if (error || !reading) {
    return (
      <div className="calan-branded min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <CelticBorder>
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-4" style={{
                fontFamily: 'Cinzel, serif',
                color: '#d4af37',
                textShadow: '0 1px 2px rgba(0,0,0,0.8)'
              }}>
                Reading Not Found
              </h2>
              <p className="mb-6" style={{
                color: '#f5e6d3',
                textShadow: '0 1px 2px rgba(0,0,0,0.7)'
              }}>
                {error || 'This reading could not be found or you do not have permission to view it.'}
              </p>
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
          </CelticBorder>
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

      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <CelticBorder>
            <div className="p-8">
              <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{
                fontFamily: 'Cinzel, serif',
                color: '#d4af37',
                textShadow: '0 0 20px rgba(212, 175, 55, 0.6), 0 2px 10px rgba(212, 175, 55, 0.3)'
              }}>
                {reading.title || getSpreadName(reading.spread_type)}
              </h2>
              <div className="w-48 h-1 mx-auto mb-4 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
              <p className="text-xl mb-2" style={{
                color: '#f5e6d3',
                textShadow: '0 1px 3px rgba(0,0,0,0.8)'
              }}>
                {getSpreadName(reading.spread_type)}
              </p>
              {reading.question && (
                <p className="mt-2 italic text-lg" style={{
                  color: '#cd7f32',
                  textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                }}>
                  ~{reading.question}~
                </p>
              )}

              {/* Metadata */}
              <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
                <div className="flex items-center gap-2" style={{ color: '#cd7f32' }}>
                  <Calendar className="w-4 h-4" />
                  <span style={{ fontFamily: 'Cinzel, serif' }}>{formatDate(reading.created_at)}</span>
                </div>
                <div className="flex items-center gap-2" style={{ color: '#cd7f32' }}>
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
                {reading.reading_source && (
                  <div style={{ color: '#cd7f32', fontFamily: 'Cinzel, serif' }}>
                    {reading.reading_source === 'daily' ? '🌅 Daily Reading' : '🔮 Personal Reading'}
                  </div>
                )}
              </div>
            </div>
          </CelticBorder>
        </div>

        {/* Cards Display */}
        <div className={`mb-12 ${getLayoutClass()} max-w-5xl mx-auto`}>
          {reading.cards.map((sc, index) => (
            <div
              key={index}
              className={`${reading.spread_type === 'celtic-cross' ? getCelticCrossPosition(index) : ''} flex flex-col items-center`}
            >
              <div
                className="group mb-4 cursor-pointer transition-all duration-300 hover:scale-105"
                onClick={() => setSelectedCardIndex(index)}
              >
                <CelticBorder>
                  <div className="p-4">
                    <TarotCardVisual card={sc.card} revealed={true} size="xlarge" isReversed={sc.isReversed} />
                  </div>
                </CelticBorder>
              </div>
              <div className="text-center">
                <p className="font-semibold text-sm mb-1" style={{ fontFamily: 'Cinzel, serif', color: '#d4af37' }}>
                  {sc.position}
                </p>
                <p className="font-medium" style={{ fontFamily: 'Cinzel, serif', color: '#f5e6d3' }}>
                  {sc.card.name}
                </p>
                {sc.isReversed && (
                  <p className="text-xs font-semibold mt-1 italic" style={{ fontFamily: 'Cinzel, serif', color: '#cd7f32' }}>
                    ⟲ Inverted
                  </p>
                )}
                <p className="text-xs mt-1" style={{ fontFamily: 'Cinzel, serif', color: '#cd7f32', opacity: 0.7 }}>
                  {sc.card.keywords.slice(0, 2).join(', ')}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Interpretation */}
        <div className="max-w-4xl mx-auto mb-8">
          <CelticBorder>
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <RunicSymbol variant="ansuz" className="w-8 h-10" style={{ color: '#d4af37' }} />
                <h3 className="text-2xl font-bold" style={{
                  fontFamily: 'Cinzel, serif',
                  color: '#d4af37',
                  textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                }}>
                  The Interpretation
                </h3>
              </div>

              {generatingInterpretation ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-12 h-12 animate-spin mb-4" style={{ color: '#d4af37' }} />
                  <p style={{ color: '#f5e6d3', fontFamily: 'Cinzel, serif', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
                    Channelling ancient wisdom...
                  </p>
                  <p className="text-sm mt-2" style={{ color: '#cd7f32', fontFamily: 'Cinzel, serif', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
                    The spirits commune...
                  </p>
                </div>
              ) : (
                <div className="prose prose-invert max-w-none">
                  <ReactMarkdown
                    components={{
                      h1: ({...props}) => <h1 className="font-bold text-3xl mb-4 mt-6" style={{ fontFamily: 'Cinzel, serif', color: '#d4af37' }} {...props} />,
                      h2: ({...props}) => <h2 className="font-bold text-2xl mb-3 mt-5" style={{ fontFamily: 'Cinzel, serif', color: '#d4af37' }} {...props} />,
                      h3: ({...props}) => <h3 className="font-semibold text-xl mb-2 mt-4" style={{ fontFamily: 'Cinzel, serif', color: '#d4af37' }} {...props} />,
                      p: ({...props}) => <p className="mb-4 leading-relaxed" style={{ fontFamily: 'Cinzel, serif', color: '#f5e6d3' }} {...props} />,
                      ul: ({...props}) => <ul className="mb-4 ml-6 list-disc" style={{ fontFamily: 'Cinzel, serif', color: '#f5e6d3' }} {...props} />,
                      ol: ({...props}) => <ol className="mb-4 ml-6 list-decimal" style={{ fontFamily: 'Cinzel, serif', color: '#f5e6d3' }} {...props} />,
                      li: ({...props}) => <li className="mb-2" {...props} />,
                      strong: ({...props}) => <strong className="font-bold" style={{ color: '#d4af37' }} {...props} />,
                      em: ({...props}) => <em className="italic" style={{ color: '#cd7f32' }} {...props} />,
                    }}
                  >
                    {interpretation}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </CelticBorder>
        </div>

        {/* Personal Notes */}
        {reading.notes && (
          <div className="max-w-4xl mx-auto mb-8">
            <CelticBorder>
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <StickyNote className="w-6 h-6" style={{ color: '#d4af37' }} />
                  <h3 className="text-xl font-bold" style={{
                    fontFamily: 'Cinzel, serif',
                    color: '#d4af37',
                    textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                  }}>
                    Personal Notes
                  </h3>
                </div>
                <p className="leading-relaxed whitespace-pre-wrap" style={{
                  fontFamily: 'Cinzel, serif',
                  color: '#f5e6d3',
                  textShadow: '0 1px 2px rgba(0,0,0,0.7)'
                }}>
                  {reading.notes}
                </p>
              </div>
            </CelticBorder>
          </div>
        )}

        {/* Back Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/saved-readings')}
            className="group relative px-10 py-4 text-lg font-bold transition-all duration-500 transform hover:scale-105 overflow-hidden bg-gradient-to-br from-amber-200 via-amber-300 to-amber-400 border-2 border-amber-500 shadow-xl hover:shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
            <span className="relative z-10 tracking-wide text-amber-900 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]" style={{ fontFamily: 'Cinzel, serif' }}>
              Back to Saved Readings
            </span>
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
