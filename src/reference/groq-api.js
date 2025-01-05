const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function sendMessageToGroq(messages) {
  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: messages,
        temperature: 0.7,
        max_tokens: 32768,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling Groq API:', error);
    throw error;
  }
}

export function createChatMessage(role, content) {
  return {
    role,
    content,
  };
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { question, isCodeReview, language, description } = req.body;

    try {
      let systemMessage = "You are a helpful assistant that responds concisely to the user.";
      let userMessage = question;

      if (isCodeReview) {
        systemMessage = "You are an experienced software engineer providing detailed code reviews.";
        userMessage = `Language: ${language}\nDescription: ${description}\n\nCode to review:\n${question}\n\nPlease provide a detailed code review, including suggestions for improvements, potential bugs, and optimizations.`;
      }

      const messages = [
        createChatMessage("system", systemMessage),
        createChatMessage("user", userMessage),
      ];

      const response = await sendMessageToGroq(messages);

      res.status(200).json({ message: response });
    } catch (error) {
      console.error('Error fetching from Groq API:', error);
      res.status(500).json({ error: 'Failed to get assistant response' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}