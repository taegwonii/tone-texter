// Background Service Worker
// Handles API calls (CORS bypass) and message passing between popup/content

console.log('💬 Tone Texter service worker started');

import { getToneSuggestions } from '../src/utils/api.js';

// Install event
chrome.runtime.onInstalled.addListener((details) => {
    console.log('Extension installed:', details.reason);
    // TODO: Open onboarding page on first install
});

// Message handler
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getSuggestions') {
        handleGetSuggestions(request.text, request.tone)
            .then(suggestions => sendResponse({ success: true, suggestions }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true; // Keep channel open for async response
    }
});

async function handleGetSuggestions(text, tone) {
    // TODO: Step 3 - Get API key from storage, call LLM
    return await getToneSuggestions(text, tone);
}
