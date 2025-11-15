import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, TrendingUp, Moon, Zap, Heart } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getUserReadings, getReadingAnalytics } from '../services/readingAnalytics';
import type { SavedReading } from '../types';
import CelticBorder from './CelticBorder';
import CircularYearCalendar from './CircularYearCalendar';
import RunicSymbol from './RunicSymbol';

export default function ReadingAnalytics() {
  const navigate = useNavigate();
  const [readings, setReadings] = useState<SavedReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [colorBy, setColorBy] = useState<'sentiment' | 'accuracy' | 'power'>('power');
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, [year]);

  const loadData = async () => {
    setLoading(true);
    setError('');

    const { data: readingsData, error: readingsError } = await getUserReadings();
    if (readingsError) {
      setError(readingsError.message);
      setLoading(false);
      return;
    }

    setReadings(readingsData || []);

    const analyticsData = await getReadingAnalytics(year);
    setAnalytics(analyticsData);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="calan-branded min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: '#d4af37' }} />
          <p style={{ color: '#f5e6d3', fontFamily: 'Cinzel, serif' }}>
            Analyzing your readings...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="calan-branded min-h-screen flex items-center justify-center p-4">
        <div className="text-center" style={{ color: '#ff6b6b' }}>
          {error}
        </div>
      </div>
    );
  }

  const yearReadings = readings.filter(r => {
    const readingYear = new Date(r.created_at).getFullYear();
    return readingYear === year;
  });

  return (
    <div className="calan-branded min-h-screen relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-15">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="calan-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
              <path d="M60 20 Q75 35 60 50 Q45 35 60 20" stroke="#d4af37" strokeWidth="1.5" fill="none" opacity="0.4" />
              <path d="M20 60 Q35 45 50 60 Q35 75 20 60" stroke="#cd7f32" strokeWidth="1.5" fill="none" opacity="0.4" />
              <circle cx="60" cy="60" r="15" stroke="#d4af37" strokeWidth="1" fill="none" opacity="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#calan-pattern)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <CelticBorder>
            <div className="p-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{
                fontFamily: 'Cinzel, serif',
                color: '#d4af37',
                textShadow: '0 0 20px rgba(212, 175, 55, 0.6)'
              }}>
                Reading Analytics
              </h1>
              <div className="w-48 h-1 mx-auto mb-4 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
              <p className="text-xl" style={{ color: '#f5e6d3' }}>
                Track patterns and insights across time
              </p>
            </div>
          </CelticBorder>
        </div>

        {/* Year Selector */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setYear(year - 1)}
            className="px-6 py-2 border-2 border-amber-700 hover:border-amber-500 transition-all"
            style={{ color: '#d4af37', fontFamily: 'Cinzel, serif' }}
          >
            ← {year - 1}
          </button>
          <span className="px-8 py-2 bg-amber-900/30 border-2 border-amber-700 text-2xl font-bold"
                style={{ color: '#d4af37', fontFamily: 'Cinzel, serif' }}>
            {year}
          </span>
          <button
            onClick={() => setYear(year + 1)}
            disabled={year >= new Date().getFullYear()}
            className="px-6 py-2 border-2 border-amber-700 hover:border-amber-500 transition-all disabled:opacity-30"
            style={{ color: '#d4af37', fontFamily: 'Cinzel, serif' }}
          >
            {year + 1} →
          </button>
        </div>

        {yearReadings.length === 0 ? (
          <CelticBorder>
            <div className="p-12 text-center">
              <p className="text-xl" style={{ color: '#f5e6d3', fontFamily: 'Cinzel, serif' }}>
                No readings for {year}
              </p>
              <button
                onClick={() => navigate('/')}
                className="mt-6 px-8 py-3 bg-gradient-to-br from-amber-200 via-amber-300 to-amber-400 border-2 border-amber-500"
                style={{ color: '#7c2d12', fontFamily: 'Cinzel, serif', fontWeight: 'bold' }}
              >
                Get a Reading
              </button>
            </div>
          </CelticBorder>
        ) : (
          <>
            {/* Overview Stats */}
            {analytics && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <CelticBorder>
                  <div className="p-6 text-center">
                    <TrendingUp className="w-8 h-8 mx-auto mb-2" style={{ color: '#d4af37' }} />
                    <div className="text-3xl font-bold mb-1" style={{ color: '#d4af37', fontFamily: 'Cinzel, serif' }}>
                      {analytics.totalReadings}
                    </div>
                    <div className="text-sm" style={{ color: '#cd7f32', fontFamily: 'Cinzel, serif' }}>
                      Total Readings
                    </div>
                  </div>
                </CelticBorder>

                <CelticBorder>
                  <div className="p-6 text-center">
                    <Moon className="w-8 h-8 mx-auto mb-2" style={{ color: '#d4af37' }} />
                    <div className="text-3xl font-bold mb-1" style={{ color: '#d4af37', fontFamily: 'Cinzel, serif' }}>
                      {analytics.averageAccuracy > 0 ? analytics.averageAccuracy.toFixed(1) : 'N/A'}
                    </div>
                    <div className="text-sm" style={{ color: '#cd7f32', fontFamily: 'Cinzel, serif' }}>
                      Avg Accuracy
                    </div>
                  </div>
                </CelticBorder>

                <CelticBorder>
                  <div className="p-6 text-center">
                    <Zap className="w-8 h-8 mx-auto mb-2" style={{ color: '#d4af37' }} />
                    <div className="text-3xl font-bold mb-1" style={{ color: '#d4af37', fontFamily: 'Cinzel, serif' }}>
                      {analytics.averagePowerScore.toFixed(0)}
                    </div>
                    <div className="text-sm" style={{ color: '#cd7f32', fontFamily: 'Cinzel, serif' }}>
                      Avg Power Score
                    </div>
                  </div>
                </CelticBorder>

                <CelticBorder>
                  <div className="p-6 text-center">
                    <Heart className="w-8 h-8 mx-auto mb-2" style={{ color: '#d4af37' }} />
                    <div className="text-3xl font-bold mb-1 capitalize" style={{ color: '#d4af37', fontFamily: 'Cinzel, serif' }}>
                      {analytics.mostCommonSentiment}
                    </div>
                    <div className="text-sm" style={{ color: '#cd7f32', fontFamily: 'Cinzel, serif' }}>
                      Most Common Mood
                    </div>
                  </div>
                </CelticBorder>
              </div>
            )}

            {/* Circular Calendar */}
            <div className="mb-12">
              <CelticBorder>
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <RunicSymbol variant="ansuz" className="w-8 h-10" style={{ color: '#d4af37' }} />
                    <h2 className="text-2xl font-bold" style={{ fontFamily: 'Cinzel, serif', color: '#d4af37' }}>
                      Yearly Overview
                    </h2>
                  </div>

                  {/* Color By Selector */}
                  <div className="flex justify-center gap-4 mb-6">
                    <button
                      onClick={() => setColorBy('power')}
                      className={`px-6 py-2 border-2 transition-all ${
                        colorBy === 'power' ? 'border-amber-500 bg-amber-900/30' : 'border-amber-900/30'
                      }`}
                      style={{ color: '#d4af37', fontFamily: 'Cinzel, serif' }}
                    >
                      Power Score
                    </button>
                    <button
                      onClick={() => setColorBy('sentiment')}
                      className={`px-6 py-2 border-2 transition-all ${
                        colorBy === 'sentiment' ? 'border-amber-500 bg-amber-900/30' : 'border-amber-900/30'
                      }`}
                      style={{ color: '#d4af37', fontFamily: 'Cinzel, serif' }}
                    >
                      Sentiment
                    </button>
                    <button
                      onClick={() => setColorBy('accuracy')}
                      className={`px-6 py-2 border-2 transition-all ${
                        colorBy === 'accuracy' ? 'border-amber-500 bg-amber-900/30' : 'border-amber-900/30'
                      }`}
                      style={{ color: '#d4af37', fontFamily: 'Cinzel, serif' }}
                    >
                      Accuracy
                    </button>
                  </div>

                  <CircularYearCalendar readings={yearReadings} year={year} colorBy={colorBy} />
                </div>
              </CelticBorder>
            </div>

            {/* Charts */}
            {analytics && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Readings by Month */}
                <CelticBorder>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-4" style={{ fontFamily: 'Cinzel, serif', color: '#d4af37' }}>
                      Readings by Month
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={analytics.readingsByMonth}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#cd7f32" opacity={0.2} />
                        <XAxis dataKey="month" stroke="#d4af37" style={{ fontFamily: 'Cinzel, serif' }} />
                        <YAxis stroke="#d4af37" style={{ fontFamily: 'Cinzel, serif' }} />
                        <Tooltip contentStyle={{ backgroundColor: '#1a2332', border: '1px solid #d4af37', fontFamily: 'Cinzel, serif' }} />
                        <Bar dataKey="count" fill="#d4af37" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CelticBorder>

                {/* Readings by Celtic Festival */}
                <CelticBorder>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-4" style={{ fontFamily: 'Cinzel, serif', color: '#d4af37' }}>
                      Readings by Celtic Festival
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={analytics.readingsByFestival}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#cd7f32" opacity={0.2} />
                        <XAxis dataKey="festival" stroke="#d4af37" style={{ fontFamily: 'Cinzel, serif', fontSize: '10px' }} angle={-45} textAnchor="end" height={100} />
                        <YAxis stroke="#d4af37" style={{ fontFamily: 'Cinzel, serif' }} />
                        <Tooltip contentStyle={{ backgroundColor: '#1a2332', border: '1px solid #d4af37', fontFamily: 'Cinzel, serif' }} />
                        <Bar dataKey="count" fill="#cd7f32" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CelticBorder>

                {/* Card Frequency */}
                <CelticBorder>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-4" style={{ fontFamily: 'Cinzel, serif', color: '#d4af37' }}>
                      Most Drawn Cards
                    </h3>
                    <div className="space-y-2">
                      {analytics.cardFrequency.slice(0, 10).map((item: any, i: number) => (
                        <div key={i} className="flex justify-between items-center">
                          <span style={{ color: '#f5e6d3', fontFamily: 'Cinzel, serif' }}>{item.card}</span>
                          <span style={{ color: '#d4af37', fontFamily: 'Cinzel, serif', fontWeight: 'bold' }}>{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CelticBorder>

                {/* Spread Type Distribution */}
                <CelticBorder>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-4" style={{ fontFamily: 'Cinzel, serif', color: '#d4af37' }}>
                      Spread Type Distribution
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={analytics.spreadTypeDistribution}
                          dataKey="count"
                          nameKey="type"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label
                        >
                          {analytics.spreadTypeDistribution.map((_: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={['#d4af37', '#cd7f32', '#5DD9C1'][index % 3]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#1a2332', border: '1px solid #d4af37', fontFamily: 'Cinzel, serif' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CelticBorder>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
