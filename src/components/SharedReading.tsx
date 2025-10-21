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

export default function SharedReading() {
  const { id } = useParams<{ id: string }>();
  const [reading, setReading] = useState<Reading | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<{ url: string; name: string; isReversed: boolean } | null>(null);

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
            href="https://sidhe.netlify.app"
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
              className="bg-gradient-to-br from-stone-900 to-stone-800 border-2 border-amber-600 rounded-lg p-6 shadow-xl"
            >
              <div className="mb-4 flex justify-between items-center">
                <span className="text-amber-600 text-sm font-medium">
                  {card.position}
                </span>
                <span
                  className={`inline-block px-3 py-1 rounded text-sm font-medium ${
                    card.isReversed
                      ? 'bg-teal-400/20 text-teal-400 border border-teal-400'
                      : 'bg-amber-500/20 text-amber-500 border border-amber-500'
                  }`}
                >
                  {card.isReversed ? 'Inverted' : 'Upright'}
                </span>
              </div>

              {/* Card Image */}
              {card.image_url && (
                <div className="mb-4 flex justify-center">
                  <img
                    src={card.image_url}
                    alt={card.name}
                    onClick={() => setSelectedImage({ url: card.image_url!, name: card.name, isReversed: card.isReversed })}
                    className={`w-48 h-auto rounded-lg shadow-lg cursor-pointer hover:opacity-90 transition-opacity ${
                      card.isReversed ? 'transform rotate-180' : ''
                    }`}
                  />
                </div>
              )}

              <h3 className="font-serif text-amber-100 text-2xl mb-4 text-center">
                {card.name}
              </h3>
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                {card.keywords.map((keyword, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 text-xs bg-amber-500/10 border border-amber-600 text-amber-300 rounded"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
              <p className="text-stone-300 text-center leading-relaxed">
                {card.isReversed ? card.reversed_meaning : card.upright_meaning}
              </p>
            </div>
          ))}
        </div>

        {/* Interpretation */}
        {reading.interpretation && (
          <div className="bg-amber-500/5 border-l-4 border-amber-600 rounded-r-lg p-8 mb-8">
            <h3 className="font-serif text-amber-300 text-xl mb-4">Today's Guidance</h3>
            <div className="text-stone-200 leading-relaxed prose prose-invert prose-amber max-w-none">
              <ReactMarkdown>{reading.interpretation}</ReactMarkdown>
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
            href="https://sidhe.netlify.app"
            className="inline-block px-6 py-3 bg-amber-600 text-stone-900 rounded-lg hover:bg-amber-500 transition-colors font-medium"
          >
            Get Your Own Reading
          </a>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-amber-400 text-4xl font-light transition-colors"
            >
              ×
            </button>
            <img
              src={selectedImage.url}
              alt={selectedImage.name}
              className={`max-w-full max-h-[90vh] object-contain rounded-lg ${
                selectedImage.isReversed ? 'transform rotate-180' : ''
              }`}
              onClick={(e) => e.stopPropagation()}
            />
            <p className="text-center text-amber-300 font-serif text-xl mt-4">
              {selectedImage.name}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
