from __future__ import annotations

import base64
import ctypes
import json
import threading
import time
from collections import deque
from ctypes import wintypes
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path
from typing import Any

import cv2
import mss
import numpy as np
import paddleocr_manual_test
import pytesseract
from flask import Flask, Response, jsonify

# Screen capture cadence in seconds.
POLL_INTERVAL_SECONDS = 0.5
HANDSHAKE_LOG_INTERVAL_SECONDS = 10.0

# HTTP server binding for the local/LAN bridge endpoint.
HTTP_HOST = "0.0.0.0"
HTTP_PORT = 62041
EVENT_ENDPOINT_PATH = "/a"
REPEAT_CAPTURE_ENDPOINT_PATH = "/b"

# Tesseract tuning. Adjust the binary path if Tesseract is not on PATH.
TESSERACT_CMD = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
OCR_LANGUAGE = "deu+eng"
COUNTER_OCR_LANGUAGE = "eng"
XOR_KEY = 0x5A
TEXT_TASK_EVENT_TYPE = "text_task"
ALERT_TASK_EVENT_TYPE = "alert_task"
TEXT_TASK_QUERY_PREFIX = "query:"
TEXT_TASK_INPUT_HEADER = "Task input below is provided as labeled OCR text instead of a screenshot."
TEXT_TASK_QUERY_LABEL = "Query:"
TEXT_TASK_PRODUCT_LABEL = "Product Text:"
TEXT_TASK_OCR_WARNING_HEADER = "OCR warning:"
TEXT_TASK_ABORT_HEADER = "OCR abort:"


@dataclass(frozen=True)
class Region:
    left: int
    top: int
    width: int
    height: int


@dataclass(frozen=True)
class TaskSettings:
    task_type: str
    wait_for_edge: bool
    prompts: tuple[str, ...]
    repeat_prefix: str


@dataclass(frozen=True)
class ArmedTask:
    task_count: int
    task_type: str
    prompts: tuple[str, ...]
    repeat_prefix: str


@dataclass(frozen=True)
class RepeatableTask:
    task_count: int
    task_type: str
    prompts: tuple[str, ...]
    repeat_prefix: str
    base_screenshot_png: bytes


# Task-counter detection settings.
TASK_COUNTER_SCAN_TOP = 135
TASK_COUNTER_SCAN_HEIGHT = 24
TASK_COUNTER_ICON_TEMPLATE_PATH = Path(__file__).resolve().parent / "assets" / "task-counter-icon.png"
TASK_COUNTER_ICON_MATCH_THRESHOLD = 0.82
TASK_COUNTER_TEXT_REGION_WIDTH = 64
TASK_COUNTER_TEXT_COLOR_BGR = (246, 135, 68)  # Hex 4487F6 in BGR order for OpenCV.
TASK_COUNTER_TEXT_COLOR_TOLERANCE = 40
TASK_COUNTER_OCR_SCALE_FACTOR = 5.0
TASK_COUNTER_OCR_CONFIG = "--psm 7 -c tessedit_char_whitelist=0123456789"

# Task-type detection settings.
TASK_TYPE_SCAN_REGION = Region(left=20, top=127, width=40, height=40)
TASK_TYPE_ICON_TEMPLATE_PATH = Path(__file__).resolve().parent / "assets" / "task-type-icon.png"
TASK_TYPE_ICON_MATCH_THRESHOLD = 0.82
TASK_TYPE_TEXT_LEFT_PADDING = 8
TASK_TYPE_TEXT_RIGHT_RATIO = 0.5
TASK_TYPE_OCR_SCALE_FACTOR = 3.0
TASK_TYPE_OCR_CONFIG = "--psm 7"

# Screenshot settings. Leave SCREENSHOT_CROP_REGION as None to attach the full screen.
SCREENSHOT_CROP_REGION: Region | None = None

# Mouse-edge signal settings for task types that need manual release.
MOUSE_SIGNAL_EDGE_WIDTH = 2

# Screen-edge scrolling settings for ChatGPT.
ENABLE_SCROLL_BRIDGE = False
SCROLL_SIGNAL_EDGE_HEIGHT = 12
SCROLL_SIGNAL_RELEASE_HEIGHT = 32
SCROLL_MONITOR_INTERVAL_SECONDS = 0.05
SCROLL_REPEAT_SECONDS = 0.2
SCROLL_DIRECTION_UP = "up"
SCROLL_DIRECTION_DOWN = "down"

# Manual test trigger settings.
TEST_HOTKEY_LABEL = "Shift+Alt+Z"
PADDLE_OCR_HOTKEY_LABEL = "Shift+Alt+X"
MOD_ALT = 0x0001
MOD_SHIFT = 0x0004
VK_Z = 0x5A
VK_X = 0x58
WM_HOTKEY = 0x0312
TEST_HOTKEY_ID = 1
PADDLE_OCR_HOTKEY_ID = 2

# Debug artifacts. The latest crops and OCR outputs are overwritten on each write.
DEBUG_OUTPUT_ENABLED = False
DEBUG_OUTPUT_DIR = Path(__file__).resolve().parent / "debug"
TASK_TYPE_CONFIG_PATH = Path(__file__).resolve().parent / "task_type_config.json"
TASK_TYPE_COUNTS_PATH = Path(__file__).resolve().parent / "task_type_counts.json"
TASK_TYPE_HISTORY_PATH = Path(__file__).resolve().parent / "task_type_history.jsonl"
TASK_ARCHIVE_SCREENSHOT_DIR = Path(__file__).resolve().parent / "task_screenshots"
TASK_ARCHIVE_CAPTURE_DELAY_SECONDS = 0.5

DEFAULT_PROMPT = """The attached screenshot contains the current task page. First extract the exact Google search query shown in the screenshot. Then, for each semantically distinct component, provide a bullet point explaining what it is. Keep explanations as short as possible -- ideally just a label like \"brand name\" or \"model nr\" or \"file format\". Only expand if the term is niche, technical, or foreign-domain, in which case explain proportionally longer and in plainer language the more it relies on assumed background knowledge. For terms that require simplification, give the shortest explanation that captures the essential nature of the thing while still leaving someone unfamiliar with an accurate mental model.

Then, below the bullets, list the most plausible interpretations of the full query, each with an estimated likelihood percentage and a one-line description of what the user is probably trying to find.

Base everything strictly on the screenshot attachment."""

DEFAULT_REPEAT_PREFIX = """Use the Google search screenshots to identify the user intent of the query that is most relatable to the product, assume that as the user intent, and update your final judgment accordingly."""

DEFAULT_TASK_TYPE_CONFIG = {
    "default": {
        "enabled": False,
        "wait_for_edge": False,
        "prompts": [],
        "repeat_prefix": DEFAULT_REPEAT_PREFIX,
    },
    "rules": [
        {
            "match": "loading",
            "match_mode": "contains",
            "enabled": True,
            "wait_for_edge": True,
            "test_trigger": False,
            "prompts": [DEFAULT_PROMPT],
            "repeat_prefix": DEFAULT_REPEAT_PREFIX,
        }
    ],
}

