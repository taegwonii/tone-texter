import { fetchSuggestions } from '../src/utils/api.js';
import { getApiKey } from '../src/utils/storage.js';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GET_SUGGESTIONS') {
    fetchSuggestions(request.text, request.tone)
      .then(suggestions => sendResponse({ success: true, suggestions }))
      .catch(err => sendResponse({ success: false, error: err.message }));
    return true; // Keep channel open for async response
  }

  if (request.type === 'CHECK_API_KEY') {
    getApiKey().then(key => sendResponse({ hasKey: Boolean(key) }));
    return true;
  }
});
