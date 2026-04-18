// Popup Script - handles UI interactions in the extension popup

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
    
    // Disable button during request
    generateBtn.disabled = true;
    generateBtn.textContent = '⏳ Generating...';
    
    try {
        // Ask service worker to call the LLM (needed for CORS)
        const response = await chrome.runtime.sendMessage({
            action: 'getSuggestions',
            text: text,
            tone: selectedTone
        });
        
        if (!response.success) {
            throw new Error(response.error);
        }
        
        displaySuggestions(response.suggestions);
    } catch (err) {
        console.error(err);
        alert(`Error: ${err.message}\n\nCheck your API key in Settings.`);
    } finally {
        generateBtn.disabled = false;
        generateBtn.textContent = '✨ Get Suggestions';
    }
});

function displaySuggestions(suggestions) {
    suggestionList.innerHTML = '';
    suggestions.forEach(text => {
        const item = document.createElement('div');
        item.className = 'suggestion-item';
        item.textContent = text;
        item.addEventListener('click', () => copyToClipboard(text, item));
        suggestionList.appendChild(item);
    });
    suggestionsSection.classList.remove('hidden');
}

async function copyToClipboard(text, element) {
    try {
        await navigator.clipboard.writeText(text);
        const original = element.textContent;
        element.textContent = '✓ Copied!';
        setTimeout(() => { element.textContent = original; }, 1000);
    } catch (err) {
        console.error('Copy failed:', err);
    }
}

// Open settings page
settingsBtn.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
});
