import { spreads } from '../data/spreads';
import { SpreadType } from '../types';
import RunicSymbol from './RunicSymbol';

interface SpreadSelectionProps {
  onSpreadSelect: (spreadType: SpreadType) => void;
}

export default function SpreadSelection({ onSpreadSelect }: SpreadSelectionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-900 via-amber-950 to-stone-950 flex items-center justify-center p-4">
      <div className="max-w-5xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-amber-100 mb-4" style={{ fontFamily: 'Georgia, serif' }}>Choose Your Spread</h2>
          <p className="text-amber-200/80 text-lg" style={{ fontFamily: 'Georgia, serif' }}>Select the ancient pattern for your divination</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {spreads.map((spread) => (
            <button
              key={spread.id}
              onClick={() => onSpreadSelect(spread.id)}
              className="group relative bg-gradient-to-br from-stone-900/80 to-amber-950/60 p-8 border-2 border-amber-900/50 hover:border-amber-600 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-amber-700/40 text-left backdrop-blur-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-700/0 to-orange-900/0 group-hover:from-amber-700/10 group-hover:to-orange-900/10 transition-all duration-300"></div>
              <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-amber-700/30"></div>
              <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-amber-700/30"></div>
              <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-amber-700/30"></div>
              <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-amber-700/30"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <RunicSymbol variant={spread.id === 'single' ? 'algiz' : spread.id === 'three-card' ? 'ansuz' : 'othala'} className="w-10 h-12 text-amber-600/70" />
                  <span className="bg-amber-900/40 text-amber-300 px-3 py-1 border border-amber-700/50 text-sm font-semibold" style={{ fontFamily: 'Georgia, serif' }}>
                    {spread.cardCount} {spread.cardCount === 1 ? 'Card' : 'Cards'}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-amber-100 mb-3 group-hover:text-amber-300 transition-colors" style={{ fontFamily: 'Georgia, serif' }}>
                  {spread.name}
                </h3>

                <p className="text-amber-200/70 leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                  {spread.description}
                </p>

                <div className="mt-6 pt-6 border-t border-amber-900/40">
                  <p className="text-xs text-amber-400/70 uppercase tracking-wider mb-2" style={{ fontFamily: 'Georgia, serif' }}>Positions Include:</p>
                  <div className="flex flex-wrap gap-2">
                    {spread.positions.slice(0, 3).map((position, idx) => (
                      <span key={idx} className="text-xs bg-amber-950/50 text-amber-300/80 px-2 py-1 border border-amber-800/40" style={{ fontFamily: 'Georgia, serif' }}>
                        {position}
                      </span>
                    ))}
                    {spread.positions.length > 3 && (
                      <span className="text-xs bg-amber-950/50 text-amber-300/80 px-2 py-1 border border-amber-800/40" style={{ fontFamily: 'Georgia, serif' }}>
                        +{spread.positions.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
