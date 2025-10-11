import { TarotCard } from '../data/tarotDeck';
import RunicSymbol from './RunicSymbol';

interface TarotCardVisualProps {
  card: TarotCard;
  revealed?: boolean;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  isReversed?: boolean;
  cardBackUrl?: string;
}

export default function TarotCardVisual({ card, revealed = false, size = 'medium', isReversed = false, cardBackUrl }: TarotCardVisualProps) {
  const sizeClasses = {
    small: 'w-24',
    medium: 'w-32',
    large: 'w-48',
    xlarge: 'w-48 sm:w-64 lg:w-80'
  };

  const getCardSymbol = () => {
    if (card.arcana === 'major') {
      const majorSymbols: Record<string, string> = {
        'The Fool': '∞',
        'The Magician': '☿',
        'The High Priestess': '☽',
        'The Empress': '♀',
        'The Emperor': '♂',
        'The Hierophant': '♃',
        'The Lovers': '♊',
        'The Chariot': '♋',
        'Strength': '♌',
        'The Hermit': '♍',
        'Wheel of Fortune': '⊕',
        'Justice': '⚖',
        'The Hanged Man': '☿',
        'Death': '♏',
        'Temperance': '♐',
        'The Devil': '♑',
        'The Tower': '♂',
        'The Star': '♒',
        'The Moon': '♓',
        'The Sun': '☉',
        'Judgement': '♇',
        'The World': '♄'
      };
      return majorSymbols[card.name] || '✦';
    }

    const suitSymbols = {
      wands: '|',
      cups: '⌒',
      swords: '†',
      pentacles: '⬟'
    };
    return suitSymbols[card.suit || 'wands'];
  };

  if (!revealed) {
    if (cardBackUrl) {
      return (
        <div className={`${sizeClasses[size]} aspect-[2/3] relative ${isReversed ? 'rotate-180' : ''}`}>
          <div className="absolute inset-0 rounded-lg shadow-2xl overflow-hidden border-2 border-amber-800/50">
            <img
              src={cardBackUrl}
              alt="Card back"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      );
    }

    return (
      <div className={`${sizeClasses[size]} aspect-[2/3] relative ${isReversed ? 'rotate-180' : ''}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900 via-orange-950 to-stone-900 rounded-lg shadow-2xl border-2 border-amber-800/50">
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" viewBox="0 0 100 150" fill="none">
              <path d="M20 30 L30 20 L40 30 L30 40 Z" stroke="#d97706" strokeWidth="0.5" opacity="0.6" />
              <path d="M60 30 L70 20 L80 30 L70 40 Z" stroke="#d97706" strokeWidth="0.5" opacity="0.6" />
              <path d="M20 110 L30 100 L40 110 L30 120 Z" stroke="#d97706" strokeWidth="0.5" opacity="0.6" />
              <path d="M60 110 L70 100 L80 110 L70 120 Z" stroke="#d97706" strokeWidth="0.5" opacity="0.6" />
              <circle cx="50" cy="75" r="25" stroke="#d97706" strokeWidth="1" opacity="0.3" />
              <path d="M30 60 Q50 50 70 60 Q50 70 30 60" stroke="#d97706" strokeWidth="0.8" opacity="0.4" />
            </svg>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <RunicSymbol variant="algiz" className="w-12 h-12 text-amber-700/40" />
          </div>
        </div>
      </div>
    );
  }

  if (card.image_url) {
    return (
      <div className={`${sizeClasses[size]} aspect-[2/3] relative group`}>
        <div className={`absolute inset-0 rounded-lg shadow-2xl overflow-hidden ${isReversed ? 'filter contrast-125 saturate-150 hue-rotate-15' : ''}`}>
          <img
            src={card.image_url}
            alt={card.name}
            className="w-full h-full object-cover"
          />
          {isReversed && (
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-blue-500/10 to-pink-500/20 mix-blend-overlay pointer-events-none" />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} aspect-[2/3] relative group`}>
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-stone-100 to-amber-100 rounded-lg shadow-2xl border-3 border-amber-900/60">
        <div className="absolute inset-0 p-2">
          <div className="w-full h-full border-2 border-amber-900/30 rounded-md relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-orange-200 to-amber-300"></div>

            <svg className="absolute top-1 left-1 w-6 h-6 text-amber-800/20" viewBox="0 0 50 50">
              <path d="M10 10 L20 10 L15 20 Z M30 10 L40 10 L35 20 Z" fill="currentColor" />
            </svg>
            <svg className="absolute top-1 right-1 w-6 h-6 text-amber-800/20" viewBox="0 0 50 50">
              <path d="M10 10 L20 10 L15 20 Z M30 10 L40 10 L35 20 Z" fill="currentColor" />
            </svg>
            <svg className="absolute bottom-1 left-1 w-6 h-6 text-amber-800/20 rotate-180" viewBox="0 0 50 50">
              <path d="M10 10 L20 10 L15 20 Z M30 10 L40 10 L35 20 Z" fill="currentColor" />
            </svg>
            <svg className="absolute bottom-1 right-1 w-6 h-6 text-amber-800/20 rotate-180" viewBox="0 0 50 50">
              <path d="M10 10 L20 10 L15 20 Z M30 10 L40 10 L35 20 Z" fill="currentColor" />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center p-3">
              <div className="text-center mb-2">
                <div className="text-5xl font-serif text-amber-900/80 mb-1" style={{ fontFamily: 'Georgia, serif' }}>
                  {getCardSymbol()}
                </div>
              </div>

              <div className="w-full border-t border-b border-amber-900/20 py-2 my-1">
                <p className="text-center text-xs font-semibold text-amber-950 leading-tight px-1"
                   style={{ fontFamily: 'Georgia, serif', fontSize: size === 'large' ? '0.875rem' : '0.65rem' }}>
                  {card.name}
                </p>
              </div>

              <div className="mt-1">
                <RunicSymbol
                  variant={card.arcana === 'major' ? 'algiz' : 'fehu'}
                  className="w-6 h-6 text-amber-900/30"
                />
              </div>
            </div>

            <div className="absolute inset-0 pointer-events-none">
              <svg className="w-full h-full opacity-5" viewBox="0 0 100 150">
                <path d="M0 0 Q50 25 100 0 T100 50 T50 100 T0 150" stroke="currentColor" strokeWidth="1" fill="none" className="text-amber-900" />
              </svg>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 border-2 border-amber-900/10 rounded-lg pointer-events-none"></div>
      </div>
    </div>
  );
}
