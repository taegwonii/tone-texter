// Popup Script - handles UI interactions in the extension popup
// TODO: Step 3에서 LLM 통합

console.log('💬 Tone Texter popup loaded');

// State
let selectedTone = null;

// DOM elements
const inputText = document.getElementById('input-text');
const toneButtons = document.querySelectorAll('.tone-btn');
const generateBtn = document.getElementById('generate-btn');
const suggestionsSection = document.getElementById('suggestions');
const suggestionList = document.getElementById('suggestion-list');
const settingsBtn = document.getElementById('settings-btn');

// Tone selection
toneButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        toneButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedTone = btn.dataset.tone;
    });
});

// Generate suggestions
generateBtn.addEventListener('click', async () => {
    const text = inputText.value.trim();
    
    if (!text) {
        alert('Please type a message first!');
        return;
    }
    
    if (!selectedTone) {
        alert('Please choose a tone!');
        return;
    }
    
    // TODO: Step 3 - Call LLM API through background service worker
    // Placeholder for now
    const mockSuggestions = [
        'ur so hot 🔥',
        'omg you look amazing',
        "you're actually so fine"
    ];
    
    displaySuggestions(mockSuggestions);
});

function displaySuggestions(suggestions) {
    suggestionList.innerHTML = '';
    suggestions.forEach(text => {
        const item = document.createElement('div');
        item.className = 'suggestion-item';
        item.textContent = text;
        item.addEventListener('click', () => copyToClipboard(text));
        suggestionList.appendChild(item);
    });
    suggestionsSection.classList.remove('hidden');
}

async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        // TODO: Show toast notification
        console.log('Copied:', text);
    } catch (err) {
        console.error('Copy failed:', err);
    }
}

// Settings (TODO: Step 2)
settingsBtn.addEventListener('click', () => {
    // TODO: Open settings page to configure API key
    alert('Settings page - coming in Step 2');
});