app = Flask(__name__)
LAST_HANDSHAKE_LOG_AT = 0.0
HANDSHAKE_LOCK = threading.Lock()


@dataclass
class ConfigCache:
    path: Path
    mtime_ns: int | None = None
    data: dict[str, Any] = field(default_factory=dict)

    def load(self) -> dict[str, Any]:
        ensure_task_type_config(self.path)
        try:
            stat = self.path.stat()
            if self.mtime_ns != stat.st_mtime_ns:
                raw = json.loads(self.path.read_text(encoding="utf-8"))
                self.data = normalize_task_type_config(raw)
                self.mtime_ns = stat.st_mtime_ns
        except Exception as exc:
            self.data = normalize_task_type_config(DEFAULT_TASK_TYPE_CONFIG)
            self.mtime_ns = None
            print(f"[bridge {timestamp_now()}] config error: {exc}. Using defaults.", flush=True)
        return self.data


CONFIG_CACHE = ConfigCache(TASK_TYPE_CONFIG_PATH)


@dataclass
class TaskTypeCounterStore:
    counts_path: Path
    history_path: Path
    totals: dict[str, int] = field(default_factory=dict)
    lock: threading.Lock = field(default_factory=threading.Lock)

    def __post_init__(self) -> None:
        self.totals = self._load_totals()

    def _load_totals(self) -> dict[str, int]:
        if not self.counts_path.exists():
            return {}
        try:
            raw = json.loads(self.counts_path.read_text(encoding="utf-8"))
        except Exception as exc:
            print(f"[bridge {timestamp_now()}] counts load error: {exc}. Resetting totals.", flush=True)
            return {}

        totals: dict[str, int] = {}
        if isinstance(raw, dict):
            for key, value in raw.items():
                try:
                    totals[str(key)] = int(value)
                except (TypeError, ValueError):
                    continue
        return totals

    def record(self, task_count: int, task_type: str) -> int:
        normalized_type = clean_ocr_text(task_type) or "Unknown"
        event = {
            "timestamp": timestamp_now(),
            "task_count": task_count,
            "task_type": normalized_type,
        }

        with self.lock:
            total = self.totals.get(normalized_type, 0) + 1
            self.totals[normalized_type] = total
            self.counts_path.write_text(
                json.dumps(self.totals, indent=2, ensure_ascii=False),
                encoding="utf-8",
            )
            with self.history_path.open("a", encoding="utf-8") as handle:
                handle.write(json.dumps(event, ensure_ascii=False) + "\n")
        return total


TASK_TYPE_COUNTERS = TaskTypeCounterStore(TASK_TYPE_COUNTS_PATH, TASK_TYPE_HISTORY_PATH)


@dataclass
class TestTriggerState:
    pending_count: int = 0
    lock: threading.Lock = field(default_factory=threading.Lock)

    def signal(self) -> None:
        with self.lock:
            self.pending_count += 1

    def consume(self) -> bool:
        with self.lock:
            if self.pending_count <= 0:
                return False
            self.pending_count -= 1
            return True


TEST_TRIGGER_STATE = TestTriggerState()
PADDLE_OCR_TRIGGER_STATE = TestTriggerState()


def warmup_paddleocr() -> None:
    try:
        paddleocr_manual_test.load_paddleocr()
        print(f"[paddleocr {timestamp_now()}] warmup-ready", flush=True)
    except Exception as exc:
        print(f"[paddleocr {timestamp_now()}] warmup-skipped error: {exc}", flush=True)


@dataclass
class SharedState:
    last_seen_task_count: int | None = None
    pending_events: deque[dict[str, Any]] = field(default_factory=deque)
    armed_task: ArmedTask | None = None
    repeatable_task: RepeatableTask | None = None
    lock: threading.Lock = field(default_factory=threading.Lock)

    def is_new_task(self, task_count: int) -> bool:
        with self.lock:
            return task_count != self.last_seen_task_count

    def ignore_task(self, task_count: int) -> bool:
        with self.lock:
            if task_count == self.last_seen_task_count:
                return False
            self.last_seen_task_count = task_count
            self.armed_task = None
            self.repeatable_task = None
            return True

    def register_task(self, task_count: int, settings: TaskSettings) -> str:
        with self.lock:
            if task_count == self.last_seen_task_count:
                return "duplicate"

            self.last_seen_task_count = task_count
            self.repeatable_task = None
            if settings.wait_for_edge:
                self.armed_task = ArmedTask(
                    task_count=task_count,
                    task_type=settings.task_type,
                    prompts=settings.prompts,
                    repeat_prefix=settings.repeat_prefix,
                )
                return "armed"

            self.armed_task = None
            return "ready"

    def consume_armed_task(self) -> ArmedTask | None:
        with self.lock:
            armed_task = self.armed_task
            self.armed_task = None
            return armed_task

    def remember_repeatable_task(
        self,
        task_count: int,
        task_type: str,
        prompts: list[str] | tuple[str, ...],
        repeat_prefix: str,
        base_screenshot_png: bytes,
    ) -> None:
        with self.lock:
            self.repeatable_task = RepeatableTask(
                task_count=task_count,
                task_type=task_type,
                prompts=tuple(prompts),
                repeat_prefix=repeat_prefix,
                base_screenshot_png=base_screenshot_png,
            )

    def get_repeatable_task(self) -> RepeatableTask | None:
        with self.lock:
            return self.repeatable_task

    def publish_payload(
        self,
        task_count: int,
        screenshots_png: list[bytes] | tuple[bytes, ...],
        prompts: list[str] | tuple[str, ...],
    ) -> None:
        with self.lock:
            self.pending_events.append(
                {
                    "type": "task",
                    "task_count": task_count,
                    "screenshots_png": [bytes(screenshot_png) for screenshot_png in screenshots_png],
                    "prompts": list(prompts),
                }
            )

    def publish_text_payload(
        self,
        task_count: int,
        prompts: list[str] | tuple[str, ...],
    ) -> None:
        with self.lock:
            self.pending_events.append(
                {
                    "type": TEXT_TASK_EVENT_TYPE,
                    "task_count": task_count,
                    "prompts": list(prompts),
                }
            )

    def publish_alert_payload(
        self,
        task_count: int,
        alerts: list[str] | tuple[str, ...],
    ) -> None:
        with self.lock:
            self.pending_events.append(
                {
                    "type": ALERT_TASK_EVENT_TYPE,
                    "task_count": task_count,
                    "alerts": list(alerts),
                }
            )

    def publish_scroll(self, direction: str, steps: int = 1) -> None:
        with self.lock:
            self.pending_events.append(
                {
                    "type": "scroll",
                    "direction": direction,
                    "steps": steps,
                }
            )

    def consume_event(self) -> dict[str, str]:
        with self.lock:
            if not self.pending_events:
                return {"a": "", "b": "", "c": "", "d": ""}

            event = self.pending_events.popleft()

        event_type = str(event.get("type", ""))
        if event_type == "task":
            task_count = int(event["task_count"])
            screenshot_pngs = [bytes(screenshot_png) for screenshot_png in event.get("screenshots_png", [])]
            prompts = [str(prompt) for prompt in event.get("prompts", [])]
            encoded_screenshots = [base64.b64encode(screenshot_png).decode("ascii") for screenshot_png in screenshot_pngs]
            total_bytes = sum(len(screenshot_png) for screenshot_png in screenshot_pngs)
            print(
                f"[bridge {timestamp_now()}] served counter={task_count} screenshots={len(screenshot_pngs)} bytes={total_bytes}",
                flush=True,
            )
            return {
                "a": xor_encrypt_to_hex(str(task_count), XOR_KEY),
                "b": xor_encrypt_string_to_base64(json.dumps(encoded_screenshots, ensure_ascii=False), XOR_KEY),
                "c": xor_encrypt_string_to_base64(json.dumps(prompts, ensure_ascii=False), XOR_KEY),
                "d": xor_encrypt_to_hex("task", XOR_KEY),
            }

        if event_type == TEXT_TASK_EVENT_TYPE:
            task_count = int(event["task_count"])
            prompts = [str(prompt) for prompt in event.get("prompts", [])]
            print(
                f"[bridge {timestamp_now()}] served counter={task_count} text-prompts={len(prompts)}",
                flush=True,
            )
            return {
                "a": xor_encrypt_to_hex(str(task_count), XOR_KEY),
                "b": "",
                "c": xor_encrypt_string_to_base64(json.dumps(prompts, ensure_ascii=False), XOR_KEY),
                "d": xor_encrypt_to_hex(TEXT_TASK_EVENT_TYPE, XOR_KEY),
            }

        if event_type == ALERT_TASK_EVENT_TYPE:
            task_count = int(event["task_count"])
            alerts = [str(alert_text) for alert_text in event.get("alerts", [])]
            print(
                f"[bridge {timestamp_now()}] served counter={task_count} alerts={len(alerts)}",
                flush=True,
            )
            return {
                "a": xor_encrypt_to_hex(str(task_count), XOR_KEY),
                "b": "",
                "c": xor_encrypt_string_to_base64(json.dumps(alerts, ensure_ascii=False), XOR_KEY),
                "d": xor_encrypt_to_hex(ALERT_TASK_EVENT_TYPE, XOR_KEY),
            }

        if event_type == "scroll":
            direction = str(event.get("direction", ""))
            steps = int(event.get("steps", 1))
            return {
                "a": xor_encrypt_to_hex(direction, XOR_KEY),
                "b": xor_encrypt_to_hex(str(steps), XOR_KEY),
                "c": "",
                "d": xor_encrypt_to_hex("scroll", XOR_KEY),
            }

        return {"a": "", "b": "", "c": "", "d": ""}


