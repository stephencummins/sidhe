/*
  # Add Meanings for Seasonal Suit Cards

  1. Changes
    - Copy meanings from traditional Rider-Waite-Smith interpretations
    - Map seasonal suits: Spring=Wands, Summer=Cups, Autumn=Swords, Winter=Pentacles
    - This provides a Celtic seasonal interpretation aligned with traditional tarot

  2. Seasonal Mapping
    - Spring (Wands): Growth, energy, passion, new beginnings
    - Summer (Cups): Emotions, relationships, intuition, love
    - Autumn (Swords): Intellect, conflict, change, clarity
    - Winter (Pentacles): Material world, stability, manifestation, earth
*/

-- Ace of Spring (Wands)
UPDATE tarot_cards SET
  meaning_upright = 'New beginnings, creative spark, inspiration, potential for growth. A seed of opportunity bursting with energy and promise.',
  meaning_reversed = 'Delays, lack of direction, false starts, creative blocks. The spark is present but struggling to ignite.',
  keywords = ARRAY['new beginnings', 'inspiration', 'potential', 'opportunity']
WHERE name = 'Ace of Spring';

-- Two of Spring (Wands)
UPDATE tarot_cards SET
  meaning_upright = 'Planning, making decisions, future action, discovery. Standing at a crossroads with the world at your fingertips.',
  meaning_reversed = 'Fear of the unknown, lack of planning, poor decisions. Hesitation holds you back from claiming your power.',
  keywords = ARRAY['planning', 'decisions', 'discovery', 'progress']
WHERE name = 'Two of Spring';

-- Three of Spring (Wands)
UPDATE tarot_cards SET
  meaning_upright = 'Expansion, foresight, overseas opportunities, leadership. Your plans are bearing fruit and new horizons beckon.',
  meaning_reversed = 'Obstacles, delays, frustration, lack of foresight. Plans stalled by unforeseen circumstances.',
  keywords = ARRAY['expansion', 'foresight', 'opportunities', 'leadership']
WHERE name = 'Three of Spring';

-- Four of Spring (Wands)
UPDATE tarot_cards SET
  meaning_upright = 'Celebration, harmony, marriage, homecoming, achievement. A time of joy and communal happiness.',
  meaning_reversed = 'Lack of harmony, conflict, instability, broken relationships. Celebrations marred by underlying tensions.',
  keywords = ARRAY['celebration', 'harmony', 'homecoming', 'stability']
WHERE name = 'Four of Spring';

-- Five of Spring (Wands)
UPDATE tarot_cards SET
  meaning_upright = 'Competition, conflict, tension, diversity of opinion. Healthy challenge that brings out your best.',
  meaning_reversed = 'Avoiding conflict, inner turmoil, aggression. Destructive competition that tears rather than builds.',
  keywords = ARRAY['competition', 'conflict', 'challenge', 'diversity']
WHERE name = 'Five of Spring';

-- Six of Spring (Wands)
UPDATE tarot_cards SET
  meaning_upright = 'Victory, success, public recognition, self-confidence. Your efforts are acknowledged and celebrated.',
  meaning_reversed = 'Lack of recognition, delays, excess pride. Success is hollow or achievements go unnoticed.',
  keywords = ARRAY['victory', 'success', 'recognition', 'confidence']
WHERE name = 'Six of Spring';

-- Seven of Spring (Wands)
UPDATE tarot_cards SET
  meaning_upright = 'Challenge, perseverance, defending your position, standing your ground. You have the advantage if you hold firm.',
  meaning_reversed = 'Feeling overwhelmed, giving up, exhaustion. Unable to maintain your position under pressure.',
  keywords = ARRAY['challenge', 'perseverance', 'defense', 'courage']
WHERE name = 'Seven of Spring';

-- Eight of Spring (Wands)
UPDATE tarot_cards SET
  meaning_upright = 'Swift action, movement, progress, quick decisions. Events are rapidly unfolding in your favor.',
  meaning_reversed = 'Delays, frustration, resisting change, hastiness. Rushed decisions or stagnation.',
  keywords = ARRAY['swift action', 'movement', 'progress', 'speed']
