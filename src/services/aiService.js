const config = require('../config');

async function answerQuestion(question) {
  // Try Groq first if key is present
  if (config.groqApiKey) {
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.groqApiKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: `Answer in EXACTLY ONE WORD only. No punctuation, no explanation. Just one word.\n\nQuestion: ${question}` }],
          max_tokens: 10
        }),
      });

      const data = await res.json();
      if (res.ok) {
        const text = data.choices?.[0]?.message?.content?.trim() || '';
        return text.split(/\s+/)[0].replace(/[^a-zA-Z0-9]/g, '');
      }
      console.error('Groq failed:', data.error?.message || data);
    } catch (err) {
      console.error('Groq error:', err.message);
    }
  }

  // Fallback to Gemini if Groq fails or no key
  if (config.geminiApiKey) {
    const MODELS = [
      { name: 'gemini-2.0-flash', version: 'v1beta' },
      { name: 'gemini-1.5-flash-latest', version: 'v1beta' },
      { name: 'gemini-pro', version: 'v1' },
    ];

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
        if (res.ok) {
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
          return text.split(/\s+/)[0].replace(/[^a-zA-Z0-9]/g, '');
        }
      } catch (err) { continue; }
    }
  }

  throw new Error('AI service failed: All AI models (Groq/Gemini) unavailable or quota exceeded.');
}

module.exports = { answerQuestion };
