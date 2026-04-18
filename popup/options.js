// Options page — configure API key and provider
import { 
    getApiKey, setApiKey, 
    getProvider, setProvider 
} from '../src/utils/storage.js';
import { getToneSuggestions } from '../src/utils/api.js';

const providerEl = document.getElementById('provider');
const apiKeyEl = document.getElementById('api-key');
const saveBtn = document.getElementById('save-btn');
const testBtn = document.getElementById('test-btn');
const statusEl = document.getElementById('status');

// Load existing settings
async function loadSettings() {
    const [provider, apiKey] = await Promise.all([
        getProvider(),
        getApiKey()
    ]);
    
    providerEl.value = provider;
    if (apiKey) {
        apiKeyEl.value = apiKey;
    }
}

// Save settings
saveBtn.addEventListener('click', async () => {
    const provider = providerEl.value;
    const apiKey = apiKeyEl.value.trim();
    
    if (!apiKey) {
        showStatus('Please enter an API key', 'error');
        return;
    }
    
    await setProvider(provider);
    await setApiKey(apiKey);
    showStatus('✅ Settings saved successfully!', 'success');
});

// Test connection
testBtn.addEventListener('click', async () => {
    const apiKey = apiKeyEl.value.trim();
    if (!apiKey) {
        showStatus('Enter an API key first', 'error');
        return;
    }
    
    // Save first
    await setProvider(providerEl.value);
    await setApiKey(apiKey);
    
    showStatus('🔄 Testing connection...', 'info');
    
    try {
        const suggestions = await getToneSuggestions(
            'You are so beautiful', 
            'casual'
        );
        showStatus(
            `✅ Works! Example: "${suggestions[0]}"`, 
            'success'
        );
    } catch (err) {
        showStatus(`❌ ${err.message}`, 'error');
    }
});

function showStatus(message, type) {
    statusEl.textContent = message;
    statusEl.className = `status ${type}`;
}

// Init
loadSettings();
