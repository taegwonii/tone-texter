// LLM API Wrapper - OpenAI implementation
// Supports OpenAI (primary). Claude and Gemini stubs kept for future.

import { getApiKey, getProvider } from './storage.js';
import { buildTonePrompt } from './prompts.js';

const OPENAI_MODEL = 'gpt-4o-mini'; // Fast & cheap, quality is great for this task

/**
 * Get tone-based suggestions for a given text
 * @param {string} text - Original user message
 * @param {string} tone - 'casual' | 'friendly' | 'flirty' | 'genz'
 * @returns {Promise<string[]>} - Array of suggestion strings
 */
export async function getToneSuggestions(text, tone) {
    const apiKey = await getApiKey();
    const provider = await getProvider();
    
    if (!apiKey) {
        throw new Error('API key not configured. Please set it in settings.');
    }
    
    const prompt = buildTonePrompt(text, tone);
    
    switch (provider) {
        case 'openai':
            return await callOpenAI(apiKey, prompt);
        case 'anthropic':
            return await callClaude(apiKey, prompt);
        case 'gemini':
            return await callGemini(apiKey, prompt);
        default:
            throw new Error(`Unknown provider: ${provider}`);
    }
}

/**
 * Call OpenAI Chat Completions API
 */
async function callOpenAI(apiKey, prompt) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: OPENAI_MODEL,
            messages: [
                {
                    role: 'system',
                    content: 'You help non-native English speakers text more naturally. You always respond with a JSON object containing a "suggestions" array of 3 strings, no other text.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.8,
            max_tokens: 300,
            response_format: { type: 'json_object' }
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.error?.message || `HTTP ${response.status}`;
        
        if (response.status === 401) {
            throw new Error('Invalid API key. Please check your settings.');
        }
        if (response.status === 429) {
            throw new Error('Rate limit or quota exceeded. Check your OpenAI billing.');
        }
        throw new Error(`OpenAI API error: ${errorMsg}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
        throw new Error('Empty response from OpenAI');
    }

    return parseSuggestions(content);
}

/**
 * Parse LLM response into array of suggestions
 */
function parseSuggestions(content) {
    try {
        const parsed = JSON.parse(content);
        
        if (Array.isArray(parsed)) {
            return parsed.slice(0, 3);
        }
        if (Array.isArray(parsed.suggestions)) {
            return parsed.suggestions.slice(0, 3);
        }
        if (Array.isArray(parsed.options)) {
            return parsed.options.slice(0, 3);
        }
        const values = Object.values(parsed).filter(v => typeof v === 'string');
        if (values.length > 0) {
            return values.slice(0, 3);
        }
        throw new Error('Unexpected response format');
    } catch (err) {
        console.error('Failed to parse:', content);
        throw new Error('Could not parse AI response. Please try again.');
    }
}

// Future provider stubs
async function callClaude(apiKey, prompt) {
    throw new Error('Claude integration coming soon');
}

async function callGemini(apiKey, prompt) {
    throw new Error('Gemini integration coming soon');
}