STATE = SharedState()


@app.after_request
def add_cors_headers(response: Response) -> Response:
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response.headers["Cache-Control"] = "no-store"
    return response


@app.get(EVENT_ENDPOINT_PATH)
def get_pending_task() -> Any:
    maybe_log_handshake()
    return jsonify(STATE.consume_event())


@app.get(REPEAT_CAPTURE_ENDPOINT_PATH)
def capture_repeat_screenshot() -> Any:
    repeatable_task = STATE.get_repeatable_task()
    if repeatable_task is None:
        return jsonify({"a": "", "b": "", "c": "", "d": "", "e": ""})

    with mss.mss() as screenshotter:
        monitor = screenshotter.monitors[1]
        frame_bgr = capture_primary_monitor(screenshotter, monitor)

    captured_screenshot_png = build_screenshot_payload(frame_bgr)
    repeat_prompts = build_repeat_prompts(repeatable_task)
    print(
        f"[repeat {timestamp_now()}] counter={repeatable_task.task_count} type={repeatable_task.task_type} captured-by-request",
        flush=True,
    )
    return jsonify(
        {
            "a": xor_encrypt_to_hex(str(repeatable_task.task_count), XOR_KEY),
            "b": xor_encrypt_bytes_to_base64(captured_screenshot_png, XOR_KEY),
            "c": xor_encrypt_string_to_base64(json.dumps(list(repeat_prompts), ensure_ascii=False), XOR_KEY),
            "d": xor_encrypt_to_hex("repeat", XOR_KEY),
            "e": xor_encrypt_bytes_to_base64(repeatable_task.base_screenshot_png, XOR_KEY),
        }
    )


def timestamp_now() -> str:
    return datetime.now().isoformat(timespec="seconds")


def maybe_log_handshake() -> None:
    global LAST_HANDSHAKE_LOG_AT

    now = time.monotonic()
    with HANDSHAKE_LOCK:
        if now - LAST_HANDSHAKE_LOG_AT < HANDSHAKE_LOG_INTERVAL_SECONDS:
            return
        LAST_HANDSHAKE_LOG_AT = now

    print(f"[bridge {timestamp_now()}] handshake", flush=True)


def ensure_tesseract() -> None:
    if TESSERACT_CMD:
        pytesseract.pytesseract.tesseract_cmd = TESSERACT_CMD

    try:
        pytesseract.get_tesseract_version()
    except Exception as exc:  # pragma: no cover - environment-specific failure path
        raise RuntimeError(
            "Tesseract is not available. Install it and set TESSERACT_CMD if it is not on PATH."
        ) from exc


def xor_encrypt_to_hex(value: str, key: int) -> str:
    return "".join(f"{ord(char) ^ key:02x}" for char in value)


def xor_encrypt_bytes_to_base64(value: bytes, key: int) -> str:
    encrypted = bytes(byte ^ key for byte in value)
    return base64.b64encode(encrypted).decode("ascii")


def xor_encrypt_string_to_base64(value: str, key: int) -> str:
    return xor_encrypt_bytes_to_base64(value.encode("utf-8"), key)


def ensure_task_type_config(path: Path) -> None:
    if path.exists():
        return

    path.write_text(json.dumps(DEFAULT_TASK_TYPE_CONFIG, indent=2), encoding="utf-8")


def normalize_prompt_entries(raw_value: Any, fallback: Any = None) -> list[str]:
    def coerce_prompts(value: Any) -> list[str]:
        if isinstance(value, list):
            prompts = [str(item).strip() for item in value]
        elif isinstance(value, str):
            prompts = [value.strip()]
        else:
            prompts = []
        return [prompt for prompt in prompts if prompt]

    prompts = coerce_prompts(raw_value)
    if not prompts and fallback is not None:
        prompts = coerce_prompts(fallback)
    return prompts[:2]


