/*
  # Add Missing Celtic Meanings

  Updates the 9 cards that are missing Celtic meanings with appropriate
  Celtic-themed interpretations, keywords, and mythology.

  1. Updates
    - Nine of Winter
    - Ace of Winter
    - Four of Winter
    - Five of Winter
    - Eight of Autumn
    - Eight of Spring
    - Eight of Summer
    - Justice (Major Arcana)
    - The Hierophant (Major Arcana)
*/

-- Nine of Winter
UPDATE tarot_cards
SET
  celtic_meaning_upright = 'Like the dark nights before Samhain when ancient fears surface, this card speaks of anxiety and nightmares that plague the Celtic soul. The nine winter ravens circle overhead, embodying worry and sleepless nights. Yet even in the darkest hour before dawn, the Celts knew that acknowledging our fears gives us power over them. The mist that brings terror also brings wisdom to those who face it bravely.',
  celtic_meaning_reversed = 'The winter dawn breaks and the ravens scatter - your nightmares lose their power in the light of day. Like emerging from the dark passage of a burial mound into sunlight, you find that your fears were shadows without substance. The Celtic warriors knew that the monsters we imagine are often greater than reality itself. Release your worries to the winter wind and trust in the returning light.',
  celtic_keywords = '{anxiety, nightmares, winter darkness, fear, worry, sleepless nights}',
  celtic_mythology = 'Associated with the Morrigan''s ravens that brought prophecies and fears in the night, and the dark half of the year when the veil between worlds grows thin and anxieties surface.'
WHERE name = 'Nine of Winter';

-- Ace of Winter
UPDATE tarot_cards
SET
  celtic_meaning_upright = 'Like the first frost that clarifies the air and hardens the ground, the Ace of Winter brings cold clarity and sharp truth. This is the sword of Nuada, the silver-handed king, cutting through illusion with crystalline precision. The winter wind sweeps away confusion, leaving only what is essential and true. Mental clarity arrives like the first clear day after long storms, bringing new perspective and understanding.',
  celtic_meaning_reversed = 'The sword becomes dull, the mind clouded like a winter fog that refuses to lift. Confusion reigns as you struggle to see clearly through the mists of doubt and indecision. The Celtic wisdom teaches that sometimes we must wait for the fog to clear naturally rather than forcing our way through. Hasty judgments made in unclear conditions lead only to regret.',
  celtic_keywords = '{clarity, truth, mental power, new ideas, winter insight, clear thought}',
  celtic_mythology = 'Represents the Sword of Nuada, one of the four treasures of the Tuatha Dé Danann, brought from the northern city of Findias. No one could escape from it once it was drawn from its sheath, and no one could resist it.'
WHERE name = 'Ace of Winter';

-- Four of Winter
UPDATE tarot_cards
SET
  celtic_meaning_upright = 'Like a warrior resting in the crannog after long battles, taking time to tend wounds and sharpen weapons. The Celts understood the wisdom of strategic retreat and recuperation. In the heart of winter, even the land itself rests beneath snow and ice, gathering strength for the renewal to come. This is sacred rest, protected and necessary, not laziness but preparation for future challenges.',
  celtic_meaning_reversed = 'The rest period has ended - spring stirs beneath the frozen earth and it is time to emerge from your winter retreat. Like the Celtic warriors preparing for the spring campaigns, you must shake off lethargy and engage with life again. Prolonged withdrawal becomes stagnation; even winter must eventually yield to spring. The time for contemplation has passed; action calls.',
  celtic_keywords = '{rest, recuperation, meditation, winter retreat, strategic withdrawal, restoration}',
  celtic_mythology = 'Connected to the winter festivals when Celtic communities would retreat indoors, telling stories and preserving knowledge while the land slept beneath snow, gathering strength for the growing season ahead.'
WHERE name = 'Four of Winter';

-- Five of Winter
UPDATE tarot_cards
SET
  celtic_meaning_upright = 'Like battles fought in winter snow where there are no true victors, only survivors marked by loss. The Celtic tales speak of hollow victories where the cost exceeds the gain. Five warriors remain standing while others have fallen, but there is no celebration in their eyes - only the bitter knowledge of what was sacrificed. This is conflict that leaves everyone diminished, where winning and losing blur into the same grey winter landscape.',
  celtic_meaning_reversed = 'The time for reconciliation arrives like the first thaw after a harsh winter. Feuds that seemed eternal lose their power; enemies discover they share more than divides them. The Celtic tradition of peace-making after conflict returns - compensation for wrongs, oaths of friendship, the rebuilding of trust. Lay down your weapons; there are better ways forward than endless winter warfare.',
  celtic_keywords = '{hollow victory, conflict, defeat, loss, winter battles, bitter triumph}',
  celtic_mythology = 'Reflects the tragic battles of Irish mythology where even victors paid terrible prices - like the Battle of Mag Tuired where victory came at the cost of many noble lives and deep wounds to the land itself.'
WHERE name = 'Five of Winter';

