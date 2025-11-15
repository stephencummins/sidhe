import type { SelectedCard, ReadingMetrics } from '../types';

/**
 * Calculate the power score for a tarot reading based on multiple factors:
 * - Major Arcana cards (significant life events)
 * - Court cards (influential people/energies)
 * - Suit patterns/trines (elemental harmony)
 * - Reversals (blocked/challenged energy)
 */
export function calculatePowerScore(cards: SelectedCard[]): number {
  if (!cards || cards.length === 0) return 0;

  let score = 0;

  // Factor 1: Major Arcana cards (+10 points each)
  // Major Arcana represents significant life events and spiritual lessons
  const majorArcanaCards = cards.filter(c => c.card.arcana === 'major');
  const majorArcanaCount = majorArcanaCards.length;
  score += majorArcanaCount * 10;

  // Factor 2: Court Cards (+5 points each)
  // Court cards represent influential people or aspects of personality
  const courtCardNames = ['Page', 'Knight', 'Queen', 'King'];
  const courtCards = cards.filter(c =>
    courtCardNames.some(courtName => c.card.name.includes(courtName))
  );
  const courtCardCount = courtCards.length;
  score += courtCardCount * 5;

  // Factor 3: Suit Patterns (Trines)
  // When 3 or more cards share the same suit, it indicates strong elemental energy
  const suitCounts = cards.reduce((acc, card) => {
    if (card.card.suit) {
      acc[card.card.suit] = (acc[card.card.suit] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const trines = Object.values(suitCounts).filter(count => count >= 3).length;
  const suitPatternScore = trines * 15; // +15 points per trine
  score += suitPatternScore;

  // Factor 4: Reversals (challenges and blocks)
  // Reversed cards indicate blocked or challenged energy (-2 points each)
  const reversedCards = cards.filter(c => c.isReversed);
  const reversalCount = reversedCards.length;
  score -= reversalCount * 2;

  // Normalize score to 0-100 range
  // Base score can theoretically go higher, but we cap at 100 for consistency
  const normalizedScore = Math.max(0, Math.min(100, score));

  return Math.round(normalizedScore);
}

/**
 * Calculate all metrics for a reading
 */
export function calculateReadingMetrics(cards: SelectedCard[]): ReadingMetrics {
  if (!cards || cards.length === 0) {
    return {
      power_score: 0,
      major_arcana_count: 0,
      court_card_count: 0,
      suit_pattern_score: 0,
      reversal_percentage: 0,
    };
  }

  // Count Major Arcana
  const majorArcanaCount = cards.filter(c => c.card.arcana === 'major').length;

  // Count Court Cards
  const courtCardNames = ['Page', 'Knight', 'Queen', 'King'];
  const courtCardCount = cards.filter(c =>
    courtCardNames.some(courtName => c.card.name.includes(courtName))
  ).length;

  // Calculate suit patterns (trines)
  const suitCounts = cards.reduce((acc, card) => {
    if (card.card.suit) {
      acc[card.card.suit] = (acc[card.card.suit] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const trines = Object.values(suitCounts).filter(count => count >= 3).length;
  const suitPatternScore = trines;

  // Calculate reversal percentage
  const reversedCount = cards.filter(c => c.isReversed).length;
  const reversalPercentage = (reversedCount / cards.length) * 100;

  // Calculate overall power score
  const powerScore = calculatePowerScore(cards);

  return {
    power_score: powerScore,
    major_arcana_count: majorArcanaCount,
    court_card_count: courtCardCount,
    suit_pattern_score: suitPatternScore,
    reversal_percentage: Math.round(reversalPercentage * 10) / 10, // Round to 1 decimal
  };
}

/**
 * Get a textual description of the power level
 */
export function getPowerLevelDescription(powerScore: number): string {
  if (powerScore >= 80) return 'Exceptionally Powerful';
  if (powerScore >= 60) return 'Strong';
  if (powerScore >= 40) return 'Moderate';
  if (powerScore >= 20) return 'Subtle';
  return 'Gentle';
}

/**
 * Get insights about the reading based on metrics
 */
export function getReadingInsights(metrics: ReadingMetrics): string[] {
  const insights: string[] = [];

  if (metrics.major_arcana_count >= 3) {
    insights.push('Heavy presence of Major Arcana indicates significant life events or spiritual lessons.');
  }

  if (metrics.court_card_count >= 2) {
    insights.push('Multiple Court cards suggest influential people or important personality aspects at play.');
  }

  if (metrics.suit_pattern_score > 0) {
    insights.push(`Strong elemental energy with ${metrics.suit_pattern_score} suit pattern(s) (trines).`);
  }

  if (metrics.reversal_percentage > 50) {
    insights.push('High number of reversals suggests challenges or blocks requiring attention.');
  } else if (metrics.reversal_percentage === 0) {
    insights.push('All cards upright - energy is flowing freely and unobstructed.');
  }

  if (insights.length === 0) {
    insights.push('A balanced reading with varied energies and perspectives.');
  }

  return insights;
}
