import { Spread } from '../types';

export const spreads: Spread[] = [
  {
    id: 'single',
    name: 'Single Card',
    cardCount: 1,
    description: 'Daily Guidance - Quick insight for your day',
    positions: ['Your Guidance']
  },
  {
    id: 'three-card',
    name: 'Three Card Spread',
    cardCount: 3,
    description: 'Past-Present-Future - Understand your journey',
    positions: ['Past', 'Present', 'Future']
  },
  {
    id: 'celtic-cross',
    name: 'Celtic Cross',
    cardCount: 10,
    description: 'Comprehensive 10-card reading for deep insights',
    positions: [
      'Present Situation',
      'Challenge',
      'Distant Past',
      'Recent Past',
      'Best Outcome',
      'Immediate Future',
      'Your Approach',
      'External Influences',
      'Hopes and Fears',
      'Final Outcome'
    ]
  }
];
