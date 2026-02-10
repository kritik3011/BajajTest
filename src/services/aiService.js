const config = require('../config');

const MODELS = [
  { name: 'gemini-2.0-flash', version: 'v1beta' },
  { name: 'gemini-2.0-flash-lite', version: 'v1beta' },
  { name: 'gemini-1.5-flash-latest', version: 'v1beta' },
  { name: 'gemini-pro', version: 'v1' },
];

async function answerQuestion(question) {
  if (!config.geminiApiKey) {
    throw new Error('AI service is not configured. GEMINI_API_KEY is missing.');
  }

  for (const model of MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/${model.version}/models/${model.name}:generateContent?key=${config.geminiApiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Answer in EXACTLY ONE WORD only. No punctuation, no explanation. Just one word.\n\nQuestion: ${question}` }] }],
        }),
      });

      const data = await res.json();
      if (!res.ok) continue;

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
      return text.split(/\s+/)[0].replace(/[^a-zA-Z0-9]/g, '');
    } catch (err) {
      continue;
    }
  }

  throw new Error('AI service failed: quota exceeded or all models unavailable. Try again later.');
}

module.exports = { answerQuestion };
