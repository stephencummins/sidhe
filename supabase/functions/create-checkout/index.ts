import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe@^13.0.0";
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface CheckoutRequest {
  priceId: string;
  productType: 'subscription' | 'celtic_cross';
  successUrl: string;
  cancelUrl: string;
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
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      throw new Error('Stripe configuration missing');
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
    });

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

    const { priceId, productType, successUrl, cancelUrl }: CheckoutRequest = await req.json();

    // Validate required fields
    if (!priceId || !productType || !successUrl || !cancelUrl) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: priceId, productType, successUrl, cancelUrl' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Check if user already has a Stripe customer ID
    const supabaseService = createClient(
      supabaseUrl,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || supabaseKey
    );

    const { data: existingSubscription } = await supabaseService
      .from('user_subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single();

    let customerId = existingSubscription?.stripe_customer_id;

    // Create or retrieve Stripe customer
    if (!customerId) {
      // Check if customer exists in Stripe by email
      const existingCustomers = await stripe.customers.list({
        email: user.email,
        limit: 1
      });

      if (existingCustomers.data.length > 0) {
        customerId = existingCustomers.data[0].id;
      } else {
        // Create new customer
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: {
            supabase_user_id: user.id
          }
        });
        customerId = customer.id;
      }
    }

    // Create checkout session based on product type
    let sessionConfig: Stripe.Checkout.SessionCreateParams;

    if (productType === 'subscription') {
      sessionConfig = {
        customer: customerId,
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          user_id: user.id,
          user_email: user.email || '',
          product_type: productType
        },
        subscription_data: {
          metadata: {
            user_id: user.id,
            user_email: user.email || ''
          }
        }
      };
    } else {
      // One-off Celtic Cross purchase
      sessionConfig = {
        customer: customerId,
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          user_id: user.id,
          user_email: user.email || '',
          product_type: productType
        }
      };
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    // Log the purchase attempt
    await supabaseService
      .from('stripe_purchases')
      .insert({
        user_id: user.id,
        email: user.email || '',
        stripe_session_id: session.id,
        stripe_customer_id: customerId,
        product_type: productType,
        product_name: productType === 'subscription' ? 'Subscription' : 'Celtic Cross Reading',
        amount_pence: session.amount_total || 0,
        currency: 'gbp',
        status: 'pending'
      });

    return new Response(
      JSON.stringify({
        sessionId: session.id,
        url: session.url
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Checkout error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to create checkout session',
        details: error.message || error.toString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
