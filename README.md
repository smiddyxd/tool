# Local Query Bridge

This project watches a task counter on screen, captures a screenshot for each new task, and submits that screenshot into ChatGPT.

## Current flow

1. `python_service/screen_bridge.py`
   Captures the primary monitor every 0.5 seconds, detects the task-counter icon in a fixed screen band, OCRs the blue counter digits to the right of that icon, and treats every new counter value as a new task.
2. For each new task, the bridge also reads the task type from the left side of the screen by matching `task-type-icon.png` and OCRing the text to its right.
3. `python_service/task_type_config.json`
   Maps task-type text to behavior. By default the bridge does nothing unless a rule matches.
   - `enabled`: if `false`, that config path is ignored
   - `wait_for_edge`: if `true`, the screenshot is held until you move the mouse to the very left edge of the screen
   - `test_trigger`: if `true`, `Shift+Alt+Z` runs a manual screenshot test using that rule
   - `prompt`: the prompt text sent to ChatGPT for that task type
4. Every new task increment is also recorded on disk by task type:
   - `python_service/task_type_counts.json`: running totals per OCRed task type
   - `python_service/task_type_history.jsonl`: append-only history with timestamp, global counter value, and task type
5. `chrome_extension/`
   Polls `GET /a`, decrypts screenshot events and scroll events, injects a content script into the active ChatGPT tab, attaches screenshots when needed, and scrolls ChatGPT when the Python side emits edge-scroll commands.

## Project layout

```text
.
|-- README.md
|-- chrome_extension
|   |-- content_script.js
|   |-- manifest.json
|   `-- service_worker.js
`-- python_service
    |-- assets
    |   |-- google_logo_template.png
    |   |-- task-counter-icon.png
    |   `-- task-type-icon.png
    |-- requirements.txt
    |-- run.ps1
    |-- run.sh
    |-- screen_bridge.py
    |-- task_type_config.json
    |-- task_type_counts.json
    `-- task_type_history.jsonl
```

## Python setup

Requirements:
- Python 3.10+
- Tesseract OCR installed
- `python_service/assets/task-counter-icon.png` present
- `python_service/assets/task-type-icon.png` present

PowerShell:

```powershell
cd python_service
.\run.ps1
```

Git Bash:

```bash
cd python_service
./run.sh
```

Both launchers stop any process already listening on the configured bridge port before starting a fresh instance.

The bridge now listens on LAN as well as locally (`HTTP_HOST = 0.0.0.0`).

Current primary-PC LAN endpoint:
- `http://192.168.0.215:62041/a`

Local endpoint on the same PC:
- `http://127.0.0.1:62041/a`

Current JSON contract:
- `d`: XOR+hex event type (`task` or `scroll`)
- task events:
  - `a`: XOR+hex task counter string
  - `b`: XOR+base64 PNG bytes
  - `c`: XOR+base64 prompt text
- scroll events:
  - `a`: XOR+hex direction (`up` or `down`)
  - `b`: XOR+hex step count

## Task detection

Task counter:
- scan region: full screen width at `top=135, height=24`
- icon template: `python_service/assets/task-counter-icon.png`
- digit OCR band: the next `64px` immediately to the right of the matched icon
- digit color target: hex `4487F6`

Task type:
- icon search region: `left=20, top=127, width=40, height=40`
- icon template: `python_service/assets/task-type-icon.png`
- OCR region: starts just to the right of the matched icon and extends to the middle of the screen

Mouse release signal:
- left-edge signal: `x < 2` anywhere vertically on the primary screen
- only task types with `wait_for_edge=true` use this gate

ChatGPT edge scrolling:
- top edge: when the mouse touches the very top of the primary screen, ChatGPT scrolls up by half a viewport
- bottom edge: when the mouse touches the very bottom of the primary screen, ChatGPT scrolls down by half a viewport
- repeats every `1.0s` while the mouse stays on that edge

Manual test trigger:
- hotkey: `Shift+Alt+Z`
- the first enabled rule with `test_trigger=true` is used as the task type/prompt source
- the screenshot is queued immediately; it does not wait for the left-edge gate

Task-type counting:
- every new global counter increment is recorded against the OCRed task type, even if that task type is ignored by the automation rules
- totals are stored in `python_service/task_type_counts.json`
- the full append-only event log is stored in `python_service/task_type_history.jsonl`

## Task-type config

Edit `python_service/task_type_config.json`.

Schema:

```json
{
  "default": {
    "enabled": false,
    "wait_for_edge": false,
    "prompt": ""
  },
  "rules": [
    {
      "match": "loading",
      "match_mode": "contains",
      "enabled": true,
      "wait_for_edge": true,
      "test_trigger": true,
      "prompt": "... [TASK_TYPE] ..."
    }
  ]
}
```

Notes:
- `match_mode` supports `contains` and `exact`
- `enabled=false` disables that config entry
- `test_trigger=true` marks the rule used by the manual `Shift+Alt+Z` test run
- rules are checked in order; the first match wins
- `[TASK_TYPE]` inside a prompt is replaced with the OCRed task type text
- with `default.enabled=false`, unmatched task types are ignored completely

## ChatGPT extension setup

1. Open `chrome://extensions`
2. Enable Developer mode
3. Click `Load unpacked`
4. Select the `chrome_extension` folder
5. Reload the extension after any file change
6. Keep a ChatGPT tab open on `https://chatgpt.com/` or `https://chat.openai.com/`

The extension now requests:
- `http://127.0.0.1/*`
- `http://localhost/*`
- `http://192.168.0.215/*`

## Logging

Python logs only state changes:
- bridge startup
- handshake every 10 seconds when `/a` is being reached successfully
- new task detected
- manual test hotkey triggered
- task released from the left-edge gate
- payload served to the extension
- monitor/config errors

Extension logs only state changes:
- handshake every 10 seconds when `/a` responds successfully
- non-200 poll failures
- fetch failures
- new screenshot payload retrieved
- screenshot submitted to ChatGPT
- ChatGPT scroll direction when a scroll event is applied

## Debug output

If you need OCR debug artifacts, set `DEBUG_OUTPUT_ENABLED = True` in `python_service/screen_bridge.py`.

Files are written to:

```text
python_service/debug/
```

## Notes

- `screen_bridge.py` attaches the full primary-monitor screenshot by default. If you want a crop instead, set `SCREENSHOT_CROP_REGION`.
- The bridge uses the current live frame when the left-edge signal releases a waiting task, so delayed tasks are captured after loading finishes.
- The extension still uses a generic `input[type="file"]` selector for ChatGPT attachments. If ChatGPT changes that DOM, update `ATTACHMENT_INPUT_SELECTOR` in `chrome_extension/content_script.js`.

## LAN setup

To run the extension on a second device on the same router:

1. Run the Python bridge on PC 1.
2. Make sure PC 1 keeps the same LAN IP, or update the extension if it changes. The current detected IP is `192.168.0.215`.
3. On PC 2, load the unpacked extension from the same `chrome_extension` folder contents.
4. In `chrome://extensions`, reload the extension after any `manifest.json` or `service_worker.js` change.
5. Open a ChatGPT tab on PC 2 and refresh it once after reloading the extension.
6. Allow inbound TCP traffic to port `62041` on PC 1 in Windows Firewall if the second device cannot connect.

If the IP changes later, update these two files on PC 2 and reload the extension:
- `chrome_extension/service_worker.js`
- `chrome_extension/manifest.json`
