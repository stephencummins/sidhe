import { spreads } from '../data/spreads';
import { SpreadType } from '../types';
import CelticBorder from './CelticBorder';

interface SpreadSelectionProps {
  onSpreadSelect: (spreadType: SpreadType) => void;
}

export default function SpreadSelection({ onSpreadSelect }: SpreadSelectionProps) {
  return (
    <div className="calan-branded min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Celtic Pattern Background */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="spread-pattern" x="0" y="0" width="150" height="150" patternUnits="userSpaceOnUse">
              <circle cx="75" cy="75" r="30" stroke="#d4af37" strokeWidth="2" fill="none" opacity="0.3" />
              <path d="M75 45 L90 75 L75 105 L60 75 Z" stroke="#cd7f32" strokeWidth="1.5" fill="none" opacity="0.4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#spread-pattern)" />
        </svg>
      </div>

      {/* Gradient Overlays */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent" />

      <div className="max-w-6xl mx-auto w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="mb-6">
            <h2 className="text-5xl font-bold mb-4" style={{ 
              fontFamily: 'Cinzel, serif',
              color: '#d4af37',
              textShadow: '0 0 20px rgba(212, 175, 55, 0.6), 0 2px 4px rgba(0,0,0,0.8)'
            }}>
              Choose Your Sacred Spread
            </h2>
            <div className="w-64 h-1 mx-auto bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
          </div>
          <p className="text-xl italic" style={{ 
            color: '#f5e6d3',
            textShadow: '0 1px 3px rgba(0,0,0,0.8)'
          }}>
            Select the pattern that speaks to your soul
          </p>
        </div>

        {/* Spread Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {spreads.map((spread) => (
            <button
              key={spread.id}
              onClick={() => onSpreadSelect(spread.id)}
              className="group transform hover:scale-105 transition-all duration-500 text-left"
            >
              <CelticBorder>
                <div className="p-8">
                  {/* Card Count Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg group-hover:shadow-amber-500/50 transition-shadow border-2 border-amber-300">
                      <span className="text-2xl font-bold text-amber-950">{spread.cardCount}</span>
                    </div>
                    <div className="px-4 py-2 bg-amber-600/30 border-2 border-amber-500/60 font-semibold text-sm rounded" 
                      style={{ 
                        color: '#d4af37',
                        textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                      }}>
                      {spread.cardCount === 1 ? 'Card' : 'Cards'}
                    </div>
                  </div>

                  {/* Spread Name */}
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-amber-300 transition-colors" style={{ 
                    fontFamily: 'Cinzel, serif',
                    color: '#d4af37',
                    textShadow: '0 1px 3px rgba(0,0,0,0.8)'
                  }}>
                    {spread.name}
                  </h3>

                  {/* Description */}
                  <p className="leading-relaxed mb-6 text-lg" style={{ 
                    color: '#f5e6d3',
                    textShadow: '0 1px 2px rgba(0,0,0,0.7)'
                  }}>
                    {spread.description}
                  </p>

                  {/* Positions Preview */}
                  <div className="pt-4 border-t-2 border-amber-600/40">
                    <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ 
                      fontFamily: 'Cinzel, serif',
                      color: '#cd7f32',
                      textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                    }}>
                      Positions:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {spread.positions.slice(0, 3).map((position, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-3 py-1 border rounded-full font-medium"
                          style={{
                            background: 'rgba(212, 175, 55, 0.2)',
                            borderColor: 'rgba(212, 175, 55, 0.6)',
                            color: '#f5e6d3',
                            textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                          }}
                        >
                          {position}
                        </span>
                      ))}
                      {spread.positions.length > 3 && (
                        <span className="text-xs px-3 py-1 border rounded-full font-medium"
                          style={{
                            background: 'rgba(205, 127, 50, 0.2)',
                            borderColor: 'rgba(205, 127, 50, 0.6)',
                            color: '#f5e6d3',
                            textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                          }}>
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

        {/* Footer Quote */}
        <div className="mt-16 text-center">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-50 mb-6" />
          <p className="text-sm italic" style={{ 
            color: '#f5e6d3', 
            opacity: 0.8,
            textShadow: '0 1px 2px rgba(0,0,0,0.8)'
          }}>
            "In the arrangement of cards lies the map of your journey"
          </p>
        </div>
      </div>
    </div>
  );
}