WHERE name = 'Eight of Spring';

-- Nine of Spring (Wands)
UPDATE tarot_cards SET
  meaning_upright = 'Resilience, persistence, last stand, boundaries. Wounded but not defeated, ready to defend what matters.',
  meaning_reversed = 'Paranoia, stubbornness, refusing help, collapse. Exhaustion overcomes determination.',
  keywords = ARRAY['resilience', 'persistence', 'boundaries', 'defense']
WHERE name = 'Nine of Spring';

-- Ten of Spring (Wands)
UPDATE tarot_cards SET
  meaning_upright = 'Burden, responsibility, hard work, stress, achievement through struggle. Success comes but at a cost.',
  meaning_reversed = 'Inability to delegate, breakdown, overwhelm. The burden is too heavy to bear alone.',
  keywords = ARRAY['burden', 'responsibility', 'hard work', 'stress']
WHERE name = 'Ten of Spring';

-- Page of Spring (Wands)
UPDATE tarot_cards SET
  meaning_upright = 'Inspiration, new ideas, enthusiasm, exploration. A messenger bringing exciting opportunities.',
  meaning_reversed = 'Lack of direction, procrastination, bad news. Ideas without follow-through.',
  keywords = ARRAY['inspiration', 'enthusiasm', 'exploration', 'news']
WHERE name = 'Page of Spring';

-- Knight of Spring (Wands)
UPDATE tarot_cards SET
  meaning_upright = 'Energy, passion, adventure, impulsiveness. A rush of dynamic force propelling you forward.',
  meaning_reversed = 'Recklessness, impatience, frustration, arrogance. Uncontrolled energy causing chaos.',
  keywords = ARRAY['energy', 'passion', 'adventure', 'action']
WHERE name = 'Knight of Spring';

-- Queen of Spring (Wands)
UPDATE tarot_cards SET
  meaning_upright = 'Confidence, independence, determination, vivaciousness. A powerful figure radiating warmth and command.',
  meaning_reversed = 'Selfishness, jealousy, demanding, insecurity. Confidence becomes controlling behavior.',
  keywords = ARRAY['confidence', 'independence', 'determination', 'charisma']
WHERE name = 'Queen of Spring';

-- King of Spring (Wands)
UPDATE tarot_cards SET
  meaning_upright = 'Natural leader, vision, entrepreneur, honor. A dynamic figure who inspires others to greatness.',
  meaning_reversed = 'Impulsiveness, overbearing, unachievable expectations. Leadership becomes tyranny.',
  keywords = ARRAY['leadership', 'vision', 'entrepreneurship', 'honor']
WHERE name = 'King of Spring';

-- Ace of Summer (Cups)
UPDATE tarot_cards SET
  meaning_upright = 'New love, emotional beginning, creative inspiration, spiritual awakening. The heart overflows with possibility.',
  meaning_reversed = 'Emotional loss, blocked creativity, emptiness, repressed feelings. The cup is overturned.',
  keywords = ARRAY['new love', 'emotions', 'creativity', 'spirituality']
WHERE name = 'Ace of Summer';

-- Two of Summer (Cups)
UPDATE tarot_cards SET
  meaning_upright = 'Partnership, mutual attraction, unity, harmony. Two souls recognizing their connection.',
  meaning_reversed = 'Imbalance, broken communication, tension, separation. Discord in relationship.',
  keywords = ARRAY['partnership', 'unity', 'attraction', 'harmony']
WHERE name = 'Two of Summer';

-- Three of Summer (Cups)
UPDATE tarot_cards SET
  meaning_upright = 'Friendship, community, celebration, group activities. Joy shared multiplies.',
  meaning_reversed = 'Overindulgence, gossip, isolation, loneliness. Celebrations ring hollow.',
  keywords = ARRAY['friendship', 'celebration', 'community', 'joy']
WHERE name = 'Three of Summer';

