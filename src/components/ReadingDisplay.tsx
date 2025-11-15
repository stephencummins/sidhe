import { useState, useEffect } from 'react';
import { Save, Loader2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { Reading } from '../types';
import { spreads } from '../data/spreads';
import TarotCardVisual from './TarotCardVisual';
import RunicSymbol from './RunicSymbol';
import SaveReadingModal from './SaveReadingModal';

interface ReadingDisplayProps {
  reading: Reading;
  onNewReading: () => void;
}

export default function ReadingDisplay({ reading, onNewReading }: ReadingDisplayProps) {
  const [interpretation, setInterpretation] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const [meaningType, setMeaningType] = useState<'traditional' | 'celtic'>('traditional');
  const [showSaveModal, setShowSaveModal] = useState(false);

  const spread = spreads.find(s => s.id === reading.spread)!;

  useEffect(() => {
    generateInterpretation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reading, meaningType]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedCardIndex === null) return;

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCardIndex, reading.cards.length]);

  const navigateToPreviousCard = () => {
    if (selectedCardIndex === null) return;
    setSelectedCardIndex((prev) =>
      prev === 0 ? reading.cards.length - 1 : prev! - 1
    );
  };

  const navigateToNextCard = () => {
    if (selectedCardIndex === null) return;
    setSelectedCardIndex((prev) =>
      prev === reading.cards.length - 1 ? 0 : prev! + 1
    );
  };

  const generateInterpretation = async () => {
    setIsLoading(true);
    setError('');

    try {
      const cards = reading.cards.map(sc => ({
        name: sc.card.name,
        position: sc.position,
        isReversed: sc.isReversed
      }));

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-tarot-interpretation`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          cards,
          question: reading.question,
          spreadName: spread.name,
          meaningType
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', response.status, errorData);
        throw new Error(errorData.error || 'Failed to generate interpretation');
      }

      const data = await response.json();
      setInterpretation(data.interpretation);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unable to generate interpretation. Please try again.';
      setError(errorMessage);
      console.error('Error generating interpretation:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveReading = () => {
    setShowSaveModal(true);
  };

  const getLayoutClass = () => {
    switch (reading.spread) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-900 via-amber-950 to-stone-950 p-4 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <RunicSymbol variant="kenaz" className="w-12 h-16 text-amber-600/70" />
          </div>
          <h2 className="text-4xl font-bold text-amber-100 mb-4" style={{ fontFamily: 'Georgia, serif' }}>The Oracle Speaks</h2>
          <p className="text-amber-200/80 text-lg" style={{ fontFamily: 'Georgia, serif' }}>{spread.name}</p>
          {reading.question && (
            <p className="text-amber-400 mt-2 italic" style={{ fontFamily: 'Georgia, serif' }}>~{reading.question}~</p>
          )}

          <div className="mt-6 flex justify-center gap-2">
            <button
              onClick={() => setMeaningType('traditional')}
              className={`px-4 py-2 border-2 transition-all ${
                meaningType === 'traditional'
                  ? 'bg-amber-700/80 border-amber-500 text-amber-100'
                  : 'bg-stone-800/50 border-amber-800/30 text-amber-400 hover:border-amber-600'
              }`}
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Traditional
            </button>
            <button
              onClick={() => setMeaningType('celtic')}
              className={`px-4 py-2 border-2 transition-all ${
                meaningType === 'celtic'
                  ? 'bg-emerald-700/80 border-emerald-500 text-emerald-100'
                  : 'bg-stone-800/50 border-amber-800/30 text-amber-400 hover:border-amber-600'
              }`}
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Celtic Mythology
            </button>
          </div>
        </div>

        <div className={`mb-12 ${getLayoutClass()} max-w-5xl mx-auto`}>
          {reading.cards.map((sc, index) => (
            <div
              key={index}
              className={`${reading.spread === 'celtic-cross' ? getCelticCrossPosition(index) : ''} flex flex-col items-center`}
            >
              <div
                className="mb-4 cursor-pointer transition-transform hover:scale-105"
                onClick={() => setSelectedCardIndex(index)}
              >
                <TarotCardVisual card={sc.card} revealed={true} size="medium" isReversed={sc.isReversed} />
              </div>
              <div className="text-center">
                <p className="text-amber-500 font-semibold text-sm mb-1" style={{ fontFamily: 'Georgia, serif' }}>{sc.position}</p>
                <p className="text-amber-100 font-medium" style={{ fontFamily: 'Georgia, serif' }}>{sc.card.name}</p>
                {sc.isReversed && (
                  <p className="text-teal-400 text-xs font-semibold mt-1 italic" style={{ fontFamily: 'Georgia, serif' }}>
                    ⟲ Inverted
                  </p>
                )}
                <p className="text-amber-400/70 text-xs mt-1" style={{ fontFamily: 'Georgia, serif' }}>{sc.card.keywords.slice(0, 2).join(', ')}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="relative max-w-4xl mx-auto bg-stone-900/70 backdrop-blur-sm border-2 border-amber-900/50 p-8">
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

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
              <p className="text-amber-200 text-lg" style={{ fontFamily: 'Georgia, serif' }}>Channelling ancient wisdom...</p>
              <p className="text-amber-500/70 text-sm mt-2" style={{ fontFamily: 'Georgia, serif' }}>The spirits commune...</p>
            </div>
          ) : error ? (
            <div className="py-8 text-center">
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={generateInterpretation}
                className="px-6 py-2 bg-amber-700 text-amber-50 border-2 border-amber-600/50 hover:border-amber-500 transition-colors"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Try Again
              </button>
            </div>
          ) : (
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
                {interpretation}
              </ReactMarkdown>
            </div>
          )}

          {!isLoading && interpretation && (
            <div className="my-8 pt-6 border-t border-amber-900/40">
              <h4 className="text-amber-100 font-semibold mb-4" style={{ fontFamily: 'Georgia, serif' }}>The Cards' Essence</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reading.cards.map((sc, idx) => {
                  const displayMeaning = meaningType === 'celtic' && sc.card.celtic_upright
                    ? sc.card.celtic_upright
                    : sc.card.upright_meaning;

                  return (
                    <div key={idx} className="bg-amber-950/30 border border-amber-800/30 p-4">
                      <h5 className="text-amber-400 font-semibold mb-1" style={{ fontFamily: 'Georgia, serif' }}>{sc.card.name}</h5>
                      <p className="text-amber-500/80 text-sm mb-2" style={{ fontFamily: 'Georgia, serif' }}>{sc.position}</p>
                      <p className="text-amber-200/80 text-sm" style={{ fontFamily: 'Georgia, serif' }}>{displayMeaning}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex gap-4 justify-center">
          <button
            onClick={handleSaveReading}
            disabled={isLoading || !interpretation}
            className="inline-flex items-center gap-2 px-8 py-3 bg-stone-800 text-amber-200 border-2 border-amber-900/50 hover:border-amber-700 hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            <Save className="w-5 h-5" />
            Save Reading
          </button>
          <button
            onClick={onNewReading}
            className="px-8 py-3 bg-gradient-to-r from-amber-700 via-orange-800 to-amber-700 text-amber-50 border-2 border-amber-600/50 hover:border-amber-500 transition-all duration-200 font-semibold shadow-lg hover:shadow-amber-700/40"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            New Reading
          </button>
        </div>
      </div>

      {showSaveModal && (
        <SaveReadingModal
          reading={reading}
          interpretation={interpretation}
          onClose={() => setShowSaveModal(false)}
          readingSource="personal"
        />
      )}

      {selectedCardIndex !== null && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4"
          onClick={() => setSelectedCardIndex(null)}
        >
          {/* Left Navigation Button */}
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

          {/* Right Navigation Button */}
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
            <div className="absolute top-3 left-3 sm:top-6 sm:left-6 w-8 h-8 sm:w-12 sm:h-12 border-t-2 border-l-2 sm:border-t-4 sm:border-l-4 border-amber-600/50"></div>
            <div className="absolute top-3 right-3 sm:top-6 sm:right-6 w-8 h-8 sm:w-12 sm:h-12 border-t-2 border-r-2 sm:border-t-4 sm:border-r-4 border-amber-600/50"></div>
            <div className="absolute bottom-3 left-3 sm:bottom-6 sm:left-6 w-8 h-8 sm:w-12 sm:h-12 border-b-2 border-l-2 sm:border-b-4 sm:border-l-4 border-amber-600/50"></div>
            <div className="absolute bottom-3 right-3 sm:bottom-6 sm:right-6 w-8 h-8 sm:w-12 sm:h-12 border-b-2 border-r-2 sm:border-b-4 sm:border-r-4 border-amber-600/50"></div>

            <button
              onClick={() => setSelectedCardIndex(null)}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 text-amber-400 hover:text-amber-200 transition-colors bg-stone-900/80 rounded-full p-1.5 sm:p-2"
            >
              <X className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>

            {/* Card Counter */}
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

                <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                  <div className="bg-stone-900/50 border-2 border-amber-800/40 p-4 sm:p-6">
                    <h4 className="text-amber-300 font-bold text-lg sm:text-xl mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3" style={{ fontFamily: 'Georgia, serif' }}>
                      <RunicSymbol variant="ansuz" className="w-6 h-8 sm:w-8 sm:h-10 text-amber-600" />
                      {reading.cards[selectedCardIndex].isReversed ? 'Current Orientation: Inverted' : 'Current Orientation: Upright'}
                    </h4>
                    <p className="text-amber-200/95 text-base sm:text-lg leading-relaxed mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                      {reading.cards[selectedCardIndex].isReversed
                        ? (meaningType === 'celtic' && reading.cards[selectedCardIndex].card.celtic_reversed
                          ? reading.cards[selectedCardIndex].card.celtic_reversed
                          : reading.cards[selectedCardIndex].card.reversed_meaning)
                        : (meaningType === 'celtic' && reading.cards[selectedCardIndex].card.celtic_upright
                          ? reading.cards[selectedCardIndex].card.celtic_upright
                          : reading.cards[selectedCardIndex].card.upright_meaning)}
                    </p>
                    <div className="my-4 pt-4 border-t border-amber-700/30">
                      <p className="text-amber-400/80 text-sm mb-2 font-semibold" style={{ fontFamily: 'Georgia, serif' }}>General Interpretation:</p>
                      <p className="text-amber-200/80 text-sm leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                        {reading.cards[selectedCardIndex].isReversed
                          ? `When inverted, this card suggests blocked energy or the shadow aspects of its upright meaning. Consider what obstacles or internal resistance might be present. Inverted cards often indicate delays, internalization, or the need to address underlying issues before moving forward.`
                          : `In its upright position, this card brings its full, positive energy to your reading. It represents an active manifestation of its core qualities in your current situation. Pay attention to how its themes are already present or emerging in your life.`}
                      </p>
                    </div>
                  </div>

                  <div className="bg-stone-900/50 border-2 border-amber-800/40 p-4 sm:p-6">
                    <h4 className="text-amber-300 font-bold text-lg sm:text-xl mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3" style={{ fontFamily: 'Georgia, serif' }}>
                      <RunicSymbol variant="kenaz" className="w-6 h-8 sm:w-8 sm:h-10 text-amber-600" />
                      Detailed Meanings
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-amber-400 text-sm font-semibold mb-2" style={{ fontFamily: 'Georgia, serif' }}>Upright:</p>
                        <p className="text-amber-200/90 text-sm sm:text-base leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                          {meaningType === 'celtic' && reading.cards[selectedCardIndex].card.celtic_upright
                            ? reading.cards[selectedCardIndex].card.celtic_upright
                            : reading.cards[selectedCardIndex].card.upright_meaning}
                        </p>
                      </div>
                      <div className="my-3 pt-3 border-t border-amber-700/20">
                        <p className="text-amber-400 text-sm font-semibold mb-2" style={{ fontFamily: 'Georgia, serif' }}>Inverted:</p>
                        <p className="text-amber-200/90 text-sm sm:text-base leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                          {meaningType === 'celtic' && reading.cards[selectedCardIndex].card.celtic_reversed
                            ? reading.cards[selectedCardIndex].card.celtic_reversed
                            : reading.cards[selectedCardIndex].card.reversed_meaning}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-stone-900/50 border-2 border-amber-800/40 p-4 sm:p-6">
                    <h4 className="text-amber-300 font-bold text-lg sm:text-xl mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3" style={{ fontFamily: 'Georgia, serif' }}>
                      <RunicSymbol variant="fehu" className="w-6 h-8 sm:w-8 sm:h-10 text-amber-600" />
                      Contextual Guidance
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-amber-400 text-sm font-semibold mb-1.5" style={{ fontFamily: 'Georgia, serif' }}>In Relationships:</p>
                        <p className="text-amber-200/80 text-sm leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                          {reading.cards[selectedCardIndex].isReversed
                            ? `Consider communication blocks, unmet needs, or patterns that need addressing. This card reversed suggests looking inward at what you bring to relationships.`
                            : `This energy supports authentic connection and growth in relationships. It encourages openness, trust, and alignment with your true feelings.`}
                        </p>
                      </div>
                      <div>
                        <p className="text-amber-400 text-sm font-semibold mb-1.5" style={{ fontFamily: 'Georgia, serif' }}>In Career & Goals:</p>
                        <p className="text-amber-200/80 text-sm leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                          {reading.cards[selectedCardIndex].isReversed
                            ? `Delays or obstacles may be present. Use this time to refine your approach, build skills, or address internal doubts before pushing forward.`
                            : `Forward momentum is available. Trust your abilities and take concrete steps toward your ambitions. The path ahead is open.`}
                        </p>
                      </div>
                      <div>
                        <p className="text-amber-400 text-sm font-semibold mb-1.5" style={{ fontFamily: 'Georgia, serif' }}>For Spiritual Growth:</p>
                        <p className="text-amber-200/80 text-sm leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                          {reading.cards[selectedCardIndex].isReversed
                            ? `Inner work is called for. Shadow aspects need integration. This is a time for deep self-reflection and healing old wounds.`
                            : `Your spiritual path is illuminated. Trust your intuition and remain open to guidance. Synchronicities and insights will flow naturally.`}
                        </p>
                      </div>
                    </div>
                  </div>

                  {meaningType === 'celtic' && reading.cards[selectedCardIndex].card.celtic_mythology && (
                    <div className="bg-emerald-900/30 border-2 border-emerald-700/40 p-4 sm:p-6">
                      <h4 className="text-emerald-300 font-bold text-lg sm:text-xl mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3" style={{ fontFamily: 'Georgia, serif' }}>
                        <RunicSymbol variant="algiz" className="w-6 h-8 sm:w-8 sm:h-10 text-emerald-600" />
                        Celtic Mythology & Symbolism
                      </h4>
                      <p className="text-emerald-200/95 text-base sm:text-lg leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                        {reading.cards[selectedCardIndex].card.celtic_mythology}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
