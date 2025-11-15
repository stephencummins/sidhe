import { supabase } from '../lib/supabase';
import { SavedReading, SaveReadingInput, Sentiment } from '../types';
import { calculateReadingMetrics } from '../lib/powerScoreCalculator';

/**
 * Save a new reading for the current user
 * Automatically calculates and saves power metrics
 */
export async function saveReading(input: SaveReadingInput): Promise<{ data: SavedReading | null; error: Error | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { data: null, error: new Error('User must be logged in to save readings') };
    }

    // Calculate metrics for the reading
    const metrics = calculateReadingMetrics(input.cards);

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
        accuracy_rating: input.accuracy_rating,
        sentiment: input.sentiment,
        outcome_notes: input.outcome_notes,
        tags: input.tags,
        // Auto-calculated metrics
        power_score: metrics.power_score,
        major_arcana_count: metrics.major_arcana_count,
        court_card_count: metrics.court_card_count,
        suit_pattern_score: metrics.suit_pattern_score,
        reversal_percentage: metrics.reversal_percentage,
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

/**
 * Update the rating for a saved reading
 */
export async function updateReadingRating(
  id: string,
  rating: {
    accuracy_rating?: number;
    sentiment?: Sentiment;
    outcome_notes?: string;
    tags?: string[];
  }
): Promise<{ data: SavedReading | null; error: Error | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { data: null, error: new Error('User must be logged in to rate readings') };
    }

    const updates: Record<string, any> = {
      ...rating,
      reviewed_at: new Date().toISOString(),
    };

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
 * Calculate and update metrics for an existing reading
 * Useful for readings saved before the metrics system was implemented
 */
export async function recalculateReadingMetrics(id: string): Promise<{ data: SavedReading | null; error: Error | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { data: null, error: new Error('User must be logged in') };
    }

    // Get the reading
    const { data: reading, error: fetchError } = await getSavedReading(id);

    if (fetchError || !reading) {
      return { data: null, error: fetchError || new Error('Reading not found') };
    }

    // Calculate metrics
    const metrics = calculateReadingMetrics(reading.cards);

    // Update the reading with new metrics
    const { data, error } = await supabase
      .from('saved_readings')
      .update({
        power_score: metrics.power_score,
        major_arcana_count: metrics.major_arcana_count,
        court_card_count: metrics.court_card_count,
        suit_pattern_score: metrics.suit_pattern_score,
        reversal_percentage: metrics.reversal_percentage,
      })
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