-- Four of Summer (Cups)
UPDATE tarot_cards SET
  meaning_upright = 'Meditation, contemplation, apathy, reevaluation. Turning inward to reassess emotional needs.',
  meaning_reversed = 'Sudden awareness, choosing happiness, acceptance. Breaking free from emotional stagnation.',
  keywords = ARRAY['contemplation', 'meditation', 'apathy', 'reevaluation']
WHERE name = 'Four of Summer';

-- Five of Summer (Cups)
UPDATE tarot_cards SET
  meaning_upright = 'Loss, grief, disappointment, focusing on the negative. Mourning what has been lost.',
  meaning_reversed = 'Acceptance, moving on, finding peace, forgiveness. Beginning to see what remains.',
  keywords = ARRAY['loss', 'grief', 'disappointment', 'regret']
WHERE name = 'Five of Summer';

-- Six of Summer (Cups)
UPDATE tarot_cards SET
  meaning_upright = 'Nostalgia, childhood memories, innocence, joy. Sweet remembrance of simpler times.',
  meaning_reversed = 'Living in the past, unrealistic expectations, stuck in old patterns. Unable to move forward.',
  keywords = ARRAY['nostalgia', 'memories', 'innocence', 'childhood']
WHERE name = 'Six of Summer';

-- Seven of Summer (Cups)
UPDATE tarot_cards SET
  meaning_upright = 'Choices, illusion, fantasy, temptation. Many paths but which are real?',
  meaning_reversed = 'Clarity, making choices, disillusionment, reality check. Seeing through the illusions.',
  keywords = ARRAY['choices', 'illusion', 'fantasy', 'possibilities']
WHERE name = 'Seven of Summer';

-- Eight of Summer (Cups)
UPDATE tarot_cards SET
  meaning_upright = 'Walking away, letting go, seeking deeper meaning, moving on. Leaving behind what no longer serves.',
  meaning_reversed = 'Fear of change, clinging to the past, stagnation. Inability to release attachments.',
  keywords = ARRAY['letting go', 'moving on', 'seeking', 'transition']
WHERE name = 'Eight of Summer';

-- Nine of Summer (Cups)
UPDATE tarot_cards SET
  meaning_upright = 'Contentment, satisfaction, wishes fulfilled, emotional stability. The wish card - dreams coming true.',
  meaning_reversed = 'Dissatisfaction, materialism, smugness, unfulfilled wishes. Happiness proves elusive.',
  keywords = ARRAY['contentment', 'satisfaction', 'wishes', 'happiness']
WHERE name = 'Nine of Summer';

-- Ten of Summer (Cups)
UPDATE tarot_cards SET
  meaning_upright = 'Harmony, family, homecoming, emotional fulfillment. Perfect happiness in relationship and family.',
  meaning_reversed = 'Disconnection, misalignment, broken family, unhappy home. Discord where there should be peace.',
  keywords = ARRAY['harmony', 'family', 'homecoming', 'fulfillment']
WHERE name = 'Ten of Summer';

-- Page of Summer (Cups)
UPDATE tarot_cards SET
  meaning_upright = 'Creative opportunities, intuitive messages, curiosity, new feelings. A gentle messenger of the heart.',
  meaning_reversed = 'Emotional immaturity, insecurity, disappointment. Creative blocks or bad news.',
  keywords = ARRAY['creativity', 'intuition', 'curiosity', 'messages']
WHERE name = 'Page of Summer';

-- Knight of Summer (Cups)
UPDATE tarot_cards SET
  meaning_upright = 'Romance, charm, following your heart, idealism. A dreamer and romantic on a quest.',
  meaning_reversed = 'Moodiness, disappointment, unrealistic expectations. Romance without substance.',
  keywords = ARRAY['romance', 'charm', 'idealism', 'emotion']
WHERE name = 'Knight of Summer';

-- Queen of Summer (Cups)
UPDATE tarot_cards SET
  meaning_upright = 'Compassion, calm, comfort, emotionally secure. A nurturing presence of deep intuition.',
  meaning_reversed = 'Insecurity, giving too much, needy, fragile. Emotional boundaries dissolved.',
  keywords = ARRAY['compassion', 'calm', 'nurturing', 'intuition']
