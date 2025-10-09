export interface TarotCard {
  id: string;
  name: string;
  suit?: 'wands' | 'cups' | 'swords' | 'pentacles';
  arcana: 'major' | 'minor';
  keywords: string[];
  upright_meaning: string;
}

const majorArcana: TarotCard[] = [
  { id: '0', name: 'The Fool', arcana: 'major', keywords: ['new beginnings', 'innocence', 'spontaneity', 'free spirit'], upright_meaning: 'New beginnings, optimism, trust in life' },
  { id: '1', name: 'The Magician', arcana: 'major', keywords: ['manifestation', 'resourcefulness', 'power', 'inspired action'], upright_meaning: 'Manifestation, resourcefulness, power, inspired action' },
  { id: '2', name: 'The High Priestess', arcana: 'major', keywords: ['intuition', 'sacred knowledge', 'divine feminine', 'subconscious'], upright_meaning: 'Intuition, sacred knowledge, divine feminine, the subconscious mind' },
  { id: '3', name: 'The Empress', arcana: 'major', keywords: ['femininity', 'beauty', 'nature', 'abundance'], upright_meaning: 'Femininity, beauty, nature, nurturing, abundance' },
  { id: '4', name: 'The Emperor', arcana: 'major', keywords: ['authority', 'establishment', 'structure', 'father figure'], upright_meaning: 'Authority, establishment, structure, a father figure' },
  { id: '5', name: 'The Hierophant', arcana: 'major', keywords: ['spiritual wisdom', 'tradition', 'conformity', 'institutions'], upright_meaning: 'Spiritual wisdom, religious beliefs, conformity, tradition' },
  { id: '6', name: 'The Lovers', arcana: 'major', keywords: ['love', 'harmony', 'relationships', 'values alignment'], upright_meaning: 'Love, harmony, relationships, values alignment, choices' },
  { id: '7', name: 'The Chariot', arcana: 'major', keywords: ['control', 'willpower', 'success', 'determination'], upright_meaning: 'Control, willpower, success, action, determination' },
  { id: '8', name: 'Strength', arcana: 'major', keywords: ['courage', 'persuasion', 'influence', 'compassion'], upright_meaning: 'Strength, courage, persuasion, influence, compassion' },
  { id: '9', name: 'The Hermit', arcana: 'major', keywords: ['soul searching', 'introspection', 'inner guidance', 'solitude'], upright_meaning: 'Soul searching, introspection, being alone, inner guidance' },
  { id: '10', name: 'Wheel of Fortune', arcana: 'major', keywords: ['good luck', 'karma', 'life cycles', 'destiny'], upright_meaning: 'Good luck, karma, life cycles, destiny, a turning point' },
  { id: '11', name: 'Justice', arcana: 'major', keywords: ['justice', 'fairness', 'truth', 'cause and effect'], upright_meaning: 'Justice, fairness, truth, cause and effect, law' },
  { id: '12', name: 'The Hanged Man', arcana: 'major', keywords: ['pause', 'surrender', 'letting go', 'new perspective'], upright_meaning: 'Pause, surrender, letting go, new perspectives' },
  { id: '13', name: 'Death', arcana: 'major', keywords: ['endings', 'change', 'transformation', 'transition'], upright_meaning: 'Endings, change, transformation, transition' },
  { id: '14', name: 'Temperance', arcana: 'major', keywords: ['balance', 'moderation', 'patience', 'purpose'], upright_meaning: 'Balance, moderation, patience, purpose' },
  { id: '15', name: 'The Devil', arcana: 'major', keywords: ['shadow self', 'attachment', 'addiction', 'restriction'], upright_meaning: 'Shadow self, attachment, addiction, restriction, sexuality' },
  { id: '16', name: 'The Tower', arcana: 'major', keywords: ['sudden change', 'upheaval', 'chaos', 'revelation'], upright_meaning: 'Sudden change, upheaval, chaos, revelation, awakening' },
  { id: '17', name: 'The Star', arcana: 'major', keywords: ['hope', 'faith', 'purpose', 'renewal'], upright_meaning: 'Hope, faith, purpose, renewal, spirituality' },
  { id: '18', name: 'The Moon', arcana: 'major', keywords: ['illusion', 'fear', 'anxiety', 'subconscious'], upright_meaning: 'Illusion, fear, anxiety, subconscious, intuition' },
  { id: '19', name: 'The Sun', arcana: 'major', keywords: ['positivity', 'fun', 'warmth', 'success'], upright_meaning: 'Positivity, fun, warmth, success, vitality' },
  { id: '20', name: 'Judgement', arcana: 'major', keywords: ['judgement', 'rebirth', 'inner calling', 'absolution'], upright_meaning: 'Judgement, rebirth, inner calling, absolution' },
  { id: '21', name: 'The World', arcana: 'major', keywords: ['completion', 'integration', 'accomplishment', 'travel'], upright_meaning: 'Completion, integration, accomplishment, travel' }
];

