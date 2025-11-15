export type SpreadType = 'single' | 'three-card' | 'celtic-cross';

export interface Spread {
  id: SpreadType;
  name: string;
  cardCount: number;
  description: string;
  positions: string[];
}

export interface SelectedCard {
  card: {
    id: string;
    name: string;
    suit?: 'wands' | 'cups' | 'swords' | 'pentacles' | string;
    arcana: string;
    keywords: string[];
    upright_meaning: string;
    reversed_meaning: string;
    image_url?: string;
    celtic_upright?: string;
    celtic_reversed?: string;
    celtic_keywords?: string[];
    celtic_mythology?: string;
  };
  position: string;
  positionIndex: number;
  isReversed: boolean;
}

export interface Reading {
  spread: SpreadType;
  question?: string;
  cards: SelectedCard[];
  interpretation?: string;
  timestamp: number;
}

export type Sentiment = 'positive' | 'neutral' | 'negative';

export interface SavedReading {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  title?: string;
  spread_type: SpreadType;
  question?: string;
  cards: SelectedCard[];
  interpretation?: string;
  is_public: boolean;
  reading_source: 'personal' | 'daily';
  notes?: string;
  // Analytics fields
  accuracy_rating?: number; // 1-5
  sentiment?: Sentiment;
  outcome_notes?: string;
  reviewed_at?: string;
  power_score?: number;
  major_arcana_count?: number;
  court_card_count?: number;
  suit_pattern_score?: number;
  reversal_percentage?: number;
  tags?: string[];
}

export interface SaveReadingInput {
  title?: string;
  spread_type: SpreadType;
  question?: string;
  cards: SelectedCard[];
  interpretation?: string;
  is_public?: boolean;
  reading_source?: 'personal' | 'daily';
  notes?: string;
  accuracy_rating?: number;
  sentiment?: Sentiment;
  outcome_notes?: string;
  tags?: string[];
}

export interface ReadingMetrics {
  power_score: number;
  major_arcana_count: number;
  court_card_count: number;
  suit_pattern_score: number;
  reversal_percentage: number;
}

export interface CelticFestival {
  id: string;
  name: string;
  date: Date;
  description: string;
  season: 'spring' | 'summer' | 'autumn' | 'winter';
}

export interface ReadingAnalyticsData {
  totalReadings: number;
  averageAccuracy: number;
  averagePowerScore: number;
  mostCommonSentiment: Sentiment;
  readingsByMonth: { month: string; count: number }[];
  readingsByFestival: { festival: string; count: number }[];
  cardFrequency: { card: string; count: number }[];
  spreadTypeDistribution: { type: SpreadType; count: number }[];
}

export type AppScreen = 'landing' | 'spread-selection' | 'question-input' | 'card-selection' | 'reading-display' | 'admin';
