import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Create Supabase client with service role key (bypasses RLS)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Creating Salvador Dali deck...')

    // Step 1: Check if deck exists
    const { data: existingDeck } = await supabaseAdmin
      .from('tarot_decks')
      .select('id')
      .eq('name', 'Salvador Dali')
      .single()

    let daliDeckId

    if (existingDeck) {
      console.log('Deck already exists:', existingDeck.id)
      daliDeckId = existingDeck.id
    } else {
      // Create the deck
      const { data: newDeck, error: deckError } = await supabaseAdmin
        .from('tarot_decks')
        .insert({
          name: 'Salvador Dali',
          description: 'Salvador Dali Tarot deck with surrealist interpretations and in-depth psychological meanings',
          is_active: false
        })
        .select()
        .single()

      if (deckError) {
        throw new Error(`Failed to create deck: ${deckError.message}`)
      }

      daliDeckId = newDeck.id
      console.log('Created new deck:', daliDeckId)
    }

    // Step 2: Check if cards exist
    const { count: cardCount } = await supabaseAdmin
      .from('tarot_cards')
      .select('*', { count: 'exact', head: true })
      .eq('deck_id', daliDeckId)

    if (cardCount > 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: `Salvador Dali deck already exists with ${cardCount} cards`,
          deckId: daliDeckId
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Step 3: Copy cards from Celtic Mythology deck
    const { data: celticDeck } = await supabaseAdmin
      .from('tarot_decks')
      .select('id')
      .eq('name', 'Celtic Mythology')
      .single()

    if (!celticDeck) {
      throw new Error('Celtic Mythology deck not found')
    }

    const { data: celticCards } = await supabaseAdmin
      .from('tarot_cards')
      .select('*')
      .eq('deck_id', celticDeck.id)

    if (!celticCards || celticCards.length === 0) {
      throw new Error('No cards found in Celtic deck')
    }

    // Create cards for Dali deck
    const daliCards = celticCards.map(card => ({
      deck_id: daliDeckId,
      name: card.name,
      arcana: card.arcana,
      suit: card.suit,
      meaning_upright: card.meaning_upright,
      meaning_reversed: card.meaning_reversed,
      keywords: card.keywords
    }))

    const { error: insertError } = await supabaseAdmin
      .from('tarot_cards')
      .insert(daliCards)

    if (insertError) {
      throw new Error(`Failed to insert cards: ${insertError.message}`)
    }

    console.log(`Created ${daliCards.length} cards`)

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully created Salvador Dali deck with ${daliCards.length} cards`,
        deckId: daliDeckId,
        cardCount: daliCards.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})
