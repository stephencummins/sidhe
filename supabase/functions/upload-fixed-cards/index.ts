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

    // Parse request body - should contain card name and base64 image data
    const { cardName, imageData } = await req.json()

    if (!cardName || !imageData) {
      throw new Error('Missing cardName or imageData')
    }

    console.log(`Processing upload for: ${cardName}`)

    // Get card from database (from active deck)
    const { data: cards, error: cardError } = await supabaseAdmin
      .from('tarot_cards')
      .select('id, name, image_url, deck_id, tarot_decks!inner(is_active)')
      .eq('name', cardName)
      .eq('tarot_decks.is_active', true)

    console.log(`Query result for "${cardName}":`, { cards, cardError })

    if (cardError) {
      console.error('Card query error:', cardError)
      throw new Error(`Database error: ${cardError.message}`)
    }

    if (!cards || cards.length === 0) {
      throw new Error(`Card not found: ${cardName}`)
    }

    const card = cards[0]

    // Determine storage path
    let storagePath
    if (card.image_url) {
      const urlParts = card.image_url.split('tarot-cards/')
      storagePath = urlParts.length > 1 ? urlParts[1] : `${card.deck_id}/${card.id}.png`
    } else {
      storagePath = `${card.deck_id}/${card.id}.png`
    }

    // Convert base64 to blob
    const imageBuffer = Uint8Array.from(atob(imageData), c => c.charCodeAt(0))

    // Upload to storage (upsert = true will replace existing)
    const { error: uploadError } = await supabaseAdmin.storage
      .from('tarot-cards')
      .upload(storagePath, imageBuffer, {
        contentType: 'image/png',
        upsert: true
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      throw new Error(`Upload failed: ${uploadError.message}`)
    }

    // Update card URL in database
    const publicUrl = `${Deno.env.get('SUPABASE_URL')}/storage/v1/object/public/tarot-cards/${storagePath}`

    const { error: updateError } = await supabaseAdmin
      .from('tarot_cards')
      .update({
        image_url: publicUrl,
        thumbnail_url: publicUrl
      })
      .eq('id', card.id)

    if (updateError) {
      console.error('Database update error:', updateError)
      throw new Error(`Database update failed: ${updateError.message}`)
    }

    console.log(`✅ Successfully uploaded: ${cardName}`)

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully uploaded ${cardName}`,
        url: publicUrl
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
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
