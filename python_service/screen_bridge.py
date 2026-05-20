from __future__ import annotations

import base64
import ctypes
import json
import secrets
import threading
import time
from collections import deque
from ctypes import wintypes
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any

import cv2
import bridge_ip_config
import mss
import numpy as np
import paddleocr_manual_test
import pytesseract
from flask import Flask, Response, jsonify, request

# Screen capture cadence in seconds.
POLL_INTERVAL_SECONDS = 0.5
HANDSHAKE_LOG_INTERVAL_SECONDS = 10.0

# HTTP server binding for the local/LAN bridge endpoint.
HTTP_HOST = "0.0.0.0"
HTTP_PORT = 62041
EVENT_ENDPOINT_PATH = "/a"
REPEAT_CAPTURE_ENDPOINT_PATH = "/b"
CONTROL_COMMAND_ENDPOINT_PATH = "/c"
TASK_TYPE_COUNTS_ENDPOINT_PATH = "/d"
OBFUSCATED_ENDPOINT_PATHS = (
    "/api/v1/sync/session",
    "/api/v1/sync/events",
    "/api/v1/sync/batches",
    "/api/v1/sync/checkpoints",
    "/api/v1/cache/entries",
    "/api/v1/cache/segments",
    "/api/v1/library/index",
    "/api/v1/library/metadata",
)
BRIDGE_ACTION_POLL = "poll"
BRIDGE_ACTION_REPEAT = "repeat"
BRIDGE_ACTION_COUNTS = "counts"
BRIDGE_ACTION_CONTROL = "control"
BRIDGE_ACTION_COVER = "cover"
BRIDGE_RESPONSE_TARGET_PARAM = "__bridgeResponseTargetBytes"
BRIDGE_PADDING_MAX_EXTRA_BYTES = 262_144
BRIDGE_REAL_RESPONSE_MIN_BYTES = 2_097_152
BRIDGE_REAL_RESPONSE_MAX_BYTES = 3_145_728
BRIDGE_COVER_RESPONSE_MIN_BYTES = 2_097_152
BRIDGE_COVER_RESPONSE_MAX_BYTES = 4_194_304

# Tesseract tuning. Adjust the binary path if Tesseract is not on PATH.
TESSERACT_CMD = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
OCR_LANGUAGE = "deu+eng"
COUNTER_OCR_LANGUAGE = "eng"
XOR_KEY = 0x5A
TEXT_TASK_EVENT_TYPE = "text_task"
ALERT_TASK_EVENT_TYPE = "alert_task"
CONTROL_STATUS_EVENT_TYPE = "control_status"
TEXT_TASK_QUERY_PREFIX = "query:"
TEXT_TASK_INPUT_HEADER = "Task input below is provided as labeled OCR text instead of a screenshot."
TEXT_TASK_QUERY_LABEL = "Query:"
TEXT_TASK_PRODUCT_LABEL = "Product Text:"
TEXT_TASK_OCR_WARNING_HEADER = "OCR warning:"
TEXT_TASK_ABORT_HEADER = "OCR abort:"
COMMENT_DRAFT_FEEDBACK_PROMPT = (
    "Give me feedback on my rating comment. Use rating_comment_style_guide.md from the project context "
    "as the style reference. Focus on making the comment sound natural, personally written, and consistent "
    "with that guide while keeping the same meaning. Suggest a polished version if useful."
)
COMMENT_DRAFT_INPUT_HEADER = "Draft comment OCR:"
MAX_CONTROL_COMMAND_FIELD_LENGTH = 500
CONTROL_CANCEL_COMMAND = "cancel_control_processing"
COMMENT_DRAFT_FEEDBACK_COMMAND = "draft_comment_feedback"
ASYNC_CONTROL_PROCESSING_COMMANDS = {
    "start_task_screenshot",
    "start_task_ocr",
    COMMENT_DRAFT_FEEDBACK_COMMAND,
}


@dataclass(frozen=True)
class Region:
    left: int
    top: int
    width: int
    height: int


@dataclass(frozen=True)
class TaskCounterRead:
    task_count: int | None
    icon_found: bool
    raw_text: str = ""
    parsed_text: str = ""
    reason: str = ""


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


@dataclass(frozen=True)
class SentTaskReference:
    reference_type: str
    record_id: str
    task_count: int
    task_type: str
    sent_at: str
    source: str
    control_run_id: str = ""
    screenshot_paths: tuple[str, ...] = ()
    record_path: str = ""

    def to_dict(self) -> dict[str, Any]:
        return {
            "referenceType": self.reference_type,
            "recordId": self.record_id,
            "taskCount": self.task_count,
            "taskType": self.task_type,
            "sentAt": self.sent_at,
            "source": self.source,
            "controlRunId": self.control_run_id,
            "screenshotPaths": list(self.screenshot_paths),
            "recordPath": self.record_path,
        }


