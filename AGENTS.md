# AGENTS.md

## Purpose

This repo is a local automation bridge between a Windows desktop task UI and ChatGPT.

- The Python service watches the primary monitor for a new task counter value.
- When a new task appears, it captures a screenshot, determines the task type with OCR, and serves an encrypted event over HTTP.
- The Chrome extension polls that local/LAN bridge, injects into ChatGPT tabs, uploads the screenshot, inserts the configured prompt text, and submits it.

`README.md` is the fuller user-facing behavior document. This file is the shorter contributor/agent-oriented map of what matters when changing code.

## Main Components

### `python_service/screen_bridge.py`

Primary runtime entrypoint.

- Captures the primary monitor with `mss`.
- Detects the task counter by template-matching `assets/task-counter-icon.png` and OCRing the digits to the right.
- Detects task type by template-matching `assets/task-type-icon.png` and OCRing the label beside it.
- Applies `task_type_config.json` rules to decide whether to ignore, delay, or emit a task.
- Exposes:
  - `/a` for normal queued bridge events
  - `/b` for repeat-capture events
- Stores runtime counts/history on disk.

This file is Windows-centric and contains most of the system assumptions:

- hard-coded Tesseract path
- Win32 hotkeys
- screen-coordinate constants
- local/LAN HTTP binding

### `chrome_extension/service_worker.js`

Extension coordinator.

- Polls the Python bridge on an alarm.
- Decrypts event payloads.
- Finds or opens eligible ChatGPT tabs.
- Injects `content_script.js`.
- Routes normal task submissions, repeat flows, and optional scroll events.

If the bridge URL changes, this file must stay aligned with `chrome_extension/manifest.json`.

### `chrome_extension/content_script.js`

ChatGPT DOM automation layer.

- Finds the prompt field, file input, and send button.
- Uploads screenshots.
- Inserts prompt text.
- Enables Web search when needed.
- Sends the composed prompt.

This is the most brittle part of the repo because it depends on ChatGPT's live DOM and selectors.

### `python_service/task_type_config.json`

Operational configuration, not just source code.

- Controls which OCRed task types are active.
- Can gate a task on a left-edge mouse release.
- Supplies one or two prompts per matched task type.
- Supplies the repeat prefix used for repeat captures.

Preserve user rules unless the task explicitly requires changing them.

## Runtime Assumptions

- Windows is the primary target environment.
- Python launcher scripts create and use `python_service/.venv`.
- Tesseract must be installed locally.
- The extension is loaded unpacked in Chrome/Chromium.
- Detection coordinates are tuned to the current task UI on the primary display.
- The LAN bridge IP is currently hard-coded in more than one place.

## Files That Must Stay In Sync

- `chrome_extension/service_worker.js`
- `chrome_extension/manifest.json`
- `README.md`

Keep these aligned when changing:

- bridge base URL or LAN IP
- allowed host permissions
- documented endpoints or setup steps

Also keep the Python-extension payload contract aligned:

- normal task events use `a`, `b`, `c`, `d`
- scroll events use `a`, `b`, `d`
- repeat events add `e`

Do not change the contract on one side only.

## Generated / Runtime Data

These paths are usually runtime output, not source-of-truth code:

- `python_service/task_type_counts.json`
- `python_service/task_type_history.jsonl`
- `python_service/manual_screenshots/`
- `python_service/paddleocr_debug/`
- `python_service/debug/`

Do not treat changes there as product logic unless the task is specifically about debugging or analysis.

## Safe Change Guidance

- If you change OCR logic, also verify the icon assets and screen regions still match the real UI.
- If you change ChatGPT automation, assume selectors may already be fragile and verify against the current site.
- If you change the bridge URL, update both the worker and manifest together.
- If you change the task config schema, update both normalization logic in `screen_bridge.py` and the documentation.
- Avoid overwriting local operational data in `task_type_config.json` unless explicitly asked.

## Common Commands

Start the bridge in PowerShell:

```powershell
cd python_service
.\run.ps1
```

Start the bridge from Git Bash:

```bash
cd python_service
./run.sh
```

Run manual OCR analysis:

```powershell
cd python_service
python paddleocr_manual_test.py
```

## Verification Checklist

After meaningful changes, verify the relevant path end to end:

1. Start `screen_bridge.py` through `run.ps1` or `run.sh`.
2. Confirm the extension can still poll the bridge.
3. Reload the unpacked extension if any extension file changed.
4. Keep a ChatGPT tab open and verify screenshot upload/prompt insertion still works.
5. If task detection changed, use the manual trigger (`Shift+Alt+Z`) or OCR debug output to confirm behavior.

## Practical Rule

Treat this repo as one system split across two runtimes. Most regressions come from changing only one half:

- Python event format without updating the extension
- extension host permissions without updating the bridge URL
- ChatGPT selector logic without re-testing against the current UI
- screen/OCR calibration without validating on the real display
