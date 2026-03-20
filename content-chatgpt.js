// content-chatgpt.js — paste payload if provided; else paste instructions only when editor is empty
(async () => {
  const delay = (ms) => new Promise(r => setTimeout(r, ms));
  const waitFor = async (sel, { tries = 120, interval = 150 } = {}) => {
    let el = null;
    while (tries-- > 0) {
      el = document.querySelector(sel);
      if (el) break;
      await delay(interval);
    }
    return el;
  };

  const editor = await waitFor("#prompt-textarea");
  if (!editor) return;

  // 1) Prefer payload from background (OPEN_DEST_INSERT_LINES)
  let { lines } = await chrome.storage.local.get("lines");
  const hasPayload = Array.isArray(lines) && lines.length > 0;

  // 2) If no payload, only proceed when editor is empty, then load instructions
  if (!hasPayload) {
    const isEmpty =
      !!editor.querySelector(".placeholder") ||
      editor.innerText.trim().length === 0;
    if (!isEmpty) return;

    const { customInstructions = "" } = await chrome.storage.sync.get({ customInstructions: "" });
    if (customInstructions && customInstructions.trim().length > 0) {
      lines = customInstructions.split("\n");
    } else if (Array.isArray(globalThis.INSTRUCTIONS_LINES)) {
      lines = globalThis.INSTRUCTIONS_LINES.slice();
    } else if (typeof globalThis.INSTRUCTIONS_TEXT === "string") {
      lines = globalThis.INSTRUCTIONS_TEXT.split("\n");
    } else {
      lines = ["[INSTRUCTIONS PLACEHOLDER]"];
    }
  }

  // 3) Insert one <p> per line
  editor.innerHTML = "";
  for (const line of lines) {
    const p = document.createElement("p");
    if (line && line.length) p.textContent = line;
    else p.appendChild(document.createElement("br"));
    editor.appendChild(p);
  }
  editor.focus();
  editor.dispatchEvent(new InputEvent("input", { bubbles: true }));

  // 4) Consume one-shot payload (safe even if none existed)
  await chrome.storage.local.remove("lines");
})();
