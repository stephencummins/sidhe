import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CelticBorder from './CelticBorder';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';

export default function PricingPage() {
  const navigate = useNavigate();
  const { user, signInWithGoogle } = useAuth();
  const { tier, subscribe, buyCelticCross, openBillingPortal, celticCrossCredits } = useSubscription();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async (selectedTier: 'subscriber' | 'vip') => {
    setError(null);
    setLoading(selectedTier);

    try {
      if (!user) {
        await signInWithGoogle();
        return;
      }
      await subscribe(selectedTier);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start checkout');
    } finally {
      setLoading(null);
    }
  };

  const handleBuyCelticCross = async () => {
    setError(null);
    setLoading('celtic');

    try {
      if (!user) {
        await signInWithGoogle();
        return;
      }
      await buyCelticCross();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start checkout');
    } finally {
      setLoading(null);
    }
  };

  const handleManageSubscription = async () => {
    setError(null);
    setLoading('manage');

    try {
      await openBillingPortal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to open billing portal');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="calan-branded min-h-screen relative overflow-hidden py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4" style={{
            fontFamily: 'Cinzel, serif',
            color: '#d4af37',
            textShadow: '0 0 20px rgba(212, 175, 55, 0.6)'
          }}>
            Choose Your Path
          </h1>
          <p className="text-xl" style={{
            color: '#f5e6d3',
            textShadow: '0 1px 3px rgba(0,0,0,0.8)'
          }}>
            Unlock the full power of Celtic tarot wisdom
          </p>
        </div>

        {error && (
          <div className="max-w-md mx-auto mb-8 p-4 bg-red-900/50 border border-red-500 rounded text-red-200 text-center">
            {error}
          </div>
        )}

        {/* Current subscription status */}
        {user && tier !== 'free' && (
          <div className="max-w-md mx-auto mb-8 text-center">
            <p className="text-amber-300 mb-2">
              Current plan: <span className="font-bold capitalize">{tier}</span>
            </p>
            <button
              onClick={handleManageSubscription}
              disabled={loading === 'manage'}
              className="text-sm text-amber-500 hover:text-amber-400 underline"
            >
              {loading === 'manage' ? 'Loading...' : 'Manage subscription'}
            </button>
          </div>
        )}

        {/* Celtic Cross credits */}
        {user && celticCrossCredits > 0 && tier !== 'vip' && (
          <div className="max-w-md mx-auto mb-8 text-center">
            <p className="text-purple-300">
              Celtic Cross credits: <span className="font-bold">{celticCrossCredits}</span>
            </p>
          </div>
        )}

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16">
          {/* Free Tier */}
          <CelticBorder>
            <div className="p-8 text-center h-full flex flex-col">
              <h3 className="text-2xl font-bold mb-2" style={{
                fontFamily: 'Cinzel, serif',
                color: '#d4af37'
              }}>
                Free
              </h3>
              <p className="text-4xl font-bold mb-4" style={{ color: '#f5e6d3' }}>
                £0
              </p>
              <ul className="text-left mb-8 flex-grow space-y-3" style={{ color: '#f5e6d3' }}>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  Yes/No one-card reading
                </li>
                <li className="flex items-start">
                  <span className="text-gray-500 mr-2">✗</span>
                  <span className="text-gray-400">Daily 3-card reading</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-500 mr-2">✗</span>
                  <span className="text-gray-400">Save readings</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-500 mr-2">✗</span>
                  <span className="text-gray-400">Analysis tool</span>
                </li>
              </ul>
              <button
                onClick={() => navigate('/reading')}
                className="w-full py-3 px-6 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded transition-colors"
              >
                Get Started
              </button>
            </div>
          </CelticBorder>

          {/* Subscriber Tier */}
          <CelticBorder>
            <div className="p-8 text-center h-full flex flex-col">
              <h3 className="text-2xl font-bold mb-2" style={{
                fontFamily: 'Cinzel, serif',
                color: '#d4af37'
              }}>
                Subscriber
              </h3>
              <p className="text-4xl font-bold mb-1" style={{ color: '#f5e6d3' }}>
                £4.99
              </p>
              <p className="text-sm mb-4" style={{ color: '#f5e6d3', opacity: 0.7 }}>
                per month
              </p>
              <ul className="text-left mb-8 flex-grow space-y-3" style={{ color: '#f5e6d3' }}>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  Yes/No one-card reading
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  Daily 3-card reading email
                </li>
                <li className="flex items-start">
                  <span className="text-gray-500 mr-2">✗</span>
                  <span className="text-gray-400">Save readings</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-500 mr-2">✗</span>
                  <span className="text-gray-400">Analysis tool</span>
                </li>
              </ul>
              <button
                onClick={() => handleSubscribe('subscriber')}
                disabled={loading === 'subscriber' || tier === 'subscriber' || tier === 'vip'}
                className={`w-full py-3 px-6 font-semibold rounded transition-colors ${
                  tier === 'subscriber' || tier === 'vip'
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-amber-600 hover:bg-amber-500 text-white'
                }`}
              >
                {loading === 'subscriber' ? 'Loading...' :
                 tier === 'subscriber' ? 'Current Plan' :
                 tier === 'vip' ? 'Included in VIP' :
                 !user ? 'Sign in to Subscribe' : 'Subscribe'}
              </button>
            </div>
          </CelticBorder>

          {/* VIP Tier */}
          <CelticBorder className="ring-2 ring-amber-500">
            <div className="p-8 text-center h-full flex flex-col relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-amber-500 text-black px-3 py-1 text-xs font-bold rounded z-20">
                MOST POPULAR
              </div>
              <h3 className="text-2xl font-bold mb-2" style={{
                fontFamily: 'Cinzel, serif',
                color: '#d4af37'
              }}>
                VIP
              </h3>
              <p className="text-4xl font-bold mb-1" style={{ color: '#f5e6d3' }}>
                £9.99
              </p>
              <p className="text-sm mb-4" style={{ color: '#f5e6d3', opacity: 0.7 }}>
                per month
              </p>
              <ul className="text-left mb-8 flex-grow space-y-3" style={{ color: '#f5e6d3' }}>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  Yes/No one-card reading
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  Daily 3-card reading email
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  Unlimited Celtic Cross
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  Save readings
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  Analysis tool
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  Winds of Change
                </li>
              </ul>
              <button
                onClick={() => handleSubscribe('vip')}
                disabled={loading === 'vip' || tier === 'vip'}
                className={`w-full py-3 px-6 font-semibold rounded transition-colors ${
                  tier === 'vip'
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black'
                }`}
              >
                {loading === 'vip' ? 'Loading...' :
                 tier === 'vip' ? 'Current Plan' :
                 !user ? 'Sign in to Subscribe' : 'Subscribe'}
              </button>
            </div>
          </CelticBorder>
        </div>

        {/* One-off purchase */}
        <div className="max-w-md mx-auto">
          <CelticBorder>
            <div className="p-8 text-center">
              <h3 className="text-xl font-bold mb-2" style={{
                fontFamily: 'Cinzel, serif',
                color: '#d4af37'
              }}>
                Celtic Cross Reading
              </h3>
              <p className="text-3xl font-bold mb-2" style={{ color: '#f5e6d3' }}>
                £4.99
              </p>
              <p className="text-sm mb-6" style={{ color: '#f5e6d3', opacity: 0.7 }}>
                One-time purchase
              </p>
              <p className="text-sm mb-6" style={{ color: '#f5e6d3' }}>
                Get a detailed 10-card Celtic Cross spread with in-depth interpretation
              </p>
              <button
                onClick={handleBuyCelticCross}
                disabled={loading === 'celtic' || tier === 'vip'}
                className={`w-full py-3 px-6 font-semibold rounded transition-colors ${
                  tier === 'vip'
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-500 text-white'
                }`}
              >
                {loading === 'celtic' ? 'Loading...' :
                 tier === 'vip' ? 'Included in VIP' :
                 !user ? 'Sign in to Purchase' : 'Buy Now'}
              </button>
            </div>
          </CelticBorder>
        </div>

        {/* FAQ */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-6" style={{
            fontFamily: 'Cinzel, serif',
            color: '#d4af37'
          }}>
            Questions?
          </h3>
          <div className="space-y-4 max-w-2xl mx-auto text-left">
            <div>
              <h4 className="font-semibold text-amber-300">Can I cancel anytime?</h4>
              <p className="text-sm" style={{ color: '#f5e6d3', opacity: 0.8 }}>
                Yes! You can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-amber-300">What payment methods do you accept?</h4>
              <p className="text-sm" style={{ color: '#f5e6d3', opacity: 0.8 }}>
                We accept all major credit and debit cards through our secure payment provider, Stripe.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-amber-300">Do Celtic Cross credits expire?</h4>
              <p className="text-sm" style={{ color: '#f5e6d3', opacity: 0.8 }}>
                No, your purchased credits never expire. Use them whenever you're ready.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
