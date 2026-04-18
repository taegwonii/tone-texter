import { SYSTEM_PROMPT, buildUserMessage } from './prompts.js';
import { getApiKey } from './storage.js';

const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL   = 'claude-haiku-4-5-20251001';

export async function fetchSuggestions(text, tone) {
  const apiKey = await getApiKey();
  if (!apiKey) {
    throw new Error('No API key set. Click the TextTone icon to add your Anthropic API key.');
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 512,
      system: [
        {
          type: 'text',
          text: SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [
        {
          role: 'user',
          content: buildUserMessage(text, tone),
        },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `API error (${response.status})`);
  }

  const data = await response.json();
  const raw = data.content?.[0]?.text || '';
  const suggestions = raw
    .split('\n')
    .map(s => s.replace(/^[\d]+[.)]\s*|^[-*•]\s*|^["']+|["']+$/g, '').trim())
    .filter(s => s.length > 0)
    .slice(0, 3);

  if (suggestions.length === 0) {
    throw new Error('No suggestions returned. Try again.');
  }

  return suggestions;
}
