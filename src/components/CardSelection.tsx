import { useState, useEffect } from 'react';
import { Shuffle } from 'lucide-react';
import { SpreadType, SelectedCard } from '../types';
import { shuffleDeck, TarotCard } from '../data/tarotDeck';
import { spreads } from '../data/spreads';
import { useTarotDeck } from '../hooks/useTarotDeck';
import TarotCardVisual from './TarotCardVisual';

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
    <div className="min-h-screen bg-gradient-to-br from-stone-900 via-amber-950 to-stone-950 p-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-amber-100 mb-4" style={{ fontFamily: 'Georgia, serif' }}>Select Your Cards</h2>
          <p className="text-amber-200/80 text-lg mb-6" style={{ fontFamily: 'Georgia, serif' }}>
            {selectedCards.length === 0
              ? 'Shuffle the ancient deck and choose the cards that speak to your spirit'
              : `Card ${selectedCards.length} of ${cardsNeeded} drawn from the depths`
            }
          </p>

          <button
            onClick={handleShuffle}
            disabled={isShuffling || selectedCards.length > 0}
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-700 via-orange-800 to-amber-700 text-amber-50 border-2 border-amber-600/50 hover:border-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-amber-700/40"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            <Shuffle className={`w-5 h-5 ${isShuffling ? 'animate-spin' : ''}`} />
            {isShuffling ? 'Shuffling...' : 'Shuffle Cards'}
          </button>
        </div>

        <div className="relative">
          <div className={`grid grid-cols-5 gap-4 transition-all duration-600 ${isShuffling ? 'blur-sm scale-95 opacity-50' : ''}`}>
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
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-amber-700 text-amber-50 border-2 border-amber-500 flex items-center justify-center font-bold text-sm shadow-lg z-10" style={{ fontFamily: 'Georgia, serif' }}>
                      {selectionOrder + 1}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {selectedCards.length > 0 && (
          <div className="relative mt-12 bg-stone-900/60 backdrop-blur-sm border-2 border-amber-900/50 p-6">
            <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-amber-700/40"></div>
            <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-amber-700/40"></div>
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-amber-700/40"></div>
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-amber-700/40"></div>
            <h3 className="text-amber-100 font-semibold mb-4 text-center" style={{ fontFamily: 'Georgia, serif' }}>Cards of Destiny</h3>
            <div className="flex flex-wrap gap-3 justify-center">
              {selectedCards.map((sc, idx) => (
                <div key={idx} className="bg-amber-950/50 px-4 py-2 border border-amber-800/40">
                  <span className="text-amber-400 font-semibold text-sm" style={{ fontFamily: 'Georgia, serif' }}>{sc.position}</span>
                  <span className="text-amber-600 mx-2">•</span>
                  <span className="text-amber-200 text-sm" style={{ fontFamily: 'Georgia, serif' }}>{sc.card.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