WHERE name = 'Queen of Summer';

-- King of Summer (Cups)
UPDATE tarot_cards SET
  meaning_upright = 'Emotional balance, diplomacy, compassion, wisdom. Mastery over the emotional realm.',
  meaning_reversed = 'Emotional manipulation, moodiness, volatility. Emotions control rather than being controlled.',
  keywords = ARRAY['emotional balance', 'diplomacy', 'compassion', 'wisdom']
WHERE name = 'King of Summer';

-- Ace of Autumn (Swords)
UPDATE tarot_cards SET
  meaning_upright = 'Breakthrough, clarity, sharp mind, new ideas, mental clarity. The sword of truth cuts through confusion.',
  meaning_reversed = 'Confusion, chaos, lack of clarity, misinformation. The blade turns against itself.',
  keywords = ARRAY['breakthrough', 'clarity', 'truth', 'mental power']
WHERE name = 'Ace of Autumn';

-- Two of Autumn (Swords)
UPDATE tarot_cards SET
  meaning_upright = 'Difficult choices, stalemate, denial, indecision. Blindfolded between two sharp edges.',
  meaning_reversed = 'Indecision lifted, truth revealed, movement forward. Removing the blindfold.',
  keywords = ARRAY['difficult choices', 'stalemate', 'indecision', 'avoidance']
WHERE name = 'Two of Autumn';

-- Three of Autumn (Swords)
UPDATE tarot_cards SET
  meaning_upright = 'Heartbreak, sorrow, grief, painful truth. Three swords pierce the heart.',
  meaning_reversed = 'Recovery, forgiveness, moving forward, releasing pain. Beginning to heal.',
  keywords = ARRAY['heartbreak', 'sorrow', 'grief', 'painful truth']
WHERE name = 'Three of Autumn';

-- Four of Autumn (Swords)
UPDATE tarot_cards SET
  meaning_upright = 'Rest, recovery, contemplation, restoration. Necessary retreat to gather strength.',
  meaning_reversed = 'Restlessness, burnout, lack of progress. Unable to rest properly.',
  keywords = ARRAY['rest', 'recovery', 'contemplation', 'restoration']
WHERE name = 'Four of Autumn';

-- Five of Autumn (Swords)
UPDATE tarot_cards SET
  meaning_upright = 'Conflict, defeat, loss, unfairness, betrayal. Victory achieved through questionable means.',
  meaning_reversed = 'Making amends, past resentment, reconciliation. Moving beyond defeat.',
  keywords = ARRAY['conflict', 'defeat', 'betrayal', 'loss']
WHERE name = 'Five of Autumn';

-- Six of Autumn (Swords)
UPDATE tarot_cards SET
  meaning_upright = 'Transition, moving on, leaving behind, mental journey. Crossing troubled waters to calmer shores.',
  meaning_reversed = 'Stuck in past, resistance to change, unfinished business. Unable to move forward.',
  keywords = ARRAY['transition', 'moving on', 'journey', 'release']
WHERE name = 'Six of Autumn';

-- Seven of Autumn (Swords)
UPDATE tarot_cards SET
  meaning_upright = 'Deception, strategy, sneakiness, mental manipulation. Operating in the shadows.',
  meaning_reversed = 'Coming clean, rethinking approach, conscience. Truth emerging from shadow.',
  keywords = ARRAY['deception', 'strategy', 'sneakiness', 'betrayal']
WHERE name = 'Seven of Autumn';

-- Eight of Autumn (Swords)
UPDATE tarot_cards SET
  meaning_upright = 'Trapped, restricted, powerless, self-imposed prison. Bound by your own thoughts.',
  meaning_reversed = 'Freedom, release, breaking free, new perspective. Realizing the bonds are illusion.',
  keywords = ARRAY['trapped', 'restricted', 'powerless', 'victim mindset']
WHERE name = 'Eight of Autumn';

