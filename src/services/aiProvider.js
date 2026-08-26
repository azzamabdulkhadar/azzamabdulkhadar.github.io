/**
 * AI Provider Service with Multi-Key Fallback
 * 
 * Priority order:
 * 1. Groq API keys (VITE_GROQ_API_KEY, VITE_GROQ_API_KEY_2, VITE_GROQ_API_KEY_3)
 * 2. Google Gemini (VITE_GEMINI_API_KEY)
 * 3. OpenRouter (VITE_OPENROUTER_API_KEY)
 * 
 * If one key/provider fails (rate limit, expired, etc.), it automatically tries the next.
 */

const hasKeyPrefix = (key, prefix) =>
  typeof key === 'string' && key.trim().startsWith(prefix);

const isGroqKey = (key) => hasKeyPrefix(key, 'gsk_');
const isGeminiKey = (key) => hasKeyPrefix(key, 'AIza');
const isOpenRouterKey = (key) => hasKeyPrefix(key, 'sk-or-');

const PROVIDERS = [
  // Groq keys
  ...[
    import.meta.env.VITE_GROQ_API_KEY,
    import.meta.env.VITE_GROQ_API_KEY_2,
    import.meta.env.VITE_GROQ_API_KEY_3,
  ]
    .filter(isGroqKey)
    .map(key => ({
      name: 'Groq',
      apiUrl: 'https://api.groq.com/openai/v1/chat/completions',
      apiKey: key,
      model: 'qwen/qwen3.6-27b',
      headers: (key) => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
      }),
      buildBody: (messages, options = {}) => ({
        model: 'qwen/qwen3.6-27b',
        messages,
        max_tokens: options.maxTokens || 500,
        temperature: options.temperature || 0.7,
        chat_template_kwargs: { enable_thinking: false },
      }),
      extractContent: (data) => {
        const raw = data.choices?.[0]?.message?.content || '';
        // Strip <think>...</think> blocks if present
        return raw.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
      },
    })),

  // Google Gemini
  ...(isGeminiKey(import.meta.env.VITE_GEMINI_API_KEY)
    ? [{
        name: 'Gemini',
        apiUrl: `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
        apiKey: import.meta.env.VITE_GEMINI_API_KEY,
        model: 'gemini-3.5-flash-lite',
        headers: () => ({
          'Content-Type': 'application/json',
        }),
        buildBody: (messages, options = {}) => ({
          contents: messages
            .filter(m => m.role !== 'system')
            .map(m => ({
              role: m.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: m.content }],
            })),
          systemInstruction: {
            parts: [{ text: messages.find(m => m.role === 'system')?.content || '' }],
          },
          generationConfig: {
            maxOutputTokens: options.maxTokens || 500,
            temperature: options.temperature || 0.7,
          },
        }),
        extractContent: (data) => {
          const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
          return raw.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
        },
      }]
    : []),

  // OpenRouter (free tier)
  ...(isOpenRouterKey(import.meta.env.VITE_OPENROUTER_API_KEY)
    ? [{
        name: 'OpenRouter',
        apiUrl: 'https://openrouter.ai/api/v1/chat/completions',
        apiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
        model: 'meta-llama/llama-4-scout:free',
        headers: (key) => ({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Azzam Portfolio',
        }),
        buildBody: (messages, options = {}) => ({
          model: 'meta-llama/llama-4-scout:free',
          messages,
          max_tokens: options.maxTokens || 500,
          temperature: options.temperature || 0.7,
        }),
        extractContent: (data) => {
          const raw = data.choices?.[0]?.message?.content || '';
          return raw.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
        },
      }]
    : []),
];

/**
 * Make an AI completion request with automatic fallback across providers/keys.
 * 
 * @param {Array} messages - Array of {role, content} message objects
 * @param {Object} options - Optional: { maxTokens, temperature }
 * @returns {Promise<{content: string, provider: string}>}
 */
export async function aiComplete(messages, options = {}) {
  if (PROVIDERS.length === 0) {
    throw new Error('No API keys configured. Add at least one key to your .env file.');
  }

  const errors = [];

  for (const provider of PROVIDERS) {
    try {
      const response = await fetch(provider.apiUrl, {
        method: 'POST',
        headers: provider.headers(provider.apiKey),
        body: JSON.stringify(provider.buildBody(messages, options)),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        const errorMsg = err?.error?.message || `HTTP ${response.status}`;
        console.warn(`[AI Fallback] ${provider.name} failed: ${errorMsg}`);
        errors.push({ provider: provider.name, error: errorMsg });
        continue; // Try next provider
      }

      const data = await response.json();
      const content = provider.extractContent(data);

      if (!content) {
        console.warn(`[AI Fallback] ${provider.name} returned empty content`);
        errors.push({ provider: provider.name, error: 'Empty response' });
        continue;
      }

      return { content, provider: provider.name };
    } catch (e) {
      console.warn(`[AI Fallback] ${provider.name} error:`, e.message);
      errors.push({ provider: provider.name, error: e.message });
      continue;
    }
  }

  // All providers failed — log details for debugging but show user-friendly message
  const summary = errors.map(e => `${e.provider}: ${e.error}`).join('; ');
  console.error(`[AI Provider] All providers failed: ${summary}`);
  throw new Error('Unable to chat right now — the server is busy. Please try again later.');
}

/**
 * Get list of configured providers (for debugging/display)
 */
export function getConfiguredProviders() {
  return PROVIDERS.map(p => ({ name: p.name, model: p.model }));
}
