import { supabase } from '../lib/supabase';
import { SavedReading, SaveReadingInput } from '../types';

/**
 * Save a new reading for the current user
 */
export async function saveReading(input: SaveReadingInput): Promise<{ data: SavedReading | null; error: Error | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { data: null, error: new Error('User must be logged in to save readings') };
    }

    const { data, error } = await supabase
      .from('saved_readings')
      .insert({
        user_id: user.id,
        title: input.title,
        spread_type: input.spread_type,
        question: input.question,
        cards: input.cards,
        interpretation: input.interpretation,
        is_public: input.is_public ?? false,
        reading_source: input.reading_source ?? 'personal',
        notes: input.notes,
      })
      .select()
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    return { data: data as SavedReading, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

/**
 * Get all saved readings for the current user
 */
export async function getUserSavedReadings(): Promise<{ data: SavedReading[] | null; error: Error | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { data: null, error: new Error('User must be logged in to view saved readings') };
    }

    const { data, error } = await supabase
      .from('saved_readings')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    return { data: data as SavedReading[], error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

/**
 * Get a single saved reading by ID
 * Returns the reading if it's public or belongs to the current user
 */
export async function getSavedReading(id: string): Promise<{ data: SavedReading | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('saved_readings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    return { data: data as SavedReading, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

/**
 * Update a saved reading
 */
export async function updateSavedReading(
  id: string,
  updates: Partial<SaveReadingInput>
): Promise<{ data: SavedReading | null; error: Error | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { data: null, error: new Error('User must be logged in to update readings') };
    }

    const { data, error } = await supabase
      .from('saved_readings')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    return { data: data as SavedReading, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

/**
 * Delete a saved reading
 */
export async function deleteSavedReading(id: string): Promise<{ error: Error | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: new Error('User must be logged in to delete readings') };
    }

    const { error } = await supabase
      .from('saved_readings')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      return { error: new Error(error.message) };
    }

    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
}
