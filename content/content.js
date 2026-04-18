(function () {
  'use strict';

  if (window.__texttoneLoaded) return;
  window.__texttoneLoaded = true;

  let overlay = null;
  let activeInput = null;
  let enabled = true;
  let isDragging = false;
  let dragOffsetX = 0;
  let dragOffsetY = 0;

  function isContextValid() {
    try { return Boolean(chrome.runtime?.id); } catch { return false; }
  }

  try {
    chrome.storage.local.get({ enabled: true, theme: 'dark' }, ({ enabled: e, theme }) => {
      enabled = e;
      applyTheme(theme);
    });
    chrome.storage.onChanged.addListener(changes => {
      if ('enabled' in changes) enabled = changes.enabled.newValue;
      if ('theme' in changes) applyTheme(changes.theme.newValue);
    });
  } catch { /* extension was reloaded — user needs to refresh the page */ }

  function applyTheme(theme) {
    if (!overlay) return;
    const isLight = theme === 'light';
    overlay.classList.toggle('tt-light', isLight);
    const cb = overlay.querySelector('.tt-theme-checkbox');
    if (cb) cb.checked = isLight;
  }

  // ── Overlay creation ──────────────────────────────────────────────────────

  function buildOverlay() {
    const el = document.createElement('div');
    el.id = 'texttone-overlay';
    el.setAttribute('data-texttone', 'true');
    el.innerHTML = `
      <div class="tt-header">
        <span class="tt-logo">✦ ToneTexter</span>
        <div class="tt-header-btns">
          <label class="tt-theme-toggle" title="Toggle light/dark">
            <input type="checkbox" class="tt-theme-checkbox" />
            <span class="tt-theme-slider"></span>
          </label>
          <button class="tt-close" title="Close">✕</button>
        </div>
      </div>
      <div class="tt-hint">Pick a tone to rephrase your message:</div>
      <div class="tt-tones">
        <button class="tt-tone" data-tone="Casual">Casual</button>
        <button class="tt-tone" data-tone="Friendly">Friendly</button>
        <button class="tt-tone" data-tone="Polite">Polite</button>
        <button class="tt-tone" data-tone="Gen Z">Gen Z</button>
      </div>
      <div class="tt-results"></div>
    `;

    // Prevent overlay clicks from stealing focus/selection from the active input
    // but allow form elements (checkbox) to work normally
    el.addEventListener('mousedown', e => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'LABEL') return;
      e.preventDefault();
    });

    el.querySelector('.tt-close').addEventListener('click', hideOverlay);
    el.querySelector('.tt-theme-checkbox').addEventListener('change', e => {
      applyTheme(e.target.checked ? 'light' : 'dark');
    });
    el.querySelectorAll('.tt-tone').forEach(btn => {
      btn.addEventListener('click', () => handleToneClick(btn.dataset.tone));
    });

    // ── Drag on header ────────────────────────────────────────────────────
    const header = el.querySelector('.tt-header');
    header.style.cursor = 'grab';

    header.addEventListener('mousedown', e => {
      if (e.target.closest('.tt-close, .tt-theme-toggle')) return;
      isDragging = true;
      dragOffsetX = e.pageX - el.offsetLeft;
      dragOffsetY = e.pageY - el.offsetTop;
      header.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', e => {
      if (!isDragging) return;
      el.style.left = (e.pageX - dragOffsetX) + 'px';
      el.style.top  = (e.pageY - dragOffsetY) + 'px';
    });

    document.addEventListener('mouseup', () => {
      if (!isDragging) return;
      isDragging = false;
      header.style.cursor = 'grab';
    });

    document.body.appendChild(el);
    return el;
  }

  function getOverlay() {
    if (!overlay) {
      overlay = buildOverlay();
      chrome.storage.local.get({ theme: 'dark' }, ({ theme }) => applyTheme(theme));
    }
    return overlay;
  }

  // ── Positioning ───────────────────────────────────────────────────────────

  function positionOverlay(inputEl) {
    const rect       = inputEl.getBoundingClientRect();
    const scrollY    = window.scrollY;
    const scrollX    = window.scrollX;
    const overlayH   = overlay.offsetHeight || 160;
    const spaceBelow = window.innerHeight - rect.bottom;

    const top  = spaceBelow >= overlayH + 12 || spaceBelow >= rect.top
      ? rect.bottom + scrollY + 8
      : rect.top + scrollY - overlayH - 8;

    const width = Math.min(Math.max(rect.width, 260), 380);
    const left  = Math.max(8, Math.min(rect.left + scrollX, window.innerWidth + scrollX - width - 16));

    overlay.style.top   = `${top}px`;
    overlay.style.left  = `${left}px`;
    overlay.style.width = `${width}px`;
  }

  // ── Show / hide ───────────────────────────────────────────────────────────

  function showOverlay(inputEl) {
    if (!enabled) return;
    if (!isMessagingInput(inputEl)) return;
    activeInput = inputEl;
    const el = getOverlay();
    el.querySelectorAll('.tt-tone').forEach(b => b.classList.remove('active'));
    el.querySelector('.tt-results').innerHTML = '';
    positionOverlay(inputEl);
    el.classList.add('tt-visible');
  }

  function hideOverlay() {
    overlay?.classList.remove('tt-visible');
    activeInput = null;
  }

  // ── Tone logic ────────────────────────────────────────────────────────────

  async function handleToneClick(tone) {
    if (!activeInput) return;

    // Capture selection at the moment the tone button is clicked
    let selStart = 0, selEnd = 0, hasSelection = false;
    if (activeInput.tagName === 'INPUT' || activeInput.tagName === 'TEXTAREA') {
      selStart = activeInput.selectionStart ?? 0;
      selEnd   = activeInput.selectionEnd   ?? 0;
      hasSelection = selStart !== selEnd;
    } else if (activeInput.isContentEditable) {
      const sel = window.getSelection();
      hasSelection = sel && sel.toString().length > 0;
    }

    const text = hasSelection
      ? (activeInput.isContentEditable
          ? window.getSelection().toString()
          : activeInput.value.substring(selStart, selEnd))
      : getInputText(activeInput).trim();

    if (!text) {
      showResults('<div class="tt-empty">Type something (or select text) first.</div>');
      return;
    }

    overlay.querySelectorAll('.tt-tone').forEach(b => b.classList.remove('active'));
    overlay.querySelector(`[data-tone="${tone}"]`).classList.add('active');
    showResults('<div class="tt-loading"><div class="tt-spinner"></div>Getting suggestions…</div>');

    try {
      if (!isContextValid()) throw new Error('Extension was reloaded — please refresh the page.');
      const response = await chrome.runtime.sendMessage({ type: 'GET_SUGGESTIONS', text, tone });
      if (!response.success) throw new Error(response.error);

      const html = response.suggestions
        .map((s, i) => `
          <div class="tt-suggestion" data-index="${i}">
            <span class="tt-suggestion-text">${escHtml(s)}</span>
            <button class="tt-copy" data-index="${i}" title="Copy to clipboard">⧉</button>
          </div>`)
        .join('');
      showResults(html);

      overlay.querySelectorAll('.tt-suggestion').forEach((el, i) => {
        el.addEventListener('click', () => {
          if (!activeInput) return;
          if (hasSelection && (activeInput.tagName === 'INPUT' || activeInput.tagName === 'TEXTAREA')) {
            replaceSelection(activeInput, selStart, selEnd, response.suggestions[i]);
          } else if (hasSelection && activeInput.isContentEditable) {
            activeInput.focus();
            document.execCommand('insertText', false, response.suggestions[i]);
          } else {
            setInputText(activeInput, response.suggestions[i]);
          }
          resetOverlay();
        });
      });

      overlay.querySelectorAll('.tt-copy').forEach((btn, i) => {
        btn.addEventListener('click', e => {
          e.stopPropagation();
          navigator.clipboard.writeText(response.suggestions[i]).then(() => {
            btn.textContent = '✓';
            btn.classList.add('tt-copy-done');
            setTimeout(() => {
              resetOverlay();
            }, 800);
          });
        });
      });
    } catch (err) {
      showResults(`<div class="tt-error">${escHtml(err.message)}</div>`);
    }
  }

  function showResults(html) {
    if (overlay) overlay.querySelector('.tt-results').innerHTML = html;
  }

  function resetOverlay() {
    if (!overlay) return;
    overlay.querySelectorAll('.tt-tone').forEach(b => b.classList.remove('active'));
    overlay.querySelector('.tt-results').innerHTML = '';
  }

  // ── Input helpers ─────────────────────────────────────────────────────────

  const EXCLUDE_ATTRS = /search|query|find|filter|lookup|username|user.?name|e.?mail|phone|address|zip|postal|city|state|country|credit|card|cvv|cvc|coupon|promo|password|url|website|subject|firstname|lastname|first.?name|last.?name/i;

  function isTextInput(el) {
    if (!el || el.nodeType !== Node.ELEMENT_NODE) return false;
    if (el.tagName === 'TEXTAREA') return true;
    if (el.tagName === 'INPUT') {
      return (el.type || 'text').toLowerCase() === 'text';
    }
    return el.isContentEditable === true;
  }

  function isMessagingInput(el) {
    if (el.tagName === 'TEXTAREA' || el.isContentEditable) return true;
    const attrs = [el.name, el.id, el.placeholder, el.getAttribute('aria-label')]
      .filter(Boolean).join(' ');
    return !EXCLUDE_ATTRS.test(attrs);
  }

  function getInputText(el) {
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') return el.value;
    if (el.isContentEditable) return el.innerText || el.textContent || '';
    return '';
  }

  function replaceSelection(el, start, end, value) {
    const original = el.value;
    const newValue = original.substring(0, start) + value + original.substring(end);
    const proto  = el.tagName === 'INPUT' ? window.HTMLInputElement.prototype : window.HTMLTextAreaElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
    if (setter) setter.call(el, newValue);
    else el.value = newValue;
    el.setSelectionRange(start, start + value.length);
    el.dispatchEvent(new Event('input',  { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function setInputText(el, value) {
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      const proto  = el.tagName === 'INPUT' ? window.HTMLInputElement.prototype : window.HTMLTextAreaElement.prototype;
      const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
      if (setter) setter.call(el, value);
      else el.value = value;
      el.dispatchEvent(new Event('input',  { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    } else if (el.isContentEditable) {
      el.focus();
      document.execCommand('selectAll', false, null);
      document.execCommand('insertText', false, value);
    }
  }

  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // ── Focus tracking ────────────────────────────────────────────────────────

  document.addEventListener('focusin', e => {
    if (e.target.closest('[data-texttone]')) return;
    isTextInput(e.target) ? showOverlay(e.target) : hideOverlay();
  }, true);

  document.addEventListener('focusout', () => {
    setTimeout(() => {
      const f = document.activeElement;
      if (!f || f === document.body) { hideOverlay(); return; }
      if (f.closest('[data-texttone]')) return;
      if (!isTextInput(f)) hideOverlay();
    }, 150);
  }, true);

  window.addEventListener('scroll', () => {
    if (!isDragging && overlay?.classList.contains('tt-visible') && activeInput) positionOverlay(activeInput);
  }, { passive: true });

  window.addEventListener('resize', () => {
    if (!isDragging && overlay?.classList.contains('tt-visible') && activeInput) positionOverlay(activeInput);
  });
})();
