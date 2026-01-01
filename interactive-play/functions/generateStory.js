export async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: cors(),
      body: "ok",
    };
  }

  try {
    const { age, mood, color } = JSON.parse(event.body || "{}");

    if (!age || !mood || !color) {
      return {
        statusCode: 400,
        headers: cors(),
        body: JSON.stringify({ error: "Missing input" }),
      };
    }

    const prompt = `
You are a gentle bilingual storytelling guide for children.

Create a short story with:
- Age: ${age}
- Mood: ${mood}
- Color theme: ${color}
- Main character: Lulu the Gourd
- Tone: warm, calm, imaginative

Structure:
1. Short story
2. ⭐ One sentence to learn
3. 🤍 One reflection question
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "OpenAI error");
    }

    return {
      statusCode: 200,
      headers: cors(),
      body: JSON.stringify({
        story: data.choices[0].message.content,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: cors(),
      body: JSON.stringify({ error: err.message }),
    };
  }
}

function cors() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}
