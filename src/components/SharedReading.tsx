import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { supabase } from '../lib/supabase';

interface Card {
  name: string;
  position: string;
  isReversed: boolean;
  keywords: string[];
  upright_meaning: string;
  reversed_meaning: string;
  celtic_mythology?: string;
  image_url?: string;
}

interface Reading {
  id: string;
  reading_date: string;
  spread_name: string;
  meaning_type: string;
  question: string | null;
  cards: Card[];
  interpretation: string;
  created_at: string;
}

const formatInterpretationText = (text: string) => {
  const headings = [
    'Guidance from the Ancient Ways',
    'Reflection Questions',
    'Actionable Wisdom',
    'Ritual Suggestion',
  ];

  const lines = text.split('\n');
  let inList = false;

  const formattedLines = lines.map(line => {
    const trimmedLine = line.trim();

    if (trimmedLine === '') {
      inList = false;
      return '';
    }

    if (headings.includes(trimmedLine)) {
      inList = false;
      return `\n## ${trimmedLine}\n`;
    }

    if (trimmedLine.endsWith(':')) {
      inList = true;
      return `\n**${trimmedLine}**`;
    }

    if (inList) {
      return `* ${trimmedLine}`;
    }

    return trimmedLine;
  });

  return formattedLines.join('\n');
};

