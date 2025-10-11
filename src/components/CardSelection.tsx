import { useState, useEffect } from 'react';
import { Shuffle } from 'lucide-react';
import { SpreadType, SelectedCard } from '../types';
import { shuffleDeck, TarotCard } from '../data/tarotDeck';
import { spreads } from '../data/spreads';
import { useTarotDeck } from '../hooks/useTarotDeck';
import TarotCardVisual from './TarotCardVisual';
import CelticBorder from './CelticBorder';

interface CardSelectionProps {
  spreadType: SpreadType;
  onCardsSelected: (cards: SelectedCard[]) => void;
}

export default function CardSelection({ spreadType, onCardsSelected }: CardSelectionProps) {
  const { deck: tarotDeck, loading: deckLoading, cardBackUrl } = useTarotDeck();
  const [deck, setDeck] = useState<TarotCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<SelectedCard[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);

  const spread = spreads.find(s => s.id === spreadType)!;
  const cardsNeeded = spread.cardCount;

  useEffect(() => {
    if (!deckLoading && tarotDeck.length > 0) {
      handleShuffle();
    }
  }, [deckLoading, tarotDeck]);

  const handleShuffle = () => {
    setIsShuffling(true);
    const shuffled = shuffleDeck(tarotDeck).slice(0, 15);

    setTimeout(() => {
      setDeck(shuffled);
      setIsShuffling(false);
    }, 600);
  };

  const handleCardClick = (card: TarotCard, index: number) => {
    if (selectedCards.length >= cardsNeeded) return;
    if (selectedCards.some(sc => sc.card.id === card.id)) return;

    const isReversed = Math.random() > 0.5;

    const newSelected: SelectedCard = {
      card,
      position: spread.positions[selectedCards.length],
      positionIndex: selectedCards.length,
      isReversed
    };

    const updatedCards = [...selectedCards, newSelected];
    setSelectedCards(updatedCards);

    if (updatedCards.length === cardsNeeded) {
      setTimeout(() => {
        onCardsSelected(updatedCards);
      }, 500);
    }
  };

  const isCardSelected = (cardId: string) => {
    return selectedCards.some(sc => sc.card.id === cardId);
  };

  return (
    <div className="calan-branded min-h-screen p-4 py-12 relative overflow-hidden">
      {/* Celtic Pattern Background */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="card-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <rect x="20" y="20" width="40" height="60" stroke="#d4af37" strokeWidth="1.5" fill="none" opacity="0.3" />
              <circle cx="40" cy="50" r="5" fill="#cd7f32" opacity="0.2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#card-pattern)" />
        </svg>
      </div>

      {/* Gradient Overlays */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <h2 className="text-5xl font-bold mb-4" style={{ 
              fontFamily: 'Cinzel, serif',
              color: '#d4af37',
              textShadow: '0 0 20px rgba(212, 175, 55, 0.6), 0 2px 4px rgba(0,0,0,0.8)'
            }}>
              Select Your Cards
            </h2>
            <div className="w-64 h-1 mx-auto bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
          </div>
          <p className="text-xl mb-6 italic" style={{ 
            color: '#f5e6d3',
            textShadow: '0 1px 3px rgba(0,0,0,0.8)'
          }}>
            {selectedCards.length === 0
              ? 'Let your spirit guide you to the cards meant for you'
              : `Card ${selectedCards.length} of ${cardsNeeded} drawn from the ancient deck`
            }
          </p>

          {/* Shuffle Button */}
          <button
            onClick={handleShuffle}
            disabled={isShuffling || selectedCards.length > 0}
            className="calan-btn calan-btn-primary inline-flex items-center gap-3 px-10 py-4 disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-xl rounded overflow-hidden group relative"
            style={{ fontFamily: 'Cinzel, serif' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
            <Shuffle className={`w-5 h-5 relative z-10 ${isShuffling ? 'animate-spin' : ''}`} />
            <span className="relative z-10">{isShuffling ? 'Shuffling the Deck...' : 'Shuffle Cards'}</span>
          </button>
        </div>

        {/* Card Grid */}
        <div className="relative">
          <div className={`grid grid-cols-3 md:grid-cols-5 gap-6 transition-all duration-600 ${isShuffling ? 'blur-sm scale-95 opacity-50' : ''}`}>
            {deck.map((card, index) => {
              const selected = isCardSelected(card.id);
              const selectionOrder = selectedCards.findIndex(sc => sc.card.id === card.id);

              return (
                <button
                  key={`${card.id}-${index}`}
                  onClick={() => handleCardClick(card, index)}
                  disabled={selected || selectedCards.length >= cardsNeeded}
                  className={`group relative transition-all duration-300 ${
                    selected
                      ? 'scale-95 opacity-30'
                      : 'hover:scale-105 hover:-translate-y-2 cursor-pointer'
                  } ${!selected && selectedCards.length < cardsNeeded ? 'hover:drop-shadow-2xl' : ''}`}
                  style={{
                    animationDelay: `${index * 30}ms`
                  }}
                >
                  <TarotCardVisual card={card} revealed={false} size="small" cardBackUrl={cardBackUrl} />

                  {/* Selection Number Badge */}
                  {selected && selectionOrder >= 0 && (
                    <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 border-3 border-amber-300 flex items-center justify-center font-bold shadow-xl z-10" 
                      style={{ 
                        fontFamily: 'Cinzel, serif',
                        color: '#1a0b2e'
                      }}>
                      {selectionOrder + 1}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Cards Summary */}
        {selectedCards.length > 0 && (
          <div className="mt-12 max-w-4xl mx-auto">
            <CelticBorder>
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-6 text-center" style={{ 
                  fontFamily: 'Cinzel, serif',
                  color: '#d4af37',
                  textShadow: '0 1px 3px rgba(0,0,0,0.8)'
                }}>
                  Your Chosen Cards
                </h3>
                <div className="flex flex-wrap gap-4 justify-center">
                  {selectedCards.map((sc, idx) => (
                    <div key={idx} className="px-6 py-3 border-2 rounded-lg shadow-md"
                      style={{
                        background: 'rgba(212, 175, 55, 0.15)',
                        borderColor: 'rgba(212, 175, 55, 0.5)'
                      }}>
                      <span className="font-bold" style={{ 
                        fontFamily: 'Cinzel, serif',
                        color: '#d4af37',
                        textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                      }}>
                        {sc.position}
                      </span>
                      <span className="mx-2" style={{ color: '#cd7f32' }}>•</span>
                      <span style={{ 
                        fontFamily: 'Crimson Text, serif',
                        color: '#f5e6d3',
                        textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                      }}>
                        {sc.card.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CelticBorder>
          </div>
        )}

        {/* Footer Quote */}
        <div className="mt-12 text-center">
          <p className="text-sm italic" style={{ 
            color: '#f5e6d3', 
            opacity: 0.8,
            textShadow: '0 1px 2px rgba(0,0,0,0.8)'
          }}>
            "Trust in the cards that call to you"
          </p>
        </div>
      </div>
    </div>
  );
}