import { useState, useEffect } from 'react';
import { SpreadType, SelectedCard } from '../types';
import { spreads } from '../data/spreads';
import { useTarotDeck } from '../hooks/useTarotDeck';
import CelticBorder from './CelticBorder';
import TarotCardVisual from './TarotCardVisual';

interface CardSelectionProps {
  spreadType: SpreadType;
  onCardsSelected: (cards: SelectedCard[]) => void;
}

export default function CardSelection({ spreadType, onCardsSelected }: CardSelectionProps) {
  const { deck, loading, cardBackUrl } = useTarotDeck();
  const [selectedCards, setSelectedCards] = useState<SelectedCard[]>([]);
  const [shuffledDeck, setShuffledDeck] = useState(deck);
  const [isShuffling, setIsShuffling] = useState(true);

  const spread = spreads.find(s => s.id === spreadType);
  const requiredCards = spread?.cardCount || 1;

  useEffect(() => {
    if (!loading) {
      const shuffled = [...deck].sort(() => Math.random() - 0.5);
      setShuffledDeck(shuffled);
      setTimeout(() => setIsShuffling(false), 1000);
    }
  }, [deck, loading]);

  const handleCardClick = (index: number) => {
    if (selectedCards.length >= requiredCards) return;

    const card = shuffledDeck[index];
    const isReversed = Math.random() > 0.5;
    const positionIndex = selectedCards.length;

    const newCard: SelectedCard = {
      card: {
        id: card.id,
        name: card.name,
        suit: card.suit,
        arcana: card.arcana,
        keywords: card.keywords,
        upright_meaning: card.upright_meaning,
        reversed_meaning: card.reversed_meaning,
        image_url: card.image_url,
        celtic_upright: card.celtic_upright,
        celtic_reversed: card.celtic_reversed,
        celtic_keywords: card.celtic_keywords,
        celtic_mythology: card.celtic_mythology
      },
      position: spread?.positions[positionIndex] || `Card ${positionIndex + 1}`,
      positionIndex,
      isReversed
    };

    const updatedCards = [...selectedCards, newCard];
    setSelectedCards(updatedCards);

    if (updatedCards.length === requiredCards) {
      setTimeout(() => {
        onCardsSelected(updatedCards);
      }, 500);
    }
  };

  if (loading) {
    return (
      <div className="calan-branded min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl" style={{ color: 'var(--calan-accent-gold)', fontFamily: 'Cinzel, serif' }}>
            Loading deck...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="calan-branded min-h-screen p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="card-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
              <path d="M60 20 Q75 35 60 50 Q45 35 60 20" stroke="#d4af37" strokeWidth="1.5" fill="none" opacity="0.4" />
              <circle cx="60" cy="60" r="15" stroke="#d4af37" strokeWidth="1" fill="none" opacity="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#card-pattern)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{
            fontFamily: 'Cinzel, serif',
            color: 'var(--calan-accent-gold)',
            textShadow: '0 0 20px rgba(212, 175, 55, 0.6)'
          }}>
            Draw Your Cards
          </h2>
          <div className="w-64 h-1 mx-auto bg-gradient-to-r from-transparent via-[var(--calan-accent-gold)] to-transparent mb-4" />
          <p className="text-xl" style={{ color: 'var(--calan-cream)' }}>
            {spread?.name} - Select {requiredCards} {requiredCards === 1 ? 'card' : 'cards'}
          </p>
          <p className="text-lg mt-2" style={{ color: 'var(--calan-cream)', opacity: 0.8 }}>
            Cards selected: {selectedCards.length} / {requiredCards}
          </p>
        </div>

        {selectedCards.length > 0 && (
          <div className="mb-8">
            <CelticBorder>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4 text-center" style={{
                  fontFamily: 'Cinzel, serif',
                  color: 'var(--calan-accent-gold)'
                }}>
                  Your Selected Cards
                </h3>
                <div className="flex flex-wrap justify-center gap-4">
                  {selectedCards.map((selectedCard, index) => (
                    <div key={index} className="text-center">
                      <TarotCardVisual
                        card={selectedCard.card}
                        revealed={true}
                        size="small"
                        isReversed={selectedCard.isReversed}
                        cardBackUrl={cardBackUrl}
                      />
                      <p className="mt-2 text-sm font-semibold" style={{ color: 'var(--calan-accent-gold)' }}>
                        {selectedCard.position}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CelticBorder>
          </div>
        )}

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {shuffledDeck.slice(0, 32).map((card, index) => (
            <button
              key={index}
              onClick={() => handleCardClick(index)}
              disabled={selectedCards.length >= requiredCards || isShuffling}
              className={`transform transition-all duration-300 ${
                selectedCards.length < requiredCards && !isShuffling
                  ? 'hover:scale-110 hover:-translate-y-2 cursor-pointer'
                  : 'opacity-50 cursor-not-allowed'
              }`}
            >
              <TarotCardVisual
                card={card}
                revealed={false}
                size="small"
                cardBackUrl={cardBackUrl}
              />
            </button>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm italic" style={{
            color: 'var(--calan-cream)',
            opacity: 0.7
          }}>
            "Trust your intuition - the cards that call to you hold your answers"
          </p>
        </div>
      </div>
    </div>
  );
}
