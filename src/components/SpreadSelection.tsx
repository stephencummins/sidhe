import { spreads } from '../data/spreads';
import { SpreadType } from '../types';
import CelticBorder from './CelticBorder';

interface SpreadSelectionProps {
  onSpreadSelect: (spreadType: SpreadType) => void;
}

export default function SpreadSelection({ onSpreadSelect }: SpreadSelectionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-teal-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="spread-pattern" x="0" y="0" width="150" height="150" patternUnits="userSpaceOnUse">
              <circle cx="75" cy="75" r="30" stroke="#b45309" strokeWidth="2" fill="none" opacity="0.3" />
              <path d="M75 45 L90 75 L75 105 L60 75 Z" stroke="#d97706" strokeWidth="1.5" fill="none" opacity="0.4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#spread-pattern)" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto w-full relative z-10">
        <div className="text-center mb-16">
          <div className="mb-6">
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-amber-800 via-orange-700 to-red-800 bg-clip-text text-transparent" style={{ fontFamily: 'Cinzel, serif' }}>
              Choose Your Sacred Spread
            </h2>
            <div className="w-64 h-1 mx-auto bg-gradient-to-r from-transparent via-amber-700 to-transparent" />
          </div>
          <p className="text-xl text-amber-900/80 italic">Select the pattern that speaks to your soul</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {spreads.map((spread) => (
            <button
              key={spread.id}
              onClick={() => onSpreadSelect(spread.id)}
              className="group transform hover:scale-105 transition-all duration-500 text-left"
            >
              <CelticBorder>
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-700 to-orange-800 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                      <span className="text-2xl font-bold text-amber-50">{spread.cardCount}</span>
                    </div>
                    <div className="px-4 py-2 bg-amber-700/20 border-2 border-amber-700/40 text-amber-900 font-semibold text-sm rounded">
                      {spread.cardCount === 1 ? 'Card' : 'Cards'}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-amber-900 mb-3 group-hover:text-orange-700 transition-colors" style={{ fontFamily: 'Cinzel, serif' }}>
                    {spread.name}
                  </h3>

                  <p className="text-orange-800/80 leading-relaxed mb-6">
                    {spread.description}
                  </p>

                  <div className="pt-4 border-t-2 border-amber-700/30">
                    <p className="text-xs text-amber-800 font-bold uppercase tracking-wider mb-3" style={{ fontFamily: 'Cinzel, serif' }}>
                      Positions:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {spread.positions.slice(0, 3).map((position, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-gradient-to-br from-amber-100 to-orange-100 text-amber-900 px-3 py-1 border border-amber-600/30 rounded-full font-medium"
                        >
                          {position}
                        </span>
                      ))}
                      {spread.positions.length > 3 && (
                        <span className="text-xs bg-gradient-to-br from-orange-100 to-red-100 text-orange-900 px-3 py-1 border border-orange-600/40 rounded-full font-medium">
                          +{spread.positions.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CelticBorder>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