def normalize_task_type_config(raw: dict[str, Any]) -> dict[str, Any]:
    default = raw.get("default", {}) if isinstance(raw, dict) else {}
    rules = raw.get("rules", []) if isinstance(raw, dict) else []
    if not isinstance(default, dict):
        default = {}
    if not isinstance(rules, list):
        rules = []

    default_prompts = normalize_prompt_entries(
        default.get("prompts", default.get("prompt", DEFAULT_TASK_TYPE_CONFIG["default"]["prompts"])),
        DEFAULT_TASK_TYPE_CONFIG["default"]["prompts"],
    )
    default_repeat_prefix = str(
        default.get("repeat_prefix", DEFAULT_TASK_TYPE_CONFIG["default"]["repeat_prefix"])
    ).strip() or DEFAULT_REPEAT_PREFIX

    normalized_rules: list[dict[str, Any]] = []
    for rule in rules:
        if not isinstance(rule, dict):
            continue
        normalized_rules.append(
            {
                "match": str(rule.get("match", "")).strip(),
                "match_mode": str(rule.get("match_mode", "contains")).strip().lower() or "contains",
                "enabled": bool(rule.get("enabled", True)),
                "wait_for_edge": bool(rule.get("wait_for_edge", default.get("wait_for_edge", False))),
                "test_trigger": bool(rule.get("test_trigger", False)),
                "prompts": normalize_prompt_entries(
                    rule.get("prompts", rule.get("prompt", default_prompts or [DEFAULT_PROMPT])),
                    default_prompts or [DEFAULT_PROMPT],
                ),
                "repeat_prefix": str(rule.get("repeat_prefix", default_repeat_prefix)).strip() or default_repeat_prefix,
            }
        )

    return {
        "default": {
            "enabled": bool(default.get("enabled", DEFAULT_TASK_TYPE_CONFIG["default"]["enabled"])),
            "wait_for_edge": bool(default.get("wait_for_edge", DEFAULT_TASK_TYPE_CONFIG["default"]["wait_for_edge"])),
            "prompts": default_prompts,
            "repeat_prefix": default_repeat_prefix,
        },
        "rules": normalized_rules,
    }

def resolve_task_settings(task_type: str, config: dict[str, Any]) -> TaskSettings | None:
    normalized_type = clean_ocr_text(task_type) or "Unknown"
    default = config["default"]
    selected_rule: dict[str, Any] | None = None

    for rule in config.get("rules", []):
        match_text = str(rule.get("match", "")).strip()
        if not match_text:
            continue

        mode = str(rule.get("match_mode", "contains")).lower()
        task_type_folded = normalized_type.casefold()
        match_folded = match_text.casefold()
        if mode == "exact" and task_type_folded == match_folded:
            selected_rule = rule
            break
        if mode != "exact" and match_folded in task_type_folded:
            selected_rule = rule
            break

    source = selected_rule if selected_rule is not None else default
    if not bool(source.get("enabled", selected_rule is not None)):
        return None

    wait_for_edge = bool(source.get("wait_for_edge", False))
    prompts = tuple(
        prompt.replace("[TASK_TYPE]", normalized_type)
        for prompt in source.get("prompts", [DEFAULT_PROMPT])
        if str(prompt).strip()
    )
    if not prompts:
        prompts = (DEFAULT_PROMPT.replace("[TASK_TYPE]", normalized_type),)
    repeat_prefix = str(source.get("repeat_prefix", DEFAULT_REPEAT_PREFIX)).strip() or DEFAULT_REPEAT_PREFIX
    repeat_prefix = repeat_prefix.replace("[TASK_TYPE]", normalized_type)
    return TaskSettings(
        task_type=normalized_type,
        wait_for_edge=wait_for_edge,
        prompts=prompts,
        repeat_prefix=repeat_prefix,
    )

def resolve_test_task_settings(config: dict[str, Any]) -> TaskSettings | None:
    for rule in config.get("rules", []):
        if not bool(rule.get("enabled", True)):
            continue
        if not bool(rule.get("test_trigger", False)):
            continue

        task_type = clean_ocr_text(str(rule.get("match", ""))) or "Test Task"
        prompts = tuple(
            prompt.replace("[TASK_TYPE]", task_type)
            for prompt in rule.get("prompts", [DEFAULT_PROMPT])
            if str(prompt).strip()
        )
        if not prompts:
            prompts = (DEFAULT_PROMPT.replace("[TASK_TYPE]", task_type),)
        repeat_prefix = str(rule.get("repeat_prefix", DEFAULT_REPEAT_PREFIX)).strip() or DEFAULT_REPEAT_PREFIX
        repeat_prefix = repeat_prefix.replace("[TASK_TYPE]", task_type)
        return TaskSettings(
            task_type=task_type,
            wait_for_edge=False,
            prompts=prompts,
            repeat_prefix=repeat_prefix,
        )

    return None


def ensure_debug_output_dir() -> None:
    if DEBUG_OUTPUT_ENABLED:
        DEBUG_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def save_debug_image(filename: str, image: np.ndarray) -> None:
    if not DEBUG_OUTPUT_ENABLED or image.size == 0:
        return
    ensure_debug_output_dir()
    cv2.imwrite(str(DEBUG_OUTPUT_DIR / filename), image)


def save_debug_text(filename: str, text: str) -> None:
    if not DEBUG_OUTPUT_ENABLED:
        return
    ensure_debug_output_dir()
    (DEBUG_OUTPUT_DIR / filename).write_text(text, encoding="utf-8")


def load_template_image(path: Path) -> np.ndarray:
    template = cv2.imread(str(path), cv2.IMREAD_COLOR)
    if template is None:
        raise FileNotFoundError(f"Missing template image: {path}")
    return template


def clamp_region(region: Region, frame_width: int, frame_height: int) -> Region | None:
    left = max(0, region.left)
    top = max(0, region.top)
    right = min(frame_width, region.left + region.width)
    bottom = min(frame_height, region.top + region.height)
    if right <= left or bottom <= top:
        return None
    return Region(left=left, top=top, width=right - left, height=bottom - top)


def extract_region(frame_bgr: np.ndarray, region: Region) -> np.ndarray:
    clamped = clamp_region(region, frame_bgr.shape[1], frame_bgr.shape[0])
    if clamped is None:
        return np.empty((0, 0, 3), dtype=np.uint8)
    return frame_bgr[
        clamped.top : clamped.top + clamped.height,
        clamped.left : clamped.left + clamped.width,
    ].copy()


def match_template(region_bgr: np.ndarray, template_bgr: np.ndarray, threshold: float) -> Region | None:
    if region_bgr.size == 0:
        return None
    if region_bgr.shape[0] < template_bgr.shape[0] or region_bgr.shape[1] < template_bgr.shape[1]:
        return None

    region_gray = cv2.cvtColor(region_bgr, cv2.COLOR_BGR2GRAY)
    template_gray = cv2.cvtColor(template_bgr, cv2.COLOR_BGR2GRAY)
    result = cv2.matchTemplate(region_gray, template_gray, cv2.TM_CCOEFF_NORMED)
    _, max_value, _, max_location = cv2.minMaxLoc(result)
    if max_value < threshold:
        return None

    return Region(
        left=int(max_location[0]),
        top=int(max_location[1]),
        width=int(template_bgr.shape[1]),
        height=int(template_bgr.shape[0]),
    )


