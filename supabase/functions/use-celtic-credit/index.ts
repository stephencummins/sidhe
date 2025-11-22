import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

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
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        {
          status: 401,
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
      return new Response(
        JSON.stringify({ error: 'User not authenticated' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Use service role to update credits
    const supabaseService = createClient(
      supabaseUrl,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || supabaseKey
    );

    // First check if user is VIP (unlimited Celtic Cross)
    const { data: subscription } = await supabaseService
      .from('user_subscriptions')
      .select('tier')
      .eq('user_id', user.id)
      .single();

    if (subscription?.tier === 'vip') {
      // VIP users don't need credits
      return new Response(
        JSON.stringify({
          success: true,
          message: 'VIP access granted',
          creditsRemaining: 'unlimited'
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Check and use credit for non-VIP users
    const { data: credits } = await supabaseService
      .from('celtic_cross_credits')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!credits || credits.credits_remaining <= 0) {
      return new Response(
        JSON.stringify({
          error: 'No Celtic Cross credits available',
          creditsRemaining: 0
        }),
        {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Decrement credit
    const { error: updateError } = await supabaseService
      .from('celtic_cross_credits')
      .update({
        credits_remaining: credits.credits_remaining - 1,
        total_used: credits.total_used + 1
      })
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Error using credit:', updateError);
      throw updateError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Credit used successfully',
        creditsRemaining: credits.credits_remaining - 1
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Use credit error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to use credit',
        details: error.message || error.toString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
