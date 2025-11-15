import { useState } from 'react';
import CelticBorder from './CelticBorder';
import { supabase } from '../lib/supabase';

type ActionType = 'subscribe' | 'unsubscribe';

export default function DailyReadingSubscription() {
  const [email, setEmail] = useState('');
  const [action, setAction] = useState<ActionType>('subscribe');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setMessage({ text: 'Please enter your email address', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const functionName = action === 'subscribe' ? 'subscribe' : 'unsubscribe';

      const { data, error } = await supabase.functions.invoke(functionName, {
        body: { email: email.trim().toLowerCase() }
      });

      if (error) throw error;

      // Handle success
      setMessage({
        text: data.message || `Successfully ${action}d!`,
        type: 'success'
      });

      // Clear email on success
      setEmail('');
    } catch (error) {
      console.error(`${action} error:`, error);
      setMessage({
        text: error.message || `Failed to ${action}. Please try again.`,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <CelticBorder>
      <div className="p-8">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold mb-2" style={{
            fontFamily: 'Cinzel, serif',
            color: '#d4af37',
            textShadow: '0 1px 2px rgba(0,0,0,0.8)'
          }}>
            Personal Tarot Reading
          </h3>
          <p className="text-base leading-relaxed" style={{
            color: '#f5e6d3',
            textShadow: '0 1px 2px rgba(0,0,0,0.7)'
          }}>
            Receive your personalized three-card reading delivered daily to your inbox
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Action Toggle */}
          <div className="flex justify-center gap-2 mb-4">
            <button
              type="button"
              onClick={() => setAction('subscribe')}
              className={`px-4 py-2 text-sm font-medium transition-all duration-300 ${
                action === 'subscribe'
                  ? 'bg-amber-600 text-amber-50 border-2 border-amber-500'
                  : 'bg-amber-900/30 text-amber-300 border-2 border-amber-700/30 hover:border-amber-600/50'
              }`}
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              Subscribe
            </button>
            <button
              type="button"
              onClick={() => setAction('unsubscribe')}
              className={`px-4 py-2 text-sm font-medium transition-all duration-300 ${
                action === 'unsubscribe'
                  ? 'bg-amber-600 text-amber-50 border-2 border-amber-500'
                  : 'bg-amber-900/30 text-amber-300 border-2 border-amber-700/30 hover:border-amber-600/50'
              }`}
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              Unsubscribe
            </button>
          </div>

          {/* Email Input */}
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full px-4 py-3 bg-stone-900/50 border-2 border-amber-700/40 focus:border-amber-500 focus:outline-none transition-colors"
              style={{
                color: '#f5e6d3',
                fontFamily: 'Cormorant Garamond, serif'
              }}
              disabled={loading}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-amber-950 font-bold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border-2 border-amber-400"
            style={{ fontFamily: 'Cinzel, serif' }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              action === 'subscribe' ? 'Get My Personal Reading Daily' : 'Unsubscribe from Daily Readings'
            )}
          </button>

          {/* Message Display */}
          {message && (
            <div className={`p-4 border-2 ${
              message.type === 'success'
                ? 'bg-green-900/20 border-green-600/50 text-green-300'
                : message.type === 'error'
                ? 'bg-red-900/20 border-red-600/50 text-red-300'
                : 'bg-amber-900/20 border-amber-600/50 text-amber-300'
            }`}>
              <p className="text-sm text-center" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                {message.text}
              </p>
            </div>
          )}
        </form>

        <p className="mt-6 text-center text-xs italic" style={{
          color: '#cd7f32',
          textShadow: '0 1px 2px rgba(0,0,0,0.8)'
        }}>
          Your email will only be used for your personal tarot readings. Unsubscribe anytime.
        </p>
      </div>
    </CelticBorder>
  );
}
