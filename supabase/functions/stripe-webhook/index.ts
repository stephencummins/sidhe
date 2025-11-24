import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe@^13.0.0";
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey, Stripe-Signature",
};

// Map Stripe price IDs to tiers
const PRICE_TO_TIER: Record<string, string> = {
  // These will be set from environment variables or Stripe metadata
  // Add your actual price IDs here after creating products in Stripe
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
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

    if (!stripeKey || !webhookSecret) {
      throw new Error('Stripe configuration missing');
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
    });

    // Get the signature from the header
    const signature = req.headers.get('Stripe-Signature');
    if (!signature) {
      return new Response(
        JSON.stringify({ error: 'Missing Stripe signature' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Get the raw body
    const body = await req.text();

    // Verify the webhook signature
    let event: Stripe.Event;
    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase configuration missing');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Processing webhook event:', event.type);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(stripe, supabase, session);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(supabase, subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(supabase, subscription);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(supabase, invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(
      JSON.stringify({ received: true }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({
        error: 'Webhook processing failed',
        details: error.message || error.toString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function handleCheckoutCompleted(
  stripe: Stripe,
  supabase: ReturnType<typeof createClient>,
  session: Stripe.Checkout.Session
) {
  const userId = session.metadata?.user_id;
  const userEmail = session.metadata?.user_email || session.customer_email || '';
  const productType = session.metadata?.product_type;

  if (!userId) {
    console.error('No user_id in session metadata');
    return;
  }

  // Update purchase status to completed
  await supabase
    .from('stripe_purchases')
    .update({
      status: 'completed',
      stripe_payment_intent_id: session.payment_intent as string
    })
    .eq('stripe_session_id', session.id);

  if (productType === 'subscription') {
    // Get subscription details
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
    const priceId = subscription.items.data[0]?.price.id;

    // Determine tier from price
    // You'll need to map your actual Stripe price IDs
    let tier = 'subscriber';
    const price = await stripe.prices.retrieve(priceId);
    const amount = price.unit_amount || 0;

    // £9.99 = 999 pence = VIP, £4.99 = 499 pence = Subscriber
    if (amount >= 900) {
      tier = 'vip';
    } else {
      tier = 'subscriber';
    }

    // Upsert user subscription
    const { error: upsertError } = await supabase
      .from('user_subscriptions')
      .upsert({
        user_id: userId,
        email: userEmail,
        stripe_customer_id: session.customer as string,
        stripe_subscription_id: subscription.id,
        tier: tier,
        status: subscription.status === 'active' ? 'active' : subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end
      }, {
        onConflict: 'user_id'
      });

    if (upsertError) {
      console.error('Error upserting subscription:', upsertError);
      throw upsertError;
    }

    console.log(`Subscription created/updated for user ${userId}: ${tier}`);

  } else if (productType === 'celtic_cross') {
    // Add Celtic Cross credits
    const { data: existing } = await supabase
      .from('celtic_cross_credits')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (existing) {
      // Update existing credits
      await supabase
        .from('celtic_cross_credits')
        .update({
          credits_remaining: existing.credits_remaining + 1,
          total_purchased: existing.total_purchased + 1
        })
        .eq('user_id', userId);
    } else {
      // Create new credits record
      await supabase
        .from('celtic_cross_credits')
        .insert({
          user_id: userId,
          email: userEmail,
          credits_remaining: 1,
          total_purchased: 1,
          total_used: 0
        });
    }

    console.log(`Celtic Cross credit added for user ${userId}`);
  }
}

async function handleSubscriptionUpdated(
  supabase: ReturnType<typeof createClient>,
  subscription: Stripe.Subscription
) {
  const userId = subscription.metadata?.user_id;

  if (!userId) {
    // Try to find by subscription ID
    const { data: existingSub } = await supabase
      .from('user_subscriptions')
      .select('user_id')
      .eq('stripe_subscription_id', subscription.id)
      .single();

    if (!existingSub) {
      console.error('Could not find user for subscription:', subscription.id);
      return;
    }
  }

  // Update subscription status
  const { error } = await supabase
    .from('user_subscriptions')
    .update({
      status: subscription.status === 'active' ? 'active' :
              subscription.status === 'past_due' ? 'past_due' :
              subscription.status === 'canceled' ? 'cancelled' : subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end
    })
    .eq('stripe_subscription_id', subscription.id);

  if (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }

  console.log(`Subscription updated: ${subscription.id}`);
}

async function handleSubscriptionDeleted(
  supabase: ReturnType<typeof createClient>,
  subscription: Stripe.Subscription
) {
  // Set user back to free tier
  const { error } = await supabase
    .from('user_subscriptions')
    .update({
      tier: 'free',
      status: 'cancelled',
      stripe_subscription_id: null,
      cancel_at_period_end: false
    })
    .eq('stripe_subscription_id', subscription.id);

  if (error) {
    console.error('Error handling subscription deletion:', error);
    throw error;
  }

  console.log(`Subscription deleted: ${subscription.id}`);
}

async function handlePaymentFailed(
  supabase: ReturnType<typeof createClient>,
  invoice: Stripe.Invoice
) {
  if (!invoice.subscription) return;

  // Update subscription status to past_due
  const { error } = await supabase
    .from('user_subscriptions')
    .update({
      status: 'past_due'
    })
    .eq('stripe_subscription_id', invoice.subscription as string);

  if (error) {
    console.error('Error updating subscription for failed payment:', error);
    throw error;
  }

  console.log(`Payment failed for subscription: ${invoice.subscription}`);
}
