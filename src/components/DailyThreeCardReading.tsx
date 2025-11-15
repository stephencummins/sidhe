import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Save } from 'lucide-react';
import TarotCardVisual from './TarotCardVisual';
import SaveReadingModal from './SaveReadingModal';
import CelticBorder from './CelticBorder';
import { Card as TarotCard, Reading, SelectedCard } from '../types';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface DailyReading {
  date: string;
  cards: TarotCard[];
}

export default function DailyThreeCardReading() {
  const [reading, setReading] = useState<DailyReading | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSaveModal, setShowSaveModal] = useState(false);

  useEffect(() => {
    loadDailyReading();
  }, []);

  const loadDailyReading = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];

      // Use a deterministic seed based on the date to get same cards each day
      const seed = hashDate(today);

      // Fetch cards from the active Celtic deck
      const { data: allCards, error } = await supabase
        .from('tarot_cards')
        .select(`
          *,
          tarot_decks!inner(name, is_active)
        `)
        .eq('tarot_decks.is_active', true)
        .order('id');

      if (error) throw error;

      if (!allCards || allCards.length === 0) {
        throw new Error('No cards found in database');
      }

      // Select 3 cards deterministically based on date
      const selectedCards = selectDailyCards(allCards, seed, 3);

      setReading({
        date: today,
        cards: selectedCards
      });
    } catch (error) {
      console.error('Error loading daily reading:', error);
    } finally {
      setLoading(false);
    }
  };

  // Hash function to generate consistent seed from date
  const hashDate = (dateStr: string): number => {
    let hash = 0;
    for (let i = 0; i < dateStr.length; i++) {
      const char = dateStr.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  };

  // Seeded random number generator
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  // Select cards deterministically based on seed
  const selectDailyCards = (cards: TarotCard[], seed: number, count: number): TarotCard[] => {
    const shuffled = [...cards];
    let currentSeed = seed;

    // Fisher-Yates shuffle with seeded random
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom(currentSeed++) * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled.slice(0, count);
  };

  const positions = ['Past', 'Present', 'Future'];

  // Convert daily reading to Reading format for saving
  const convertToReading = (): Reading | null => {
    if (!reading) return null;

    const selectedCards: SelectedCard[] = reading.cards.map((card, index) => ({
      card: {
        id: card.id || '',
        name: card.name || '',
        suit: card.suit as 'wands' | 'cups' | 'swords' | 'pentacles' | undefined,
        arcana: card.arcana || 'major',
        keywords: card.keywords || [],
        upright_meaning: card.upright_meaning || card.meaning_upright || '',
        reversed_meaning: card.reversed_meaning || card.meaning_reversed || '',
        image_url: card.image_url,
        celtic_upright: card.celtic_meaning_upright,
        celtic_reversed: card.celtic_meaning_reversed,
        celtic_keywords: card.celtic_keywords,
        celtic_mythology: card.celtic_mythology,
      },
      position: positions[index],
      positionIndex: index,
      isReversed: false,
    }));

    return {
      spread: 'three-card',
      cards: selectedCards,
      timestamp: new Date(reading.date).getTime(),
    };
  };

  if (loading) {
    return (
      <div className="calan-branded min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-amber-400 mx-auto mb-4"></div>
          <p style={{ color: '#f5e6d3', fontFamily: 'Cinzel, serif', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
            Drawing your daily cards...
          </p>
        </div>
      </div>
    );
  }

  if (!reading) {
    return (
      <div className="calan-branded min-h-screen flex items-center justify-center p-4">
        <div className="text-center" style={{ color: '#f5e6d3' }}>
          <p>Unable to load daily reading. Please try again later.</p>
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
        <div className="text-center mb-12">
          <CelticBorder>
            <div className="p-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{
                fontFamily: 'Cinzel, serif',
                color: '#d4af37',
                textShadow: '0 0 20px rgba(212, 175, 55, 0.6), 0 2px 10px rgba(212, 175, 55, 0.3)'
              }}>
                Daily Three Card Reading
              </h1>
              <div className="w-48 h-1 mx-auto mb-4 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
              <p className="text-xl mb-2" style={{
                color: '#f5e6d3',
                textShadow: '0 1px 3px rgba(0,0,0,0.8)'
              }}>
                {new Date(reading.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <p className="text-lg italic" style={{
                color: '#cd7f32',
                textShadow: '0 1px 2px rgba(0,0,0,0.8)'
              }}>
                Past • Present • Future
              </p>
            </div>
          </CelticBorder>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {reading.cards.map((card, index) => (
            <div key={index}>
              <CelticBorder>
                <div className="p-6 flex flex-col items-center">
                  <h3 className="text-2xl font-bold mb-4" style={{
                    fontFamily: 'Cinzel, serif',
                    color: '#d4af37',
                    textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                  }}>
                    {positions[index]}
                  </h3>
                  <div className="mb-4">
                    <TarotCardVisual
                      card={card}
                      revealed={true}
                      size="medium"
                    />
                  </div>
                  <div className="text-center">
                    <h4 className="text-xl font-bold mb-2" style={{
                      fontFamily: 'Cinzel, serif',
                      color: '#d4af37',
                      textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                    }}>
                      {card.name}
                    </h4>
                    <p className="text-sm mb-3" style={{
                      color: '#cd7f32',
                      textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                    }}>
                      {card.arcana} {card.suit ? `• ${card.suit}` : ''}
                    </p>
                    {card.celtic_keywords && card.celtic_keywords.length > 0 && (
                      <p className="text-sm mb-3 italic" style={{
                        color: '#f5e6d3',
                        textShadow: '0 1px 2px rgba(0,0,0,0.7)'
                      }}>
                        {card.celtic_keywords.slice(0, 3).join(' • ')}
                      </p>
                    )}
                    <p className="leading-relaxed" style={{
                      color: '#f5e6d3',
                      textShadow: '0 1px 2px rgba(0,0,0,0.7)'
                    }}>
                      {card.celtic_meaning_upright || card.meaning_upright || card.upright_meaning}
                    </p>
                  </div>
                </div>
              </CelticBorder>
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="mb-12">
          <CelticBorder>
            <div className="p-8 text-center">
              <p className="leading-relaxed mb-3" style={{
                color: '#f5e6d3',
                textShadow: '0 1px 2px rgba(0,0,0,0.7)'
              }}>
                These cards are drawn fresh each day and shared with all who seek guidance from the ancient Celtic wisdom.
                Return tomorrow for a new reading as the wheel of the seasons continues to turn.
              </p>
              <p className="text-sm italic" style={{
                color: '#cd7f32',
                textShadow: '0 1px 2px rgba(0,0,0,0.8)'
              }}>
                "In every season, a story. In every turn, wisdom eternal."
              </p>
            </div>
          </CelticBorder>
        </div>

        {/* Footer Buttons */}
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
          <button
            onClick={() => setShowSaveModal(true)}
            className="group relative px-10 py-4 text-lg font-bold transition-all duration-500 transform hover:scale-105 overflow-hidden bg-gradient-to-br from-purple-200 via-purple-300 to-purple-400 border-2 border-purple-500 shadow-xl hover:shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
            <span className="relative z-10 flex items-center gap-2 tracking-wide text-purple-900 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]" style={{ fontFamily: 'Cinzel, serif' }}>
              <Save className="w-5 h-5" />
              Save Reading
            </span>
          </button>
          <a
            href="/"
            className="group relative px-10 py-4 text-lg font-bold transition-all duration-500 transform hover:scale-105 overflow-hidden bg-gradient-to-br from-amber-200 via-amber-300 to-amber-400 border-2 border-amber-500 shadow-xl hover:shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
            <span className="relative z-10 tracking-wide text-amber-900 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]" style={{ fontFamily: 'Cinzel, serif' }}>
              Back to Home
            </span>
          </a>
        </div>
      </div>

      {showSaveModal && convertToReading() && (
        <SaveReadingModal
          reading={convertToReading()!}
          interpretation=""
          onClose={() => setShowSaveModal(false)}
          readingSource="daily"
        />
      )}
    </div>
  );
}
