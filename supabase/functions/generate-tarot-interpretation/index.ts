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

    const apiKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY not configured');
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1500,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Anthropic API Error:', response.status, errorData);
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    const interpretation = data.content[0].text;

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