import { supabase } from '../lib/supabase';
import type { SavedReading, ReadingAnalyticsData, Sentiment, SpreadType } from '../types';
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import { getCelticFestivals, getNearestCelticFestival } from '../lib/celticCalendar';

/**
 * Get all readings for the current user
 */
export async function getUserReadings() {
  const { data, error } = await supabase
    .from('saved_readings')
    .select('*')
    .order('created_at', { ascending: false });

  return { data: data as SavedReading[] | null, error };
}

/**
 * Get analytics data for the current user
 */
export async function getReadingAnalytics(year?: number): Promise<ReadingAnalyticsData | null> {
  const currentYear = year || new Date().getFullYear();
  const yearStart = startOfYear(new Date(currentYear, 0, 1));
  const yearEnd = endOfYear(new Date(currentYear, 11, 31));

  const { data: readings, error } = await supabase
    .from('saved_readings')
    .select('*')
    .gte('created_at', yearStart.toISOString())
    .lte('created_at', yearEnd.toISOString())
    .order('created_at', { ascending: true });

  if (error || !readings) {
    console.error('Error fetching readings for analytics:', error);
    return null;
  }

  const readingsData = readings as SavedReading[];

  // Calculate total readings
  const totalReadings = readingsData.length;

  // Calculate average accuracy (only from rated readings)
  const ratedReadings = readingsData.filter(r => r.accuracy_rating !== null && r.accuracy_rating !== undefined);
  const averageAccuracy = ratedReadings.length > 0
    ? ratedReadings.reduce((sum, r) => sum + (r.accuracy_rating || 0), 0) / ratedReadings.length
    : 0;

  // Calculate average power score
  const readingsWithPower = readingsData.filter(r => r.power_score !== null && r.power_score !== undefined);
  const averagePowerScore = readingsWithPower.length > 0
    ? readingsWithPower.reduce((sum, r) => sum + (r.power_score || 0), 0) / readingsWithPower.length
    : 0;

  // Determine most common sentiment
  const sentimentCounts = readingsData.reduce((acc, r) => {
    if (r.sentiment) {
      acc[r.sentiment] = (acc[r.sentiment] || 0) + 1;
    }
    return acc;
  }, {} as Record<Sentiment, number>);

  const mostCommonSentiment = Object.keys(sentimentCounts).length > 0
    ? (Object.keys(sentimentCounts).reduce((a, b) =>
        sentimentCounts[a as Sentiment] > sentimentCounts[b as Sentiment] ? a : b
      ) as Sentiment)
    : 'neutral';

  // Group readings by month
  const readingsByMonth = Array.from({ length: 12 }, (_, i) => {
    const monthStart = startOfMonth(new Date(currentYear, i, 1));
    const monthEnd = endOfMonth(new Date(currentYear, i, 1));
    const count = readingsData.filter(r => {
      const date = new Date(r.created_at);
      return date >= monthStart && date <= monthEnd;
    }).length;

    return {
      month: format(new Date(currentYear, i, 1), 'MMM'),
      count,
    };
  });

  // Group readings by Celtic festival
  const festivals = getCelticFestivals(currentYear);
  const readingsByFestival = festivals.map(festival => {
    const count = readingsData.filter(r => {
      const nearest = getNearestCelticFestival(new Date(r.created_at));
      return nearest.id === festival.id;
    }).length;

    return {
      festival: festival.name,
      count,
    };
  });

  // Calculate card frequency
  const cardCounts: Record<string, number> = {};
  readingsData.forEach(reading => {
    reading.cards.forEach(selectedCard => {
      const cardName = selectedCard.card.name;
      cardCounts[cardName] = (cardCounts[cardName] || 0) + 1;
    });
  });

  const cardFrequency = Object.entries(cardCounts)
    .map(([card, count]) => ({ card, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // Top 10 cards

  // Calculate spread type distribution
  const spreadCounts = readingsData.reduce((acc, r) => {
    acc[r.spread_type] = (acc[r.spread_type] || 0) + 1;
    return acc;
  }, {} as Record<SpreadType, number>);

  const spreadTypeDistribution = Object.entries(spreadCounts).map(([type, count]) => ({
    type: type as SpreadType,
    count,
  }));

  return {
    totalReadings,
    averageAccuracy: Math.round(averageAccuracy * 10) / 10,
    averagePowerScore: Math.round(averagePowerScore * 10) / 10,
    mostCommonSentiment,
    readingsByMonth,
    readingsByFestival,
    cardFrequency,
    spreadTypeDistribution,
  };
}

/**
 * Get readings grouped by a specific period (day, week, month)
 */
export async function getReadingsByPeriod(period: 'day' | 'week' | 'month' | 'year' = 'month') {
  const { data, error } = await supabase
    .from('saved_readings')
    .select('created_at, accuracy_rating, sentiment, power_score')
    .order('created_at', { ascending: true });

  if (error || !data) {
    return { data: null, error };
  }

  // Group by the specified period
  const grouped = data.reduce((acc, reading) => {
    const date = new Date(reading.created_at);
    let key: string;

    switch (period) {
      case 'day':
        key = format(date, 'yyyy-MM-dd');
        break;
      case 'week':
        key = format(date, 'yyyy-ww');
        break;
      case 'month':
        key = format(date, 'yyyy-MM');
        break;
      case 'year':
        key = format(date, 'yyyy');
        break;
    }

    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(reading);

    return acc;
  }, {} as Record<string, any[]>);

  return { data: grouped, error: null };
}
