import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

export type SubscriptionTier = 'free' | 'subscriber' | 'vip';

interface SubscriptionFeatures {
  yesNoReading: boolean;
  dailyReading: boolean;
  saveReadings: boolean;
  analysisTool: boolean;
  windsOfChange: boolean;
  celticCross: boolean;
}

interface SubscriptionState {
  tier: SubscriptionTier;
  status: string;
  celticCrossCredits: number;
  features: SubscriptionFeatures;
  subscription?: {
    cancelAtPeriodEnd: boolean;
    currentPeriodEnd: string | null;
  };
}

interface SubscriptionContextType extends SubscriptionState {
  loading: boolean;
  refreshSubscription: () => Promise<void>;
  subscribe: (tier: 'subscriber' | 'vip') => Promise<void>;
  buyCelticCross: () => Promise<void>;
  useCelticCredit: () => Promise<boolean>;
  openBillingPortal: () => Promise<void>;
}

const defaultState: SubscriptionState = {
  tier: 'free',
  status: 'active',
  celticCrossCredits: 0,
  features: {
    yesNoReading: true,
    dailyReading: false,
    saveReadings: false,
    analysisTool: false,
    windsOfChange: false,
    celticCross: false
  }
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [state, setState] = useState<SubscriptionState>(defaultState);
  const [loading, setLoading] = useState(true);

  const refreshSubscription = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/check-access`,
        {
          headers: session?.access_token ? {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          } : {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setState(data);
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSubscription();
  }, [user, refreshSubscription]);

  const subscribe = async (tier: 'subscriber' | 'vip') => {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      throw new Error('Please sign in to subscribe');
    }

    const priceId = tier === 'vip'
      ? import.meta.env.VITE_STRIPE_VIP_PRICE_ID
      : import.meta.env.VITE_STRIPE_SUBSCRIBER_PRICE_ID;

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          priceId,
          productType: 'subscription',
          successUrl: `${window.location.origin}/success?type=subscription`,
          cancelUrl: `${window.location.origin}/pricing`
        })
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create checkout session');
    }

    const { url } = await response.json();
    window.location.href = url;
  };

  const buyCelticCross = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      throw new Error('Please sign in to purchase');
    }

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          priceId: import.meta.env.VITE_STRIPE_CELTIC_CROSS_PRICE_ID,
          productType: 'celtic_cross',
          successUrl: `${window.location.origin}/success?type=celtic-cross`,
          cancelUrl: `${window.location.origin}/pricing`
        })
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create checkout session');
    }

    const { url } = await response.json();
    window.location.href = url;
  };

  const useCelticCredit = async (): Promise<boolean> => {
    // VIP users don't need to use credits
    if (state.tier === 'vip') {
      return true;
    }

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      throw new Error('Please sign in');
    }

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/use-celtic-credit`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to use credit');
    }

    // Update local state
    if (typeof result.creditsRemaining === 'number') {
      setState(prev => ({
        ...prev,
        celticCrossCredits: result.creditsRemaining
      }));
    }

    return true;
  };

  const openBillingPortal = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      throw new Error('Please sign in');
    }

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/customer-portal`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          returnUrl: window.location.origin
        })
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to open billing portal');
    }

    const { url } = await response.json();
    window.location.href = url;
  };

  return (
    <SubscriptionContext.Provider
      value={{
        ...state,
        loading,
        refreshSubscription,
        subscribe,
        buyCelticCross,
        useCelticCredit,
        openBillingPortal
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}
