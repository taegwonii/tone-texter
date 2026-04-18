// LLM API Wrapper
// Supports OpenAI, Anthropic (Claude), and Google (Gemini)

import { getApiKey, getProvider } from './storage.js';
import { buildTonePrompt } from './prompts.js';

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

async function callOpenAI(apiKey, prompt) {
    // TODO: Implement OpenAI API call
    // POST https://api.openai.com/v1/chat/completions
    throw new Error('OpenAI integration not yet implemented');
}

async function callClaude(apiKey, prompt) {
    // TODO: Implement Claude API call
    // POST https://api.anthropic.com/v1/messages
    throw new Error('Claude integration not yet implemented');
}

async function callGemini(apiKey, prompt) {
    // TODO: Implement Gemini API call
    // POST https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent
    throw new Error('Gemini integration not yet implemented');
}
