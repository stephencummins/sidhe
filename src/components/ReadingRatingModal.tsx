import { useState } from 'react';
import { X, Moon, ThumbsUp, ThumbsDown, Minus, Tag } from 'lucide-react';
import { updateReadingRating } from '../services/savedReadings';
import type { Sentiment } from '../types';
import CelticBorder from './CelticBorder';

interface ReadingRatingModalProps {
  readingId: string;
  currentRating?: number;
  currentSentiment?: Sentiment;
  currentOutcomeNotes?: string;
  currentTags?: string[];
  onClose: () => void;
  onSaved: (rating: {
    accuracy_rating?: number;
    sentiment?: Sentiment;
    outcome_notes?: string;
    tags?: string[];
  }) => void;
}

export default function ReadingRatingModal({
  readingId,
  currentRating,
  currentSentiment,
  currentOutcomeNotes,
  currentTags,
  onClose,
  onSaved,
}: ReadingRatingModalProps) {
  const [rating, setRating] = useState<number | undefined>(currentRating);
  const [sentiment, setSentiment] = useState<Sentiment | undefined>(currentSentiment);
  const [outcomeNotes, setOutcomeNotes] = useState(currentOutcomeNotes || '');
  const [tags, setTags] = useState<string[]>(currentTags || []);
  const [newTag, setNewTag] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    setSaving(true);
    setError('');

    const ratingData = {
      accuracy_rating: rating,
      sentiment,
      outcome_notes: outcomeNotes || undefined,
      tags: tags.length > 0 ? tags : undefined,
    };

    const { error: saveError } = await updateReadingRating(readingId, ratingData);

    if (saveError) {
      setError(saveError.message);
      setSaving(false);
      return;
    }

    setSaving(false);
    onSaved(ratingData);
    onClose();
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim().toLowerCase())) {
      setTags([...tags, newTag.trim().toLowerCase()]);
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <CelticBorder>
          <div className="p-8 calan-branded">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-3xl font-bold" style={{
                fontFamily: 'Cinzel, serif',
                color: '#d4af37',
                textShadow: '0 1px 2px rgba(0,0,0,0.8)'
              }}>
                Rate This Reading
              </h2>
              <button
                onClick={onClose}
                className="text-amber-400 hover:text-amber-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Accuracy Rating */}
            <div className="mb-6">
              <label className="block text-lg font-semibold mb-3" style={{
                fontFamily: 'Cinzel, serif',
                color: '#d4af37',
              }}>
                Accuracy Rating
              </label>
              <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    onClick={() => setRating(num)}
                    className={`p-3 transition-all duration-200 ${
                      rating && num <= rating
                        ? 'text-amber-400 scale-110'
                        : 'text-amber-900/40 hover:text-amber-600'
                    }`}
                  >
                    <Moon className="w-8 h-8" fill={rating && num <= rating ? 'currentColor' : 'none'} />
                  </button>
                ))}
              </div>
              <p className="text-center text-sm mt-2" style={{ color: '#cd7f32', fontFamily: 'Cinzel, serif' }}>
                {rating ? `${rating} moon${rating > 1 ? 's' : ''}` : 'Click to rate'}
              </p>
            </div>

            {/* Sentiment */}
            <div className="mb-6">
              <label className="block text-lg font-semibold mb-3" style={{
                fontFamily: 'Cinzel, serif',
                color: '#d4af37',
              }}>
                How did this reading feel?
              </label>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setSentiment('positive')}
                  className={`flex flex-col items-center gap-2 p-4 border-2 transition-all ${
                    sentiment === 'positive'
                      ? 'border-green-400 bg-green-900/20'
                      : 'border-amber-900/30 hover:border-amber-700'
                  }`}
                  style={{ fontFamily: 'Cinzel, serif' }}
                >
                  <ThumbsUp className={sentiment === 'positive' ? 'text-green-400' : 'text-amber-600'} />
                  <span style={{ color: sentiment === 'positive' ? '#5DD9C1' : '#cd7f32' }}>Positive</span>
                </button>

                <button
                  onClick={() => setSentiment('neutral')}
                  className={`flex flex-col items-center gap-2 p-4 border-2 transition-all ${
                    sentiment === 'neutral'
                      ? 'border-amber-400 bg-amber-900/20'
                      : 'border-amber-900/30 hover:border-amber-700'
                  }`}
                  style={{ fontFamily: 'Cinzel, serif' }}
                >
                  <Minus className={sentiment === 'neutral' ? 'text-amber-400' : 'text-amber-600'} />
                  <span style={{ color: sentiment === 'neutral' ? '#d4af37' : '#cd7f32' }}>Neutral</span>
                </button>

                <button
                  onClick={() => setSentiment('negative')}
                  className={`flex flex-col items-center gap-2 p-4 border-2 transition-all ${
                    sentiment === 'negative'
                      ? 'border-red-400 bg-red-900/20'
                      : 'border-amber-900/30 hover:border-amber-700'
                  }`}
                  style={{ fontFamily: 'Cinzel, serif' }}
                >
                  <ThumbsDown className={sentiment === 'negative' ? 'text-red-400' : 'text-amber-600'} />
                  <span style={{ color: sentiment === 'negative' ? '#ff6b6b' : '#cd7f32' }}>Negative</span>
                </button>
              </div>
            </div>

            {/* Tags */}
            <div className="mb-6">
              <label className="block text-lg font-semibold mb-3" style={{
                fontFamily: 'Cinzel, serif',
                color: '#d4af37',
              }}>
                Tags
                <span className="text-sm font-normal ml-2" style={{ color: '#cd7f32' }}>
                  (career, love, health, etc.)
                </span>
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  placeholder="Add a tag..."
                  className="flex-1 bg-amber-950/30 border-2 border-amber-900/40 px-4 py-2 focus:border-amber-600 focus:outline-none"
                  style={{ color: '#f5e6d3', fontFamily: 'Cinzel, serif' }}
                />
                <button
                  onClick={addTag}
                  className="px-6 py-2 bg-amber-700 hover:bg-amber-600 border-2 border-amber-500 transition-colors"
                  style={{ color: '#f5e6d3', fontFamily: 'Cinzel, serif' }}
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-amber-900/40 border border-amber-700/60"
                    style={{ color: '#d4af37', fontFamily: 'Cinzel, serif' }}
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="hover:text-red-400 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Outcome Notes */}
            <div className="mb-6">
              <label className="block text-lg font-semibold mb-3" style={{
                fontFamily: 'Cinzel, serif',
                color: '#d4af37',
              }}>
                Reflection & Notes
              </label>
              <textarea
                value={outcomeNotes}
                onChange={(e) => setOutcomeNotes(e.target.value)}
                placeholder="How did this reading play out? Any insights or reflections..."
                rows={4}
                className="w-full bg-amber-950/30 border-2 border-amber-900/40 px-4 py-3 focus:border-amber-600 focus:outline-none resize-none"
                style={{ color: '#f5e6d3', fontFamily: 'Cinzel, serif' }}
              />
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-700/50" style={{ color: '#ff6b6b' }}>
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 justify-end">
              <button
                onClick={onClose}
                className="px-8 py-3 border-2 border-amber-700 hover:border-amber-500 transition-all"
                style={{ color: '#d4af37', fontFamily: 'Cinzel, serif' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-8 py-3 bg-gradient-to-br from-amber-200 via-amber-300 to-amber-400 border-2 border-amber-500 hover:shadow-xl transition-all disabled:opacity-50"
                style={{ color: '#7c2d12', fontFamily: 'Cinzel, serif', fontWeight: 'bold' }}
              >
                {saving ? 'Saving...' : 'Save Rating'}
              </button>
            </div>
          </div>
        </CelticBorder>
      </div>
    </div>
  );
}