# Task-counter detection settings.
TASK_COUNTER_SCAN_TOP = 135
TASK_COUNTER_SCAN_HEIGHT = 24
TASK_COUNTER_SCAN_LEFT_RATIO = 0.5
TASK_COUNTER_SCAN_RIGHT_MAX_X = 2300
TASK_COUNTER_DIGIT_MAX_GAP = 5
TASK_COUNTER_DIGIT_MIN_AREA = 4
TASK_COUNTER_DIGIT_MIN_HEIGHT = 6
TASK_COUNTER_ICON_COLOR_BGR = (189, 189, 189)  # Hex BDBDBD in BGR order for OpenCV.
TASK_COUNTER_ICON_COLOR_TOLERANCE = 24
TASK_COUNTER_ICON_ANCHOR_MAX_GAP = 36
TASK_COUNTER_ICON_MIN_AREA = 8
TASK_COUNTER_ICON_MIN_HEIGHT = 8
TASK_COUNTER_TEXT_COLOR_BGR = (245, 134, 68)  # Hex 4486F5 in BGR order for OpenCV.
TASK_COUNTER_TEXT_COLOR_TOLERANCE = 40
TASK_COUNTER_OCR_SCALE_FACTOR = 5.0
TASK_COUNTER_OCR_CONFIG = "--psm 7 -c tessedit_char_whitelist=0123456789"
TASK_COUNTER_STATUS_TYPE = "counter"
TASK_COUNTER_STATUS_HEARTBEAT_SECONDS = 10.0

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
TASK_SENT_SCREENSHOT_DIR = Path(__file__).resolve().parent / "task_screenshots"
TASK_OCR_TEXT_HISTORY_PATH = Path(__file__).resolve().parent / "task_ocr_text_history.jsonl"
RATING_COMMENT_DRAFT_HISTORY_PATH = Path(__file__).resolve().parent / "rating_comment_drafts.jsonl"
DEFAULT_CONTROL_TASK_TYPE_KEY = "search-experience-to-product-usefulness"
DEFAULT_CONTROL_TASK_TYPE_LABEL = "Search Experience to Product Usefulness"

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

    def get_counts(self, span: str) -> dict[str, Any]:
        normalized_span = span if span in {"day", "week", "month"} else "day"
        now = datetime.now()
        if normalized_span == "day":
            since = now.replace(hour=0, minute=0, second=0, microsecond=0)
        elif normalized_span == "week":
            since = now - timedelta(days=7)
        else:
            since = now - timedelta(days=30)

        counts: dict[str, int] = {}
        skipped = 0
        with self.lock:
            if self.history_path.exists():
                try:
                    with self.history_path.open("r", encoding="utf-8") as handle:
                        for line in handle:
                            try:
                                event = json.loads(line)
                                timestamp = datetime.fromisoformat(str(event.get("timestamp", "")))
                                if timestamp.tzinfo is not None:
                                    timestamp = timestamp.astimezone().replace(tzinfo=None)
                                task_type = clean_ocr_text(str(event.get("task_type", ""))) or "Unknown"
                            except (TypeError, ValueError, json.JSONDecodeError):
                                skipped += 1
                                continue

                            if timestamp >= since:
                                counts[task_type] = counts.get(task_type, 0) + 1
                except OSError as exc:
                    return {
                        "ok": False,
                        "span": normalized_span,
                        "error": str(exc),
                        "counts": {},
                    }

        return {
            "ok": True,
            "span": normalized_span,
            "since": since.isoformat(timespec="seconds"),
            "until": now.isoformat(timespec="seconds"),
            "counts": counts,
            "skippedRows": skipped,
        }


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
    cancelled_control_run_ids: set[str] = field(default_factory=set)
    armed_task: ArmedTask | None = None
    repeatable_task: RepeatableTask | None = None
    last_sent_task_reference: SentTaskReference | None = None
    active_task_type_key: str = DEFAULT_CONTROL_TASK_TYPE_KEY
    active_task_type_label: str = DEFAULT_CONTROL_TASK_TYPE_LABEL
    lock: threading.Lock = field(default_factory=threading.Lock)

    def is_new_task(self, task_count: int) -> bool:
        with self.lock:
            return task_count != self.last_seen_task_count

    def get_last_seen_task_count(self) -> int | None:
        with self.lock:
            return self.last_seen_task_count

    def set_active_task_type(self, task_type_key: str = "", task_type_label: str = "") -> tuple[str, str]:
        normalized_key = sanitize_control_command_field(task_type_key, 120)
        normalized_label = clean_ocr_text(str(task_type_label or ""))
        with self.lock:
            if normalized_key:
                self.active_task_type_key = normalized_key
            if normalized_label:
                self.active_task_type_label = normalized_label
            elif normalized_key and not self.active_task_type_label:
                self.active_task_type_label = normalized_key
            return self.active_task_type_key, self.active_task_type_label

    def get_active_task_type(self) -> tuple[str, str]:
        with self.lock:
            return self.active_task_type_key, self.active_task_type_label

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

    def remember_sent_task_reference(self, reference: SentTaskReference) -> None:
        with self.lock:
            self.last_sent_task_reference = reference

    def get_last_sent_task_reference(self) -> SentTaskReference | None:
        with self.lock:
            return self.last_sent_task_reference

    def cancel_control_run(self, run_id: str) -> None:
        normalized_run_id = sanitize_control_command_field(run_id, 120)
        if not normalized_run_id:
            return
        with self.lock:
            self.cancelled_control_run_ids.add(normalized_run_id)

    def clear_control_run_cancel(self, run_id: str) -> None:
        normalized_run_id = sanitize_control_command_field(run_id, 120)
        if not normalized_run_id:
            return
        with self.lock:
            self.cancelled_control_run_ids.discard(normalized_run_id)

    def is_control_run_cancelled(self, run_id: str) -> bool:
        normalized_run_id = sanitize_control_command_field(run_id, 120)
        if not normalized_run_id:
            return False
        with self.lock:
            return normalized_run_id in self.cancelled_control_run_ids

    def publish_control_status(
        self,
        run_id: str,
        status_type: str,
        message: str,
        *,
        details: dict[str, Any] | None = None,
        tab_id: str = "",
        task_type: str = "",
    ) -> None:
        event = self.build_control_status_event(
            run_id,
            status_type,
            message,
            details=details,
            tab_id=tab_id,
            task_type=task_type,
        )
        if event is None:
            return

        with self.lock:
            self.pending_events.append(event)

    def publish_bridge_status(
        self,
        status_type: str,
        message: str,
        *,
        details: dict[str, Any] | None = None,
        task_type: str = "",
    ) -> None:
        event = {
            "type": CONTROL_STATUS_EVENT_TYPE,
            "run_id": "",
            "status_type": sanitize_control_command_field(status_type, 80),
            "message": sanitize_control_command_field(message, 300),
            "details": details if isinstance(details, dict) else {},
            "tab_id": "",
            "task_type": str(task_type or ""),
            "timestamp": timestamp_now(),
        }
        with self.lock:
            self.pending_events.append(event)

    def build_control_status_event(
        self,
        run_id: str,
        status_type: str,
        message: str,
        *,
        details: dict[str, Any] | None = None,
        tab_id: str = "",
        task_type: str = "",
    ) -> dict[str, Any] | None:
        normalized_run_id = sanitize_control_command_field(run_id, 120)
        if not normalized_run_id:
            return None

        return {
            "type": CONTROL_STATUS_EVENT_TYPE,
            "run_id": normalized_run_id,
            "status_type": sanitize_control_command_field(status_type, 80),
            "message": sanitize_control_command_field(message, 300),
            "details": details if isinstance(details, dict) else {},
            "tab_id": sanitize_control_command_field(tab_id, 40),
            "task_type": str(task_type or ""),
            "timestamp": timestamp_now(),
        }

    def publish_payload(
        self,
        task_count: int,
        screenshots_png: list[bytes] | tuple[bytes, ...],
        prompts: list[str] | tuple[str, ...],
        task_type: str = "",
        control_run_id: str = "",
    ) -> None:
        with self.lock:
            self.pending_events.append(
                {
                    "type": "task",
                    "task_count": task_count,
                    "screenshots_png": [bytes(screenshot_png) for screenshot_png in screenshots_png],
                    "prompts": list(prompts),
                    "task_type": str(task_type or ""),
                    "control_run_id": sanitize_control_command_field(control_run_id, 120),
                }
            )

    def publish_control_status_and_payload(
        self,
        run_id: str,
        status_type: str,
        message: str,
        *,
        details: dict[str, Any] | None = None,
        tab_id: str = "",
        status_task_type: str = "",
        task_count: int,
        screenshots_png: list[bytes] | tuple[bytes, ...],
        prompts: list[str] | tuple[str, ...],
        payload_task_type: str = "",
        control_run_id: str = "",
    ) -> None:
        status_event = self.build_control_status_event(
            run_id,
            status_type,
            message,
            details=details,
            tab_id=tab_id,
            task_type=status_task_type,
        )
        payload_event = {
            "type": "task",
            "task_count": task_count,
            "screenshots_png": [bytes(screenshot_png) for screenshot_png in screenshots_png],
            "prompts": list(prompts),
            "task_type": str(payload_task_type or ""),
            "control_run_id": sanitize_control_command_field(control_run_id, 120),
        }
        with self.lock:
            if status_event is not None:
                self.pending_events.append(status_event)
            self.pending_events.append(payload_event)

    def publish_text_payload(
        self,
        task_count: int,
        prompts: list[str] | tuple[str, ...],
        task_type: str = "",
        control_run_id: str = "",
        task_text_record: dict[str, Any] | None = None,
    ) -> None:
        event = {
            "type": TEXT_TASK_EVENT_TYPE,
            "task_count": task_count,
            "prompts": list(prompts),
            "task_type": str(task_type or ""),
            "control_run_id": sanitize_control_command_field(control_run_id, 120),
        }
        if task_text_record is not None:
            event["task_text_record"] = task_text_record

        with self.lock:
            self.pending_events.append(event)

    def publish_control_status_and_text_payload(
        self,
        run_id: str,
        status_type: str,
        message: str,
        *,
        details: dict[str, Any] | None = None,
        tab_id: str = "",
        status_task_type: str = "",
        task_count: int,
        prompts: list[str] | tuple[str, ...],
        payload_task_type: str = "",
        control_run_id: str = "",
        task_text_record: dict[str, Any] | None = None,
        comment_draft_record: dict[str, Any] | None = None,
    ) -> None:
        status_event = self.build_control_status_event(
            run_id,
            status_type,
            message,
            details=details,
            tab_id=tab_id,
            task_type=status_task_type,
        )
        payload_event = {
            "type": TEXT_TASK_EVENT_TYPE,
            "task_count": task_count,
            "prompts": list(prompts),
            "task_type": str(payload_task_type or ""),
            "control_run_id": sanitize_control_command_field(control_run_id, 120),
        }
        if task_text_record is not None:
            payload_event["task_text_record"] = task_text_record
        if comment_draft_record is not None:
            payload_event["comment_draft_record"] = comment_draft_record

        with self.lock:
            if status_event is not None:
                self.pending_events.append(status_event)
            self.pending_events.append(payload_event)

    def publish_alert_payload(
        self,
        task_count: int,
        alerts: list[str] | tuple[str, ...],
        task_type: str = "",
        control_run_id: str = "",
    ) -> None:
        with self.lock:
            self.pending_events.append(
                {
                    "type": ALERT_TASK_EVENT_TYPE,
                    "task_count": task_count,
                    "alerts": list(alerts),
                    "task_type": str(task_type or ""),
                    "control_run_id": sanitize_control_command_field(control_run_id, 120),
                }
            )

    def publish_control_status_and_alert_payload(
        self,
        run_id: str,
        status_type: str,
        message: str,
        *,
        details: dict[str, Any] | None = None,
        tab_id: str = "",
        status_task_type: str = "",
        task_count: int,
        alerts: list[str] | tuple[str, ...],
        payload_task_type: str = "",
        control_run_id: str = "",
    ) -> None:
        status_event = self.build_control_status_event(
            run_id,
            status_type,
            message,
            details=details,
            tab_id=tab_id,
            task_type=status_task_type,
        )
        payload_event = {
            "type": ALERT_TASK_EVENT_TYPE,
            "task_count": task_count,
            "alerts": list(alerts),
            "task_type": str(payload_task_type or ""),
            "control_run_id": sanitize_control_command_field(control_run_id, 120),
        }
        with self.lock:
            if status_event is not None:
                self.pending_events.append(status_event)
            self.pending_events.append(payload_event)

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
            task_type = str(event.get("task_type", ""))
            control_run_id = str(event.get("control_run_id", ""))
            encoded_screenshots = [base64.b64encode(screenshot_png).decode("ascii") for screenshot_png in screenshot_pngs]
            total_bytes = sum(len(screenshot_png) for screenshot_png in screenshot_pngs)
            screenshot_paths = save_sent_screenshot_pngs(
                task_count,
                screenshot_pngs,
                task_type=task_type,
                source="task",
            )
            self.remember_sent_task_reference(
                build_sent_screenshot_reference(
                    task_count,
                    task_type,
                    source="task",
                    screenshot_paths=screenshot_paths,
                    control_run_id=control_run_id,
                )
            )
            print(
                f"[bridge {timestamp_now()}] served counter={task_count} screenshots={len(screenshot_pngs)} bytes={total_bytes} type={task_type or '-'} run={control_run_id or '-'}",
                flush=True,
            )
            return {
                "a": xor_encrypt_to_hex(str(task_count), XOR_KEY),
                "b": xor_encrypt_string_to_base64(json.dumps(encoded_screenshots, ensure_ascii=False), XOR_KEY),
                "c": xor_encrypt_string_to_base64(json.dumps(prompts, ensure_ascii=False), XOR_KEY),
                "d": xor_encrypt_to_hex("task", XOR_KEY),
                "e": xor_encrypt_to_hex(task_type, XOR_KEY),
                "f": xor_encrypt_to_hex(control_run_id, XOR_KEY),
            }

        if event_type == TEXT_TASK_EVENT_TYPE:
            task_count = int(event["task_count"])
            prompts = [str(prompt) for prompt in event.get("prompts", [])]
            task_type = str(event.get("task_type", ""))
            control_run_id = str(event.get("control_run_id", ""))
            task_text_record = event.get("task_text_record")
            if isinstance(task_text_record, dict):
                reference = save_task_ocr_text_record(
                    task_count,
                    task_type,
                    prompts,
                    task_text_record,
                    control_run_id=control_run_id,
                )
                if reference is not None:
                    self.remember_sent_task_reference(reference)

            comment_draft_record = event.get("comment_draft_record")
            if isinstance(comment_draft_record, dict):
                save_rating_comment_draft_record(
                    task_count,
                    task_type,
                    prompts,
                    comment_draft_record,
                    linked_task_reference=self.get_last_sent_task_reference(),
                    control_run_id=control_run_id,
                )

            print(
                f"[bridge {timestamp_now()}] served counter={task_count} text-prompts={len(prompts)} type={task_type or '-'} run={control_run_id or '-'}",
                flush=True,
            )
            return {
                "a": xor_encrypt_to_hex(str(task_count), XOR_KEY),
                "b": "",
                "c": xor_encrypt_string_to_base64(json.dumps(prompts, ensure_ascii=False), XOR_KEY),
                "d": xor_encrypt_to_hex(TEXT_TASK_EVENT_TYPE, XOR_KEY),
                "e": xor_encrypt_to_hex(task_type, XOR_KEY),
                "f": xor_encrypt_to_hex(control_run_id, XOR_KEY),
            }

        if event_type == ALERT_TASK_EVENT_TYPE:
            task_count = int(event["task_count"])
            alerts = [str(alert_text) for alert_text in event.get("alerts", [])]
            task_type = str(event.get("task_type", ""))
            control_run_id = str(event.get("control_run_id", ""))
            print(
                f"[bridge {timestamp_now()}] served counter={task_count} alerts={len(alerts)} type={task_type or '-'} run={control_run_id or '-'}",
                flush=True,
            )
            return {
                "a": xor_encrypt_to_hex(str(task_count), XOR_KEY),
                "b": "",
                "c": xor_encrypt_string_to_base64(json.dumps(alerts, ensure_ascii=False), XOR_KEY),
                "d": xor_encrypt_to_hex(ALERT_TASK_EVENT_TYPE, XOR_KEY),
                "e": xor_encrypt_to_hex(task_type, XOR_KEY),
                "f": xor_encrypt_to_hex(control_run_id, XOR_KEY),
            }

        if event_type == CONTROL_STATUS_EVENT_TYPE:
            run_id = str(event.get("run_id", ""))
            status_type = str(event.get("status_type", ""))
            task_type = str(event.get("task_type", ""))
            details = {
                "runId": run_id,
                "type": status_type,
                "message": str(event.get("message", "")),
                "details": event.get("details", {}) if isinstance(event.get("details"), dict) else {},
                "tabId": str(event.get("tab_id", "")),
                "taskType": task_type,
                "timestamp": str(event.get("timestamp", "")),
            }
            print(
                f"[bridge {timestamp_now()}] served control-status run={run_id or '-'} type={status_type or '-'} task={task_type or '-'}",
                flush=True,
            )
            return {
                "a": xor_encrypt_to_hex(run_id, XOR_KEY),
                "b": xor_encrypt_to_hex(status_type, XOR_KEY),
                "c": xor_encrypt_string_to_base64(json.dumps(details, ensure_ascii=False), XOR_KEY),
                "d": xor_encrypt_to_hex(CONTROL_STATUS_EVENT_TYPE, XOR_KEY),
                "e": xor_encrypt_to_hex(task_type, XOR_KEY),
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
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Cache-Control"] = "no-store"
    return response


@app.get(EVENT_ENDPOINT_PATH)
def get_pending_task() -> Any:
    maybe_log_handshake()
    return jsonify(STATE.consume_event())


def build_task_type_counts_payload(span_value: Any = "day") -> dict[str, Any]:
    span = sanitize_control_command_field(span_value or "day", 20)
    return TASK_TYPE_COUNTERS.get_counts(span)


@app.get(TASK_TYPE_COUNTS_ENDPOINT_PATH)
def get_task_type_counts() -> Any:
    return jsonify(build_task_type_counts_payload(request.args.get("span") or "day"))


def build_repeat_capture_payload() -> dict[str, str]:
    repeatable_task = STATE.get_repeatable_task()
    if repeatable_task is None:
        return {"a": "", "b": "", "c": "", "d": "", "e": "", "f": ""}

    with mss.mss() as screenshotter:
        monitor = screenshotter.monitors[1]
        frame_bgr = capture_primary_monitor(screenshotter, monitor)

    captured_screenshot_png = build_screenshot_payload(frame_bgr)
    repeat_prompts = build_repeat_prompts(repeatable_task)
    screenshot_paths = save_sent_screenshot_pngs(
        repeatable_task.task_count,
        [captured_screenshot_png],
        task_type=repeatable_task.task_type,
        source="repeat",
    )
    STATE.remember_sent_task_reference(
        build_sent_screenshot_reference(
            repeatable_task.task_count,
            repeatable_task.task_type,
            source="repeat",
            screenshot_paths=screenshot_paths,
        )
    )
    print(
        f"[repeat {timestamp_now()}] counter={repeatable_task.task_count} type={repeatable_task.task_type} captured-by-request",
        flush=True,
    )
    return {
        "a": xor_encrypt_to_hex(str(repeatable_task.task_count), XOR_KEY),
        "b": xor_encrypt_bytes_to_base64(captured_screenshot_png, XOR_KEY),
        "c": xor_encrypt_string_to_base64(json.dumps(list(repeat_prompts), ensure_ascii=False), XOR_KEY),
        "d": xor_encrypt_to_hex("repeat", XOR_KEY),
        "e": xor_encrypt_bytes_to_base64(repeatable_task.base_screenshot_png, XOR_KEY),
        "f": xor_encrypt_to_hex(repeatable_task.task_type, XOR_KEY),
    }


@app.get(REPEAT_CAPTURE_ENDPOINT_PATH)
def capture_repeat_screenshot() -> Any:
    return jsonify(build_repeat_capture_payload())


@app.post(CONTROL_COMMAND_ENDPOINT_PATH)
def receive_control_command() -> Any:
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        payload = {}
    return jsonify(handle_control_command_payload(payload))


def handle_control_command_payload(payload: dict[str, Any]) -> dict[str, Any]:
    command = sanitize_control_command_field(payload.get("command"), 80)
    label = sanitize_control_command_field(payload.get("label"), 120)
    group = sanitize_control_command_field(payload.get("group"), 80)
    value = sanitize_control_command_field(payload.get("value"), 120)
    current_task_type = sanitize_control_command_field(payload.get("currentTaskType"), 120)
    current_task_type_label = sanitize_control_command_field(payload.get("currentTaskTypeLabel"), 160)
    processing_mode = sanitize_control_command_field(payload.get("processingMode"), 120)
    selected_region = sanitize_control_command_field(payload.get("selectedRegion"), 120)
    selected_region_label = sanitize_control_command_field(payload.get("selectedRegionLabel"), 160)
    selected_region_bounds = sanitize_control_json_field(payload.get("selectedRegionBounds"), 500)
    regions = sanitize_control_json_field(payload.get("regions"), 2000)
    project_url = sanitize_control_command_field(payload.get("projectUrl"), MAX_CONTROL_COMMAND_FIELD_LENGTH)
    active_project_id = sanitize_control_command_field(payload.get("activeProjectId"), 120)
    boilerplate_prompt_length = len(str(payload.get("boilerplatePrompt") or ""))
    ocr_review_text_length = len(str(payload.get("ocrReviewText") or ""))
    ocr_review_text_length = max(
        ocr_review_text_length,
        int(payload.get("ocrReviewTextLength") or 0) if str(payload.get("ocrReviewTextLength") or "").isdigit() else 0,
    )
    source = sanitize_control_command_field(payload.get("source"), 120)
    page_url = sanitize_control_command_field(
        payload.get("pageUrl") or payload.get("tabUrl"),
        MAX_CONTROL_COMMAND_FIELD_LENGTH,
    )
    tab_id = sanitize_control_command_field(payload.get("tabId"), 40)
    control_run_id = get_control_run_id(payload)

    print(
        "[control "
        f"{timestamp_now()}] command={command or '-'} value={value or '-'} "
        f"group={group or '-'} label={label or '-'} "
        f"current_task_type={current_task_type or '-'} current_task_type_label={current_task_type_label or '-'} "
        f"processing_mode={processing_mode or '-'} "
        f"selected_region={selected_region or '-'} selected_region_label={selected_region_label or '-'} "
        f"bounds={selected_region_bounds or '-'} regions={regions or '-'} review_chars={ocr_review_text_length} "
        f"project={active_project_id or '-'} project_url={project_url or '-'} prompt_chars={boilerplate_prompt_length} "
        f"tab={tab_id or '-'} run={control_run_id or '-'} source={source or '-'} page={page_url or '-'}",
        flush=True,
    )

    active_task_type_key = current_task_type or (value if command == "set_task_type" else "")
    active_task_type_label = current_task_type_label
    if active_task_type_key or active_task_type_label or command in {"set_task_type", "sync_task_type"}:
        stored_task_type_key, stored_task_type_label = STATE.set_active_task_type(
            active_task_type_key,
            active_task_type_label,
        )
        if command in {"set_task_type", "sync_task_type"}:
            print(
                f"[control {timestamp_now()}] active-task-type key={stored_task_type_key or '-'} label={stored_task_type_label or '-'}",
                flush=True,
            )

    if command == CONTROL_CANCEL_COMMAND:
        STATE.cancel_control_run(control_run_id)
        publish_control_status(
            payload,
            "cancel",
            "Cancel requested.",
            task_type=current_task_type,
        )
        return {"ok": True, "queued": False, "cancelled": True}

    if control_run_id:
        STATE.clear_control_run_cancel(control_run_id)
        publish_control_status(
            payload,
            "server-received",
            "Bridge received the processing request.",
            details={
                "command": command,
                "label": label,
                "selectedRegion": selected_region,
                "selectedRegionLabel": selected_region_label,
                "processingMode": processing_mode,
            },
            task_type=current_task_type,
        )

    if command in ASYNC_CONTROL_PROCESSING_COMMANDS:
        processing_payload = dict(payload)
        thread = threading.Thread(
            target=run_control_processing_command,
            args=(command, processing_payload),
            name=f"control-{command}",
            daemon=True,
        )
        thread.start()
        return {"ok": True, "queued": True, "runId": control_run_id}

    queued = handle_control_processing_command(command, payload)
    return {"ok": True, "queued": queued, "runId": control_run_id}


def receive_obfuscated_bridge_request() -> Any:
    envelope = request.get_json(silent=True)
    if not isinstance(envelope, dict):
        envelope = {}

    try:
        action, params = decode_bridge_operation_envelope(envelope)
    except ValueError as exc:
        response = encode_bridge_operation_response({"ok": False, "error": str(exc)})
        return jsonify(response), 400

    response_target_size = sanitize_optional_bridge_response_target_size(params.get(BRIDGE_RESPONSE_TARGET_PARAM))
    if BRIDGE_RESPONSE_TARGET_PARAM in params:
        params = dict(params)
        params.pop(BRIDGE_RESPONSE_TARGET_PARAM, None)

    if action == BRIDGE_ACTION_POLL:
        maybe_log_handshake()
        event_payload = STATE.consume_event()
        if response_target_size is None and not is_empty_bridge_event_payload(event_payload):
            response_target_size = choose_real_bridge_response_target_size()
        return jsonify(encode_bridge_operation_response(event_payload, target_size=response_target_size))
    if action == BRIDGE_ACTION_REPEAT:
        return jsonify(encode_bridge_operation_response(build_repeat_capture_payload(), target_size=response_target_size))
    if action == BRIDGE_ACTION_COUNTS:
        return jsonify(encode_bridge_operation_response(
            build_task_type_counts_payload(params.get("span") or "day"),
            target_size=response_target_size,
        ))
    if action == BRIDGE_ACTION_CONTROL:
        return jsonify(encode_bridge_operation_response(
            handle_control_command_payload(params),
            target_size=response_target_size,
        ))
    if action == BRIDGE_ACTION_COVER:
        response_target_size = sanitize_cover_response_target_size(params.get("responseTargetBytes"))
        print(
            f"[traffic {timestamp_now()}] cover response_target={response_target_size}",
            flush=True,
        )
        return jsonify(encode_bridge_operation_response({"ok": True}, target_size=response_target_size))

    response = encode_bridge_operation_response({"ok": False, "error": "Unknown bridge operation."})
    return jsonify(response), 400


for endpoint_index, endpoint_path in enumerate(OBFUSCATED_ENDPOINT_PATHS):
    app.add_url_rule(
        endpoint_path,
        f"obfuscated_bridge_operation_{endpoint_index}",
        receive_obfuscated_bridge_request,
        methods=["POST"],
    )


def timestamp_now() -> str:
    return datetime.now().isoformat(timespec="seconds")


def sanitize_control_command_field(value: Any, max_length: int = MAX_CONTROL_COMMAND_FIELD_LENGTH) -> str:
    text = "" if value is None else str(value)
    return " ".join(text.replace("\r", " ").replace("\n", " ").split())[:max_length]


def sanitize_control_json_field(value: Any, max_length: int = MAX_CONTROL_COMMAND_FIELD_LENGTH) -> str:
    if value is None:
        return ""
    try:
        text = json.dumps(value, ensure_ascii=False, separators=(",", ":"))
    except (TypeError, ValueError):
        text = str(value)
    return sanitize_control_command_field(text, max_length)


def get_control_run_id(payload: dict[str, Any]) -> str:
    return sanitize_control_command_field(payload.get("controlRunId") or payload.get("runId"), 120)


def get_control_payload_tab_id(payload: dict[str, Any]) -> str:
    return sanitize_control_command_field(payload.get("tabId"), 40)


def publish_control_status(
    payload: dict[str, Any],
    status_type: str,
    message: str,
    *,
    details: dict[str, Any] | None = None,
    task_type: str = "",
) -> None:
    run_id = get_control_run_id(payload)
    if not run_id:
        return

    STATE.publish_control_status(
        run_id,
        status_type,
        message,
        details=details,
        tab_id=get_control_payload_tab_id(payload),
        task_type=task_type or get_control_payload_task_type_key(payload),
    )


def get_control_payload_task_type(payload: dict[str, Any]) -> str:
    for key in ("currentTaskTypeLabel", "currentTaskType"):
        task_type = clean_ocr_text(str(payload.get(key) or ""))
        if task_type:
            return task_type
    return "Control Task"


def get_control_payload_task_type_key(payload: dict[str, Any], fallback: str = "") -> str:
    task_type_key = sanitize_control_command_field(payload.get("currentTaskType"), 120)
    return task_type_key or fallback


def resolve_control_task_settings(payload: dict[str, Any]) -> TaskSettings | None:
    config = CONFIG_CACHE.load()
    candidates = [
        str(payload.get("currentTaskTypeLabel") or ""),
        str(payload.get("currentTaskType") or ""),
    ]
    for candidate in candidates:
        task_type = clean_ocr_text(candidate)
        if not task_type:
            continue
        settings = resolve_task_settings(task_type, config)
        if settings is not None:
            return TaskSettings(
                task_type=settings.task_type,
                wait_for_edge=False,
                prompts=settings.prompts,
                repeat_prefix=settings.repeat_prefix,
            )

    boilerplate_prompt = str(payload.get("boilerplatePrompt") or "").strip()
    if boilerplate_prompt:
        task_type = get_control_payload_task_type(payload)
        return TaskSettings(
            task_type=task_type,
            wait_for_edge=False,
            prompts=(boilerplate_prompt.replace("[TASK_TYPE]", task_type),),
            repeat_prefix=DEFAULT_REPEAT_PREFIX.replace("[TASK_TYPE]", task_type),
        )

    return resolve_test_task_settings(config)


def capture_control_frame() -> tuple[np.ndarray, int | None]:
    with mss.mss() as screenshotter:
        monitor = screenshotter.monitors[1]
        frame_bgr = capture_primary_monitor(screenshotter, monitor)

    task_count: int | None = None
    try:
        task_count = extract_task_counter(frame_bgr)
    except Exception as exc:
        print(f"[control {timestamp_now()}] counter-read-error: {exc}", flush=True)

    return frame_bgr, task_count


def parse_control_selected_region(payload: dict[str, Any]) -> Region | None:
    bounds = payload.get("selectedRegionBounds")
    if not isinstance(bounds, dict):
        return None

    def parse_coordinate(key: str) -> int | None:
        try:
            value = int(float(str(bounds.get(key, "")).strip()))
        except (TypeError, ValueError):
            return None
        return value

    left = parse_coordinate("left")
    top = parse_coordinate("top")
    right = parse_coordinate("right")
    bottom = parse_coordinate("bottom")
    if left is None or top is None or right is None or bottom is None:
        return None
    if right <= left or bottom <= top:
        return None
    return Region(left=left, top=top, width=right - left, height=bottom - top)


def get_control_selected_region_label(payload: dict[str, Any], fallback: str = "selected region") -> str:
    return sanitize_control_command_field(
        payload.get("selectedRegionLabel") or payload.get("selectedRegion") or fallback,
        160,
    )


def extract_plain_ocr_result_text(ocr_result: dict[str, Any]) -> str:
    lines = ocr_result.get("lines", [])
    if isinstance(lines, list):
        text_lines: list[str] = []
        for line in lines:
            if not isinstance(line, dict):
                continue
            cleaned = clean_multiline_ocr_text(str(line.get("text", "")))
            if cleaned:
                text_lines.append(cleaned)
        if text_lines:
            return "\n".join(text_lines)

    return clean_multiline_ocr_text(str(ocr_result.get("text", "")))


def build_comment_draft_feedback_prompt(comment_text: str) -> str:
    return "\n\n".join(
        [
            COMMENT_DRAFT_FEEDBACK_PROMPT,
            COMMENT_DRAFT_INPUT_HEADER,
            comment_text.strip(),
        ]
    ).strip()


def publish_task_counter_status(
    counter_read: TaskCounterRead,
    counter_status: str,
    message: str,
    *,
    last_seen_task_count: int | None = None,
    task_type: str = "",
    extra_details: dict[str, Any] | None = None,
) -> None:
    details: dict[str, Any] = {
        "taskCount": counter_read.task_count if counter_read.task_count is not None else "",
        "screenTaskCount": counter_read.task_count if counter_read.task_count is not None else "",
        "lastSeenTaskCount": last_seen_task_count if last_seen_task_count is not None else "",
        "counterVisible": counter_read.task_count is not None,
        "counterIconFound": counter_read.icon_found,
        "counterRawText": counter_read.raw_text,
        "counterParsedText": counter_read.parsed_text,
        "counterReadReason": counter_read.reason,
        "counterStatus": counter_status,
    }
    if extra_details:
        details.update(extra_details)

    STATE.publish_bridge_status(
        TASK_COUNTER_STATUS_TYPE,
        message,
        details=details,
        task_type=task_type,
    )
    print(
        f"[counter {timestamp_now()}] status={counter_status or '-'} "
        f"screen={counter_read.task_count if counter_read.task_count is not None else '-'} "
        f"last_seen={last_seen_task_count if last_seen_task_count is not None else '-'} "
        f"icon={'yes' if counter_read.icon_found else 'no'} "
        f"raw={counter_read.raw_text!r} parsed={counter_read.parsed_text!r} "
        f"reason={counter_read.reason or '-'}",
        flush=True,
    )


def check_bridge_ip_configuration() -> None:
    detected = bridge_ip_config.detect_lan_ipv4_from_ipconfig()
    configured = bridge_ip_config.read_service_worker_bridge_endpoint()
    configured_host = configured.host if configured is not None else ""
    configured_port = configured.port if configured is not None else None

    if detected is None:
        print(
            "[bridge-ip] Could not detect a LAN IPv4 address from ipconfig. "
            "If the laptop cannot reach the bridge, run python_service/update_bridge_ip.py with the current IPv4.",
            flush=True,
        )
        return

    endpoint_text = f"http://{configured_host}:{configured_port}" if configured_host and configured_port else "-"
    print(
        f"[bridge-ip] detected={detected.ipv4} adapter={detected.adapter_name!r} "
        f"gateway={detected.gateway} configured={endpoint_text}",
        flush=True,
    )

    if configured_host == detected.ipv4 and (configured_port in {None, HTTP_PORT}):
        return

    print(
        f"[bridge-ip] WARNING: extension bridge IP is {configured_host or '-'}, "
        f"but ipconfig default-gateway adapter IPv4 is {detected.ipv4}.",
        flush=True,
    )
    print(
        f"[bridge-ip] Run from python_service: python update_bridge_ip.py {detected.ipv4}",
        flush=True,
    )
    print("[bridge-ip] Then reload the unpacked Chrome extension on the laptop.", flush=True)


def queue_control_screenshot(payload: dict[str, Any]) -> bool:
    settings = resolve_control_task_settings(payload)
    if settings is None:
        print(f"[control {timestamp_now()}] screenshot no-task-settings", flush=True)
        publish_control_status(payload, "error", "No task settings found for screenshot request.")
        return False

    if STATE.is_control_run_cancelled(get_control_run_id(payload)):
        publish_control_status(payload, "cancel", "Screenshot request cancelled before capture.", task_type=settings.task_type)
        return False

    publish_control_status(payload, "capture", "Capturing task screenshot.", task_type=settings.task_type)
    frame_bgr, task_count = capture_control_frame()
    effective_task_count = task_count if task_count is not None else 0
    screenshot_png = build_screenshot_payload(frame_bgr)
    prompts = () if str(payload.get("boilerplatePrompt") or "").strip() else settings.prompts
    STATE.remember_repeatable_task(
        effective_task_count,
        settings.task_type,
        prompts,
        settings.repeat_prefix,
        screenshot_png,
    )
    run_id = get_control_run_id(payload)
    STATE.publish_control_status_and_payload(
        run_id,
        "queued",
        "Screenshot event queued for ChatGPT.",
        details={"taskCount": effective_task_count, "promptCount": len(prompts), "screenshotCount": 1},
        tab_id=get_control_payload_tab_id(payload),
        status_task_type=settings.task_type,
        task_count=effective_task_count,
        screenshots_png=[screenshot_png],
        prompts=prompts,
        payload_task_type=get_control_payload_task_type_key(payload, settings.task_type),
        control_run_id=run_id,
    )
    print(
        f"[control {timestamp_now()}] queued-screenshot counter={effective_task_count} type={settings.task_type}",
        flush=True,
    )
    return True


def queue_control_ocr(payload: dict[str, Any]) -> bool:
    settings = resolve_control_task_settings(payload)
    if settings is None:
        print(f"[control {timestamp_now()}] ocr no-task-settings", flush=True)
        publish_control_status(payload, "error", "No task settings found for OCR request.")
        return False

    run_id = get_control_run_id(payload)
    if STATE.is_control_run_cancelled(run_id):
        publish_control_status(payload, "cancel", "OCR request cancelled before capture.", task_type=settings.task_type)
        return False

    publish_control_status(payload, "capture", "Capturing screenshot for OCR.", task_type=settings.task_type)
    frame_bgr, task_count = capture_control_frame()
    effective_task_count = task_count if task_count is not None else 0
    screenshot_bgr = build_screenshot_image(frame_bgr)

    def ocr_status_callback(status_type: str, message: str, details: dict[str, Any] | None = None) -> None:
        publish_control_status(payload, status_type, message, details=details, task_type=settings.task_type)

    def should_cancel_ocr() -> bool:
        return STATE.is_control_run_cancelled(run_id)

    try:
        result = paddleocr_manual_test.capture_and_process_image(
            screenshot_bgr,
            prefix="control_ocr",
            status_callback=ocr_status_callback,
            should_cancel=should_cancel_ocr,
        )
    except paddleocr_manual_test.OcrProcessingCancelled:
        print(f"[control {timestamp_now()}] ocr cancelled run={run_id or '-'}", flush=True)
        publish_control_status(payload, "cancel", "OCR processing cancelled.", task_type=settings.task_type)
        return False
    except Exception as exc:
        print(f"[control {timestamp_now()}] ocr error: {exc}", flush=True)
        publish_control_status(
            payload,
            "error",
            "OCR failed.",
            details={"error": str(exc)},
            task_type=settings.task_type,
        )
        return False

    image_path = result["image_path"]
    entry = result["entry"]
    debug_name = Path(entry.get("ocr_debug_path", "")).name if entry.get("ocr_debug_path") else ""
    selected_transcript = entry.get("selected_transcript", {})
    selected_line_count = len(selected_transcript.get("selected_lines", [])) if isinstance(selected_transcript, dict) else 0
    print(
        f"[control {timestamp_now()}] ocr saved={Path(image_path).name} lines={len(entry.get('lines', []))} "
        f"selected_lines={selected_line_count} variant={entry.get('ocr_variant', 'unknown')} debug={debug_name}",
        flush=True,
    )

    query_text, product_text = extract_text_task_parts(entry)
    publish_control_status(
        payload,
        "ocr-selected",
        "Selected OCR text.",
        details={
            "queryText": query_text,
            "productText": product_text,
            "variant": str(entry.get("ocr_variant", "")),
            "selectedLineCount": selected_line_count,
            "debug": debug_name,
        },
        task_type=settings.task_type,
    )
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
            STATE.publish_control_status_and_alert_payload(
                run_id,
                "queued",
                "OCR alert queued for ChatGPT.",
                details={"taskCount": effective_task_count, "abortReasons": abort_reasons},
                tab_id=get_control_payload_tab_id(payload),
                status_task_type=settings.task_type,
                task_count=effective_task_count,
                alerts=abort_alerts,
                payload_task_type=get_control_payload_task_type_key(payload, settings.task_type),
                control_run_id=run_id,
            )
            print(
                f"[control {timestamp_now()}] queued-ocr-alert counter={effective_task_count} type={settings.task_type}",
                flush=True,
            )
        return True

    text_prompts = build_text_task_prompts(
        settings.prompts,
        query_text,
        product_text,
        ocr_warning=ocr_warning,
    )
    if not text_prompts:
        print(f"[control {timestamp_now()}] ocr no-text-prompts type={settings.task_type}", flush=True)
        publish_control_status(payload, "error", "OCR produced no text prompts.", task_type=settings.task_type)
        return False

    if STATE.is_control_run_cancelled(run_id):
        publish_control_status(payload, "cancel", "OCR request cancelled before queueing prompt.", task_type=settings.task_type)
        return False

    STATE.publish_control_status_and_text_payload(
        run_id,
        "queued",
        "OCR prompt queued for ChatGPT.",
        details={"taskCount": effective_task_count, "promptCount": len(text_prompts)},
        tab_id=get_control_payload_tab_id(payload),
        status_task_type=settings.task_type,
        task_count=effective_task_count,
        prompts=text_prompts,
        payload_task_type=get_control_payload_task_type_key(payload, settings.task_type),
        control_run_id=run_id,
        task_text_record={
            "source": "control_ocr",
            "queryText": query_text,
            "productText": product_text,
            "ocrWarning": ocr_warning,
            "selectedLineCount": selected_line_count,
            "variant": str(entry.get("ocr_variant", "")),
            "debug": debug_name,
        },
    )
    print(
        f"[control {timestamp_now()}] queued-ocr-text counter={effective_task_count} type={settings.task_type}",
        flush=True,
    )
    return True


def queue_comment_draft_feedback(payload: dict[str, Any]) -> bool:
    settings = resolve_control_task_settings(payload)
    task_type = settings.task_type if settings is not None else get_control_payload_task_type(payload)
    run_id = get_control_run_id(payload)
    region_label = get_control_selected_region_label(payload, "rating comment")

    if STATE.is_control_run_cancelled(run_id):
        publish_control_status(
            payload,
            "cancel",
            "Comment feedback request cancelled before capture.",
            task_type=task_type,
        )
        return False

    selected_region = parse_control_selected_region(payload)
    if selected_region is None:
        publish_control_status(
            payload,
            "error",
            "Rating comment region bounds are empty. Set the Rating comment coordinates before using Comment.",
            details={
                "selectedRegion": sanitize_control_command_field(payload.get("selectedRegion"), 120),
                "selectedRegionLabel": region_label,
            },
            task_type=task_type,
        )
        return False

    publish_control_status(
        payload,
        "capture",
        f"Capturing {region_label} for comment feedback.",
        task_type=task_type,
    )
    frame_bgr, task_count = capture_control_frame()
    effective_task_count = task_count if task_count is not None else 0
    comment_crop = extract_region(frame_bgr, selected_region)
    if comment_crop.size == 0:
        publish_control_status(
            payload,
            "error",
            "Rating comment region did not overlap the captured screen.",
            details={
                "selectedRegion": sanitize_control_command_field(payload.get("selectedRegion"), 120),
                "selectedRegionLabel": region_label,
                "bounds": {
                    "left": selected_region.left,
                    "top": selected_region.top,
                    "right": selected_region.left + selected_region.width,
                    "bottom": selected_region.top + selected_region.height,
                },
            },
            task_type=task_type,
        )
        return False

    save_debug_image("comment_draft_region.png", comment_crop)

    if STATE.is_control_run_cancelled(run_id):
        publish_control_status(
            payload,
            "cancel",
            "Comment feedback request cancelled before OCR.",
            task_type=task_type,
        )
        return False

    publish_control_status(
        payload,
        "ocr-start",
        f"OCRing {region_label} for comment feedback.",
        details={
            "selectedRegion": sanitize_control_command_field(payload.get("selectedRegion"), 120),
            "selectedRegionLabel": region_label,
            "cropWidth": int(comment_crop.shape[1]),
            "cropHeight": int(comment_crop.shape[0]),
        },
        task_type=task_type,
    )
    try:
        ocr_result = paddleocr_manual_test.ocr_text_region(comment_crop)
    except Exception as exc:
        print(f"[control {timestamp_now()}] comment-draft-ocr error: {exc}", flush=True)
        publish_control_status(
            payload,
            "error",
            "Comment OCR failed.",
            details={"error": str(exc), "selectedRegionLabel": region_label},
            task_type=task_type,
        )
        return False

    comment_text = extract_plain_ocr_result_text(ocr_result)
    line_count = len(ocr_result.get("lines", [])) if isinstance(ocr_result.get("lines", []), list) else 0
    publish_control_status(
        payload,
        "ocr-selected",
        "Selected rating comment OCR text.",
        details={
            "commentText": comment_text,
            "charCount": len(comment_text),
            "lineCount": line_count,
            "variant": str(ocr_result.get("variant", "")),
            "rawLineCount": int(ocr_result.get("raw_line_count", 0) or 0),
            "selectedRegionLabel": region_label,
        },
        task_type=task_type,
    )

    if not comment_text.strip():
        publish_control_status(
            payload,
            "error",
            "Comment OCR produced no text.",
            details={"selectedRegionLabel": region_label, "lineCount": line_count},
            task_type=task_type,
        )
        return False

    if STATE.is_control_run_cancelled(run_id):
        publish_control_status(
            payload,
            "cancel",
            "Comment feedback request cancelled before queueing prompt.",
            task_type=task_type,
        )
        return False

    prompt = build_comment_draft_feedback_prompt(comment_text)
    STATE.publish_control_status_and_text_payload(
        run_id,
        "queued",
        "Comment feedback prompt queued for ChatGPT.",
        details={
            "taskCount": effective_task_count,
            "promptCount": 1,
            "commentChars": len(comment_text),
            "selectedRegionLabel": region_label,
        },
        tab_id=get_control_payload_tab_id(payload),
        status_task_type=task_type,
        task_count=effective_task_count,
        prompts=(prompt,),
        payload_task_type=get_control_payload_task_type_key(payload, task_type),
        control_run_id=run_id,
        comment_draft_record={
            "source": "comment_draft_feedback",
            "commentText": comment_text,
            "lineCount": line_count,
            "rawLineCount": int(ocr_result.get("raw_line_count", 0) or 0),
            "variant": str(ocr_result.get("variant", "")),
            "selectedRegionLabel": region_label,
            "selectedRegion": {
                "left": selected_region.left,
                "top": selected_region.top,
                "right": selected_region.left + selected_region.width,
                "bottom": selected_region.top + selected_region.height,
            },
        },
    )
    print(
        f"[control {timestamp_now()}] queued-comment-draft counter={effective_task_count} "
        f"type={task_type} chars={len(comment_text)} region={region_label}",
        flush=True,
    )
    return True


def handle_control_processing_command(command: str, payload: dict[str, Any]) -> bool:
    if command == "start_task_screenshot":
        return queue_control_screenshot(payload)
    if command == "start_task_ocr":
        return queue_control_ocr(payload)
    if command == COMMENT_DRAFT_FEEDBACK_COMMAND:
        return queue_comment_draft_feedback(payload)
    if get_control_run_id(payload):
        publish_control_status(
            payload,
            "error",
            f"Unsupported processing command: {command or 'unknown'}.",
        )
    return False


def run_control_processing_command(command: str, payload: dict[str, Any]) -> None:
    try:
        queued = handle_control_processing_command(command, payload)
        if not queued and get_control_run_id(payload) and not STATE.is_control_run_cancelled(get_control_run_id(payload)):
            publish_control_status(
                payload,
                "error",
                "Processing finished without queueing a ChatGPT event.",
            )
    except Exception as exc:
        print(f"[control {timestamp_now()}] async-processing-error command={command or '-'} error={exc}", flush=True)
        publish_control_status(
            payload,
            "error",
            "Processing failed.",
            details={"error": str(exc)},
        )


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


def xor_decrypt_from_hex(value: Any, key: int) -> str:
    text = str(value or "")
    if not text or len(text) % 2 != 0:
        return ""

    try:
        decoded = bytes(int(text[index : index + 2], 16) ^ key for index in range(0, len(text), 2))
    except ValueError:
        return ""
    return decoded.decode("utf-8", errors="replace")


def xor_encrypt_bytes_to_base64(value: bytes, key: int) -> str:
    encrypted = bytes(byte ^ key for byte in value)
    return base64.b64encode(encrypted).decode("ascii")


def xor_decrypt_bytes_from_base64(value: Any, key: int) -> bytes:
    text = str(value or "")
    if not text:
        return b""
    try:
        encrypted = base64.b64decode(text.encode("ascii"), validate=True)
    except Exception:
        return b""
    return bytes(byte ^ key for byte in encrypted)


def xor_encrypt_string_to_base64(value: str, key: int) -> str:
    return xor_encrypt_bytes_to_base64(value.encode("utf-8"), key)


def xor_decrypt_string_from_base64(value: Any, key: int) -> str:
    return xor_decrypt_bytes_from_base64(value, key).decode("utf-8", errors="replace")


def decode_bridge_operation_envelope(envelope: dict[str, Any]) -> tuple[str, dict[str, Any]]:
    action = sanitize_control_command_field(xor_decrypt_from_hex(envelope.get("a"), XOR_KEY), 80)
    if not action:
        raise ValueError("Missing bridge operation.")

    params_text = xor_decrypt_string_from_base64(envelope.get("b"), XOR_KEY)
    if not params_text.strip():
        return action, {}

    try:
        params = json.loads(params_text)
    except json.JSONDecodeError as exc:
        raise ValueError("Invalid bridge operation payload.") from exc

    if not isinstance(params, dict):
        raise ValueError("Bridge operation payload must be an object.")
    return action, params


def get_json_payload_size(payload: dict[str, Any]) -> int:
    return len(json.dumps(payload, ensure_ascii=False, separators=(",", ":")).encode("utf-8"))


def get_random_int_inclusive(minimum: int, maximum: int) -> int:
    if maximum <= minimum:
        return minimum
    return minimum + secrets.randbelow(maximum - minimum + 1)


def choose_padded_envelope_target_size(base_size: int) -> int:
    minimum_extra = 1024
    maximum_extra = 4096

    if base_size >= 65_536:
        minimum_extra = int(base_size * 0.08)
        maximum_extra = int(base_size * 0.35)
    elif base_size >= 8192:
        minimum_extra = int(base_size * 0.25)
        maximum_extra = int(base_size * 0.9)
    elif base_size >= 1024:
        minimum_extra = int(base_size * 0.5)
        maximum_extra = int(base_size * 2)

    maximum_extra = max(minimum_extra, min(maximum_extra, BRIDGE_PADDING_MAX_EXTRA_BYTES))
    return base_size + get_random_int_inclusive(minimum_extra, maximum_extra)


def sanitize_cover_response_target_size(value: Any) -> int:
    try:
        requested_size = int(value)
    except (TypeError, ValueError):
        requested_size = get_random_int_inclusive(BRIDGE_COVER_RESPONSE_MIN_BYTES, BRIDGE_COVER_RESPONSE_MAX_BYTES)

    return max(BRIDGE_COVER_RESPONSE_MIN_BYTES, min(requested_size, BRIDGE_COVER_RESPONSE_MAX_BYTES))


def sanitize_optional_bridge_response_target_size(value: Any) -> int | None:
    if value is None or value == "":
        return None
    return sanitize_cover_response_target_size(value)


def choose_real_bridge_response_target_size() -> int:
    return get_random_int_inclusive(BRIDGE_REAL_RESPONSE_MIN_BYTES, BRIDGE_REAL_RESPONSE_MAX_BYTES)


def is_empty_bridge_event_payload(payload: Any) -> bool:
    if not isinstance(payload, dict):
        return True
    return not any(str(payload.get(key) or "") for key in ("a", "b", "c", "d", "e", "f"))


def pad_bridge_operation_envelope(envelope: dict[str, str], target_size: int | None = None) -> dict[str, str]:
    padded = dict(envelope)
    padded["d"] = ""
    base_size = get_json_payload_size(padded)
    if target_size is not None and target_size > base_size:
        effective_target_size = target_size
    else:
        effective_target_size = choose_padded_envelope_target_size(base_size)
    padding_bytes = max(0, int((effective_target_size - base_size) * 0.72))

    for _attempt in range(4):
        padded["d"] = xor_encrypt_bytes_to_base64(secrets.token_bytes(padding_bytes), XOR_KEY)
        current_size = get_json_payload_size(padded)
        if current_size >= effective_target_size:
            return padded
        padding_bytes += int((effective_target_size - current_size) * 0.72) + 1

    return padded


def encode_bridge_operation_response(payload: dict[str, Any], target_size: int | None = None) -> dict[str, str]:
    return pad_bridge_operation_envelope({
        "a": xor_encrypt_to_hex("ok", XOR_KEY),
        "b": xor_encrypt_string_to_base64(
            json.dumps(payload, ensure_ascii=False, separators=(",", ":")),
            XOR_KEY,
        ),
        "c": xor_encrypt_to_hex(timestamp_now(), XOR_KEY),
    }, target_size=target_size)


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

def resolve_active_control_task_settings(
    config: dict[str, Any],
    task_type_key: str,
    task_type_label: str,
) -> TaskSettings | None:
    candidates = [
        clean_ocr_text(task_type_label),
        sanitize_control_command_field(task_type_key, 120),
    ]
    seen: set[str] = set()
    for candidate in candidates:
        if not candidate or candidate.casefold() in seen:
            continue
        seen.add(candidate.casefold())
        settings = resolve_task_settings(candidate, config)
        if settings is not None:
            return settings
    return None


def apply_counted_task_type(settings: TaskSettings, counted_task_type: str) -> TaskSettings:
    return TaskSettings(
        task_type=counted_task_type,
        wait_for_edge=settings.wait_for_edge,
        prompts=settings.prompts,
        repeat_prefix=settings.repeat_prefix,
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


def sanitize_filename_component(value: Any, fallback: str = "unknown", max_length: int = 80) -> str:
    text = sanitize_control_command_field(value, max_length)
    safe_text = "".join(
        character if character.isascii() and (character.isalnum() or character in {"-", "_"}) else "_"
        for character in text
    ).strip("_")
    return safe_text[:max_length] or fallback


def save_sent_screenshot_pngs(
    task_count: int,
    screenshots_png: list[bytes] | tuple[bytes, ...],
    *,
    task_type: str = "",
    source: str = "task",
) -> list[str]:
    if not screenshots_png:
        return []

    task_count_slug = sanitize_filename_component(task_count, fallback="unknown", max_length=24)
    task_type_slug = sanitize_filename_component(task_type, fallback="unknown-task", max_length=80)
    source_slug = sanitize_filename_component(source, fallback="sent", max_length=40)
    saved_paths: list[str] = []
    try:
        TASK_SENT_SCREENSHOT_DIR.mkdir(parents=True, exist_ok=True)
    except Exception as exc:
        print(
            f"[task-screenshot {timestamp_now()}] counter={task_count} type={task_type or '-'} "
            f"source={source_slug} mkdir-error={exc}",
            flush=True,
        )
        return saved_paths

    for index, screenshot_png in enumerate(screenshots_png, start=1):
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
        file_path = TASK_SENT_SCREENSHOT_DIR / (
            f"task_{task_count_slug}_{timestamp}_{source_slug}_{task_type_slug}_{index}.png"
        )
        try:
            file_path.write_bytes(bytes(screenshot_png))
        except Exception as exc:
            print(
                f"[task-screenshot {timestamp_now()}] counter={task_count} type={task_type or '-'} "
                f"source={source_slug} save-error={exc}",
                flush=True,
            )
        else:
            print(
                f"[task-screenshot {timestamp_now()}] counter={task_count} type={task_type or '-'} "
                f"source={source_slug} saved={file_path.name} bytes={len(screenshot_png)}",
                flush=True,
            )
            saved_paths.append(str(file_path))

    return saved_paths


def append_jsonl_record(path: Path, record: dict[str, Any]) -> bool:
    try:
        path.parent.mkdir(parents=True, exist_ok=True)
        with path.open("a", encoding="utf-8") as file:
            file.write(json.dumps(record, ensure_ascii=False, sort_keys=True) + "\n")
        return True
    except Exception as exc:
        print(f"[bridge {timestamp_now()}] jsonl-save-error path={path.name} error={exc}", flush=True)
        return False


def build_sent_screenshot_reference(
    task_count: int,
    task_type: str,
    *,
    source: str,
    screenshot_paths: list[str] | tuple[str, ...],
    control_run_id: str = "",
) -> SentTaskReference:
    sent_at = timestamp_now()
    first_path = Path(screenshot_paths[0]) if screenshot_paths else None
    fallback_id = (
        f"screenshot_{sanitize_filename_component(task_count, max_length=24)}_"
        f"{datetime.now().strftime('%Y%m%d_%H%M%S_%f')}"
    )
    record_id = first_path.stem if first_path is not None else fallback_id
    return SentTaskReference(
        reference_type="task_screenshot",
        record_id=record_id,
        task_count=task_count,
        task_type=task_type,
        sent_at=sent_at,
        source=source,
        control_run_id=sanitize_control_command_field(control_run_id, 120),
        screenshot_paths=tuple(screenshot_paths),
    )


def build_task_text_record_id(task_count: int, source: str) -> str:
    task_count_slug = sanitize_filename_component(task_count, fallback="unknown", max_length=24)
    source_slug = sanitize_filename_component(source, fallback="ocr", max_length=40)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
    return f"task_ocr_{task_count_slug}_{timestamp}_{source_slug}"


# TODO: When task OCR is fleshed out beyond the current query/product extraction,
# keep recording the exact OCR text sent to Chrome here so every later rating
# comment draft can stay linked to the task OCR it was written for.
def save_task_ocr_text_record(
    task_count: int,
    task_type: str,
    prompts: list[str] | tuple[str, ...],
    task_text_record: dict[str, Any],
    *,
    control_run_id: str = "",
) -> SentTaskReference | None:
    source = sanitize_control_command_field(task_text_record.get("source") or "task_ocr", 80)
    record_id = build_task_text_record_id(task_count, source)
    sent_at = timestamp_now()
    record = {
        "id": record_id,
        "type": "task_ocr_text",
        "sentAt": sent_at,
        "taskCount": task_count,
        "taskType": task_type,
        "source": source,
        "controlRunId": sanitize_control_command_field(control_run_id, 120),
        "promptCount": len(prompts),
        "prompts": list(prompts),
        "queryText": str(task_text_record.get("queryText") or ""),
        "productText": str(task_text_record.get("productText") or ""),
        "ocrWarning": str(task_text_record.get("ocrWarning") or ""),
        "selectedLineCount": task_text_record.get("selectedLineCount", ""),
        "variant": str(task_text_record.get("variant") or ""),
        "debug": str(task_text_record.get("debug") or ""),
    }
    if not append_jsonl_record(TASK_OCR_TEXT_HISTORY_PATH, record):
        return None

    print(
        f"[task-ocr-text {timestamp_now()}] counter={task_count} type={task_type or '-'} "
        f"source={source or '-'} saved={record_id}",
        flush=True,
    )
    return SentTaskReference(
        reference_type="task_ocr_text",
        record_id=record_id,
        task_count=task_count,
        task_type=task_type,
        sent_at=sent_at,
        source=source,
        control_run_id=sanitize_control_command_field(control_run_id, 120),
        record_path=str(TASK_OCR_TEXT_HISTORY_PATH),
    )


def save_rating_comment_draft_record(
    task_count: int,
    task_type: str,
    prompts: list[str] | tuple[str, ...],
    comment_draft_record: dict[str, Any],
    *,
    linked_task_reference: SentTaskReference | None,
    control_run_id: str = "",
) -> None:
    source = sanitize_control_command_field(comment_draft_record.get("source") or "comment_draft", 80)
    record_id = (
        f"rating_comment_{sanitize_filename_component(task_count, fallback='unknown', max_length=24)}_"
        f"{datetime.now().strftime('%Y%m%d_%H%M%S_%f')}"
    )
    comment_text = str(comment_draft_record.get("commentText") or "")
    record = {
        "id": record_id,
        "type": "rating_comment_draft",
        "sentAt": timestamp_now(),
        "taskCount": task_count,
        "taskType": task_type,
        "source": source,
        "controlRunId": sanitize_control_command_field(control_run_id, 120),
        "commentText": comment_text,
        "commentChars": len(comment_text),
        "lineCount": comment_draft_record.get("lineCount", ""),
        "rawLineCount": comment_draft_record.get("rawLineCount", ""),
        "variant": str(comment_draft_record.get("variant") or ""),
        "selectedRegionLabel": str(comment_draft_record.get("selectedRegionLabel") or ""),
        "selectedRegion": comment_draft_record.get("selectedRegion", {}),
        "promptCount": len(prompts),
        "linkedTaskReference": linked_task_reference.to_dict() if linked_task_reference is not None else None,
    }
    if append_jsonl_record(RATING_COMMENT_DRAFT_HISTORY_PATH, record):
        linked_id = linked_task_reference.record_id if linked_task_reference is not None else "-"
        print(
            f"[rating-comment {timestamp_now()}] counter={task_count} type={task_type or '-'} "
            f"saved={record_id} linked={linked_id}",
            flush=True,
        )


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


def color_mask(region_bgr: np.ndarray, color_bgr: tuple[int, int, int], tolerance: int) -> np.ndarray:
    target = np.array(color_bgr, dtype=np.int16)
    lower = np.clip(target - tolerance, 0, 255).astype(np.uint8)
    upper = np.clip(target + tolerance, 0, 255).astype(np.uint8)
    return cv2.inRange(region_bgr, lower, upper)


def build_counter_digit_mask(region_bgr: np.ndarray) -> np.ndarray:
    mask = color_mask(region_bgr, TASK_COUNTER_TEXT_COLOR_BGR, TASK_COUNTER_TEXT_COLOR_TOLERANCE)
    kernel = np.ones((2, 2), dtype=np.uint8)
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
    mask = cv2.dilate(mask, kernel, iterations=1)
    return mask


def build_counter_icon_mask(region_bgr: np.ndarray) -> np.ndarray:
    mask = color_mask(region_bgr, TASK_COUNTER_ICON_COLOR_BGR, TASK_COUNTER_ICON_COLOR_TOLERANCE)
    kernel = np.ones((2, 2), dtype=np.uint8)
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
    return mask


def preprocess_counter_digits(region_bgr: np.ndarray) -> np.ndarray:
    mask = build_counter_digit_mask(region_bgr)
    processed = 255 - mask
    return upscale_image(processed, TASK_COUNTER_OCR_SCALE_FACTOR, cv2.INTER_NEAREST)


def get_mask_components(mask: np.ndarray, *, min_area: int, min_height: int) -> list[dict[str, int]]:
    if mask.size == 0:
        return []

    component_count, _labels, stats, _centroids = cv2.connectedComponentsWithStats(mask, connectivity=8)
    components: list[dict[str, int]] = []
    for component_index in range(1, component_count):
        left = int(stats[component_index, cv2.CC_STAT_LEFT])
        top = int(stats[component_index, cv2.CC_STAT_TOP])
        width = int(stats[component_index, cv2.CC_STAT_WIDTH])
        height = int(stats[component_index, cv2.CC_STAT_HEIGHT])
        area = int(stats[component_index, cv2.CC_STAT_AREA])
        if area < min_area or height < min_height:
            continue
        components.append(
            {
                "left": left,
                "top": top,
                "right": left + width,
                "bottom": top + height,
                "width": width,
                "height": height,
                "area": area,
            }
        )
    return sorted(components, key=lambda component: (component["left"], component["top"]))


def cluster_counter_digit_components(components: list[dict[str, int]]) -> list[dict[str, int]]:
    clusters: list[dict[str, int]] = []
    current: dict[str, int] | None = None

    for component in components:
        if current is None or component["left"] - current["right"] > TASK_COUNTER_DIGIT_MAX_GAP:
            if current is not None:
                clusters.append(current)
            current = {
                "left": component["left"],
                "top": component["top"],
                "right": component["right"],
                "bottom": component["bottom"],
                "area": component["area"],
                "component_count": 1,
            }
            continue

        current["top"] = min(current["top"], component["top"])
        current["right"] = max(current["right"], component["right"])
        current["bottom"] = max(current["bottom"], component["bottom"])
        current["area"] += component["area"]
        current["component_count"] += 1

    if current is not None:
        clusters.append(current)

    return [
        {
            **cluster,
            "width": cluster["right"] - cluster["left"],
            "height": cluster["bottom"] - cluster["top"],
        }
        for cluster in clusters
        if cluster["area"] >= TASK_COUNTER_DIGIT_MIN_AREA and cluster["bottom"] - cluster["top"] >= TASK_COUNTER_DIGIT_MIN_HEIGHT
    ]


def counter_cluster_has_left_icon_anchor(cluster: dict[str, int], icon_components: list[dict[str, int]]) -> bool:
    for icon_component in icon_components:
        if icon_component["right"] > cluster["left"]:
            continue
        if cluster["left"] - icon_component["right"] <= TASK_COUNTER_ICON_ANCHOR_MAX_GAP:
            return True
    return False


def choose_counter_digit_cluster(
    digit_components: list[dict[str, int]],
    icon_components: list[dict[str, int]],
) -> tuple[dict[str, int] | None, bool]:
    clusters = cluster_counter_digit_components(digit_components)
    if not clusters:
        return None, bool(icon_components)

    anchored_clusters = [
        cluster for cluster in clusters
        if counter_cluster_has_left_icon_anchor(cluster, icon_components)
    ]
    candidates = anchored_clusters or clusters
    candidates = sorted(
        candidates,
        key=lambda cluster: (
            cluster in anchored_clusters,
            cluster["component_count"],
            cluster["area"],
            cluster["right"],
        ),
        reverse=True,
    )
    return candidates[0], bool(anchored_clusters)


def read_task_counter(frame_bgr: np.ndarray, _icon_template_bgr: np.ndarray | None = None) -> TaskCounterRead:
    search_left = int(frame_bgr.shape[1] * TASK_COUNTER_SCAN_LEFT_RATIO)
    search_right = min(frame_bgr.shape[1], TASK_COUNTER_SCAN_RIGHT_MAX_X)
    if search_right <= search_left:
        return TaskCounterRead(
            task_count=None,
            icon_found=False,
            reason="counter search region empty",
        )

    scan_region = extract_region(
        frame_bgr,
        Region(
            left=search_left,
            top=TASK_COUNTER_SCAN_TOP,
            width=search_right - search_left,
            height=TASK_COUNTER_SCAN_HEIGHT,
        ),
    )
    digit_mask = build_counter_digit_mask(scan_region)
    icon_mask = build_counter_icon_mask(scan_region)
    digit_components = get_mask_components(
        digit_mask,
        min_area=TASK_COUNTER_DIGIT_MIN_AREA,
        min_height=TASK_COUNTER_DIGIT_MIN_HEIGHT,
    )
    icon_components = get_mask_components(
        icon_mask,
        min_area=TASK_COUNTER_ICON_MIN_AREA,
        min_height=TASK_COUNTER_ICON_MIN_HEIGHT,
    )
    digit_cluster, icon_anchor_found = choose_counter_digit_cluster(digit_components, icon_components)
    if digit_cluster is None:
        save_debug_image("task_counter_scan_region.png", scan_region)
        save_debug_image("task_counter_digits_processed.png", 255 - digit_mask)
        save_debug_text(
            "task_counter_ocr.txt",
            (
                "raw=''\nparsed=''\n"
                f"search_left={search_left}\nsearch_right={search_right}\n"
                f"digit_components={len(digit_components)}\nicon_components={len(icon_components)}\n"
                "reason='counter digit color cluster not found'\n"
            ),
        )
        return TaskCounterRead(
            task_count=None,
            icon_found=bool(icon_components),
            reason="counter digit color cluster not found",
        )

    padding = 2
    digits_left = max(0, digit_cluster["left"] - padding)
    digits_right = min(scan_region.shape[1], digit_cluster["right"] + padding)
    if digits_right <= digits_left:
        return TaskCounterRead(
            task_count=None,
            icon_found=icon_anchor_found,
            reason="counter digit region empty",
        )

    digits_region = scan_region[:, digits_left:digits_right].copy()
    processed_digits = preprocess_counter_digits(digits_region)

    raw_text = ocr_single_line(processed_digits, language=COUNTER_OCR_LANGUAGE, config=TASK_COUNTER_OCR_CONFIG)
    cleaned = "".join(character for character in raw_text if character.isdigit())

    save_debug_image("task_counter_scan_region.png", scan_region)
    save_debug_image("task_counter_digits_raw.png", digits_region)
    save_debug_image("task_counter_digits_processed.png", processed_digits)
    save_debug_text(
        "task_counter_ocr.txt",
        (
            f"raw={raw_text!r}\nparsed={cleaned!r}\n"
            f"search_left={search_left}\nsearch_right={search_right}\n"
            f"digits_left={search_left + digits_left}\ndigits_right={search_left + digits_right}\n"
            f"digit_components={len(digit_components)}\nicon_components={len(icon_components)}\n"
            f"icon_anchor_found={icon_anchor_found}\n"
        ),
    )

    if not cleaned:
        return TaskCounterRead(
            task_count=None,
            icon_found=icon_anchor_found,
            raw_text=raw_text,
            parsed_text=cleaned,
            reason="counter OCR read no digits",
        )

    try:
        return TaskCounterRead(
            task_count=int(cleaned),
            icon_found=icon_anchor_found,
            raw_text=raw_text,
            parsed_text=cleaned,
            reason="ok",
        )
    except ValueError:
        return TaskCounterRead(
            task_count=None,
            icon_found=icon_anchor_found,
            raw_text=raw_text,
            parsed_text=cleaned,
            reason="counter OCR parsed invalid integer",
        )


def extract_task_counter(frame_bgr: np.ndarray, icon_template_bgr: np.ndarray | None = None) -> int | None:
    return read_task_counter(frame_bgr, icon_template_bgr).task_count

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
    with mss.mss() as screenshotter:
        monitor = screenshotter.monitors[1]
        last_edge_active = is_mouse_signal_active(monitor)
        last_counter_visible = False
        last_reported_counter_count: int | None = None
        last_reported_counter_visible = False
        last_counter_status_at = 0.0
        while True:
            try:
                frame_bgr = capture_primary_monitor(screenshotter, monitor)
                counter_read = read_task_counter(frame_bgr)
                task_count = counter_read.task_count
                counter_visible = task_count is not None

                counter_status_reported = False
                counter_status_now = time.monotonic()
                counter_status_heartbeat_due = (
                    last_counter_status_at <= 0.0
                    or counter_status_now - last_counter_status_at >= TASK_COUNTER_STATUS_HEARTBEAT_SECONDS
                )
                counter_changed = (
                    counter_visible != last_reported_counter_visible
                    or (counter_visible and task_count != last_reported_counter_count)
                )

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
                            task_type=test_settings.task_type,
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
                                    STATE.publish_alert_payload(
                                        effective_task_count,
                                        abort_alerts,
                                        task_type=test_settings.task_type,
                                    )
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
                                    STATE.publish_text_payload(
                                        effective_task_count,
                                        text_prompts,
                                        task_type=test_settings.task_type,
                                        task_text_record={
                                            "source": "manual_paddleocr",
                                            "queryText": query_text,
                                            "productText": product_text,
                                            "ocrWarning": ocr_warning,
                                            "selectedLineCount": selected_line_count,
                                            "variant": str(entry.get("ocr_variant", "")),
                                            "debug": debug_name,
                                        },
                                    )
                                    print(
                                        f"[paddleocr {timestamp_now()}] hotkey={PADDLE_OCR_HOTKEY_LABEL} queued-text type={test_settings.task_type}",
                                        flush=True,
                                    )

                if task_count is not None and STATE.is_new_task(task_count):
                    last_seen_before_task = STATE.get_last_seen_task_count()
                    active_task_type_key, active_task_type_label = STATE.get_active_task_type()
                    counted_task_type = active_task_type_key or active_task_type_label or "Unknown"
                    settings = resolve_active_control_task_settings(
                        CONFIG_CACHE.load(),
                        active_task_type_key,
                        active_task_type_label,
                    )
                    task_type_total = TASK_TYPE_COUNTERS.record(task_count, counted_task_type)

                    if settings is None:
                        if STATE.ignore_task(task_count):
                            print(
                                f"[task {timestamp_now()}] counter={task_count} type={counted_task_type} label={active_task_type_label or '-'} total={task_type_total} ignored",
                                flush=True,
                            )
                            publish_task_counter_status(
                                counter_read,
                                "ignored",
                                f"Task counter read {task_count}; recorded history entry but ignored the task because no settings matched.",
                                last_seen_task_count=last_seen_before_task,
                                task_type=counted_task_type,
                                extra_details={
                                    "newTaskSignal": True,
                                    "historyRecorded": True,
                                    "taskTypeTotal": task_type_total,
                                    "activeTaskType": active_task_type_key,
                                    "activeTaskTypeLabel": active_task_type_label,
                                },
                            )
                            counter_status_reported = True
                    else:
                        settings = apply_counted_task_type(settings, counted_task_type)
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
                            STATE.publish_payload(
                                task_count,
                                [screenshot_png],
                                settings.prompts,
                                task_type=settings.task_type,
                            )
                            print(
                                f"[task {timestamp_now()}] counter={task_count} type={settings.task_type} label={active_task_type_label or '-'} total={task_type_total}",
                                flush=True,
                            )
                            publish_task_counter_status(
                                counter_read,
                                "queued",
                                f"Task counter read {task_count}; accepted as a new task and queued for ChatGPT.",
                                last_seen_task_count=last_seen_before_task,
                                task_type=settings.task_type,
                                extra_details={
                                    "newTaskSignal": True,
                                    "historyRecorded": True,
                                    "taskTypeTotal": task_type_total,
                                    "activeTaskType": active_task_type_key,
                                    "activeTaskTypeLabel": active_task_type_label,
                                },
                            )
                            counter_status_reported = True
                        elif action == "armed":
                            print(
                                f"[task {timestamp_now()}] counter={task_count} type={settings.task_type} label={active_task_type_label or '-'} total={task_type_total} waiting-for-edge",
                                flush=True,
                            )
                            publish_task_counter_status(
                                counter_read,
                                "waiting-for-edge",
                                f"Task counter read {task_count}; accepted as a new task and waiting for edge release.",
                                last_seen_task_count=last_seen_before_task,
                                task_type=settings.task_type,
                                extra_details={
                                    "newTaskSignal": True,
                                    "historyRecorded": True,
                                    "taskTypeTotal": task_type_total,
                                    "activeTaskType": active_task_type_key,
                                    "activeTaskTypeLabel": active_task_type_label,
                                },
                            )
                            counter_status_reported = True
                        elif action == "duplicate":
                            publish_task_counter_status(
                                counter_read,
                                "duplicate",
                                f"Task counter read {task_count}; duplicate after task registration check.",
                                last_seen_task_count=last_seen_before_task,
                                task_type=settings.task_type,
                                extra_details={
                                    "newTaskSignal": False,
                                    "historyRecorded": True,
                                    "taskTypeTotal": task_type_total,
                                    "activeTaskType": active_task_type_key,
                                    "activeTaskTypeLabel": active_task_type_label,
                                },
                            )
                            counter_status_reported = True

                if not counter_status_reported:
                    last_seen_task_count = STATE.get_last_seen_task_count()
                    if counter_visible and (counter_changed or counter_status_heartbeat_due):
                        new_task_signal = task_count != last_seen_task_count
                        counter_status = "new-signal" if new_task_signal else ("read" if counter_changed else "heartbeat")
                        signal_text = "new task signal" if new_task_signal else "no new task signal"
                        publish_task_counter_status(
                            counter_read,
                            counter_status,
                            f"Task counter read {task_count}; {signal_text}.",
                            last_seen_task_count=last_seen_task_count,
                            extra_details={
                                "newTaskSignal": new_task_signal,
                                "historyRecorded": False,
                            },
                        )
                        counter_status_reported = True
                    elif not counter_visible and (last_reported_counter_visible or counter_status_heartbeat_due):
                        publish_task_counter_status(
                            counter_read,
                            "missing",
                            "Task counter not found on screen.",
                            last_seen_task_count=last_seen_task_count,
                            extra_details={
                                "newTaskSignal": False,
                                "historyRecorded": False,
                            },
                        )
                        counter_status_reported = True

                if counter_status_reported:
                    last_reported_counter_count = task_count
                    last_reported_counter_visible = counter_visible
                    last_counter_status_at = counter_status_now

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
                            task_type=armed_task.task_type,
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
    check_bridge_ip_configuration()
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
    app.run(host=HTTP_HOST, port=HTTP_PORT, debug=False, use_reloader=False, threaded=True)


if __name__ == "__main__":
    main()
