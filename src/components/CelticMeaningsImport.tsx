import { useState } from 'react';
import { Upload, AlertCircle, CheckCircle, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface CelticCard {
  name: string;
  celtic_upright: string;
  celtic_reversed: string;
  celtic_keywords: string[];
  mythology_notes: string;
}

interface CelticDeckData {
  deck_name: string;
  description: string;
  cards: CelticCard[];
}

interface CelticMeaningsImportProps {
  deckId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CelticMeaningsImport({ deckId, onClose, onSuccess }: CelticMeaningsImportProps) {
  const [jsonData, setJsonData] = useState<string>('');
  const [validationError, setValidationError] = useState<string>('');
  const [importing, setImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<{ success: number; failed: number; errors: string[] } | null>(null);

  const validateJSON = (text: string): CelticDeckData | null => {
    try {
      const data = JSON.parse(text);

      if (!data.cards || !Array.isArray(data.cards)) {
        setValidationError('Invalid format: "cards" array is required');
        return null;
      }

      if (data.cards.length !== 78) {
        setValidationError(`Expected 78 cards, but found ${data.cards.length}`);
        return null;
      }

      for (let i = 0; i < data.cards.length; i++) {
        const card = data.cards[i];
        if (!card.name || !card.celtic_upright || !card.celtic_reversed) {
          setValidationError(`Card at index ${i} is missing required fields (name, celtic_upright, celtic_reversed)`);
          return null;
        }
        if (!Array.isArray(card.celtic_keywords)) {
          setValidationError(`Card "${card.name}" must have celtic_keywords as an array`);
          return null;
        }
      }

      setValidationError('');
      return data as CelticDeckData;
    } catch (error) {
      setValidationError(`Invalid JSON: ${error.message}`);
      return null;
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setJsonData(text);
      validateJSON(text);
    };
    reader.readAsText(file);
  };

  const normalizeCardName = (name: string): string => {
    const suitMap: Record<string, string> = {
      'Wands': 'Spring',
      'Cups': 'Summer',
      'Swords': 'Autumn',
      'Pentacles': 'Winter'
    };

    let normalized = name;
    for (const [traditional, seasonal] of Object.entries(suitMap)) {
      normalized = normalized.replace(traditional, seasonal);
    }
    return normalized;
  };

  const handleImport = async () => {
    const data = validateJSON(jsonData);
    if (!data) return;

    setImporting(true);
    setImportStatus(null);

    const status = { success: 0, failed: 0, errors: [] as string[] };

    try {
      const { data: existingCards, error: fetchError } = await supabase
        .from('tarot_cards')
        .select('id, name')
        .eq('deck_id', deckId);

      if (fetchError) throw fetchError;

      for (const celticCard of data.cards) {
        const normalizedName = normalizeCardName(celticCard.name);
        const existingCard = existingCards.find(c => c.name === normalizedName || c.name === celticCard.name);

        if (!existingCard) {
          status.failed++;
          status.errors.push(`Card "${celticCard.name}" (tried "${normalizedName}") not found in deck`);
          continue;
        }

        const { error: updateError } = await supabase
          .from('tarot_cards')
          .update({
            celtic_meaning_upright: celticCard.celtic_upright,
            celtic_meaning_reversed: celticCard.celtic_reversed,
            celtic_keywords: celticCard.celtic_keywords,
            celtic_mythology: celticCard.mythology_notes
          })
          .eq('id', existingCard.id);

        if (updateError) {
          status.failed++;
          status.errors.push(`Failed to update "${celticCard.name}": ${updateError.message}`);
        } else {
          status.success++;
        }
      }

      setImportStatus(status);

      if (status.success > 0 && status.failed === 0) {
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 2000);
      }
    } catch (error) {
      setValidationError(`Import failed: ${error.message}`);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg border-2 border-amber-500 max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div>
            <h2 className="text-2xl font-serif text-white">Import Celtic Meanings</h2>
            <p className="text-gray-300 text-sm mt-1">Upload your JSON file with Celtic mythology meanings</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <div className="space-y-4">
            <div>
              <label className="block text-white font-medium mb-2">
                Upload JSON File
              </label>
              <label className="flex items-center gap-2 px-4 py-3 bg-amber-500/20 text-amber-400 rounded-lg hover:bg-amber-500/30 transition-colors cursor-pointer border-2 border-amber-500/50">
                <Upload className="w-5 h-5" />
                Choose File
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                Or Paste JSON
              </label>
              <textarea
                value={jsonData}
                onChange={(e) => {
                  setJsonData(e.target.value);
                  if (e.target.value) validateJSON(e.target.value);
                }}
                placeholder='{"deck_name": "Celtic Mythology Tarot", "cards": [...]}'
                className="w-full h-64 px-3 py-2 bg-slate-900 text-white rounded-lg border border-amber-500/30 focus:border-amber-500 focus:outline-none font-mono text-sm resize-none"
              />
            </div>

            {validationError && (
              <div className="flex items-start gap-3 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-red-300 font-medium">Validation Error</p>
                  <p className="text-red-200 text-sm mt-1">{validationError}</p>
                </div>
              </div>
            )}

            {!validationError && jsonData && (
              <div className="flex items-start gap-3 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-green-300 font-medium">Valid JSON</p>
                  <p className="text-green-200 text-sm mt-1">
                    Ready to import {JSON.parse(jsonData).cards.length} cards with Celtic meanings
                  </p>
                  <p className="text-green-200/70 text-xs mt-1">
                    Traditional suits (Wands/Cups/Swords/Pentacles) will be mapped to seasonal suits (Spring/Summer/Autumn/Winter)
                  </p>
                </div>
              </div>
            )}

            {importStatus && (
              <div className={`p-4 rounded-lg border ${
                importStatus.failed === 0
                  ? 'bg-green-500/20 border-green-500/50'
                  : 'bg-yellow-500/20 border-yellow-500/50'
              }`}>
                <p className={`font-medium ${
                  importStatus.failed === 0 ? 'text-green-300' : 'text-yellow-300'
                }`}>
                  Import Complete
                </p>
                <p className={`text-sm mt-1 ${
                  importStatus.failed === 0 ? 'text-green-200' : 'text-yellow-200'
                }`}>
                  Successfully imported: {importStatus.success} cards
                  {importStatus.failed > 0 && ` | Failed: ${importStatus.failed} cards`}
                </p>
                {importStatus.errors.length > 0 && (
                  <div className="mt-2 max-h-32 overflow-y-auto">
                    {importStatus.errors.map((error, idx) => (
                      <p key={idx} className="text-xs text-yellow-200 mt-1">• {error}</p>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="bg-slate-900/50 p-4 rounded-lg">
              <p className="text-gray-300 text-sm font-medium mb-2">Expected Format:</p>
              <pre className="text-xs text-gray-400 overflow-x-auto">
{`{
  "deck_name": "Celtic Mythology Tarot",
  "description": "Your description",
  "cards": [
    {
      "name": "The Fool",
      "celtic_upright": "Upright meaning...",
      "celtic_reversed": "Reversed meaning...",
      "celtic_keywords": ["keyword1", "keyword2"],
      "mythology_notes": "Deity associations..."
    }
  ]
}`}
              </pre>
              <div className="mt-3 p-3 bg-blue-900/20 border border-blue-700/30 rounded">
                <p className="text-blue-300 text-xs font-medium mb-1">📝 Suit Mapping:</p>
                <p className="text-blue-200/80 text-xs">
                  Traditional suits in your JSON will be auto-converted:
                </p>
                <ul className="text-blue-200/70 text-xs mt-1 ml-4 space-y-0.5">
                  <li>• Wands → Spring</li>
                  <li>• Cups → Summer</li>
                  <li>• Swords → Autumn</li>
                  <li>• Pentacles → Winter</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-slate-700">
          <button
            onClick={handleImport}
            disabled={!jsonData || !!validationError || importing}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 text-slate-900 rounded-lg hover:bg-amber-400 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload className="w-5 h-5" />
            {importing ? 'Importing...' : 'Import Celtic Meanings'}
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
