export async function handler(event) {
  try {
    const { age, mood, color } = JSON.parse(event.body);

    const prompt = `
You are a gentle bilingual storytelling guide for children.

Create a short interactive story:

- Age group: ${age}
- Mood: ${mood}
- Color theme: ${color}
- Main character: Lulu the Gourd
- Supporting friends: the five gourds
- Tone: warm, calm, imaginative
- Language: simple English with light Chinese explanation

Structure:
1. Story (short, gentle)
2. ⭐ One sentence to learn
3. 🤍 One reflection question
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      })
    });

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        story: data.choices[0].message.content
      })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}
