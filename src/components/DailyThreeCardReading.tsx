import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import TarotCardVisual from './TarotCardVisual';
import { Card as TarotCard } from '../types';

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

  useEffect(() => {
    loadDailyReading();
  }, []);

  const loadDailyReading = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];

      // Use a deterministic seed based on the date to get same cards each day
      const seed = hashDate(today);

      // Fetch all cards from Supabase
      const { data: allCards, error } = await supabase
        .from('tarot_cards')
        .select('*')
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sidhe-deep-blue via-sidhe-navy to-sidhe-deep-blue flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sidhe-gold mx-auto mb-4"></div>
          <p className="text-sidhe-cream">Drawing your daily cards...</p>
        </div>
      </div>
    );
  }

  if (!reading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sidhe-deep-blue via-sidhe-navy to-sidhe-deep-blue flex items-center justify-center p-4">
        <div className="text-center text-sidhe-cream">
          <p>Unable to load daily reading. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sidhe-deep-blue via-sidhe-navy to-sidhe-deep-blue py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-sidhe-gold mb-4">
            Daily Three Card Reading
          </h1>
          <p className="text-sidhe-cream text-lg">
            {new Date(reading.date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
          <p className="text-sidhe-cream/80 mt-2">
            Past • Present • Future
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {reading.cards.map((card, index) => (
            <div key={index} className="flex flex-col items-center">
              <h3 className="text-2xl font-serif text-sidhe-gold mb-4">
                {positions[index]}
              </h3>
              <div className="w-full max-w-sm">
                <TarotCardVisual
                  card={card}
                  isRevealed={true}
                />
                <div className="mt-4 bg-sidhe-navy/50 rounded-lg p-4 border border-sidhe-gold/20">
                  <h4 className="text-xl font-serif text-sidhe-cream mb-2">
                    {card.name}
                  </h4>
                  <p className="text-sidhe-cream/80 text-sm mb-3">
                    {card.arcana} • {card.suit || 'Major Arcana'}
                  </p>
                  <p className="text-sidhe-cream/90 leading-relaxed">
                    {card.meaning}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sidhe-cream/60 text-sm mb-4">
            These cards are drawn fresh each day and shared with all who seek guidance.
            Return tomorrow for a new reading.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-sidhe-gold text-sidhe-deep-blue font-semibold rounded-lg hover:bg-sidhe-gold/90 transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
