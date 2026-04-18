export async function getApiKey() {
  const { apiKey } = await chrome.storage.local.get('apiKey');
  return apiKey || null;
}

export async function setApiKey(key) {
  await chrome.storage.local.set({ apiKey: key });
}

export async function getEnabled() {
  const { enabled } = await chrome.storage.local.get({ enabled: true });
  return enabled;
}

export async function setEnabled(value) {
  await chrome.storage.local.set({ enabled: value });
}