-- Eight of Autumn
UPDATE tarot_cards
SET
  celtic_meaning_upright = 'Like the harvest season when skilled hands work from dawn to dusk, this is the time of dedicated craft and focused labor. The Celtic smiths at their forges, the weavers at their looms, the scribes illuminating manuscripts - all demonstrate the sacred nature of skillful work. Autumn demands effort and attention; the harvest will not gather itself, and winter approaches. Pour yourself into your craft with the devotion of those who know the value of their work.',
  celtic_meaning_reversed = 'The work has lost its meaning, becoming mere toil without purpose or satisfaction. Like harvest work done without care, producing inferior results. The Celtic craftspeople understood that work without spirit creates nothing of lasting value. Perhaps you labor at the wrong task, or your heart is not in the effort. Autumn teaches us to work with purpose or not at all.',
  celtic_keywords = '{craftsmanship, diligence, skill development, autumn labor, apprenticeship, dedication}',
  celtic_mythology = 'Associated with the legendary craftspeople of Celtic tradition - the smith god Goibniu who could forge a weapon with three blows, and the intricate artistry of Celtic metalwork and manuscript illumination.'
WHERE name = 'Eight of Autumn';

-- Eight of Spring
UPDATE tarot_cards
SET
  celtic_meaning_upright = 'Like arrows flying swift and true toward their target, or messages carried on the spring winds across the greening land. This is the energy of rapid movement and swift communication that comes with spring''s renewal. The Celtic peoples knew spring as a time of movement - cattle driven to new pastures, tribes traveling to sacred gathering places, news spreading like wildflowers across the land. Events accelerate; things held static through winter now flow with sudden force.',
  celtic_meaning_reversed = 'The swift flight falters, messages go astray, plans encounter unexpected delays. Like spring storms that ground travelers and muddy roads, forward motion slows despite your eagerness to proceed. The Celtic wisdom reminds us that not all timing is ours to control; sometimes the land itself determines the pace. Practice patience when spring''s promised momentum fails to materialize as expected.',
  celtic_keywords = '{swift action, messages, rapid movement, spring momentum, acceleration, news}',
  celtic_mythology = 'Connected to the Celtic festivals of spring movement and the tradition of sending messages via swift runners or trained ravens, and the seasonal migrations that marked the Celtic calendar.'
WHERE name = 'Eight of Spring';

-- Eight of Summer
UPDATE tarot_cards
SET
  celtic_meaning_upright = 'Like the midsummer fires blazing at their height, passion and energy burn with fierce intensity. This is the fullness of summer''s power - the sun at its peak, desires at their strongest, emotions running as hot as the forge fires. The Celtic celebrations of high summer acknowledged this overwhelming force; we are caught up in something larger than ourselves. Let the fire burn bright, but remember that all fires eventually bank down to embers.',
  celtic_meaning_reversed = 'The fire burns too hot, consuming rather than warming, destroying rather than illuminating. Passion becomes obsession; intensity turns to burnout. The Celtic peoples knew that even the midsummer fire must be carefully tended lest it spread beyond control. Step back from the flames; even summer''s heat can become oppressive. Allow the fire to settle to sustainable warmth rather than desperate conflagration.',
  celtic_keywords = '{passion, intensity, desire, summer heat, overwhelming emotion, fierce energy}',
  celtic_mythology = 'Associated with the intensity of the midsummer Beltane fires and the passionate tales of Celtic lovers like Diarmuid and Gráinne, whose desire drove them to abandon duty and embrace wild passion.'
WHERE name = 'Eight of Summer';

-- Justice
UPDATE tarot_cards
SET
  celtic_meaning_upright = 'Like the Brehon laws that governed Celtic society with intricate fairness, this is the principle of balance and right action woven into the fabric of existence. The Celts understood justice not as abstract morality but as the maintenance of cosmic order - each person receiving their due, debts balanced, harmony restored. The scales are in balance; truth prevails over deception. What is fair will be done, not through mercy but through the inexorable workings of natural law.',
  celtic_meaning_reversed = 'The scales tip unfairly, laws are applied unjustly, truth is obscured by falsehood. Like a corrupt judge taking bribes or a witness giving false testimony, the mechanisms of justice have been corrupted. The Celtic tradition held that such imbalance would eventually correct itself - for the universe itself demands equilibrium - but the process may be painful and slow. Seek the truth even when systems fail to recognize it.',
  celtic_keywords = '{fairness, balance, law, truth, Brehon justice, cosmic order}',
  celtic_mythology = 'Connected to the Brehon legal system and the concept of "fír flathemon" (truth of the ruler) - the belief that a just king would cause the land itself to prosper, while injustice would bring blight and disaster.'
WHERE name = 'Justice';

-- The Hierophant
UPDATE tarot_cards
SET
  celtic_meaning_upright = 'Like the Druids who held the sacred knowledge and initiated seekers into ancient mysteries, this is the guardian of tradition and spiritual wisdom. The Hierophant stands at the threshold between the mundane and the sacred, teaching those who would learn the old ways. Celtic society revered those who preserved and transmitted sacred knowledge through generations. Seek legitimate spiritual guidance; respect the tested wisdom of tradition while remaining open to genuine understanding.',
  celtic_meaning_reversed = 'The teacher has become dogmatic, preferring rigid rules over living wisdom. Like a Druid who recites formulas without understanding their meaning, or a Christian monk who values tradition over truth. The Celtic tradition valued wisdom over mere learning, understanding over rote memorization. Question authorities who demand blind obedience; true spiritual teaching liberates rather than constrains.',
  celtic_keywords = '{spiritual teaching, tradition, sacred knowledge, initiation, Druidic wisdom, guidance}',
  celtic_mythology = 'Represents the Druids, the priestly class of Celtic society who spent decades in training, memorizing vast bodies of sacred knowledge, law, poetry, and performing religious ceremonies and initiations.'
WHERE name = 'The Hierophant';
