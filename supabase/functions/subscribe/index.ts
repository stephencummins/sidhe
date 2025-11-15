import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface SubscribeRequest {
  email: string;
}

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { email }: SubscribeRequest = await req.json();

    // Validate email
    if (!email || typeof email !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (!emailRegex.test(trimmedEmail)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase configuration missing');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if email already exists
    const { data: existingSubscriber, error: checkError } = await supabase
      .from('subscribers')
      .select('*')
      .eq('email', trimmedEmail)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // Ignore 'single row not found'
      console.error('Error checking subscriber:', checkError);
      throw checkError;
    }

    if (existingSubscriber) {
      // If already subscribed and active
      if (existingSubscriber.is_active) {
        return new Response(
          JSON.stringify({
            message: 'You are already subscribed to daily readings',
            alreadySubscribed: true
          }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      // If previously unsubscribed, reactivate
      const { error: updateError } = await supabase
        .from('subscribers')
        .update({
          is_active: true,
          subscribed_at: new Date().toISOString(),
          unsubscribed_at: null
        })
        .eq('email', trimmedEmail);

      if (updateError) {
        console.error('Error reactivating subscription:', updateError);
        throw updateError;
      }

      return new Response(
        JSON.stringify({
          message: 'Welcome back! Your subscription has been reactivated.',
          reactivated: true
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Create new subscriber
    const { data: newSubscriber, error: insertError } = await supabase
      .from('subscribers')
      .insert({ email: trimmedEmail })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating subscription:', insertError);
      throw insertError;
    }

    console.log(`New subscriber added: ${trimmedEmail}`);

    return new Response(
      JSON.stringify({
        message: 'Successfully subscribed! You will receive daily tarot readings via email.',
        subscriber: {
          email: newSubscriber.email,
          subscribed_at: newSubscriber.subscribed_at
        }
      }),
      {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Subscription error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to process subscription',
        details: error.message || error.toString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
