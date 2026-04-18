# 🛠 Development Guide

## Git Workflow (main + develop + feature)

### Branch Structure
```
main      ─●─────●─────●────────●───  (stable, shippable)
           │     │     │        │
develop   ─●──●──●──●──●──●──●──●───  (integration)
              │     │     │
feature/   ●──●     │     │
step1              ●──●   │
                  step2   │
                         ●──●
                        step3
```

### Per-Step Development Flow

```bash
# 1. Start from develop
git checkout develop
git pull origin develop

# 2. Create feature branch
git checkout -b feature/step1-popup-ui

# 3. Develop & commit
git add .
git commit -m "feat(popup): basic popup UI with tone buttons"

# 4. Push to remote
git push -u origin feature/step1-popup-ui

# 5. On GitHub: Open PR → feature/step1-popup-ui into develop

# 6. After merge: sync local
git checkout develop
git pull origin develop
git branch -d feature/step1-popup-ui
```

### Release (develop → main)

```bash
git checkout main
git merge develop
git tag -a v0.1.0 -m "Initial MVP"
git push origin main --tags
```

## Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting (no code change)
- `refactor:` Code restructuring
- `chore:` Build/config

Examples:
```
feat(popup): add tone selection buttons
fix(api): handle Gemini API rate limit
docs: add setup instructions to README
```

## 🔒 Security - API Keys

**NEVER commit API keys to Git!**

- API keys are stored in `chrome.storage.local` (user's browser only)
- The `.gitignore` file excludes `.env` and `secrets.json`
- If you accidentally commit a key:
  1. Revoke it immediately on the provider's dashboard
  2. Generate a new one
  3. Use `git filter-branch` or BFG Repo-Cleaner to remove from history

## Testing the Extension Locally

1. Open Chrome → `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked** → select the `tone-texter` folder
4. After code changes: click the 🔄 reload button on the extension card
5. For content script changes: reload the target web page too

### Debugging
- **Popup**: Right-click popup → Inspect
- **Content script**: Open DevTools on the target web page
- **Service worker**: `chrome://extensions/` → "Inspect views: service worker"

## Per-Step Checklist

### Step 1 — Extension Scaffold & Popup UI ✅
- [x] manifest.json with Manifest V3
- [x] Popup HTML/CSS/JS
- [x] Tone selector buttons
- [ ] Icon assets (16, 48, 128 px) - need to design

### Step 2 — Settings & API Key Storage
- [ ] Settings page (options.html)
- [ ] Provider selection (OpenAI/Claude/Gemini)
- [ ] API key input with masked display
- [ ] Save to chrome.storage.local
- [ ] First-time setup prompt

### Step 3 — LLM Integration
- [ ] Implement callOpenAI / callClaude / callGemini in api.js
- [ ] Error handling (invalid key, rate limit, network)
- [ ] Parse JSON response, handle malformed output
- [ ] Loading state in popup

### Step 4 — Active Text Input Detection
- [ ] Detect focus on input/textarea/contenteditable
- [ ] Capture current text value
- [ ] Handle dynamic inputs (React/Vue sites)
- [ ] Test on Instagram, Messenger, Gmail, etc.

### Step 5 — Floating UI
- [ ] Floating suggestion button near active input
- [ ] Suggestion panel with animations
- [ ] Click-to-replace text in input
- [ ] Dismiss on click outside

### Step 6 — Tone Selector in Content Script
- [ ] Tone quick-picker in floating UI
- [ ] Remember last-used tone
- [ ] Keyboard shortcut (Ctrl+Shift+T?)

### Step 7 — Polish
- [ ] Smooth animations
- [ ] Error toasts
- [ ] Offline detection
- [ ] Onboarding flow for first install
- [ ] Demo GIF/video for README

## Test Inputs

Try these messages during testing to make sure all tones work well:

- "Hello, how are you doing today?"
- "You look very beautiful in that photo"
- "I am really happy that we met"
- "Do you want to hang out this weekend?"
- "That was a very funny joke you told"

## Team Roles (Suggested)

- **Popup UI & Settings** — person A
- **LLM API integration & prompts** — person B
- **Content script & floating UI** — person C
- **Polish, icons, demo** — everyone