def upscale_image(image: np.ndarray, scale_factor: float, interpolation: int) -> np.ndarray:
    return cv2.resize(image, None, fx=scale_factor, fy=scale_factor, interpolation=interpolation)


def clean_ocr_text(text: str) -> str:
    text = text.replace("\r", " ").replace("\n", " ")
    text = " ".join(text.split())
    return text.strip(" |:-")


def clean_multiline_ocr_text(text: str) -> str:
    normalized_lines: list[str] = []
    for raw_line in str(text).replace("\r\n", "\n").replace("\r", "\n").split("\n"):
        cleaned_line = " ".join(str(raw_line).split()).strip(" |")
        if cleaned_line:
            normalized_lines.append(cleaned_line)
    return "\n".join(normalized_lines)


def extract_text_task_parts(entry: dict[str, Any]) -> tuple[str, str]:
    selected_transcript = entry.get("selected_transcript", {})
    query_line = selected_transcript.get("query_line") if isinstance(selected_transcript, dict) else None
    query_text = ""
    if isinstance(query_line, dict):
        query_text = clean_multiline_ocr_text(str(query_line.get("text", "")))
    if query_text.casefold().startswith(TEXT_TASK_QUERY_PREFIX):
        query_text = query_text.split(":", 1)[1].strip()

    product_text = ""
    if isinstance(selected_transcript, dict):
        product_text = clean_multiline_ocr_text(str(selected_transcript.get("bottom_block_text", "")))
        if not product_text:
            product_lines: list[str] = []
            for line in selected_transcript.get("bottom_block_lines", []):
                if not isinstance(line, dict):
                    continue
                cleaned_line = clean_multiline_ocr_text(str(line.get("text", "")))
                if cleaned_line:
                    product_lines.append(cleaned_line)
            product_text = "\n".join(product_lines)

    return query_text, product_text


def build_text_task_ocr_warning(entry: dict[str, Any]) -> str:
    selected_transcript = entry.get("selected_transcript", {})
    if not isinstance(selected_transcript, dict):
        return ""

    product_signature = selected_transcript.get("product_signature", {})
    if not isinstance(product_signature, dict) or bool(product_signature.get("is_complete_like", False)):
        return ""

    line_count = int(product_signature.get("line_count", 0) or 0)
    reasons = [str(reason).strip() for reason in product_signature.get("reasons", []) if str(reason).strip()]
    retry_attempted = bool(selected_transcript.get("retry_attempted", False))
    warning_lines = [
        (
            f"{TEXT_TASK_OCR_WARNING_HEADER} selected product text still appears incomplete after OCR retries."
            if retry_attempted
            else f"{TEXT_TASK_OCR_WARNING_HEADER} selected product text may be incomplete."
        ),
        f"Observed {line_count} selected product line{'s' if line_count != 1 else ''}.",
    ]
    if reasons:
        warning_lines.append("Signature check: " + "; ".join(reasons) + ".")

    excluded_above = selected_transcript.get("first_excluded_above_bottom_block")
    if isinstance(excluded_above, dict):
        excluded_line = excluded_above.get("line")
        excluded_text = ""
        if isinstance(excluded_line, dict):
            excluded_text = clean_multiline_ocr_text(str(excluded_line.get("text", "")))
        gap_px = excluded_above.get("gap_px")
        if excluded_text:
            gap_label = f"{gap_px}px" if isinstance(gap_px, (int, float)) else "more than the current gap threshold"
            warning_lines.append(f"Nearest excluded row above the selected block was {gap_label} away: {excluded_text}")

    warning_lines.append("Use caution and avoid overconfident conclusions if the product text appears truncated.")
    return "\n".join(warning_lines)


def get_text_task_abort_reasons(entry: dict[str, Any], query_text: str, product_text: str) -> list[str]:
    reasons: list[str] = []
    if not query_text.strip():
        reasons.append("missing query text")
    if not product_text.strip():
        reasons.append("missing product text")

    selected_transcript = entry.get("selected_transcript", {})
    product_signature = selected_transcript.get("product_signature", {}) if isinstance(selected_transcript, dict) else {}
    if isinstance(product_signature, dict) and not bool(product_signature.get("is_complete_like", False)):
        reasons.append("product signature incomplete after OCR retries")

    return reasons


def build_text_task_input(query_text: str, product_text: str, *, ocr_warning: str = "") -> str:
    sections = [TEXT_TASK_INPUT_HEADER]
    if ocr_warning.strip():
        sections.extend(["", ocr_warning.strip()])
    sections.extend(
        [
            "",
            TEXT_TASK_QUERY_LABEL,
            query_text,
            "",
            TEXT_TASK_PRODUCT_LABEL,
            product_text,
        ]
    )
    return "\n".join(sections).strip()


def build_text_task_prompts(prompts: tuple[str, ...], query_text: str, product_text: str, *, ocr_warning: str = "") -> tuple[str, ...]:
    task_input_text = build_text_task_input(query_text, product_text, ocr_warning=ocr_warning)
    return tuple(f"{prompt}\n\n{task_input_text}".strip() for prompt in prompts if str(prompt).strip())


def build_text_task_abort_alerts(
    query_text: str,
    product_text: str,
    *,
    abort_reasons: list[str],
    ocr_warning: str = "",
) -> tuple[str, ...]:
    sections = [
        f"{TEXT_TASK_ABORT_HEADER} the OCR-based text capture is incomplete.",
    ]
    if abort_reasons:
        sections.extend(["", "Reason: " + "; ".join(reason.strip() for reason in abort_reasons if reason.strip()) + "."])
    if ocr_warning.strip():
        sections.extend(["", ocr_warning.strip()])
    if query_text.strip() or product_text.strip():
        sections.extend(
            [
                "",
                TEXT_TASK_QUERY_LABEL,
                query_text or "[missing]",
                "",
                TEXT_TASK_PRODUCT_LABEL,
                product_text or "[missing]",
            ]
        )
    return ("\n".join(sections).strip(),)


def ocr_single_line(image: np.ndarray, *, language: str, config: str) -> str:
    return pytesseract.image_to_string(image, lang=language, config=config)


def preprocess_counter_digits(region_bgr: np.ndarray) -> np.ndarray:
    target = np.array(TASK_COUNTER_TEXT_COLOR_BGR, dtype=np.int16)
    tolerance = TASK_COUNTER_TEXT_COLOR_TOLERANCE
    lower = np.clip(target - tolerance, 0, 255).astype(np.uint8)
    upper = np.clip(target + tolerance, 0, 255).astype(np.uint8)

    mask = cv2.inRange(region_bgr, lower, upper)
    kernel = np.ones((2, 2), dtype=np.uint8)
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
    mask = cv2.dilate(mask, kernel, iterations=1)
    processed = 255 - mask
    return upscale_image(processed, TASK_COUNTER_OCR_SCALE_FACTOR, cv2.INTER_NEAREST)


