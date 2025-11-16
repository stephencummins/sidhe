import type { SavedReading } from '../types';

// Demo readings for analytics showcase
// These use public reading IDs that should exist in your database
export const demoReadings: SavedReading[] = [
  {
    id: 'demo-1',
    user_id: 'demo-user',
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-15T10:00:00Z',
    title: 'New Year Intentions',
    question: 'What energy should I focus on this year?',
    spread_type: 'three-card',
    cards: [
      { card: { name: 'The Fool', arcana: 'major' }, position: 'Past', isReversed: false },
      { card: { name: 'The Star', arcana: 'major' }, position: 'Present', isReversed: false },
      { card: { name: 'Ace of Spring', arcana: 'minor', suit: 'spring' }, position: 'Future', isReversed: false }
    ],
    interpretation: 'A powerful reading showing new beginnings and hope.',
    is_public: true,
    accuracy_rating: 5,
    sentiment: 'positive',
    power_score: 85,
    major_arcana_count: 2,
    court_card_count: 0,
    suit_pattern_score: 0,
    reversal_percentage: 0,
    tags: ['new-year', 'intentions', 'powerful']
  },
  {
    id: 'demo-2',
    user_id: 'demo-user',
    created_at: '2025-03-20T07:15:00Z',
    updated_at: '2025-03-20T07:15:00Z',
    title: 'Spring Equinox Balance',
    question: 'Where do I need more balance?',
    spread_type: 'three-card',
    cards: [
      { card: { name: 'Justice', arcana: 'major' }, position: 'Past', isReversed: false },
      { card: { name: 'Two of Pentacles', arcana: 'minor', suit: 'pentacles' }, position: 'Present', isReversed: true },
      { card: { name: 'Temperance', arcana: 'major' }, position: 'Future', isReversed: false }
    ],
    interpretation: 'Strong message about finding equilibrium in work-life balance.',
    is_public: true,
    accuracy_rating: 5,
    sentiment: 'neutral',
    power_score: 90,
    major_arcana_count: 3,
    court_card_count: 0,
    suit_pattern_score: 0,
    reversal_percentage: 33.33,
    tags: ['balance', 'equinox', 'spring']
  },
  {
    id: 'demo-3',
    user_id: 'demo-user',
    created_at: '2025-05-01T08:00:00Z',
    updated_at: '2025-05-01T08:00:00Z',
    title: 'Beltane Abundance',
    question: 'What is growing in my life?',
    spread_type: 'single',
    cards: [
      { card: { name: 'Ace of Pentacles', arcana: 'minor', suit: 'pentacles' }, position: 'Single', isReversed: false }
    ],
    interpretation: 'New financial opportunity emerging.',
    is_public: true,
    accuracy_rating: 4,
    sentiment: 'positive',
    power_score: 45,
    major_arcana_count: 0,
    court_card_count: 0,
    suit_pattern_score: 0,
    reversal_percentage: 0,
    tags: ['beltane', 'abundance', 'prosperity']
  },
  {
    id: 'demo-4',
    user_id: 'demo-user',
    created_at: '2025-06-21T12:00:00Z',
    updated_at: '2025-06-21T12:00:00Z',
    title: 'Summer Solstice Peak',
    question: 'What is at its peak in my life?',
    spread_type: 'three-card',
    cards: [
      { card: { name: 'The Sun', arcana: 'major' }, position: 'Past', isReversed: false },
      { card: { name: 'Nine of Cups', arcana: 'minor', suit: 'cups' }, position: 'Present', isReversed: false },
      { card: { name: 'The World', arcana: 'major' }, position: 'Future', isReversed: false }
    ],
    interpretation: 'Incredibly positive reading showing achievement and fulfillment.',
    is_public: true,
    accuracy_rating: 5,
    sentiment: 'positive',
    power_score: 95,
    major_arcana_count: 3,
    court_card_count: 0,
    suit_pattern_score: 0,
    reversal_percentage: 0,
    tags: ['solstice', 'summer', 'success', 'peak']
  },
  {
    id: 'demo-5',
    user_id: 'demo-user',
    created_at: '2025-08-01T09:45:00Z',
    updated_at: '2025-08-01T09:45:00Z',
    title: 'First Harvest',
    question: 'What am I harvesting from my efforts?',
    spread_type: 'three-card',
    cards: [
      { card: { name: 'Seven of Pentacles', arcana: 'minor', suit: 'pentacles' }, position: 'Past', isReversed: false },
      { card: { name: 'Nine of Pentacles', arcana: 'minor', suit: 'pentacles' }, position: 'Present', isReversed: false },
      { card: { name: 'Ten of Pentacles', arcana: 'minor', suit: 'pentacles' }, position: 'Future', isReversed: false }
    ],
    interpretation: 'Perfect harvest reading - three pentacles showing material growth.',
    is_public: true,
    accuracy_rating: 5,
    sentiment: 'positive',
    power_score: 60,
    major_arcana_count: 0,
    court_card_count: 0,
    suit_pattern_score: 15,
    reversal_percentage: 0,
    tags: ['harvest', 'lughnasadh', 'reward', 'pentacles']
  },
  {
    id: 'demo-6',
    user_id: 'demo-user',
    created_at: '2025-10-31T23:59:00Z',
    updated_at: '2025-10-31T23:59:00Z',
    title: 'Samhain Ancestors',
    question: 'What wisdom do my ancestors offer?',
    spread_type: 'three-card',
    cards: [
      { card: { name: 'The Hermit', arcana: 'major' }, position: 'Past', isReversed: false },
      { card: { name: 'Six of Cups', arcana: 'minor', suit: 'cups' }, position: 'Present', isReversed: false },
      { card: { name: 'Queen of Pentacles', arcana: 'minor', suit: 'pentacles' }, position: 'Future', isReversed: false }
    ],
    interpretation: 'Ancestral wisdom about nurturing and grounding.',
    is_public: true,
    accuracy_rating: 5,
    sentiment: 'positive',
    power_score: 65,
    major_arcana_count: 1,
    court_card_count: 1,
    suit_pattern_score: 0,
    reversal_percentage: 0,
    tags: ['samhain', 'ancestors', 'wisdom']
  }
];
