export const maxDuration = 30;

const API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${API_KEY}`;

export async function POST(req: Request) {
  const { messages, chapter } = await req.json();

  const systemPrompt = `You are an expert AI teaching assistant for this specific course chapter. Your sole purpose is to help students understand the chapter's content.

CHAPTER INFORMATION:
- Title: ${chapter.title}
- Description: ${chapter.description || "No description provided"}
- Content: ${chapter.content || "No content provided"}

STRICT GUIDELINES:
1. ONLY answer questions related to this chapter's content.
2. If the user asks something completely unrelated to the chapter (like food recommendations, random topics, jokes, personal advice, etc.), respond with EXACTLY this message:
   "I'm here to help you understand the course content. Please ask questions related to this chapter's material, and I'll be happy to assist you with your learning!"
3. Keep answers concise, educational, and focused on the chapter content.
4. If a question is somewhat related but vague, gently guide them back to the chapter content.
5. Be encouraging and supportive - you're a helpful teaching assistant.
6. If the student asks about concepts not covered in the chapter, explain them briefly but relate them back to the chapter material when possible.
7. Answer in the same language the student is using (English, Urdu, etc.).

Remember: Your ONLY job is to help with THIS specific chapter's content. Nothing else.`;

  // Convert messages to Gemini format
  const contents = [
    {
      role: "user",
      parts: [{ text: systemPrompt }],
    },
    ...messages.map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    })),
  ];

  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents }),
    });

    const data = await response.json();

    if (data.error) {
      return new Response(
        JSON.stringify({ error: data.error.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";

    return new Response(
      JSON.stringify({ message: aiText }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Gemini API error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to get AI response" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
// every things is working