def extract_task_counter(frame_bgr: np.ndarray, icon_template_bgr: np.ndarray) -> int | None:
    scan_region = extract_region(
        frame_bgr,
        Region(left=0, top=TASK_COUNTER_SCAN_TOP, width=frame_bgr.shape[1], height=TASK_COUNTER_SCAN_HEIGHT),
    )
    icon_match = match_template(scan_region, icon_template_bgr, TASK_COUNTER_ICON_MATCH_THRESHOLD)
    if icon_match is None:
        return None

    digits_left = icon_match.left + icon_match.width
    digits_right = min(scan_region.shape[1], digits_left + TASK_COUNTER_TEXT_REGION_WIDTH)
    if digits_right <= digits_left:
        return None

    digits_region = scan_region[:, digits_left:digits_right].copy()
    processed_digits = preprocess_counter_digits(digits_region)

    raw_text = ocr_single_line(processed_digits, language=COUNTER_OCR_LANGUAGE, config=TASK_COUNTER_OCR_CONFIG)
    cleaned = "".join(character for character in raw_text if character.isdigit())

    save_debug_image("task_counter_scan_region.png", scan_region)
    save_debug_image("task_counter_digits_raw.png", digits_region)
    save_debug_image("task_counter_digits_processed.png", processed_digits)
    save_debug_text("task_counter_ocr.txt", f"raw={raw_text!r}\nparsed={cleaned!r}\n")

    if not cleaned:
        return None

    try:
        return int(cleaned)
    except ValueError:
        return None

def preprocess_task_type_variants(region_bgr: np.ndarray) -> list[tuple[str, np.ndarray]]:
    raw_upscaled = upscale_image(region_bgr, TASK_TYPE_OCR_SCALE_FACTOR, cv2.INTER_CUBIC)
    gray = cv2.cvtColor(region_bgr, cv2.COLOR_BGR2GRAY)
    gray_upscaled = upscale_image(gray, TASK_TYPE_OCR_SCALE_FACTOR, cv2.INTER_CUBIC)
    thresholded = cv2.threshold(gray_upscaled, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]

    return [
        ("raw", cv2.cvtColor(raw_upscaled, cv2.COLOR_BGR2RGB)),
        ("gray", gray_upscaled),
        ("threshold", thresholded),
    ]


def extract_task_type(frame_bgr: np.ndarray, icon_template_bgr: np.ndarray) -> str:
    icon_region = extract_region(frame_bgr, TASK_TYPE_SCAN_REGION)
    icon_match = match_template(icon_region, icon_template_bgr, TASK_TYPE_ICON_MATCH_THRESHOLD)
    if icon_match is None:
        save_debug_image("task_type_scan_region.png", icon_region)
        save_debug_text("task_type_ocr.txt", "Icon not found in task-type scan region.\n")
        return ""

    icon_left = TASK_TYPE_SCAN_REGION.left + icon_match.left
    icon_right = icon_left + icon_match.width
    text_left = icon_right + TASK_TYPE_TEXT_LEFT_PADDING
    text_right = max(text_left + 1, int(frame_bgr.shape[1] * TASK_TYPE_TEXT_RIGHT_RATIO))
    text_region = Region(
        left=text_left,
        top=TASK_TYPE_SCAN_REGION.top,
        width=max(1, text_right - text_left),
        height=TASK_TYPE_SCAN_REGION.height,
    )
    text_crop = extract_region(frame_bgr, text_region)

    paddle_result: dict[str, Any] | None = None
    paddle_error: str | None = None
    try:
        paddle_result = paddleocr_manual_test.ocr_text_region(text_crop)
        paddle_text = clean_ocr_text(paddle_result.get("text", ""))
    except Exception as exc:
        paddle_error = str(exc)
        paddle_text = ""

    save_debug_image("task_type_scan_region.png", icon_region)
    save_debug_image("task_type_text_region.png", text_crop)

    if paddle_text:
        save_debug_text(
            "task_type_ocr.txt",
            "\n".join(
                [
                    f"engine='paddle' variant={paddle_result.get('variant')!r} cleaned={paddle_text!r}",
                    f"raw_line_count={paddle_result.get('raw_line_count')!r}",
                    f"lines={json.dumps(paddle_result.get('lines', []), ensure_ascii=False)}",
                    f"variants={json.dumps(paddle_result.get('variant_runs', []), ensure_ascii=False)}",
                ]
            )
            + "\n",
        )
        return paddle_text

    variants = preprocess_task_type_variants(text_crop)
    attempts: list[tuple[str, str, str]] = []
    for label, image in variants:
        raw_text = ocr_single_line(image, language=OCR_LANGUAGE, config=TASK_TYPE_OCR_CONFIG)
        cleaned_text = clean_ocr_text(raw_text)
        attempts.append((label, raw_text, cleaned_text))

    best_label, _best_raw, best_cleaned = max(attempts, key=lambda item: len(item[2]))

    for label, image in variants:
        save_debug_image(f"task_type_{label}.png", image)
    save_debug_text(
        "task_type_ocr.txt",
        "\n".join(
            [
                f"engine='tesseract-fallback' paddle_error={paddle_error!r} paddle_text={paddle_text!r}",
                f"best={best_label!r} cleaned={best_cleaned!r}",
            ]
            + [f"{label}: raw={raw!r} cleaned={cleaned!r}" for label, raw, cleaned in attempts]
        )
        + "\n",
    )

    return best_cleaned

def get_cursor_position() -> tuple[int, int]:
    point = wintypes.POINT()
    if not ctypes.windll.user32.GetCursorPos(ctypes.byref(point)):
        raise OSError("GetCursorPos failed")
    return int(point.x), int(point.y)


def is_mouse_signal_active(monitor: dict[str, int] | None = None) -> bool:
    x, _y = get_cursor_position()
    if monitor is None:
        return 0 <= x < MOUSE_SIGNAL_EDGE_WIDTH

    return monitor["left"] <= x < monitor["left"] + MOUSE_SIGNAL_EDGE_WIDTH


def build_repeat_prompts(repeatable_task: RepeatableTask) -> tuple[str, ...]:
    prefix = repeatable_task.repeat_prefix.strip()
    if not prefix:
        return repeatable_task.prompts
    return tuple(f"{prefix}\n\n{prompt}".strip() for prompt in repeatable_task.prompts)