export default function SharedReading() {
  const { id } = useParams<{ id: string }>();
  const [reading, setReading] = useState<Reading | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  useEffect(() => {
    async function fetchReading() {
      if (!id) {
        setError('No reading ID provided');
        setLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from('daily_readings')
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError) throw fetchError;
        if (!data) throw new Error('Reading not found');

        setReading(data);
      } catch (err) {
        console.error('Error fetching reading:', err);
        setError(err instanceof Error ? err.message : 'Failed to load reading');
      } finally {
        setLoading(false);
      }
    }

    fetchReading();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-800 via-stone-900 to-stone-800 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
          <p className="mt-4 text-stone-300">Loading reading...</p>
        </div>
      </div>
    );
  }

  if (error || !reading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-800 via-stone-900 to-stone-800 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-serif text-amber-500 mb-4">Reading Not Found</h1>
          <p className="text-stone-400 mb-6">{error || 'This reading does not exist or has been removed.'}</p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-amber-600 text-stone-900 rounded-lg hover:bg-amber-500 transition-colors font-medium"
          >
            Return to SÍDHE
          </a>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(reading.reading_date).toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-800 via-stone-900 to-stone-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-amber-500 text-5xl mb-4 drop-shadow-lg">
            🌙 SÍDHE 🌙
          </h1>
          <div className="w-48 h-0.5 mx-auto bg-gradient-to-r from-transparent via-amber-500 to-transparent mb-6"></div>
          <h2 className="font-serif text-amber-300 text-2xl mb-2">Daily Tarot Reading</h2>
          <p className="text-stone-400 italic">{formattedDate}</p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {reading.cards.map((card, index) => (
            <div
              key={index}
              className="bg-stone-900/50 backdrop-blur-sm border border-amber-600/30 rounded-xl p-6 shadow-2xl flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-amber-500 font-serif text-lg">
                  {card.position}
                </span>
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    card.isReversed
                      ? 'bg-teal-400/20 text-teal-300'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}
                >
                  {card.isReversed ? 'Inverted' : 'Upright'}
                </span>
              </div>

              {card.image_url && (
                <div className="mb-6 flex-grow flex items-center justify-center">
                  <img
                    src={card.image_url}
                    alt={card.name}
                    onClick={() => setSelectedCard(card)}
                    className={`max-w-full max-h-64 object-contain rounded-lg shadow-lg cursor-pointer hover:shadow-amber-500/20 transition-shadow duration-300 ${
                      card.isReversed ? 'filter invert' : ''
                    }`}
                  />
                </div>
              )}

              <h3 className="font-serif text-amber-200 text-3xl mb-4 text-center">
                {card.name}
              </h3>

              <div className="flex flex-wrap gap-2 justify-center mb-6">
                {card.keywords.map((keyword, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 text-xs bg-amber-800/50 text-amber-300 rounded"
                  >
                    {keyword}
                  </span>
                ))}
              </div>

              <p className="text-stone-400 text-center text-sm leading-relaxed flex-shrink-0">
                {card.isReversed ? card.reversed_meaning : card.upright_meaning}
              </p>
            </div>
          ))}
        </div>

        {/* Interpretation */}
        {reading.interpretation && (
          <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-l-4 border-amber-500 rounded-r-lg p-8 mb-8 shadow-lg">
            <h3 className="font-serif text-amber-300 text-2xl mb-6">Today's Guidance</h3>
            <div className="prose prose-invert max-w-none prose-headings:text-amber-400 prose-headings:font-serif prose-h1:text-amber-400 prose-h2:text-amber-400 prose-h3:text-amber-400 prose-h4:text-amber-400 prose-p:text-white prose-p:text-base prose-p:leading-8 prose-p:mb-6 prose-strong:text-amber-300 prose-em:text-teal-300 prose-ul:text-white prose-ul:list-disc prose-ul:ml-6 prose-ul:space-y-2 prose-ul:my-4 prose-li:text-white prose-li:leading-8 prose-li:pl-2 [&>*]:text-white [&_h1]:text-amber-400 [&_h2]:text-amber-400 [&_h3]:text-amber-400 [&_h4]:text-amber-400">
              <ReactMarkdown>{formatInterpretationText(reading.interpretation)}</ReactMarkdown>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center pt-8 border-t border-stone-700">
          <p className="text-stone-500 italic text-sm mb-4">
            "Trust in the wisdom of the cards"
          </p>
          <p className="text-stone-600 text-xs mb-6">SÍDHE Celtic Tarot</p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-amber-600 text-stone-900 rounded-lg hover:bg-amber-500 transition-colors font-medium"
          >
            Get Your Own Reading
          </a>
        </div>
      </div>

      {/* Card Modal */}
      {selectedCard && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 overflow-y-auto"
          onClick={() => setSelectedCard(null)}
        >
          <div className="relative max-w-4xl w-full my-8" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedCard(null)}
              className="absolute -top-4 right-0 text-white hover:text-amber-400 text-5xl font-light transition-colors z-10"
            >
              ×
            </button>

            <div className="bg-gradient-to-br from-stone-900 to-stone-800 border-2 border-amber-600 rounded-lg p-8 shadow-2xl">
              {/* Header with Position and Orientation */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-amber-600 text-lg font-medium font-serif">
                  {selectedCard.position}
                </span>
                <span
                  className={`inline-block px-4 py-2 rounded text-base font-medium ${
                    selectedCard.isReversed
                      ? 'bg-teal-400/20 text-teal-400 border border-teal-400'
                      : 'bg-amber-500/20 text-amber-500 border border-amber-500'
                  }`}
                >
                  {selectedCard.isReversed ? 'Inverted' : 'Upright'}
                </span>
              </div>

              {/* Card Image */}
              {selectedCard.image_url && (
                <div className="mb-6 flex justify-center">
                  <img
                    src={selectedCard.image_url}
                    alt={selectedCard.name}
                    className={`max-w-md w-full h-auto rounded-lg shadow-lg ${
                      selectedCard.isReversed ? 'filter invert' : ''
                    }`}
                  />
                </div>
              )}

              {/* Card Name */}
              <h3 className="font-serif text-amber-100 text-4xl mb-6 text-center">
                {selectedCard.name}
              </h3>

              {/* Keywords */}
              <div className="flex flex-wrap gap-2 justify-center mb-6">
                {selectedCard.keywords.map((keyword, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 text-sm bg-amber-500/10 border border-amber-600 text-amber-300 rounded font-serif"
                  >
                    {keyword}
                  </span>
                ))}
              </div>

              {/* Meaning */}
              <div className="bg-amber-500/5 border-l-4 border-amber-600 rounded-r-lg p-6">
                <h4 className="font-serif text-amber-300 text-xl mb-3">Meaning</h4>
                <p className="text-stone-200 text-lg leading-relaxed">
                  {selectedCard.isReversed ? selectedCard.reversed_meaning : selectedCard.upright_meaning}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
