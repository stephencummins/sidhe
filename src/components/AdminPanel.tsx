import { useState, useEffect } from 'react';
import { LogOut, Plus, Trash2, Upload, Check, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { TarotDeck, TarotCardDB } from '../types/database';
import CelticBorder from './CelticBorder';

export default function AdminPanel() {
  const { user, signOut } = useAuth();
  const [decks, setDecks] = useState<TarotDeck[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<string | null>(null);
  const [showNewDeckForm, setShowNewDeckForm] = useState(false);
  const [newDeckName, setNewDeckName] = useState('');
  const [newDeckDescription, setNewDeckDescription] = useState('');
  const [loading, setLoading] = useState(true);

  console.log('AdminPanel render - user:', user?.email, 'loading:', loading, 'decks:', decks.length);

  // DEBUG ONLY - Remove this after troubleshooting
  if (!user) {
    return (
      <div className="min-h-screen bg-red-500 p-8">
        <h1 className="text-white text-4xl">DEBUG: No user found in AdminPanel</h1>
      </div>
    );
  }

  useEffect(() => {
    if (user) {
      loadDecks();
    }
  }, [user]);

  const loadDecks = async () => {
    if (!user) {
      console.log('No user found in loadDecks');
      setLoading(false);
      return;
    }

    console.log('Loading decks for user:', user.id, user.email);

    try {
      const { data, error } = await supabase
        .from('tarot_decks')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Loaded decks:', data);
      setDecks(data || []);
    } catch (error) {
      console.error('Error loading decks:', error);
    } finally {
      setLoading(false);
    }
  };

  const createDeck = async () => {
    if (!newDeckName.trim()) return;

    try {
      const { data, error } = await supabase
        .from('tarot_decks')
        .insert({
          name: newDeckName,
          description: newDeckDescription,
          created_by: user.id
        })
        .select()
        .single();

      if (error) throw error;

      setDecks([data, ...decks]);
      setNewDeckName('');
      setNewDeckDescription('');
      setShowNewDeckForm(false);
      setSelectedDeck(data.id);
    } catch (error) {
      console.error('Error creating deck:', error);
    }
  };

  const deleteDeck = async (deckId: string) => {
    if (!confirm('Are you sure you want to delete this deck?')) return;

    try {
      const { error } = await supabase
        .from('tarot_decks')
        .delete()
        .eq('id', deckId);

      if (error) throw error;

      setDecks(decks.filter(d => d.id !== deckId));
      if (selectedDeck === deckId) setSelectedDeck(null);
    } catch (error) {
      console.error('Error deleting deck:', error);
    }
  };

  const toggleDeckActive = async (deckId: string, currentActive: boolean) => {
    try {
      if (!currentActive) {
        await supabase
          .from('tarot_decks')
          .update({ is_active: false })
          .neq('id', deckId);
      }

      const { error } = await supabase
        .from('tarot_decks')
        .update({ is_active: !currentActive })
        .eq('id', deckId);

      if (error) throw error;

      setDecks(decks.map(d => ({
        ...d,
        is_active: d.id === deckId ? !currentActive : (!currentActive ? false : d.is_active)
      })));
    } catch (error) {
      console.error('Error toggling deck:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      {/* DEBUG BAR */}
      <div className="bg-yellow-400 text-black p-4 text-xl font-bold mb-4">
        DEBUG: AdminPanel is rendering! User: {user.email}
      </div>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-serif text-white">Admin Panel</h1>
            <p className="text-gray-300 mt-1">Manage your tarot decks</p>
          </div>
          <button
            onClick={signOut}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors border border-amber-500"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <CelticBorder>
              <div className="bg-slate-800/95 backdrop-blur-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-serif text-white">Your Decks</h2>
                  <button
                    onClick={() => setShowNewDeckForm(!showNewDeckForm)}
                    className="p-2 bg-amber-500/20 text-amber-400 rounded-lg hover:bg-amber-500/30 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {showNewDeckForm && (
                  <div className="mb-4 p-4 bg-slate-700/50 rounded-lg space-y-3">
                    <input
                      type="text"
                      placeholder="Deck name"
                      value={newDeckName}
                      onChange={(e) => setNewDeckName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 text-white rounded-lg border border-amber-500/30 focus:border-amber-500 focus:outline-none"
                    />
                    <textarea
                      placeholder="Description (optional)"
                      value={newDeckDescription}
                      onChange={(e) => setNewDeckDescription(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 text-white rounded-lg border border-amber-500/30 focus:border-amber-500 focus:outline-none resize-none"
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={createDeck}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 text-slate-900 rounded-lg hover:bg-amber-400 transition-colors font-medium"
                      >
                        <Check className="w-4 h-4" />
                        Create
                      </button>
                      <button
                        onClick={() => setShowNewDeckForm(false)}
                        className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {loading ? (
                  <p className="text-gray-300 text-center py-8">Loading...</p>
                ) : decks.length === 0 ? (
                  <p className="text-gray-300 text-center py-8">No decks yet. Create one to get started!</p>
                ) : (
                  <div className="space-y-2">
                    {decks.map(deck => (
                      <div
                        key={deck.id}
                        className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                          selectedDeck === deck.id
                            ? 'border-amber-500 bg-amber-500/10'
                            : 'border-slate-600 bg-slate-700/50 hover:border-amber-500/50'
                        }`}
                        onClick={() => setSelectedDeck(deck.id)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-medium truncate">{deck.name}</h3>
                            {deck.description && (
                              <p className="text-gray-300 text-sm mt-1 line-clamp-2">{deck.description}</p>
                            )}
                            {deck.is_active && (
                              <span className="inline-block mt-2 px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded">
                                Active
                              </span>
                            )}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteDeck(deck.id);
                            }}
                            className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CelticBorder>
          </div>

          <div className="lg:col-span-2">
            {selectedDeck ? (
              <DeckEditor
                deckId={selectedDeck}
                deck={decks.find(d => d.id === selectedDeck)!}
                onToggleActive={toggleDeckActive}
              />
            ) : (
              <CelticBorder>
                <div className="bg-slate-800/95 backdrop-blur-sm p-12">
                  <p className="text-gray-300 text-center">
                    Select a deck to edit or create a new one
                  </p>
                </div>
              </CelticBorder>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface DeckEditorProps {
  deckId: string;
  deck: TarotDeck;
  onToggleActive: (deckId: string, currentActive: boolean) => void;
}

function DeckEditor({ deckId, deck, onToggleActive }: DeckEditorProps) {
  const [cards, setCards] = useState<TarotCardDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadCards();
  }, [deckId]);

  const loadCards = async () => {
    try {
      const { data, error } = await supabase
        .from('tarot_cards')
        .select('*')
        .eq('deck_id', deckId)
        .order('name');

      if (error) throw error;
      setCards(data || []);
    } catch (error) {
      console.error('Error loading cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const uploadedCards: TarotCardDB[] = [];

      for (const file of Array.from(files)) {
        const fileName = file.name.replace(/\.[^/.]+$/, '');
        const fileExt = file.name.split('.').pop();
        const filePath = `${deckId}/${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('tarot-cards')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('tarot-cards')
          .getPublicUrl(filePath);

        const arcana = fileName.toLowerCase().includes('major') ? 'major' : 'minor';
        let suit = null;
        if (arcana === 'minor') {
          if (fileName.toLowerCase().includes('wand')) suit = 'wands';
          else if (fileName.toLowerCase().includes('cup')) suit = 'cups';
          else if (fileName.toLowerCase().includes('sword')) suit = 'swords';
          else if (fileName.toLowerCase().includes('pentacle')) suit = 'pentacles';
        }

        const { data: cardData, error: cardError } = await supabase
          .from('tarot_cards')
          .insert({
            deck_id: deckId,
            name: fileName,
            arcana,
            suit,
            image_url: publicUrl,
            meaning_upright: '',
            meaning_reversed: '',
            keywords: []
          })
          .select()
          .single();

        if (cardError) throw cardError;
        uploadedCards.push(cardData);
      }

      setCards([...cards, ...uploadedCards]);
    } catch (error) {
      console.error('Error uploading cards:', error);
      alert('Failed to upload some cards. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const deleteCard = async (cardId: string) => {
    try {
      const { error } = await supabase
        .from('tarot_cards')
        .delete()
        .eq('id', cardId);

      if (error) throw error;
      setCards(cards.filter(c => c.id !== cardId));
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  };

  return (
    <CelticBorder>
      <div className="bg-slate-800/95 backdrop-blur-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-serif text-white">{deck.name}</h2>
            <p className="text-gray-300 mt-1">{cards.length} cards</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onToggleActive(deckId, deck.is_active)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                deck.is_active
                  ? 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
                  : 'bg-slate-700 text-white hover:bg-slate-600 border border-amber-500/30'
              }`}
            >
              {deck.is_active ? 'Active' : 'Set Active'}
            </button>
            <label className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-slate-900 rounded-lg hover:bg-amber-400 transition-colors cursor-pointer font-medium">
              <Upload className="w-4 h-4" />
              Upload Cards
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleBulkUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>
        </div>

        {uploading && (
          <div className="mb-4 p-4 bg-amber-500/20 text-amber-400 rounded-lg text-center">
            Uploading cards...
          </div>
        )}

        {loading ? (
          <p className="text-gray-300 text-center py-12">Loading cards...</p>
        ) : cards.length === 0 ? (
          <div className="text-center py-12">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-300">No cards yet. Upload images to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {cards.map(card => (
              <div key={card.id} className="group relative">
                <div className="aspect-[2/3] bg-slate-900/50 rounded-lg overflow-hidden">
                  <img
                    src={card.image_url}
                    alt={card.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={() => deleteCard(card.id)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <p className="mt-2 text-sm text-white truncate">{card.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </CelticBorder>
  );
}