-- Nine of Autumn (Swords)
UPDATE tarot_cards SET
  meaning_upright = 'Anxiety, nightmares, fear, negative thoughts. The mind attacks itself in darkness.',
  meaning_reversed = 'Hope, recovery, reaching out, healing. The worst of the storm has passed.',
  keywords = ARRAY['anxiety', 'nightmares', 'fear', 'worry']
WHERE name = 'Nine of Autumn';

-- Ten of Autumn (Swords)
UPDATE tarot_cards SET
  meaning_upright = 'Rock bottom, painful endings, betrayal, loss. The darkest hour before dawn.',
  meaning_reversed = 'Recovery, regeneration, learning from experience. Rising from the ashes.',
  keywords = ARRAY['rock bottom', 'endings', 'loss', 'betrayal']
WHERE name = 'Ten of Autumn';

-- Page of Autumn (Swords)
UPDATE tarot_cards SET
  meaning_upright = 'Curiosity, mental restlessness, new ideas, vigilance. A sharp mind seeking truth.',
  meaning_reversed = 'Haste, defensive, all talk, lack of planning. Ideas without wisdom.',
  keywords = ARRAY['curiosity', 'vigilance', 'ideas', 'mental agility']
WHERE name = 'Page of Autumn';

-- Knight of Autumn (Swords)
UPDATE tarot_cards SET
  meaning_upright = 'Action, ambition, drive, fast thinking, fearless. Charging forward with single-minded purpose.',
  meaning_reversed = 'Recklessness, arrogance, no direction, aggression. Unchecked force causing destruction.',
  keywords = ARRAY['action', 'ambition', 'drive', 'fearlessness']
WHERE name = 'Knight of Autumn';

-- Queen of Autumn (Swords)
UPDATE tarot_cards SET
  meaning_upright = 'Independent, clear thinking, direct, honest, intellectual. Sharp mind cutting through illusion.',
  meaning_reversed = 'Cold, cruel, bitter, harsh judgment. Intellect without heart.',
  keywords = ARRAY['independent', 'clear thinking', 'honest', 'intellectual']
WHERE name = 'Queen of Autumn';

-- King of Autumn (Swords)
UPDATE tarot_cards SET
  meaning_upright = 'Authority, logic, truth, clarity, discipline. Master of the mental realm.',
  meaning_reversed = 'Manipulation, tyranny, abuse of power, harsh. Power wielded without wisdom.',
  keywords = ARRAY['authority', 'logic', 'truth', 'discipline']
WHERE name = 'King of Autumn';

-- Ace of Winter (Pentacles)
UPDATE tarot_cards SET
  meaning_upright = 'New opportunity, prosperity, manifestation, solid beginning. A golden opportunity appears.',
  meaning_reversed = 'Lost opportunity, missed chance, bad investment. The coin slips through fingers.',
  keywords = ARRAY['opportunity', 'prosperity', 'manifestation', 'abundance']
WHERE name = 'Ace of Winter';

-- Two of Winter (Pentacles)
UPDATE tarot_cards SET
  meaning_upright = 'Balance, adaptability, juggling resources, flexibility. Dancing between multiple priorities.',
  meaning_reversed = 'Imbalance, overwhelmed, disorganized, chaos. Dropping the balls.',
  keywords = ARRAY['balance', 'adaptability', 'flexibility', 'priorities']
WHERE name = 'Two of Winter';

-- Three of Winter (Pentacles)
UPDATE tarot_cards SET
  meaning_upright = 'Collaboration, teamwork, skill building, implementation. Master craftsmanship recognized.',
  meaning_reversed = 'Lack of teamwork, ego, poor quality. Working alone to detriment.',
  keywords = ARRAY['collaboration', 'teamwork', 'skill', 'craftsmanship']
WHERE name = 'Three of Winter';

-- Four of Winter (Pentacles)
UPDATE tarot_cards SET
  meaning_upright = 'Conservation, security, stability, possessiveness, control. Holding tight to what you have.',
  meaning_reversed = 'Greed, materialism, self-protection, resistance to change. Clinging too tightly.',
  keywords = ARRAY['security', 'stability', 'conservation', 'control']
WHERE name = 'Four of Winter';

