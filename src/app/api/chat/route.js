import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
});

export async function POST(request) {
  try {
    const { messages } = await request.json();

    const response = await groq.chat.completions.create({
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      model: "llama3-8b-8192",
      temperature: 0.5,
      max_tokens: 1024,
      top_p: 1,
    });

    return new Response(JSON.stringify({
      content: response.choices[0]?.message?.content || "No response received"
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chat route:', error);
    return new Response(JSON.stringify({ error: 'Failed to get assistant response' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
