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
    suit?: string;
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

export type AppScreen = 'landing' | 'spread-selection' | 'question-input' | 'card-selection' | 'reading-display' | 'admin';
