// Prompt templates for different tone styles
// These are the core of the product — iterate on them as you test!

const TONE_DESCRIPTIONS = {
    casual: {
        name: 'Casual',
        guide: `Rewrite as how native English speakers casually text friends. Use contractions, lowercase, occasional abbreviations (u, ur, lol, tbh). Keep it short and relaxed. No formal grammar needed.`
    },
    friendly: {
        name: 'Friendly',
        guide: `Rewrite as warm, friendly texting. Feel welcoming and approachable. Can use emojis sparingly. Sound genuine and personable, like texting a good friend.`
    },
    flirty: {
        name: 'Flirty',
        guide: `Rewrite as playful, flirty texting between people who are into each other. Short, teasing, confident. Can use emojis like 😏 😍 🔥. Avoid being creepy — keep it fun.`
    },
    genz: {
        name: 'Gen Z',
        guide: `Rewrite in Gen Z texting style. Use current slang (lowkey, fr, no cap, actually, literally, bestie). Lowercase. Dry humor. Feel authentic, not cringe or try-hard.`
    }
};

/**
 * Build the LLM prompt for tone conversion
 */
export function buildTonePrompt(text, tone) {
    const toneInfo = TONE_DESCRIPTIONS[tone];
    if (!toneInfo) {
        throw new Error(`Unknown tone: ${tone}`);
    }
    
    return `You help non-native English speakers text more naturally.

Original message: "${text}"

Rewrite this in ${toneInfo.name} style.
Guide: ${toneInfo.guide}

Return a JSON object with a "suggestions" key containing exactly 3 different alternatives.
Format: {"suggestions": ["option 1", "option 2", "option 3"]}`;
}

export { TONE_DESCRIPTIONS };
