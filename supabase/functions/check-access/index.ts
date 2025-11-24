import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface AccessResponse {
  tier: 'free' | 'subscriber' | 'vip';
  status: string;
  celticCrossCredits: number;
  features: {
    yesNoReading: boolean;
    dailyReading: boolean;
    saveReadings: boolean;
    analysisTool: boolean;
    windsOfChange: boolean;
    celticCross: boolean;
  };
  subscription?: {
    cancelAtPeriodEnd: boolean;
    currentPeriodEnd: string | null;
  };
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    // Get user from authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      // Return free tier for unauthenticated users
      const freeResponse: AccessResponse = {
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

      return new Response(
        JSON.stringify(freeResponse),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase configuration missing');
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Get the authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      // Return free tier for invalid auth
      const freeResponse: AccessResponse = {
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

      return new Response(
        JSON.stringify(freeResponse),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Get user subscription and credits using service role
    const supabaseService = createClient(
      supabaseUrl,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || supabaseKey
    );

    const [subscriptionResult, creditsResult] = await Promise.all([
      supabaseService
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single(),
      supabaseService
        .from('celtic_cross_credits')
        .select('credits_remaining')
        .eq('user_id', user.id)
        .single()
    ]);

    const subscription = subscriptionResult.data;
    const credits = creditsResult.data;

    // Determine tier and status
    let tier: 'free' | 'subscriber' | 'vip' = 'free';
    let status = 'active';
    let cancelAtPeriodEnd = false;
    let currentPeriodEnd: string | null = null;

    if (subscription) {
      tier = subscription.tier as 'free' | 'subscriber' | 'vip';
      status = subscription.status;
      cancelAtPeriodEnd = subscription.cancel_at_period_end;
      currentPeriodEnd = subscription.current_period_end;

      // Check if subscription is still valid (not expired)
      if (subscription.current_period_end) {
        const endDate = new Date(subscription.current_period_end);
        if (endDate < new Date() && subscription.status !== 'active') {
          tier = 'free';
          status = 'expired';
        }
      }
    }

    const celticCrossCredits = credits?.credits_remaining || 0;

    // Determine features based on tier
    const features = {
      yesNoReading: true, // Always available
      dailyReading: tier === 'subscriber' || tier === 'vip',
      saveReadings: tier === 'vip',
      analysisTool: tier === 'vip',
      windsOfChange: tier === 'vip',
      celticCross: tier === 'vip' || celticCrossCredits > 0
    };

    const response: AccessResponse = {
      tier,
      status,
      celticCrossCredits,
      features,
      subscription: subscription ? {
        cancelAtPeriodEnd,
        currentPeriodEnd
      } : undefined
    };

    return new Response(
      JSON.stringify(response),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Check access error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to check access',
        details: error.message || error.toString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
