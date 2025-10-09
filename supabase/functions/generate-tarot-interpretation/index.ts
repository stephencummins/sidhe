import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RequestBody {
  cards: Array<{
    name: string;
    position: string;
    isReversed: boolean;
  }>;
  question?: string;
  spreadName: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { cards, question, spreadName }: RequestBody = await req.json();

    const cardsDescription = cards
      .map(card => `${card.position}: ${card.name}${card.isReversed ? ' (Reversed)' : ''}`)
      .join('\n');

    const prompt = `You are a mystical tarot reader with deep knowledge of symbolism and intuition.

Spread: ${spreadName}
${question ? `Question: ${question}` : 'This is a general reading.'}

Cards drawn:
${cardsDescription}

Provide a comprehensive tarot interpretation that includes:
1. The meaning of each card in its position
2. How the cards relate to each other and the overall message
3. Actionable guidance or reflection questions

Keep the tone mystical yet insightful. Focus on personal growth and self-reflection.`;

    // Use OpenAI API instead
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1500
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenAI API Error:', response.status, errorData);
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    const interpretation = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ interpretation }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to generate interpretation' }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
