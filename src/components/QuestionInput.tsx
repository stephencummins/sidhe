import { useState } from 'react';

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
    <div className="min-h-screen bg-gradient-to-br from-stone-900 via-amber-950 to-stone-950 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-amber-100 mb-4" style={{ fontFamily: 'Georgia, serif' }}>What Guidance Do You Seek?</h2>
          <p className="text-amber-200/80 text-lg" style={{ fontFamily: 'Georgia, serif' }}>Share your question or intention for the divination</p>
        </div>

        <div className="relative bg-stone-900/60 backdrop-blur-sm border-2 border-amber-900/50 p-8">
          <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-amber-700/40"></div>
          <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-amber-700/40"></div>
          <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-amber-700/40"></div>
          <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-amber-700/40"></div>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value.slice(0, maxLength))}
            placeholder="e.g., career decision, relationship guidance, personal growth..."
            className="w-full h-40 bg-amber-950/30 text-amber-100 placeholder-amber-700/50 border-2 border-amber-900/50 p-4 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-amber-600 resize-none"
            style={{ fontFamily: 'Georgia, serif' }}
          />

          <div className="mt-4 flex items-center justify-between">
            <span className={`text-sm ${question.length >= maxLength ? 'text-amber-400' : 'text-amber-600/60'}`} style={{ fontFamily: 'Georgia, serif' }}>
              {question.length} / {maxLength}
            </span>
          </div>

          <div className="mt-8 flex gap-4">
            <button
              onClick={handleSkip}
              className="flex-1 px-6 py-3 bg-stone-800 text-amber-200 border-2 border-amber-900/50 hover:border-amber-700 hover:bg-stone-700 transition-all duration-200"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Skip
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-700 via-orange-800 to-amber-700 text-amber-50 border-2 border-amber-600/50 hover:border-amber-500 transition-all duration-200 font-semibold shadow-lg hover:shadow-amber-700/40"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Continue
            </button>
          </div>
        </div>

        <div className="mt-8 text-center text-amber-400/70 text-sm">
          <p style={{ fontFamily: 'Georgia, serif' }}>Speak clearly to the ancient forces for greater wisdom</p>
        </div>
      </div>
    </div>
  );
}
