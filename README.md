# 💬 Tone Texter

A Chrome extension that helps non-native English speakers text more naturally.
Type what you mean, and get real-time tone-based suggestions that sound like a real native speaker.

## 🎯 The Problem

Many international students and English learners know what they want to say, but their messages often sound:
- Too formal ("I am happy to see you" vs "so happy to see u!")
- Too direct ("You are beautiful" vs "ur stunning 😍")
- Not like how real people actually text

## ✨ Features

- 🎭 **Multiple tone options** — Casual, Friendly, Flirty, Gen Z style
- ⚡ **Real-time suggestions** — See alternatives as you type
- 🧠 **AI-powered** — Uses LLM to understand context and tone
- 🌐 **Works anywhere** — Compatible with most text inputs on the web
- 🔒 **Privacy-first** — Your messages are only sent when you ask for suggestions

## 🎮 How It Works

1. Type a message in any text box (e.g., Instagram DM, Messenger, Gmail)
2. Click the Tone Texter icon or use the shortcut
3. Pick a tone style you want
4. Get 2-3 natural alternatives instantly
5. Click to copy or replace your text

### Example

**You type:** "You are so attractive"

**Tone Texter suggests:**
- 😎 Casual: "ur so hot"
- 😊 Friendly: "you look amazing omg"
- 🤝 Polite: "you look really nice"
- 🎨 Gen Z: "you're actually so fine"

## 🛠 Tech Stack

- **Browser:** Chrome (Manifest V3)
- **Frontend:** Vanilla HTML/CSS/JavaScript
- **AI:** OpenAI / Claude / Gemini API (configurable)
- **Storage:** Chrome Storage API

## 💡 Model Choice

Tone Texter uses **Claude Haiku (Haiku 4.5)** for text generation.

We chose Haiku because it provides:
- fast response time
- reliable natural language understanding
- stable performance for real-time text suggestions

This makes it well-suited for a responsive Chrome extension experience.

## 📋 Development Roadmap

- [ ] **Step 1** — Extension scaffold & popup UI
- [ ] **Step 2** — API key settings & secure storage
- [ ] **Step 3** — LLM integration for tone suggestions
- [ ] **Step 4** — Content script to detect active text inputs
- [ ] **Step 5** — Floating suggestion UI on web pages
- [ ] **Step 6** — Tone selector (Casual / Friendly / Flirty / Gen Z)
- [ ] **Step 7** — Polish: shortcuts, animations, error handling

## 🚀 Getting Started

### Prerequisites
- Google Chrome browser
- An API key from [OpenAI](https://platform.openai.com/), [Anthropic](https://console.anthropic.com/), or [Google AI Studio](https://aistudio.google.com/)

### Installation (Developer Mode)

1. Clone this repository
   ```bash
   git clone https://github.com/YOUR_USERNAME/tone-texter.git
   cd tone-texter
   ```

2. Open Chrome and go to `chrome://extensions/`
3. Enable **Developer mode** (top-right toggle)
4. Click **Load unpacked** and select the `tone-texter` folder
5. Pin the extension to your toolbar
6. Click the icon and enter your API key in settings

## 📁 Project Structure

```
tone-texter/
├── manifest.json           # Chrome extension config
├── popup/                  # Extension popup UI
│   ├── popup.html
│   ├── popup.js
│   └── popup.css
├── content/                # Injected into web pages
│   ├── content.js          # Detects text inputs, shows suggestions
│   └── content.css         # Floating UI styles
├── background/             # Service worker
│   └── service-worker.js   # Handles API calls, message passing
├── src/
│   ├── utils/
│   │   ├── api.js          # LLM API wrapper
│   │   ├── prompts.js      # Tone conversion prompts
│   │   └── storage.js      # Chrome storage helpers
│   └── styles/
│       └── common.css
├── assets/
│   └── icons/              # Extension icons (16, 48, 128 px)
└── docs/                   # Team docs
```

## 🌿 Branch Strategy

- `main` — Stable, shippable version
- `develop` — Development integration branch
- `feature/*` — Feature branches (one per roadmap step)

## 👥 Contributing

1. Branch from `develop`: `git checkout -b feature/your-feature`
2. Commit with conventional messages: `feat:`, `fix:`, `docs:`
3. Push and open a PR targeting `develop`
4. After review, merge and delete branch

## 📝 License

MIT
