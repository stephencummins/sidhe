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
  const { deck: tarotDeck, loading: deckLoading } = useTarotDeck();
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-teal-50 p-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="card-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <rect x="20" y="20" width="40" height="60" stroke="#b45309" strokeWidth="1.5" fill="none" opacity="0.3" />
              <circle cx="40" cy="50" r="5" fill="#d97706" opacity="0.2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#card-pattern)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <div className="mb-6">
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-amber-800 via-orange-700 to-red-800 bg-clip-text text-transparent" style={{ fontFamily: 'Cinzel, serif' }}>Select Your Cards</h2>
            <div className="w-64 h-1 mx-auto bg-gradient-to-r from-transparent via-amber-700 to-transparent" />
          </div>
          <p className="text-xl text-amber-900/80 mb-6 italic">
            {selectedCards.length === 0
              ? 'Let your spirit guide you to the cards meant for you'
              : `Card ${selectedCards.length} of ${cardsNeeded} drawn from the ancient deck`
            }
          </p>

          <button
            onClick={handleShuffle}
            disabled={isShuffling || selectedCards.length > 0}
            className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-amber-700 via-orange-600 to-red-700 text-amber-50 border-2 border-amber-900 hover:border-orange-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-bold shadow-xl hover:shadow-amber-900/50 rounded overflow-hidden group"
            style={{ fontFamily: 'Cinzel, serif' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
            <Shuffle className={`w-5 h-5 relative z-10 ${isShuffling ? 'animate-spin' : ''}`} />
            <span className="relative z-10">{isShuffling ? 'Shuffling the Deck...' : 'Shuffle Cards'}</span>
          </button>
        </div>

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
                  <TarotCardVisual card={card} revealed={false} size="small" />

                  {selected && selectionOrder >= 0 && (
                    <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-gradient-to-br from-amber-700 to-orange-800 text-amber-50 border-3 border-amber-300 flex items-center justify-center font-bold shadow-xl z-10" style={{ fontFamily: 'Cinzel, serif' }}>
                      {selectionOrder + 1}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {selectedCards.length > 0 && (
          <div className="mt-12 max-w-4xl mx-auto">
            <CelticBorder>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-amber-900 mb-6 text-center" style={{ fontFamily: 'Cinzel, serif' }}>Your Chosen Cards</h3>
                <div className="flex flex-wrap gap-4 justify-center">
                  {selectedCards.map((sc, idx) => (
                    <div key={idx} className="bg-gradient-to-br from-amber-100 to-orange-100 px-6 py-3 border-2 border-amber-700/50 rounded-lg shadow-md">
                      <span className="text-amber-900 font-bold" style={{ fontFamily: 'Cinzel, serif' }}>{sc.position}</span>
                      <span className="text-orange-700 mx-2">•</span>
                      <span className="text-amber-800" style={{ fontFamily: 'Crimson Text, serif' }}>{sc.card.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CelticBorder>
          </div>
        )}
      </div>
    </div>
  );
}
