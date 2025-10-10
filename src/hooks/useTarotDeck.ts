import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { TarotCardDB } from '../types/database';
import { tarotDeck as defaultDeck } from '../data/tarotDeck';

export function useTarotDeck() {
  const [deck, setDeck] = useState(defaultDeck);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActiveDeck();
  }, []);

  const loadActiveDeck = async () => {
    try {
      const { data: activeDeck, error: deckError } = await supabase
        .from('tarot_decks')
        .select('id')
        .eq('is_active', true)
        .maybeSingle();

      if (deckError) throw deckError;

      if (activeDeck) {
        const { data: cards, error: cardsError } = await supabase
          .from('tarot_cards')
          .select('*')
          .eq('deck_id', activeDeck.id);

        if (cardsError) throw cardsError;

        if (cards && cards.length > 0) {
          const formattedDeck = cards.map((card: TarotCardDB) => ({
            id: card.id,
            name: card.name,
            suit: card.suit || undefined,
            arcana: card.arcana,
            keywords: card.keywords,
            upright_meaning: card.meaning_upright,
            reversed_meaning: card.meaning_reversed,
            image_url: card.image_url,
            celtic_upright: card.celtic_meaning_upright,
            celtic_reversed: card.celtic_meaning_reversed,
            celtic_keywords: card.celtic_keywords,
            celtic_mythology: card.celtic_mythology
          }));
          setDeck(formattedDeck);
        }
      }
    } catch (error) {
      console.error('Error loading custom deck:', error);
    } finally {
      setLoading(false);
    }
  };

  return { deck, loading };
}
