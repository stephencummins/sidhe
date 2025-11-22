import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CelticBorder from './CelticBorder';
import { useSubscription } from '../contexts/SubscriptionContext';

export default function SuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refreshSubscription } = useSubscription();
  const type = searchParams.get('type');

  useEffect(() => {
    // Refresh subscription state after successful payment
    refreshSubscription();
  }, [refreshSubscription]);

  const isSubscription = type === 'subscription';
  const isCelticCross = type === 'celtic-cross';

  return (
    <div className="calan-branded min-h-screen relative overflow-hidden py-16 flex items-center justify-center">
      <div className="max-w-md mx-auto px-4">
        <CelticBorder>
          <div className="p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
                <span className="text-4xl">✓</span>
              </div>
            </div>

            <h1 className="text-3xl font-bold mb-4" style={{
              fontFamily: 'Cinzel, serif',
              color: '#d4af37',
              textShadow: '0 0 20px rgba(212, 175, 55, 0.6)'
            }}>
              {isSubscription ? 'Welcome!' : isCelticCross ? 'Purchase Complete!' : 'Success!'}
            </h1>

            <p className="mb-6" style={{
              color: '#f5e6d3',
              textShadow: '0 1px 3px rgba(0,0,0,0.8)'
            }}>
              {isSubscription
                ? 'Your subscription is now active. Thank you for joining us on this mystical journey.'
                : isCelticCross
                ? 'Your Celtic Cross reading credit has been added to your account.'
                : 'Thank you for your purchase.'}
            </p>

            <div className="space-y-3">
              {isCelticCross && (
                <button
                  onClick={() => navigate('/reading')}
                  className="w-full py-3 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold rounded transition-colors"
                >
                  Start Your Reading
                </button>
              )}

              {isSubscription && (
                <button
                  onClick={() => navigate('/daily')}
                  className="w-full py-3 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold rounded transition-colors"
                >
                  View Daily Reading
                </button>
              )}

              <button
                onClick={() => navigate('/')}
                className="w-full py-3 px-6 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded transition-colors"
              >
                Return Home
              </button>
            </div>
          </div>
        </CelticBorder>
      </div>
    </div>
  );
}
