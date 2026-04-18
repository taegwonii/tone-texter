'use strict';

const apiKeyInput   = document.getElementById('apiKey');
const saveBtn       = document.getElementById('saveBtn');
const statusEl      = document.getElementById('status');
const toggleVis     = document.getElementById('toggleVis');
const enabledToggle = document.getElementById('enabledToggle');
const toggleLabel   = document.getElementById('toggleLabel');
const themeToggle   = document.getElementById('themeToggle');

chrome.storage.local.get(['apiKey', 'enabled', 'theme'], ({ apiKey, enabled, theme }) => {
  if (apiKey) {
    apiKeyInput.value = apiKey;
    showStatus('API key is saved ✓', 'success');
  }
  const isEnabled = enabled !== false;
  enabledToggle.checked = isEnabled;
  toggleLabel.textContent = isEnabled ? 'ToneTexter Active' : 'ToneTexter Paused';

  const isLight = theme === 'light';
  themeToggle.checked = isLight;
  applyTheme(isLight);
});

enabledToggle.addEventListener('change', () => {
  const isEnabled = enabledToggle.checked;
  chrome.storage.local.set({ enabled: isEnabled });
  toggleLabel.textContent = isEnabled ? 'ToneTexter Active' : 'ToneTexter Paused';
});

themeToggle.addEventListener('change', () => {
  const isLight = themeToggle.checked;
  chrome.storage.local.set({ theme: isLight ? 'light' : 'dark' });
  applyTheme(isLight);
});

function applyTheme(isLight) {
  document.body.classList.toggle('light', isLight);
}

toggleVis.addEventListener('click', () => {
  apiKeyInput.type = apiKeyInput.type === 'password' ? 'text' : 'password';
});

saveBtn.addEventListener('click', async () => {
  const key = apiKeyInput.value.trim();
  if (!key) { showStatus('Please enter your API key.', 'error'); return; }
  if (!key.startsWith('sk-ant-')) { showStatus('Key should start with sk-ant-…', 'error'); return; }
  await chrome.storage.local.set({ apiKey: key });
  showStatus('Saved! ToneTexter is ready.', 'success');
});

apiKeyInput.addEventListener('keydown', e => { if (e.key === 'Enter') saveBtn.click(); });

function showStatus(msg, type) {
  statusEl.textContent = msg;
  statusEl.className = `status ${type}`;
}
