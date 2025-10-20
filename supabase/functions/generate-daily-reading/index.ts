import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface TarotCard {
  id: string;
  name: string;
  suit?: string;
  arcana: string;
  keywords: string[];
  upright_meaning: string;
  reversed_meaning: string;
  celtic_upright?: string;
  celtic_reversed?: string;
  celtic_mythology?: string;
}

interface RequestBody {
  meaningType?: 'traditional' | 'celtic';
  question?: string;
}

// Complete tarot deck (78 cards)
const tarotDeck: TarotCard[] = [
  // Major Arcana
  { id: '0', name: 'The Fool', arcana: 'major', keywords: ['new beginnings', 'innocence', 'spontaneity', 'free spirit'], upright_meaning: 'New beginnings, optimism, trust in life', reversed_meaning: 'Recklessness, risk-taking, carelessness, naivety, foolishness' },
  { id: '1', name: 'The Magician', arcana: 'major', keywords: ['manifestation', 'resourcefulness', 'power', 'inspired action'], upright_meaning: 'Manifestation, resourcefulness, power, inspired action', reversed_meaning: 'Manipulation, poor planning, untapped talents, trickery' },
  { id: '2', name: 'The High Priestess', arcana: 'major', keywords: ['intuition', 'sacred knowledge', 'divine feminine', 'subconscious'], upright_meaning: 'Intuition, sacred knowledge, divine feminine, the subconscious mind', reversed_meaning: 'Secrets, disconnected from intuition, withdrawal, silence' },
  { id: '3', name: 'The Empress', arcana: 'major', keywords: ['femininity', 'beauty', 'nature', 'abundance'], upright_meaning: 'Femininity, beauty, nature, nurturing, abundance', reversed_meaning: 'Creative block, dependence on others, lack of growth' },
  { id: '4', name: 'The Emperor', arcana: 'major', keywords: ['authority', 'establishment', 'structure', 'father figure'], upright_meaning: 'Authority, establishment, structure, a father figure', reversed_meaning: 'Domination, excessive control, lack of discipline, rigidity' },
  { id: '5', name: 'The Hierophant', arcana: 'major', keywords: ['spiritual wisdom', 'tradition', 'conformity', 'institutions'], upright_meaning: 'Spiritual wisdom, religious beliefs, conformity, tradition', reversed_meaning: 'Rebellion, unconventional approaches, freedom, challenging the status quo' },
  { id: '6', name: 'The Lovers', arcana: 'major', keywords: ['love', 'harmony', 'relationships', 'values alignment'], upright_meaning: 'Love, harmony, relationships, values alignment, choices', reversed_meaning: 'Self-love, disharmony, imbalance, misalignment of values' },
  { id: '7', name: 'The Chariot', arcana: 'major', keywords: ['control', 'willpower', 'success', 'determination'], upright_meaning: 'Control, willpower, success, action, determination', reversed_meaning: 'Lack of control, lack of direction, aggression, opposition' },
  { id: '8', name: 'Strength', arcana: 'major', keywords: ['courage', 'persuasion', 'influence', 'compassion'], upright_meaning: 'Strength, courage, persuasion, influence, compassion', reversed_meaning: 'Self-doubt, weakness, insecurity, low confidence' },
  { id: '9', name: 'The Hermit', arcana: 'major', keywords: ['soul searching', 'introspection', 'inner guidance', 'solitude'], upright_meaning: 'Soul searching, introspection, being alone, inner guidance', reversed_meaning: 'Isolation, loneliness, withdrawal, losing your way' },
  { id: '10', name: 'Wheel of Fortune', arcana: 'major', keywords: ['good luck', 'karma', 'life cycles', 'destiny'], upright_meaning: 'Good luck, karma, life cycles, destiny, a turning point', reversed_meaning: 'Bad luck, resistance to change, breaking cycles' },
  { id: '11', name: 'Justice', arcana: 'major', keywords: ['justice', 'fairness', 'truth', 'cause and effect'], upright_meaning: 'Justice, fairness, truth, cause and effect, law', reversed_meaning: 'Unfairness, lack of accountability, dishonesty, injustice' },
  { id: '12', name: 'The Hanged Man', arcana: 'major', keywords: ['pause', 'surrender', 'letting go', 'new perspective'], upright_meaning: 'Pause, surrender, letting go, new perspectives', reversed_meaning: 'Delays, resistance, stalling, indecision' },
  { id: '13', name: 'Death', arcana: 'major', keywords: ['endings', 'change', 'transformation', 'transition'], upright_meaning: 'Endings, change, transformation, transition', reversed_meaning: 'Resistance to change, stagnation, fear of endings, personal transformation' },
  { id: '14', name: 'Temperance', arcana: 'major', keywords: ['balance', 'moderation', 'patience', 'purpose'], upright_meaning: 'Balance, moderation, patience, purpose', reversed_meaning: 'Imbalance, excess, self-healing, re-alignment' },
  { id: '15', name: 'The Devil', arcana: 'major', keywords: ['shadow self', 'attachment', 'addiction', 'restriction'], upright_meaning: 'Shadow self, attachment, addiction, restriction, sexuality', reversed_meaning: 'Releasing limiting beliefs, exploring dark thoughts, detachment' },
  { id: '16', name: 'The Tower', arcana: 'major', keywords: ['sudden change', 'upheaval', 'chaos', 'revelation'], upright_meaning: 'Sudden change, upheaval, chaos, revelation, awakening', reversed_meaning: 'Personal transformation, fear of change, averting disaster' },
  { id: '17', name: 'The Star', arcana: 'major', keywords: ['hope', 'faith', 'purpose', 'renewal'], upright_meaning: 'Hope, faith, purpose, renewal, spirituality', reversed_meaning: 'Lack of faith, despair, self-trust, disconnection' },
  { id: '18', name: 'The Moon', arcana: 'major', keywords: ['illusion', 'fear', 'anxiety', 'subconscious'], upright_meaning: 'Illusion, fear, anxiety, subconscious, intuition', reversed_meaning: 'Release of fear, repressed emotion, inner confusion' },
  { id: '19', name: 'The Sun', arcana: 'major', keywords: ['positivity', 'fun', 'warmth', 'success'], upright_meaning: 'Positivity, fun, warmth, success, vitality', reversed_meaning: 'Inner child, feeling down, overly optimistic' },
  { id: '20', name: 'Judgement', arcana: 'major', keywords: ['judgement', 'rebirth', 'inner calling', 'absolution'], upright_meaning: 'Judgement, rebirth, inner calling, absolution', reversed_meaning: 'Self-doubt, inner critic, ignoring the call, lack of self-awareness' },
  { id: '21', name: 'The World', arcana: 'major', keywords: ['completion', 'integration', 'accomplishment', 'travel'], upright_meaning: 'Completion, integration, accomplishment, travel', reversed_meaning: 'Seeking personal closure, short-cuts, delays, incompletion' },

  // Minor Arcana - Wands
  { id: 'wands-ace', name: 'Ace of Wands', suit: 'wands', arcana: 'minor', keywords: ['inspiration', 'new opportunities', 'growth', 'potential'], upright_meaning: 'Inspiration, new opportunities, growth, potential', reversed_meaning: 'Emerging spark, lack of direction, distractions, delays' },
  { id: 'wands-2', name: 'Two of Wands', suit: 'wands', arcana: 'minor', keywords: ['planning', 'decisions', 'progress', 'discovery'], upright_meaning: 'Future planning, progress, decisions, discovery', reversed_meaning: 'Personal goals, inner alignment, fear of unknown, lack of planning' },
  { id: 'wands-3', name: 'Three of Wands', suit: 'wands', arcana: 'minor', keywords: ['expansion', 'foresight', 'overseas opportunities', 'leadership'], upright_meaning: 'Progress, expansion, foresight, overseas opportunities', reversed_meaning: 'Playing small, lack of foresight, unexpected delays' },
  { id: 'wands-4', name: 'Four of Wands', suit: 'wands', arcana: 'minor', keywords: ['celebration', 'joy', 'harmony', 'homecoming'], upright_meaning: 'Celebration, joy, harmony, relaxation, homecoming', reversed_meaning: 'Personal celebration, inner harmony, conflict with others, transition' },
  { id: 'wands-5', name: 'Five of Wands', suit: 'wands', arcana: 'minor', keywords: ['conflict', 'competition', 'tension', 'diversity'], upright_meaning: 'Conflict, disagreements, competition, tension', reversed_meaning: 'Inner conflict, conflict avoidance, tension release' },
  { id: 'wands-6', name: 'Six of Wands', suit: 'wands', arcana: 'minor', keywords: ['success', 'public recognition', 'victory', 'self-confidence'], upright_meaning: 'Success, public recognition, progress, self-confidence', reversed_meaning: 'Private achievement, self-doubt, fall from grace, egotism' },
  { id: 'wands-7', name: 'Seven of Wands', suit: 'wands', arcana: 'minor', keywords: ['challenge', 'perseverance', 'defense', 'maintaining control'], upright_meaning: 'Challenge, competition, protection, perseverance', reversed_meaning: 'Exhaustion, giving up, overwhelmed, yielding' },
  { id: 'wands-8', name: 'Eight of Wands', suit: 'wands', arcana: 'minor', keywords: ['movement', 'speed', 'progress', 'quick decisions'], upright_meaning: 'Movement, fast paced change, action, alignment', reversed_meaning: 'Delays, frustration, resisting change, internal alignment' },
  { id: 'wands-9', name: 'Nine of Wands', suit: 'wands', arcana: 'minor', keywords: ['resilience', 'courage', 'persistence', 'boundaries'], upright_meaning: 'Resilience, courage, persistence, test of faith, boundaries', reversed_meaning: 'Inner resources, struggle, overwhelm, defensive' },
  { id: 'wands-10', name: 'Ten of Wands', suit: 'wands', arcana: 'minor', keywords: ['burden', 'responsibility', 'hard work', 'stress'], upright_meaning: 'Burden, extra responsibility, hard work, completion', reversed_meaning: 'Doing it all, carrying the burden, delegation, release' },
  { id: 'wands-page', name: 'Page of Wands', suit: 'wands', arcana: 'minor', keywords: ['inspiration', 'ideas', 'discovery', 'free spirit'], upright_meaning: 'Inspiration, ideas, discovery, limitless potential, free spirit', reversed_meaning: 'Newly-formed ideas, redirecting energy, self-limiting beliefs' },
  { id: 'wands-knight', name: 'Knight of Wands', suit: 'wands', arcana: 'minor', keywords: ['energy', 'passion', 'adventure', 'impulsiveness'], upright_meaning: 'Energy, passion, inspired action, adventure, impulsiveness', reversed_meaning: 'Passion project, haste, scattered energy, delays' },
  { id: 'wands-queen', name: 'Queen of Wands', suit: 'wands', arcana: 'minor', keywords: ['courage', 'confidence', 'independence', 'determination'], upright_meaning: 'Courage, confidence, independence, social butterfly, determination', reversed_meaning: 'Self-respect, self-confidence, introverted, re-establish' },
  { id: 'wands-king', name: 'King of Wands', suit: 'wands', arcana: 'minor', keywords: ['natural leader', 'vision', 'entrepreneur', 'honour'], upright_meaning: 'Natural-born leader, vision, entrepreneur, honour', reversed_meaning: 'Impulsiveness, haste, ruthless, high expectations' },

  // Minor Arcana - Cups
  { id: 'cups-ace', name: 'Ace of Cups', suit: 'cups', arcana: 'minor', keywords: ['love', 'new relationships', 'compassion', 'creativity'], upright_meaning: 'Love, new relationships, compassion, creativity', reversed_meaning: 'Self-love, intuition, repressed emotions' },
  { id: 'cups-2', name: 'Two of Cups', suit: 'cups', arcana: 'minor', keywords: ['unified love', 'partnership', 'mutual attraction', 'relationships'], upright_meaning: 'Unified love, partnership, mutual attraction, relationships', reversed_meaning: 'Self-love, break-ups, disharmony, distrust' },
  { id: 'cups-3', name: 'Three of Cups', suit: 'cups', arcana: 'minor', keywords: ['celebration', 'friendship', 'creativity', 'community'], upright_meaning: 'Celebration, friendship, creativity, collaborations', reversed_meaning: 'Independence, alone time, hardcore partying, three\'s a crowd' },
  { id: 'cups-4', name: 'Four of Cups', suit: 'cups', arcana: 'minor', keywords: ['meditation', 'contemplation', 'apathy', 'reevaluation'], upright_meaning: 'Meditation, contemplation, apathy, reevaluation', reversed_meaning: 'Retreat, withdrawal, checking in for alignment' },
  { id: 'cups-5', name: 'Five of Cups', suit: 'cups', arcana: 'minor', keywords: ['regret', 'failure', 'disappointment', 'pessimism'], upright_meaning: 'Regret, failure, disappointment, pessimism', reversed_meaning: 'Personal setbacks, self-forgiveness, moving on' },
  { id: 'cups-6', name: 'Six of Cups', suit: 'cups', arcana: 'minor', keywords: ['revisiting the past', 'childhood memories', 'innocence', 'joy'], upright_meaning: 'Revisiting the past, childhood memories, innocence, joy', reversed_meaning: 'Living in the past, forgiveness, lacking playfulness' },
  { id: 'cups-7', name: 'Seven of Cups', suit: 'cups', arcana: 'minor', keywords: ['opportunities', 'choices', 'wishful thinking', 'illusion'], upright_meaning: 'Opportunities, choices, wishful thinking, illusion', reversed_meaning: 'Alignment, personal values, overwhelmed by choices' },
  { id: 'cups-8', name: 'Eight of Cups', suit: 'cups', arcana: 'minor', keywords: ['disappointment', 'abandonment', 'withdrawal', 'escapism'], upright_meaning: 'Disappointment, abandonment, withdrawal, escapism', reversed_meaning: 'Trying one more time, indecision, aimless drifting' },
  { id: 'cups-9', name: 'Nine of Cups', suit: 'cups', arcana: 'minor', keywords: ['contentment', 'satisfaction', 'gratitude', 'wish come true'], upright_meaning: 'Contentment, satisfaction, gratitude, wish come true', reversed_meaning: 'Inner happiness, materialism, dissatisfaction, indulgence' },
  { id: 'cups-10', name: 'Ten of Cups', suit: 'cups', arcana: 'minor', keywords: ['divine love', 'blissful relationships', 'harmony', 'alignment'], upright_meaning: 'Divine love, blissful relationships, harmony, alignment', reversed_meaning: 'Disconnection, misaligned values, struggling relationships' },
  { id: 'cups-page', name: 'Page of Cups', suit: 'cups', arcana: 'minor', keywords: ['creative opportunities', 'curiosity', 'possibility', 'intuition'], upright_meaning: 'Creative opportunities, curiosity, possibility, intuitive messages', reversed_meaning: 'New ideas, doubting intuition, creative blocks, emotional immaturity' },
  { id: 'cups-knight', name: 'Knight of Cups', suit: 'cups', arcana: 'minor', keywords: ['creativity', 'romance', 'charm', 'imagination'], upright_meaning: 'Creativity, romance, charm, imagination, beauty', reversed_meaning: 'Overactive imagination, unrealistic, jealous, moody' },
  { id: 'cups-queen', name: 'Queen of Cups', suit: 'cups', arcana: 'minor', keywords: ['compassionate', 'caring', 'emotionally stable', 'intuitive'], upright_meaning: 'Compassionate, caring, emotionally stable, intuitive, in flow', reversed_meaning: 'Inner feelings, self-care, self-love, co-dependency' },
  { id: 'cups-king', name: 'King of Cups', suit: 'cups', arcana: 'minor', keywords: ['emotionally balanced', 'compassionate', 'diplomatic'], upright_meaning: 'Emotionally balanced, compassionate, diplomatic', reversed_meaning: 'Self-compassion, inner feelings, moodiness, emotionally manipulative' },

  // Minor Arcana - Swords
  { id: 'swords-ace', name: 'Ace of Swords', suit: 'swords', arcana: 'minor', keywords: ['breakthrough', 'clarity', 'sharp mind', 'success'], upright_meaning: 'Breakthrough, clarity, sharp mind, success', reversed_meaning: 'Confusion, brutality, chaos, lack of clarity' },
  { id: 'swords-2', name: 'Two of Swords', suit: 'swords', arcana: 'minor', keywords: ['difficult decisions', 'weighing options', 'stalemate'], upright_meaning: 'Difficult decisions, weighing up options, an impasse, avoidance', reversed_meaning: 'Indecision, confusion, information overload, stalemate' },
  { id: 'swords-3', name: 'Three of Swords', suit: 'swords', arcana: 'minor', keywords: ['heartbreak', 'emotional pain', 'sorrow', 'grief'], upright_meaning: 'Heartbreak, emotional pain, sorrow, grief, hurt', reversed_meaning: 'Negative self-talk, releasing pain, optimism, forgiveness' },
  { id: 'swords-4', name: 'Four of Swords', suit: 'swords', arcana: 'minor', keywords: ['rest', 'relaxation', 'meditation', 'contemplation'], upright_meaning: 'Rest, relaxation, meditation, contemplation, recuperation', reversed_meaning: 'Exhaustion, burn-out, deep contemplation, stagnation' },
  { id: 'swords-5', name: 'Five of Swords', suit: 'swords', arcana: 'minor', keywords: ['conflict', 'disagreements', 'competition', 'defeat'], upright_meaning: 'Conflict, disagreements, competition, defeat, winning at all costs', reversed_meaning: 'Reconciliation, making amends, past resentment' },
  { id: 'swords-6', name: 'Six of Swords', suit: 'swords', arcana: 'minor', keywords: ['transition', 'change', 'rite of passage', 'release'], upright_meaning: 'Transition, change, rite of passage, releasing baggage', reversed_meaning: 'Personal transition, resistance to change, unfinished business' },
  { id: 'swords-7', name: 'Seven of Swords', suit: 'swords', arcana: 'minor', keywords: ['betrayal', 'deception', 'getting away with something'], upright_meaning: 'Betrayal, deception, getting away with something, acting strategically', reversed_meaning: 'Imposter syndrome, self-deceit, keeping secrets' },
  { id: 'swords-8', name: 'Eight of Swords', suit: 'swords', arcana: 'minor', keywords: ['negative thoughts', 'self-imposed restriction', 'imprisonment'], upright_meaning: 'Negative thoughts, self-imposed restriction, imprisonment, victim mentality', reversed_meaning: 'Self-limiting beliefs, inner critic, releasing negative thoughts' },
  { id: 'swords-9', name: 'Nine of Swords', suit: 'swords', arcana: 'minor', keywords: ['anxiety', 'worry', 'fear', 'depression', 'nightmares'], upright_meaning: 'Anxiety, worry, fear, depression, nightmares', reversed_meaning: 'Inner turmoil, deep-seated fears, secrets, releasing worry' },
  { id: 'swords-10', name: 'Ten of Swords', suit: 'swords', arcana: 'minor', keywords: ['painful endings', 'deep wounds', 'betrayal', 'crisis'], upright_meaning: 'Painful endings, deep wounds, betrayal, loss, crisis', reversed_meaning: 'Recovery, regeneration, resisting an inevitable end' },
  { id: 'swords-page', name: 'Page of Swords', suit: 'swords', arcana: 'minor', keywords: ['new ideas', 'curiosity', 'thirst for knowledge', 'new ways'], upright_meaning: 'New ideas, curiosity, thirst for knowledge, new ways of communicating', reversed_meaning: 'Self-expression, all talk and no action, haphazard action' },
  { id: 'swords-knight', name: 'Knight of Swords', suit: 'swords', arcana: 'minor', keywords: ['ambitious', 'action-oriented', 'driven', 'fast thinking'], upright_meaning: 'Ambitious, action-oriented, driven to succeed, fast-thinking', reversed_meaning: 'Restless, unfocused, impulsive, burn-out' },
  { id: 'swords-queen', name: 'Queen of Swords', suit: 'swords', arcana: 'minor', keywords: ['independent', 'unbiased judgement', 'clear boundaries'], upright_meaning: 'Independent, unbiased judgement, clear boundaries, direct communication', reversed_meaning: 'Overly-emotional, easily influenced, bitchy, cold-hearted' },
  { id: 'swords-king', name: 'King of Swords', suit: 'swords', arcana: 'minor', keywords: ['mental clarity', 'intellectual power', 'authority', 'truth'], upright_meaning: 'Mental clarity, intellectual power, authority, truth', reversed_meaning: 'Quiet power, inner truth, misuse of power, manipulation' },

  // Minor Arcana - Pentacles
  { id: 'pentacles-ace', name: 'Ace of Pentacles', suit: 'pentacles', arcana: 'minor', keywords: ['opportunity', 'prosperity', 'new venture', 'manifestation'], upright_meaning: 'A new financial or career opportunity, manifestation, abundance', reversed_meaning: 'Lost opportunity, lack of planning, poor financial decisions' },
  { id: 'pentacles-2', name: 'Two of Pentacles', suit: 'pentacles', arcana: 'minor', keywords: ['multiple priorities', 'time management', 'prioritisation'], upright_meaning: 'Multiple priorities, time management, prioritisation, adaptability', reversed_meaning: 'Over-committed, disorganisation, reprioritisation' },
  { id: 'pentacles-3', name: 'Three of Pentacles', suit: 'pentacles', arcana: 'minor', keywords: ['teamwork', 'collaboration', 'learning', 'implementation'], upright_meaning: 'Teamwork, collaboration, learning, implementation', reversed_meaning: 'Disharmony, misalignment, working alone' },
  { id: 'pentacles-4', name: 'Four of Pentacles', suit: 'pentacles', arcana: 'minor', keywords: ['saving money', 'security', 'conservatism', 'scarcity'], upright_meaning: 'Saving money, security, conservatism, scarcity, control', reversed_meaning: 'Over-spending, greed, self-protection' },
  { id: 'pentacles-5', name: 'Five of Pentacles', suit: 'pentacles', arcana: 'minor', keywords: ['financial loss', 'poverty', 'lack mindset', 'isolation'], upright_meaning: 'Financial loss, poverty, lack mindset, isolation, worry', reversed_meaning: 'Recovery from financial loss, spiritual poverty' },
  { id: 'pentacles-6', name: 'Six of Pentacles', suit: 'pentacles', arcana: 'minor', keywords: ['giving', 'receiving', 'sharing wealth', 'generosity'], upright_meaning: 'Giving, receiving, sharing wealth, generosity, charity', reversed_meaning: 'Self-care, unpaid debts, one-sided charity' },
  { id: 'pentacles-7', name: 'Seven of Pentacles', suit: 'pentacles', arcana: 'minor', keywords: ['long-term view', 'sustainable results', 'perseverance'], upright_meaning: 'Long-term view, sustainable results, perseverance, investment', reversed_meaning: 'Lack of long-term vision, limited success, question investments' },
  { id: 'pentacles-8', name: 'Eight of Pentacles', suit: 'pentacles', arcana: 'minor', keywords: ['apprenticeship', 'repetitive tasks', 'mastery', 'skill'], upright_meaning: 'Apprenticeship, repetitive tasks, mastery, skill development', reversed_meaning: 'Self-development, perfectionism, misdirected activity' },
  { id: 'pentacles-9', name: 'Nine of Pentacles', suit: 'pentacles', arcana: 'minor', keywords: ['abundance', 'luxury', 'self-sufficiency', 'financial independence'], upright_meaning: 'Abundance, luxury, self-sufficiency, financial independence', reversed_meaning: 'Self-worth, over-investment in work, hustling' },
  { id: 'pentacles-10', name: 'Ten of Pentacles', suit: 'pentacles', arcana: 'minor', keywords: ['wealth', 'financial security', 'family', 'long-term success'], upright_meaning: 'Wealth, financial security, family, long-term success, contribution', reversed_meaning: 'The dark side of wealth, financial failure, loneliness' },
  { id: 'pentacles-page', name: 'Page of Pentacles', suit: 'pentacles', arcana: 'minor', keywords: ['manifestation', 'financial opportunity', 'skill development'], upright_meaning: 'Manifestation, financial opportunity, skill development, new career', reversed_meaning: 'Lack of progress, procrastination, learn from failure' },
  { id: 'pentacles-knight', name: 'Knight of Pentacles', suit: 'pentacles', arcana: 'minor', keywords: ['hard work', 'productivity', 'routine', 'conservatism'], upright_meaning: 'Hard work, productivity, routine, conservatism, methodical', reversed_meaning: 'Self-discipline, boredom, feeling stuck, perfectionism' },
  { id: 'pentacles-queen', name: 'Queen of Pentacles', suit: 'pentacles', arcana: 'minor', keywords: ['nurturing', 'practical', 'providing financially', 'grounded'], upright_meaning: 'Nurturing, practical, providing financially, a working parent, grounded', reversed_meaning: 'Financial independence, self-care, work-home conflict' },
  { id: 'pentacles-king', name: 'King of Pentacles', suit: 'pentacles', arcana: 'minor', keywords: ['wealth', 'business', 'leadership', 'security', 'discipline'], upright_meaning: 'Wealth, business, leadership, security, discipline, abundance', reversed_meaning: 'Financially inept, obsessed with wealth and status' }
];