-- Five of Winter (Pentacles)
UPDATE tarot_cards SET
  meaning_upright = 'Financial loss, hardship, isolation, lack of support. Walking through the storm alone.',
  meaning_reversed = 'Recovery, overcoming adversity, positive change. Seeing the light ahead.',
  keywords = ARRAY['hardship', 'loss', 'isolation', 'struggle']
WHERE name = 'Five of Winter';

-- Six of Winter (Pentacles)
UPDATE tarot_cards SET
  meaning_upright = 'Generosity, charity, sharing, equality, giving and receiving. The scales balanced.',
  meaning_reversed = 'Strings attached, debt, imbalance, one-sidedness. Gifts with expectations.',
  keywords = ARRAY['generosity', 'charity', 'sharing', 'balance']
WHERE name = 'Six of Winter';

-- Seven of Winter (Pentacles)
UPDATE tarot_cards SET
  meaning_upright = 'Investment, patience, long-term view, perseverance. Tending the garden for future harvest.',
  meaning_reversed = 'Impatience, lack of reward, limited success. Harvest comes up short.',
  keywords = ARRAY['investment', 'patience', 'perseverance', 'long-term']
WHERE name = 'Seven of Winter';

-- Eight of Winter (Pentacles)
UPDATE tarot_cards SET
  meaning_upright = 'Apprenticeship, skill development, quality, attention to detail. Mastering your craft through dedication.',
  meaning_reversed = 'Lack of focus, mediocrity, shortcuts, poor quality. Rushing through important work.',
  keywords = ARRAY['apprenticeship', 'skill', 'quality', 'dedication']
WHERE name = 'Eight of Winter';

-- Nine of Winter (Pentacles)
UPDATE tarot_cards SET
  meaning_upright = 'Abundance, luxury, self-sufficiency, financial independence. Enjoying the fruits of your labor.',
  meaning_reversed = 'Overworking, lack of success, lack of reward. Working hard but seeing no return.',
  keywords = ARRAY['abundance', 'luxury', 'independence', 'success']
WHERE name = 'Nine of Winter';

-- Ten of Winter (Pentacles)
UPDATE tarot_cards SET
  meaning_upright = 'Wealth, inheritance, family, legacy, culmination. Generational prosperity and tradition.',
  meaning_reversed = 'Financial failure, family disputes, broken traditions. Legacy crumbling.',
  keywords = ARRAY['wealth', 'family', 'legacy', 'inheritance']
WHERE name = 'Ten of Winter';

-- Page of Winter (Pentacles)
UPDATE tarot_cards SET
  meaning_upright = 'Manifestation, opportunity, new venture, studious nature. A messenger of material opportunity.',
  meaning_reversed = 'Lack of progress, procrastination, bad news. Opportunities missed.',
  keywords = ARRAY['manifestation', 'opportunity', 'studious', 'new venture']
WHERE name = 'Page of Winter';

-- Knight of Winter (Pentacles)
UPDATE tarot_cards SET
  meaning_upright = 'Efficiency, routine, conservatism, methodical, reliable. Steady progress toward goals.',
  meaning_reversed = 'Laziness, boredom, stagnation, perfectionism. Movement without progress.',
  keywords = ARRAY['efficiency', 'routine', 'reliability', 'methodical']
WHERE name = 'Knight of Winter';

-- Queen of Winter (Pentacles)
UPDATE tarot_cards SET
  meaning_upright = 'Nurturing, practical, down-to-earth, provider, security. Creating abundance and comfort.',
  meaning_reversed = 'Self-care neglect, work-home imbalance, smothering. Giving at cost of self.',
  keywords = ARRAY['nurturing', 'practical', 'provider', 'abundance']
WHERE name = 'Queen of Winter';

-- King of Winter (Pentacles)
UPDATE tarot_cards SET
  meaning_upright = 'Abundance, success, leadership, stability, provider. Master of the material world.',
  meaning_reversed = 'Greed, materialism, corruption, failure. Success at any cost.',
  keywords = ARRAY['abundance', 'success', 'leadership', 'stability']
WHERE name = 'King of Winter';
