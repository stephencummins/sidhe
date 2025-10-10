import { useState } from 'react';
import CelticBorder from './CelticBorder';

interface QuestionInputProps {
  onSubmit: (question: string) => void;
}

export default function QuestionInput({ onSubmit }: QuestionInputProps) {
  const [question, setQuestion] = useState('');
  const maxLength = 200;

  const handleSubmit = () => {
    onSubmit(question.trim());
  };

  const handleSkip = () => {
    onSubmit('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-teal-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="question-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M50 20 Q60 30 50 40 Q40 30 50 20" stroke="#b45309" strokeWidth="1" fill="none" opacity="0.4" />
              <circle cx="50" cy="50" r="8" stroke="#d97706" strokeWidth="1" fill="none" opacity="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#question-pattern)" />
        </svg>
      </div>

      <div className="max-w-3xl mx-auto w-full relative z-10">
        <div className="text-center mb-12">
          <div className="mb-6">
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-amber-800 via-orange-700 to-red-800 bg-clip-text text-transparent" style={{ fontFamily: 'Cinzel, serif' }}>
              What Guidance Do You Seek?
            </h2>
            <div className="w-64 h-1 mx-auto bg-gradient-to-r from-transparent via-amber-700 to-transparent" />
          </div>
          <p className="text-xl text-amber-900/80 italic">Share your question with the ancient spirits</p>
        </div>

        <CelticBorder>
          <div className="p-8">
            <div className="mb-6">
              <div className="relative">
                <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-amber-700/50" />
                <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-amber-700/50" />
                <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-amber-700/50" />
                <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-amber-700/50" />
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value.slice(0, maxLength))}
                  placeholder="What weighs upon your heart? What path do you seek to illuminate?"
                  className="w-full h-48 bg-gradient-to-br from-amber-50/50 to-orange-50/50 text-amber-900 placeholder-amber-700/40 border-2 border-amber-700/30 p-6 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-amber-600 resize-none rounded-sm text-lg leading-relaxed"
                  style={{ fontFamily: 'Crimson Text, serif' }}
                />
              </div>

              <div className="mt-4 flex items-center justify-between px-2">
                <span className="text-sm text-amber-800/60 italic">
                  Speak from the heart...
                </span>
                <span className={`text-sm font-semibold ${question.length >= maxLength ? 'text-orange-700' : 'text-amber-700/60'}`}>
                  {question.length} / {maxLength}
                </span>
              </div>
            </div>

            <div className="border-t-2 border-amber-700/30 pt-6 mt-6">
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleSkip}
                  className="px-8 py-4 bg-gradient-to-br from-amber-100 to-orange-100 text-amber-900 border-2 border-amber-700/40 hover:border-amber-700 hover:shadow-lg transition-all duration-300 font-semibold rounded"
                  style={{ fontFamily: 'Cinzel, serif' }}
                >
                  Skip
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-8 py-4 bg-gradient-to-r from-amber-700 via-orange-600 to-red-700 text-amber-50 border-2 border-amber-900 hover:border-orange-800 hover:shadow-xl transition-all duration-300 font-bold rounded relative overflow-hidden group"
                  style={{ fontFamily: 'Cinzel, serif' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                  <span className="relative z-10">Continue Journey</span>
                </button>
              </div>
            </div>
          </div>
        </CelticBorder>

        <div className="mt-8 text-center">
          <p className="text-amber-900/60 text-sm italic">
            "The clearer your question, the more profound the wisdom revealed"
          </p>
        </div>
      </div>
    </div>
  );
}