def get_scroll_signal_direction(monitor: dict[str, int], active_direction: str | None) -> str | None:
    _x, y = get_cursor_position()
    top_enter_boundary = monitor["top"] + SCROLL_SIGNAL_EDGE_HEIGHT
    bottom_enter_boundary = monitor["top"] + monitor["height"] - SCROLL_SIGNAL_EDGE_HEIGHT
    top_release_boundary = monitor["top"] + SCROLL_SIGNAL_RELEASE_HEIGHT
    bottom_release_boundary = monitor["top"] + monitor["height"] - SCROLL_SIGNAL_RELEASE_HEIGHT

    if active_direction == SCROLL_DIRECTION_UP and y <= top_release_boundary:
        return SCROLL_DIRECTION_UP
    if active_direction == SCROLL_DIRECTION_DOWN and y >= bottom_release_boundary:
        return SCROLL_DIRECTION_DOWN
    if y <= top_enter_boundary:
        return SCROLL_DIRECTION_UP
    if y >= bottom_enter_boundary:
        return SCROLL_DIRECTION_DOWN
    return None


def monitor_test_hotkey() -> None:
    msg = wintypes.MSG()
    user32 = ctypes.windll.user32
    registered_test = bool(user32.RegisterHotKey(None, TEST_HOTKEY_ID, MOD_SHIFT | MOD_ALT, VK_Z))
    registered_paddle_ocr = bool(user32.RegisterHotKey(None, PADDLE_OCR_HOTKEY_ID, MOD_SHIFT | MOD_ALT, VK_X))

    if not registered_test:
        error_code = ctypes.GetLastError()
        print(
            f"[test {timestamp_now()}] hotkey-register-failed key={TEST_HOTKEY_LABEL} error={error_code}",
            flush=True,
        )
    else:
        print(f"[test {timestamp_now()}] hotkey-registered key={TEST_HOTKEY_LABEL}", flush=True)

    if not registered_paddle_ocr:
        error_code = ctypes.GetLastError()
        print(
            f"[paddleocr {timestamp_now()}] hotkey-register-failed key={PADDLE_OCR_HOTKEY_LABEL} error={error_code}",
            flush=True,
        )
    else:
        print(f"[paddleocr {timestamp_now()}] hotkey-registered key={PADDLE_OCR_HOTKEY_LABEL}", flush=True)

    if not registered_test and not registered_paddle_ocr:
        return

    try:
        while user32.GetMessageW(ctypes.byref(msg), None, 0, 0) != 0:
            if msg.message == WM_HOTKEY:
                if msg.wParam == TEST_HOTKEY_ID:
                    TEST_TRIGGER_STATE.signal()
                    print(f"[test {timestamp_now()}] hotkey-pressed key={TEST_HOTKEY_LABEL}", flush=True)
                elif msg.wParam == PADDLE_OCR_HOTKEY_ID:
                    PADDLE_OCR_TRIGGER_STATE.signal()
                    print(f"[paddleocr {timestamp_now()}] hotkey-pressed key={PADDLE_OCR_HOTKEY_LABEL}", flush=True)
            user32.TranslateMessage(ctypes.byref(msg))
            user32.DispatchMessageW(ctypes.byref(msg))
    finally:
        if registered_test:
            user32.UnregisterHotKey(None, TEST_HOTKEY_ID)
        if registered_paddle_ocr:
            user32.UnregisterHotKey(None, PADDLE_OCR_HOTKEY_ID)


def encode_png(image_bgr: np.ndarray) -> bytes:
    success, encoded = cv2.imencode(".png", image_bgr)
    if not success:
        raise RuntimeError("Failed to encode screenshot as PNG")
    return encoded.tobytes()


def build_screenshot_image(frame_bgr: np.ndarray) -> np.ndarray:
    screenshot_bgr = frame_bgr
    if SCREENSHOT_CROP_REGION is not None:
        screenshot_bgr = extract_region(frame_bgr, SCREENSHOT_CROP_REGION)
    save_debug_image("latest_screenshot.png", screenshot_bgr)
    return screenshot_bgr


def build_screenshot_payload(frame_bgr: np.ndarray) -> bytes:
    return encode_png(build_screenshot_image(frame_bgr))


def save_task_archive_screenshot(frame_bgr: np.ndarray, task_count: int) -> Path:
    TASK_ARCHIVE_SCREENSHOT_DIR.mkdir(parents=True, exist_ok=True)
    screenshot_bgr = build_screenshot_image(frame_bgr)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    file_path = TASK_ARCHIVE_SCREENSHOT_DIR / f"task_{int(task_count)}_{timestamp}.png"
    success = cv2.imwrite(str(file_path), screenshot_bgr)
    if not success:
        raise RuntimeError(f"Failed to save task screenshot to {file_path}")
    return file_path


def capture_primary_monitor(screenshotter: mss.mss, monitor: dict[str, int]) -> np.ndarray:
    grabbed = np.asarray(screenshotter.grab(monitor))
    return cv2.cvtColor(grabbed, cv2.COLOR_BGRA2BGR)

def monitor_scroll_signals() -> None:
    with mss.mss() as screenshotter:
        monitor = screenshotter.monitors[1]
        active_scroll_direction: str | None = None
        next_scroll_at = time.monotonic()

        while True:
            try:
                scroll_direction = get_scroll_signal_direction(monitor, active_scroll_direction)
                now = time.monotonic()
                if scroll_direction != active_scroll_direction:
                    active_scroll_direction = scroll_direction
                    next_scroll_at = now
                if active_scroll_direction is not None:
                    while now >= next_scroll_at:
                        STATE.publish_scroll(active_scroll_direction)
                        next_scroll_at += SCROLL_REPEAT_SECONDS
            except Exception as exc:
                print(f"[bridge {timestamp_now()}] scroll monitor error: {exc}", flush=True)

            time.sleep(SCROLL_MONITOR_INTERVAL_SECONDS)


