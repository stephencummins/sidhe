import { useState } from 'react';
import { X, Save, Lock, Globe } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { saveReading } from '../services/savedReadings';
import type { Reading, SpreadType } from '../types';

interface SaveReadingModalProps {
  reading: Reading;
  interpretation: string;
  onClose: () => void;
  readingSource?: 'personal' | 'daily';
}

export default function SaveReadingModal({ reading, interpretation, onClose, readingSource = 'personal' }: SaveReadingModalProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);

  const handleSave = async () => {
    if (!user) {
      setError('You must be logged in to save readings');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const { data, error: saveError } = await saveReading({
        title: title || undefined,
        spread_type: reading.spread as SpreadType,
        question: reading.question,
        cards: reading.cards,
        interpretation,
        is_public: isPublic,
        reading_source: readingSource,
        notes: notes || undefined,
      });

      if (saveError) {
        setError(saveError.message);
        return;
      }

      if (data) {
        setSavedId(data.id);
        setSuccess(true);
        // Auto-close after 2 seconds
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save reading');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyLink = () => {
    if (savedId && isPublic) {
      const url = `${window.location.origin}/saved/${savedId}`;
      navigator.clipboard.writeText(url);
    }
  };

  if (!user) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-stone-900 via-amber-950 to-stone-950 border-2 border-amber-700/60 p-8 max-w-md w-full">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-amber-100 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
              Sign In Required
            </h3>
            <p className="text-amber-200/80 mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              You need to be signed in to save readings. Please sign in to continue.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-amber-700 text-amber-50 border-2 border-amber-600/50 hover:border-amber-500 transition-colors"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-stone-900 via-amber-950 to-stone-950 border-2 border-amber-700/60 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-amber-600/50"></div>
        <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-amber-600/50"></div>
        <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-amber-600/50"></div>
        <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-amber-600/50"></div>

        <div className="flex justify-between items-start mb-6">
          <h3 className="text-2xl font-bold text-amber-100" style={{ fontFamily: 'Georgia, serif' }}>
            Save Reading
          </h3>
          <button
            onClick={onClose}
            className="text-amber-400 hover:text-amber-200 transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {success ? (
          <div className="py-8 text-center">
            <div className="w-16 h-16 bg-emerald-600/20 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Save className="w-8 h-8 text-emerald-400" />
            </div>
            <h4 className="text-xl font-bold text-amber-100 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
              Reading Saved!
            </h4>
            <p className="text-amber-200/80 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
              Your reading has been saved successfully.
            </p>
            {isPublic && savedId && (
              <button
                onClick={handleCopyLink}
                className="px-6 py-2 bg-amber-700 text-amber-50 border-2 border-amber-600/50 hover:border-amber-500 transition-colors"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Copy Share Link
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {error && (
              <div className="bg-red-900/30 border border-red-700/50 p-4 text-red-200">
                {error}
              </div>
            )}

            <div>
              <label className="block text-amber-200 font-semibold mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                Title (Optional)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Morning Guidance Reading"
                className="w-full bg-stone-900/50 border-2 border-amber-800/40 text-amber-100 px-4 py-2 focus:outline-none focus:border-amber-600"
                style={{ fontFamily: 'Georgia, serif' }}
              />
            </div>

            <div>
              <label className="block text-amber-200 font-semibold mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                Privacy
              </label>
              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="privacy"
                    checked={!isPublic}
                    onChange={() => setIsPublic(false)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-amber-100 group-hover:text-amber-50">
                      <Lock className="w-4 h-4" />
                      <span className="font-semibold" style={{ fontFamily: 'Georgia, serif' }}>Private</span>
                    </div>
                    <p className="text-amber-300/70 text-sm mt-1" style={{ fontFamily: 'Georgia, serif' }}>
                      Only you can view this reading
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="privacy"
                    checked={isPublic}
                    onChange={() => setIsPublic(true)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-amber-100 group-hover:text-amber-50">
                      <Globe className="w-4 h-4" />
                      <span className="font-semibold" style={{ fontFamily: 'Georgia, serif' }}>Public</span>
                    </div>
                    <p className="text-amber-300/70 text-sm mt-1" style={{ fontFamily: 'Georgia, serif' }}>
                      Anyone with the link can view this reading
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-amber-200 font-semibold mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                Personal Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add your reflections, insights, or observations..."
                rows={4}
                className="w-full bg-stone-900/50 border-2 border-amber-800/40 text-amber-100 px-4 py-2 focus:outline-none focus:border-amber-600 resize-none"
                style={{ fontFamily: 'Georgia, serif' }}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-700 via-orange-800 to-amber-700 text-amber-50 border-2 border-amber-600/50 hover:border-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                <Save className="w-5 h-5" />
                {isSaving ? 'Saving...' : 'Save Reading'}
              </button>
              <button
                onClick={onClose}
                disabled={isSaving}
                className="px-6 py-3 bg-stone-800 text-amber-200 border-2 border-amber-900/50 hover:border-amber-700 disabled:opacity-50 transition-all duration-200"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
