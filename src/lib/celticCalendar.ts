import type { CelticFestival } from '../types';

/**
 * Calculate the exact date of the Spring Equinox for a given year
 * Uses a simplified astronomical formula
 */
function getSpringEquinox(year: number): Date {
  // Approximate formula for Spring Equinox in the Northern Hemisphere
  const day = Math.floor(20 + 0.2422 * (year - 2000) - Math.floor((year - 2000) / 4));
  return new Date(year, 2, day); // March (month 2)
}

/**
 * Calculate the exact date of the Summer Solstice for a given year
 */
function getSummerSolstice(year: number): Date {
  const day = Math.floor(21 + 0.2422 * (year - 2000) - Math.floor((year - 2000) / 4));
  return new Date(year, 5, day); // June (month 5)
}

/**
 * Calculate the exact date of the Autumn Equinox for a given year
 */
function getAutumnEquinox(year: number): Date {
  const day = Math.floor(22 + 0.2422 * (year - 2000) - Math.floor((year - 2000) / 4));
  return new Date(year, 8, day); // September (month 8)
}

/**
 * Calculate the exact date of the Winter Solstice for a given year
 */
function getWinterSolstice(year: number): Date {
  const day = Math.floor(21 + 0.2422 * (year - 2000) - Math.floor((year - 2000) / 4));
  return new Date(year, 11, day); // December (month 11)
}

/**
 * Get all 8 Celtic festivals for a given year
 * The Wheel of the Year includes 4 solar festivals and 4 fire festivals
 */
export function getCelticFestivals(year: number): CelticFestival[] {
  return [
    // Samhain - Celtic New Year (October 31 - November 1)
    {
      id: 'samhain',
      name: 'Samhain',
      date: new Date(year, 9, 31), // October 31
      description: 'Celtic New Year, honoring ancestors and the thinning veil between worlds',
      season: 'autumn',
    },
    // Winter Solstice / Yule (December 20-23, calculated)
    {
      id: 'winter-solstice',
      name: 'Winter Solstice (Yule)',
      date: getWinterSolstice(year),
      description: 'Shortest day, celebration of rebirth of the sun',
      season: 'winter',
    },
    // Imbolc (February 1-2)
    {
      id: 'imbolc',
      name: 'Imbolc',
      date: new Date(year, 1, 1), // February 1
      description: 'Spring awakening, festival of Brigid, first signs of spring',
      season: 'winter',
    },
    // Spring Equinox / Ostara (March 19-22, calculated)
    {
      id: 'spring-equinox',
      name: 'Spring Equinox (Ostara)',
      date: getSpringEquinox(year),
      description: 'Day and night equal, renewal and fertility',
      season: 'spring',
    },
    // Beltane (May 1)
    {
      id: 'beltane',
      name: 'Beltane',
      date: new Date(year, 4, 1), // May 1
      description: 'Beginning of summer, fire festival celebrating fertility and growth',
      season: 'spring',
    },
    // Summer Solstice / Litha (June 19-23, calculated)
    {
      id: 'summer-solstice',
      name: 'Summer Solstice (Litha)',
      date: getSummerSolstice(year),
      description: 'Longest day, peak of solar power and abundance',
      season: 'summer',
    },
    // Lughnasadh (August 1)
    {
      id: 'lughnasadh',
      name: 'Lughnasadh',
      date: new Date(year, 7, 1), // August 1
      description: 'First harvest, festival of Lugh, gratitude for abundance',
      season: 'summer',
    },
    // Autumn Equinox / Mabon (September 20-23, calculated)
    {
      id: 'autumn-equinox',
      name: 'Autumn Equinox (Mabon)',
      date: getAutumnEquinox(year),
      description: 'Second harvest, balance and thanksgiving',
      season: 'autumn',
    },
  ];
}

/**
 * Get the season boundaries for a given year
 */
export function getSeasonBoundaries(year: number) {
  return {
    spring: { start: getSpringEquinox(year), end: getSummerSolstice(year) },
    summer: { start: getSummerSolstice(year), end: getAutumnEquinox(year) },
    autumn: { start: getAutumnEquinox(year), end: getWinterSolstice(year) },
    winter: { start: getWinterSolstice(year), end: getSpringEquinox(year + 1) },
  };
}

/**
 * Get the season for a given date
 */
export function getSeasonForDate(date: Date): 'spring' | 'summer' | 'autumn' | 'winter' {
  const year = date.getFullYear();
  const boundaries = getSeasonBoundaries(year);

  if (date >= boundaries.spring.start && date < boundaries.summer.start) {
    return 'spring';
  } else if (date >= boundaries.summer.start && date < boundaries.autumn.start) {
    return 'summer';
  } else if (date >= boundaries.autumn.start && date < boundaries.winter.start) {
    return 'autumn';
  } else {
    return 'winter';
  }
}

/**
 * Find the nearest Celtic festival to a given date
 */
export function getNearestCelticFestival(date: Date): CelticFestival {
  const year = date.getFullYear();
  const festivals = getCelticFestivals(year);
  const previousYearFestivals = getCelticFestivals(year - 1);
  const nextYearFestivals = getCelticFestivals(year + 1);

  const allFestivals = [...previousYearFestivals, ...festivals, ...nextYearFestivals];

  let nearest = allFestivals[0];
  let minDistance = Math.abs(date.getTime() - nearest.date.getTime());

  for (const festival of allFestivals) {
    const distance = Math.abs(date.getTime() - festival.date.getTime());
    if (distance < minDistance) {
      minDistance = distance;
      nearest = festival;
    }
  }

  return nearest;
}

/**
 * Get the festival period for a given date (within 7 days of festival)
 */
export function getFestivalForDate(date: Date): CelticFestival | null {
  const nearest = getNearestCelticFestival(date);
  const daysFromFestival = Math.abs(date.getTime() - nearest.date.getTime()) / (1000 * 60 * 60 * 24);

  // If within 7 days of a festival, consider it part of that festival period
  if (daysFromFestival <= 7) {
    return nearest;
  }

  return null;
}

/**
 * Convert a date to a position on a circular calendar (0-360 degrees)
 * 0 degrees = January 1, 360 degrees = December 31
 */
export function getCircularPosition(date: Date): number {
  const year = date.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const endOfYear = new Date(year, 11, 31);
  const yearDuration = endOfYear.getTime() - startOfYear.getTime();
  const datePosition = date.getTime() - startOfYear.getTime();

  return (datePosition / yearDuration) * 360;
}

/**
 * Get seasonal color for theming
 */
export function getSeasonColor(season: 'spring' | 'summer' | 'autumn' | 'winter'): string {
  const colors = {
    spring: '#5DD9C1', // Turquoise/green
    summer: '#d4af37', // Gold
    autumn: '#cd7f32', // Bronze/orange
    winter: '#1a2332', // Deep blue
  };

  return colors[season];
}

/**
 * Get the festival closest to today
 */
export function getTodaysFestival(): CelticFestival {
  return getNearestCelticFestival(new Date());
}