def monitor_screen() -> None:
    counter_icon_template = load_template_image(TASK_COUNTER_ICON_TEMPLATE_PATH)
    task_type_icon_template = load_template_image(TASK_TYPE_ICON_TEMPLATE_PATH)

    with mss.mss() as screenshotter:
        monitor = screenshotter.monitors[1]
        last_edge_active = is_mouse_signal_active(monitor)
        last_counter_visible = False
        while True:
            try:
                frame_bgr = capture_primary_monitor(screenshotter, monitor)
                task_count = extract_task_counter(frame_bgr, counter_icon_template)
                counter_visible = task_count is not None
                should_archive_task_screenshot = bool(
                    task_count is not None and (
                        not last_counter_visible or STATE.is_new_task(task_count)
                    )
                )
                if should_archive_task_screenshot:
                    time.sleep(TASK_ARCHIVE_CAPTURE_DELAY_SECONDS)
                    frame_bgr = capture_primary_monitor(screenshotter, monitor)
                    refreshed_task_count = extract_task_counter(frame_bgr, counter_icon_template)
                    if refreshed_task_count is not None:
                        task_count = refreshed_task_count
                    archive_path = save_task_archive_screenshot(frame_bgr, task_count)
                    print(
                        f"[task-screenshot {timestamp_now()}] counter={task_count} saved={archive_path.name}",
                        flush=True,
                    )
                    counter_visible = task_count is not None

                if TEST_TRIGGER_STATE.consume():
                    test_settings = resolve_test_task_settings(CONFIG_CACHE.load())
                    if test_settings is None:
                        print(
                            f"[test {timestamp_now()}] hotkey={TEST_HOTKEY_LABEL} no-test-trigger-configured",
                            flush=True,
                        )
                    else:
                        screenshot_png = build_screenshot_payload(frame_bgr)
                        effective_task_count = task_count if task_count is not None else 0
                        STATE.remember_repeatable_task(
                            effective_task_count,
                            test_settings.task_type,
                            test_settings.prompts,
                            test_settings.repeat_prefix,
                            screenshot_png,
                        )
                        STATE.publish_payload(
                            effective_task_count,
                            [screenshot_png],
                            test_settings.prompts,
                        )
                        print(
                            f"[test {timestamp_now()}] hotkey={TEST_HOTKEY_LABEL} queued type={test_settings.task_type}",
                            flush=True,
                        )

                if PADDLE_OCR_TRIGGER_STATE.consume():
                    screenshot_bgr = build_screenshot_image(frame_bgr)
                    try:
                        result = paddleocr_manual_test.capture_and_process_image(screenshot_bgr, prefix="llm_test")
                    except Exception as exc:
                        print(
                            f"[paddleocr {timestamp_now()}] hotkey={PADDLE_OCR_HOTKEY_LABEL} error: {exc}",
                            flush=True,
                        )
                    else:
                        image_path = result["image_path"]
                        entry = result["entry"]
                        debug_name = Path(entry.get("ocr_debug_path", "")).name if entry.get("ocr_debug_path") else ""
                        selected_transcript = entry.get("selected_transcript", {})
                        selected_line_count = len(selected_transcript.get("selected_lines", []))
                        test_settings = resolve_test_task_settings(CONFIG_CACHE.load())
                        print(
                            f"[paddleocr {timestamp_now()}] hotkey={PADDLE_OCR_HOTKEY_LABEL} saved={image_path.name} lines={len(entry.get('lines', []))} selected_lines={selected_line_count} variant={entry.get('ocr_variant', 'unknown')} debug={debug_name}",
                            flush=True,
                        )
                        if test_settings is None:
                            print(
                                f"[paddleocr {timestamp_now()}] hotkey={PADDLE_OCR_HOTKEY_LABEL} no-test-trigger-configured",
                                flush=True,
                            )
                        else:
                            query_text, product_text = extract_text_task_parts(entry)
                            effective_task_count = task_count if task_count is not None else 0
                            ocr_warning = build_text_task_ocr_warning(entry)
                            abort_reasons = get_text_task_abort_reasons(entry, query_text, product_text)
                            if abort_reasons:
                                abort_alerts = build_text_task_abort_alerts(
                                    query_text,
                                    product_text,
                                    abort_reasons=abort_reasons,
                                    ocr_warning=ocr_warning,
                                )
                                if abort_alerts:
                                    STATE.publish_alert_payload(effective_task_count, abort_alerts)
                                    print(
                                        f"[paddleocr {timestamp_now()}] hotkey={PADDLE_OCR_HOTKEY_LABEL} queued-alert type={test_settings.task_type}",
                                        flush=True,
                                    )
                            else:
                                text_prompts = build_text_task_prompts(
                                    test_settings.prompts,
                                    query_text,
                                    product_text,
                                    ocr_warning=ocr_warning,
                                )
                                if text_prompts:
                                    STATE.publish_text_payload(effective_task_count, text_prompts)
                                    print(
                                        f"[paddleocr {timestamp_now()}] hotkey={PADDLE_OCR_HOTKEY_LABEL} queued-text type={test_settings.task_type}",
                                        flush=True,
                                    )

                if task_count is not None and STATE.is_new_task(task_count):
                    task_type = clean_ocr_text(extract_task_type(frame_bgr, task_type_icon_template)) or "Unknown"
                    task_type_total = TASK_TYPE_COUNTERS.record(task_count, task_type)
                    settings = resolve_task_settings(task_type, CONFIG_CACHE.load())

                    if settings is None:
                        if STATE.ignore_task(task_count):
                            print(
                                f"[task {timestamp_now()}] counter={task_count} type={task_type} total={task_type_total} ignored",
                                flush=True,
                            )
                    else:
                        action = STATE.register_task(task_count, settings)
                        if action == "ready":
                            screenshot_png = build_screenshot_payload(frame_bgr)
                            STATE.remember_repeatable_task(
                                task_count,
                                settings.task_type,
                                settings.prompts,
                                settings.repeat_prefix,
                                screenshot_png,
                            )
                            STATE.publish_payload(task_count, [screenshot_png], settings.prompts)
                            print(
                                f"[task {timestamp_now()}] counter={task_count} type={settings.task_type} total={task_type_total}",
                                flush=True,
                            )
                        elif action == "armed":
                            print(
                                f"[task {timestamp_now()}] counter={task_count} type={settings.task_type} total={task_type_total} waiting-for-edge",
                                flush=True,
                            )

                edge_active = is_mouse_signal_active(monitor)
                if edge_active and not last_edge_active:
                    armed_task = STATE.consume_armed_task()
                    if armed_task is not None:
                        screenshot_png = build_screenshot_payload(frame_bgr)
                        STATE.remember_repeatable_task(
                            armed_task.task_count,
                            armed_task.task_type,
                            armed_task.prompts,
                            armed_task.repeat_prefix,
                            screenshot_png,
                        )
                        STATE.publish_payload(
                            armed_task.task_count,
                            [screenshot_png],
                            armed_task.prompts,
                        )
                        print(
                            f"[task {timestamp_now()}] counter={armed_task.task_count} type={armed_task.task_type} released",
                            flush=True,
                        )
                last_edge_active = edge_active
                last_counter_visible = counter_visible
            except Exception as exc:
                print(f"[bridge {timestamp_now()}] monitor error: {exc}", flush=True)

            time.sleep(POLL_INTERVAL_SECONDS)

def main() -> None:
    ensure_tesseract()
    ensure_task_type_config(TASK_TYPE_CONFIG_PATH)
    if DEBUG_OUTPUT_ENABLED:
        ensure_debug_output_dir()

    hotkey_thread = threading.Thread(target=monitor_test_hotkey, name="test-hotkey", daemon=True)
    hotkey_thread.start()

    paddleocr_warmup_thread = threading.Thread(target=warmup_paddleocr, name="paddleocr-warmup", daemon=True)
    paddleocr_warmup_thread.start()

    if ENABLE_SCROLL_BRIDGE:
        scroll_thread = threading.Thread(target=monitor_scroll_signals, name="scroll-monitor", daemon=True)
        scroll_thread.start()

    monitor_thread = threading.Thread(target=monitor_screen, name="screen-monitor", daemon=True)
    monitor_thread.start()

    print(
        f"[bridge {timestamp_now()}] started host={HTTP_HOST} port={HTTP_PORT}",
        flush=True,
    )
    app.run(host=HTTP_HOST, port=HTTP_PORT, debug=False, use_reloader=False)


if __name__ == "__main__":
    main()
