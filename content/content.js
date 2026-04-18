// Content Script - injected into web pages to detect text inputs
// TODO: Step 4-5에서 활성 텍스트 입력 감지 및 플로팅 UI 표시

console.log('💬 Tone Texter content script loaded');

// TODO: Step 4 - Detect active text inputs (textarea, input[type=text], contenteditable)
function detectTextInputs() {
    // Find text inputs on the page
}

// TODO: Step 5 - Show floating suggestion button near focused input
function showFloatingButton(inputElement) {
    // Create and position floating UI
}

// TODO: Listen to focus events on text inputs
document.addEventListener('focusin', (e) => {
    const target = e.target;
    if (isTextInput(target)) {
        // showFloatingButton(target);
    }
});

function isTextInput(element) {
    if (!element) return false;
    const tag = element.tagName;
    const type = element.type;
    return (
        tag === 'TEXTAREA' ||
        (tag === 'INPUT' && (type === 'text' || type === 'search')) ||
        element.isContentEditable
    );
}

// Listen to messages from popup / service worker
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Content script received:', request);
    // TODO: Handle suggestion insertion requests
    sendResponse({ status: 'ok' });
});