// Shuffle array function
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { meaningType = 'celtic', question }: RequestBody = await req.json().catch(() => ({}));

    console.log('Generating daily 3-card reading...');

    // Initialize Supabase client first to fetch cards from database
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase configuration missing');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all cards from the active deck in database
    const { data: dbCards, error: cardsError } = await supabase
      .from('tarot_cards')
      .select('id, name, arcana, suit, meaning_upright, meaning_reversed, image_url, keywords')
      .limit(78);

    if (cardsError || !dbCards || dbCards.length === 0) {
      console.error('Database cards error:', cardsError);
      // Fall back to hardcoded deck if database fails
      console.log('Falling back to hardcoded deck');
      var selectedCards = shuffleArray(tarotDeck).slice(0, 3);
      var usingDatabase = false;
    } else {
      console.log(`Fetched ${dbCards.length} cards from database`);
      selectedCards = shuffleArray(dbCards).slice(0, 3);
      usingDatabase = true;
    }

    // Three-card spread positions
    const positions = ['Past', 'Present', 'Future'];

    // Randomly determine if each card is reversed (50% chance)
    const cardsWithOrientation = selectedCards.map((card, index) => ({
      name: card.name,
      position: positions[index],
      isReversed: Math.random() < 0.5,
      keywords: card.keywords || [],
      upright_meaning: card.meaning_upright || card.upright_meaning,
      reversed_meaning: card.meaning_reversed || card.reversed_meaning,
      image_url: usingDatabase ? card.image_url : undefined
    }));

    // Prepare request for interpretation function
    const interpretationRequest = {
      cards: cardsWithOrientation.map(c => ({
        name: c.name,
        position: c.position,
        isReversed: c.isReversed
      })),
      question: question || undefined,
      spreadName: 'Three Card Spread',
      meaningType
    };

    // Call the existing interpretation function
    console.log('Calling interpretation function...');
    const interpretationResponse = await fetch(`${supabaseUrl}/functions/v1/generate-tarot-interpretation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify(interpretationRequest)
    });

    if (!interpretationResponse.ok) {
      const errorText = await interpretationResponse.text();
      console.error('Interpretation API Error:', interpretationResponse.status, errorText);
      throw new Error(`Interpretation failed: ${interpretationResponse.status} - ${errorText}`);
    }

    const { interpretation } = await interpretationResponse.json();

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    // Save reading to database (upsert - update if exists for today)
    const readingData = {
      reading_date: today,
      spread_name: 'Three Card Spread',
      meaning_type: meaningType,
      question: question || null,
      cards: cardsWithOrientation,
      interpretation
    };

    const { data: savedReading, error: dbError } = await supabase
      .from('daily_readings')
      .upsert(readingData, { onConflict: 'reading_date' })
      .select('id')
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      // Continue even if database save fails
    }

    const readingId = savedReading?.id;
    const shareableUrl = readingId ? `https://sidhe.netlify.app/reading/${readingId}` : null;

    console.log(`Reading saved with ID: ${readingId}`);
    console.log(`Shareable URL: ${shareableUrl}`);

    // Return complete reading
    return new Response(
      JSON.stringify({
        id: readingId,
        date: new Date().toISOString(),
        spread: 'Three Card Spread',
        meaningType,
        question: question || null,
        cards: cardsWithOrientation,
        interpretation,
        shareableUrl
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'Failed to generate daily reading',
        details: error.toString()
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