const minorArcana: TarotCard[] = [
  // Wands
  { id: 'wands-ace', name: 'Ace of Wands', suit: 'wands', arcana: 'minor', keywords: ['inspiration', 'new opportunities', 'growth', 'potential'], upright_meaning: 'Inspiration, new opportunities, growth, potential' },
  { id: 'wands-2', name: 'Two of Wands', suit: 'wands', arcana: 'minor', keywords: ['planning', 'decisions', 'progress', 'discovery'], upright_meaning: 'Future planning, progress, decisions, discovery' },
  { id: 'wands-3', name: 'Three of Wands', suit: 'wands', arcana: 'minor', keywords: ['expansion', 'foresight', 'overseas opportunities', 'leadership'], upright_meaning: 'Progress, expansion, foresight, overseas opportunities' },
  { id: 'wands-4', name: 'Four of Wands', suit: 'wands', arcana: 'minor', keywords: ['celebration', 'joy', 'harmony', 'homecoming'], upright_meaning: 'Celebration, joy, harmony, relaxation, homecoming' },
  { id: 'wands-5', name: 'Five of Wands', suit: 'wands', arcana: 'minor', keywords: ['conflict', 'competition', 'tension', 'diversity'], upright_meaning: 'Conflict, disagreements, competition, tension' },
  { id: 'wands-6', name: 'Six of Wands', suit: 'wands', arcana: 'minor', keywords: ['success', 'public recognition', 'victory', 'self-confidence'], upright_meaning: 'Success, public recognition, progress, self-confidence' },
  { id: 'wands-7', name: 'Seven of Wands', suit: 'wands', arcana: 'minor', keywords: ['challenge', 'perseverance', 'defense', 'maintaining control'], upright_meaning: 'Challenge, competition, protection, perseverance' },
  { id: 'wands-8', name: 'Eight of Wands', suit: 'wands', arcana: 'minor', keywords: ['movement', 'speed', 'progress', 'quick decisions'], upright_meaning: 'Movement, fast paced change, action, alignment' },
  { id: 'wands-9', name: 'Nine of Wands', suit: 'wands', arcana: 'minor', keywords: ['resilience', 'courage', 'persistence', 'boundaries'], upright_meaning: 'Resilience, courage, persistence, test of faith' },
  { id: 'wands-10', name: 'Ten of Wands', suit: 'wands', arcana: 'minor', keywords: ['burden', 'responsibility', 'hard work', 'stress'], upright_meaning: 'Burden, extra responsibility, hard work, completion' },
  { id: 'wands-page', name: 'Page of Wands', suit: 'wands', arcana: 'minor', keywords: ['inspiration', 'ideas', 'discovery', 'free spirit'], upright_meaning: 'Inspiration, ideas, discovery, limitless potential' },
  { id: 'wands-knight', name: 'Knight of Wands', suit: 'wands', arcana: 'minor', keywords: ['energy', 'passion', 'adventure', 'impulsiveness'], upright_meaning: 'Energy, passion, inspired action, adventure' },
  { id: 'wands-queen', name: 'Queen of Wands', suit: 'wands', arcana: 'minor', keywords: ['courage', 'determination', 'independence', 'vibrancy'], upright_meaning: 'Courage, confidence, independence, social butterfly' },
  { id: 'wands-king', name: 'King of Wands', suit: 'wands', arcana: 'minor', keywords: ['natural leader', 'vision', 'entrepreneur', 'honor'], upright_meaning: 'Natural-born leader, vision, entrepreneur, honour' },

  // Cups
  { id: 'cups-ace', name: 'Ace of Cups', suit: 'cups', arcana: 'minor', keywords: ['love', 'new relationships', 'compassion', 'creativity'], upright_meaning: 'Love, new relationships, compassion, creativity' },
  { id: 'cups-2', name: 'Two of Cups', suit: 'cups', arcana: 'minor', keywords: ['unified love', 'partnership', 'mutual attraction', 'connection'], upright_meaning: 'Unified love, partnership, mutual attraction' },
  { id: 'cups-3', name: 'Three of Cups', suit: 'cups', arcana: 'minor', keywords: ['celebration', 'friendship', 'creativity', 'community'], upright_meaning: 'Celebration, friendship, creativity, collaborations' },
  { id: 'cups-4', name: 'Four of Cups', suit: 'cups', arcana: 'minor', keywords: ['meditation', 'contemplation', 'apathy', 'reevaluation'], upright_meaning: 'Meditation, contemplation, apathy, reevaluation' },
  { id: 'cups-5', name: 'Five of Cups', suit: 'cups', arcana: 'minor', keywords: ['regret', 'failure', 'disappointment', 'pessimism'], upright_meaning: 'Regret, failure, disappointment, pessimism' },
  { id: 'cups-6', name: 'Six of Cups', suit: 'cups', arcana: 'minor', keywords: ['revisiting the past', 'childhood memories', 'innocence', 'joy'], upright_meaning: 'Revisiting the past, childhood memories, innocence' },
  { id: 'cups-7', name: 'Seven of Cups', suit: 'cups', arcana: 'minor', keywords: ['opportunities', 'choices', 'wishful thinking', 'illusion'], upright_meaning: 'Opportunities, choices, wishful thinking, illusion' },
  { id: 'cups-8', name: 'Eight of Cups', suit: 'cups', arcana: 'minor', keywords: ['disappointment', 'abandonment', 'withdrawal', 'escape'], upright_meaning: 'Disappointment, abandonment, withdrawal, searching' },
  { id: 'cups-9', name: 'Nine of Cups', suit: 'cups', arcana: 'minor', keywords: ['contentment', 'satisfaction', 'gratitude', 'wish come true'], upright_meaning: 'Contentment, satisfaction, gratitude, wish come true' },
  { id: 'cups-10', name: 'Ten of Cups', suit: 'cups', arcana: 'minor', keywords: ['divine love', 'harmony', 'alignment', 'happiness'], upright_meaning: 'Divine love, blissful relationships, harmony, alignment' },
  { id: 'cups-page', name: 'Page of Cups', suit: 'cups', arcana: 'minor', keywords: ['creative opportunities', 'curiosity', 'intuitive messages', 'possibility'], upright_meaning: 'Creative opportunities, intuitive messages, curiosity' },
  { id: 'cups-knight', name: 'Knight of Cups', suit: 'cups', arcana: 'minor', keywords: ['creativity', 'romance', 'charm', 'imagination'], upright_meaning: 'Creativity, romance, charm, imagination, beauty' },
  { id: 'cups-queen', name: 'Queen of Cups', suit: 'cups', arcana: 'minor', keywords: ['compassion', 'calm', 'comfort', 'intuition'], upright_meaning: 'Compassionate, caring, emotionally stable, intuitive' },
  { id: 'cups-king', name: 'King of Cups', suit: 'cups', arcana: 'minor', keywords: ['emotional balance', 'control', 'generosity', 'diplomacy'], upright_meaning: 'Emotionally balanced, compassionate, diplomatic' },

  // Swords
  { id: 'swords-ace', name: 'Ace of Swords', suit: 'swords', arcana: 'minor', keywords: ['breakthrough', 'clarity', 'sharp mind', 'new ideas'], upright_meaning: 'Breakthroughs, new ideas, mental clarity, success' },
  { id: 'swords-2', name: 'Two of Swords', suit: 'swords', arcana: 'minor', keywords: ['difficult decisions', 'stalemate', 'avoidance', 'blocked emotions'], upright_meaning: 'Difficult decisions, weighing options, stalemate' },
  { id: 'swords-3', name: 'Three of Swords', suit: 'swords', arcana: 'minor', keywords: ['heartbreak', 'emotional pain', 'sorrow', 'grief'], upright_meaning: 'Heartbreak, emotional pain, sorrow, grief, hurt' },
  { id: 'swords-4', name: 'Four of Swords', suit: 'swords', arcana: 'minor', keywords: ['rest', 'recovery', 'contemplation', 'relaxation'], upright_meaning: 'Rest, relaxation, meditation, contemplation, recovery' },
  { id: 'swords-5', name: 'Five of Swords', suit: 'swords', arcana: 'minor', keywords: ['conflict', 'defeat', 'tension', 'loss'], upright_meaning: 'Conflict, disagreements, competition, defeat, loss' },
  { id: 'swords-6', name: 'Six of Swords', suit: 'swords', arcana: 'minor', keywords: ['transition', 'change', 'moving on', 'release'], upright_meaning: 'Transition, change, rite of passage, releasing baggage' },
  { id: 'swords-7', name: 'Seven of Swords', suit: 'swords', arcana: 'minor', keywords: ['betrayal', 'deception', 'strategy', 'stealth'], upright_meaning: 'Betrayal, deception, getting away with something' },
  { id: 'swords-8', name: 'Eight of Swords', suit: 'swords', arcana: 'minor', keywords: ['isolation', 'restriction', 'self-imposed', 'victim mentality'], upright_meaning: 'Negative thoughts, self-imposed restriction, imprisonment' },
  { id: 'swords-9', name: 'Nine of Swords', suit: 'swords', arcana: 'minor', keywords: ['anxiety', 'worry', 'fear', 'nightmares'], upright_meaning: 'Anxiety, worry, fear, depression, nightmares' },
  { id: 'swords-10', name: 'Ten of Swords', suit: 'swords', arcana: 'minor', keywords: ['painful endings', 'loss', 'crisis', 'hitting rock bottom'], upright_meaning: 'Painful endings, deep wounds, betrayal, loss, crisis' },
  { id: 'swords-page', name: 'Page of Swords', suit: 'swords', arcana: 'minor', keywords: ['curiosity', 'restlessness', 'mental energy', 'vigilance'], upright_meaning: 'New ideas, curiosity, thirst for knowledge, new ways' },
  { id: 'swords-knight', name: 'Knight of Swords', suit: 'swords', arcana: 'minor', keywords: ['ambitious', 'action-oriented', 'driven', 'assertive'], upright_meaning: 'Ambitious, action-oriented, driven to succeed, fast' },
  { id: 'swords-queen', name: 'Queen of Swords', suit: 'swords', arcana: 'minor', keywords: ['independent', 'unbiased judgement', 'clear boundaries', 'direct'], upright_meaning: 'Independent, unbiased judgement, clear boundaries' },
  { id: 'swords-king', name: 'King of Swords', suit: 'swords', arcana: 'minor', keywords: ['intellectual power', 'authority', 'truth', 'clear thinking'], upright_meaning: 'Mental clarity, intellectual power, authority, truth' },

  // Pentacles
  { id: 'pentacles-ace', name: 'Ace of Pentacles', suit: 'pentacles', arcana: 'minor', keywords: ['opportunity', 'prosperity', 'new venture', 'manifestation'], upright_meaning: 'A new financial or career opportunity, manifestation' },
  { id: 'pentacles-2', name: 'Two of Pentacles', suit: 'pentacles', arcana: 'minor', keywords: ['balance', 'adaptability', 'time management', 'prioritization'], upright_meaning: 'Multiple priorities, time management, prioritisation' },
  { id: 'pentacles-3', name: 'Three of Pentacles', suit: 'pentacles', arcana: 'minor', keywords: ['teamwork', 'collaboration', 'learning', 'implementation'], upright_meaning: 'Teamwork, collaboration, learning, implementation' },
  { id: 'pentacles-4', name: 'Four of Pentacles', suit: 'pentacles', arcana: 'minor', keywords: ['saving money', 'security', 'conservatism', 'control'], upright_meaning: 'Saving money, security, conservatism, scarcity' },
  { id: 'pentacles-5', name: 'Five of Pentacles', suit: 'pentacles', arcana: 'minor', keywords: ['financial loss', 'poverty', 'lack mindset', 'isolation'], upright_meaning: 'Financial loss, poverty, lack mindset, isolation' },
  { id: 'pentacles-6', name: 'Six of Pentacles', suit: 'pentacles', arcana: 'minor', keywords: ['giving', 'receiving', 'sharing wealth', 'generosity'], upright_meaning: 'Giving, receiving, sharing wealth, generosity' },
  { id: 'pentacles-7', name: 'Seven of Pentacles', suit: 'pentacles', arcana: 'minor', keywords: ['long-term view', 'sustainable results', 'perseverance', 'investment'], upright_meaning: 'Long-term view, sustainable results, perseverance' },
  { id: 'pentacles-8', name: 'Eight of Pentacles', suit: 'pentacles', arcana: 'minor', keywords: ['apprenticeship', 'skill development', 'quality', 'craftsmanship'], upright_meaning: 'Apprenticeship, repetitive tasks, mastery, skill' },
  { id: 'pentacles-9', name: 'Nine of Pentacles', suit: 'pentacles', arcana: 'minor', keywords: ['abundance', 'luxury', 'self-sufficiency', 'financial independence'], upright_meaning: 'Abundance, luxury, self-sufficiency, financial independence' },
  { id: 'pentacles-10', name: 'Ten of Pentacles', suit: 'pentacles', arcana: 'minor', keywords: ['wealth', 'financial security', 'family', 'legacy'], upright_meaning: 'Wealth, financial security, family, long-term success' },
  { id: 'pentacles-page', name: 'Page of Pentacles', suit: 'pentacles', arcana: 'minor', keywords: ['manifestation', 'financial opportunity', 'skill development', 'ambition'], upright_meaning: 'Manifestation, financial opportunity, new job' },
  { id: 'pentacles-knight', name: 'Knight of Pentacles', suit: 'pentacles', arcana: 'minor', keywords: ['hard work', 'productivity', 'routine', 'conservatism'], upright_meaning: 'Hard work, productivity, routine, conservatism' },
  { id: 'pentacles-queen', name: 'Queen of Pentacles', suit: 'pentacles', arcana: 'minor', keywords: ['nurturing', 'practical', 'abundance', 'down-to-earth'], upright_meaning: 'Nurturing, practical, providing, working parent' },
  { id: 'pentacles-king', name: 'King of Pentacles', suit: 'pentacles', arcana: 'minor', keywords: ['wealth', 'business', 'leadership', 'security'], upright_meaning: 'Wealth, business, leadership, security, abundance' }
];

export const tarotDeck: TarotCard[] = [...majorArcana, ...minorArcana];

export const shuffleDeck = (deck: TarotCard[] = tarotDeck): TarotCard[] => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
