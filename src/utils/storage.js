// Chrome Storage Helpers
// Stores API key and user preferences securely

const STORAGE_KEYS = {
    API_KEY: 'apiKey',
    PROVIDER: 'provider', // 'openai' | 'anthropic' | 'gemini'
    DEFAULT_TONE: 'defaultTone'
};

export async function getApiKey() {
    const result = await chrome.storage.local.get(STORAGE_KEYS.API_KEY);
    return result[STORAGE_KEYS.API_KEY] || null;
}

export async function setApiKey(apiKey) {
    await chrome.storage.local.set({ [STORAGE_KEYS.API_KEY]: apiKey });
}

export async function getProvider() {
    const result = await chrome.storage.local.get(STORAGE_KEYS.PROVIDER);
    return result[STORAGE_KEYS.PROVIDER] || 'openai'; // Default
}

export async function setProvider(provider) {
    await chrome.storage.local.set({ [STORAGE_KEYS.PROVIDER]: provider });
}

export async function getDefaultTone() {
    const result = await chrome.storage.local.get(STORAGE_KEYS.DEFAULT_TONE);
    return result[STORAGE_KEYS.DEFAULT_TONE] || 'casual';
}

export async function setDefaultTone(tone) {
    await chrome.storage.local.set({ [STORAGE_KEYS.DEFAULT_TONE]: tone });
}

export async function clearAll() {
    await chrome.storage.local.clear();
}
