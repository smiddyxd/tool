from __future__ import annotations

import json
import os
import re
import sys
from collections import defaultdict
from datetime import datetime
from pathlib import Path
from typing import Any

import cv2
import numpy as np

INPUT_DIR = Path(__file__).resolve().parent / "manual_screenshots"
OUTPUT_PATH = Path(__file__).resolve().parent / "paddleocr_manual_results.json"
DEBUG_DIR = Path(__file__).resolve().parent / "paddleocr_debug"
SUPPORTED_IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".bmp", ".webp", ".tif", ".tiff"}
PADDLEOCR_LANG = "german"
PADDLEOCR_USE_DOC_ORIENTATION_CLASSIFY = False
PADDLEOCR_USE_DOC_UNWARPING = False
PADDLEOCR_USE_TEXTLINE_ORIENTATION = False
PADDLEOCR_TEXT_DET_THRESH = 0.12
PADDLEOCR_TEXT_DET_BOX_THRESH = 0.3
PADDLEOCR_TEXT_REC_SCORE_THRESH = 0.0
PADDLEOCR_MIN_DET_SIDE_LEN = 256
PADDLEOCR_UPSCALE_TARGET_MAX_SIDE = 960
PADDLEOCR_MAX_UPSCALE_FACTOR = 4.0
PADDLEOCR_TEXT_DET_LIMIT_TYPE = "max"
PADDLEOCR_COLOR_VARIANT_MIN_SCALE = 1.15
OCR_FOCUS_LEFT = 330
OCR_FOCUS_TOP = 170
OCR_FOCUS_RIGHT = 1090
OCR_FOCUS_BOTTOM = 970
OCR_FOCUS_PADDING_LEFT = 0
OCR_FOCUS_PADDING_TOP = 0
OCR_FOCUS_PADDING_RIGHT = 220
OCR_FOCUS_PADDING_BOTTOM = 0
BLOCK_HORIZONTAL_GAP_PX = 72
BLOCK_VERTICAL_GAP_PX = 28
BLOCK_ROW_ALIGNMENT_PX = 18
BOTTOM_BLOCK_VERTICAL_GAP_PX = 10
QUERY_LINE_PREFIX = "query:"
BASE_VARIANT_PHASE = "base"
RETRY_VARIANT_PHASE = "retry"
PRICE_LIKE_PATTERN = re.compile(
    r"(?ix)(?:[$€£¥₹₩]\s*\d[\d,]*(?:\.\d{2})?|\d[\d,]*(?:\.\d{2})\s*(?:[$€£¥₹₩]|usd|eur|gbp|cad|aud))"
)
JSON_INDENT = 2
DEFAULT_CAPTURE_PREFIX = "manual"

_PADDLE_OCR_INSTANCE: Any | None = None


NOISE_ONLY_PATTERN = re.compile(r"^[.\-+\u2022\u00b7_=~:;,'`^\|/\\]+$")
MOJIBAKE_MARKERS = ("\u00c3", "\u00e2", "\u20ac", "\u0153", "\u017e", "\ufffd")
TARGET_NON_ASCII = "\u00e4\u00f6\u00fc\u00c4\u00d6\u00dc\u00df"


def repair_mojibake(text: str) -> str:
    if not text:
        return text

    try:
        repaired = text.encode("latin-1", errors="ignore").decode("utf-8", errors="ignore")
    except Exception:
        return text

    def score(value: str) -> int:
        return (
            sum(value.count(ch) for ch in TARGET_NON_ASCII) * 4
            - sum(value.count(marker) for marker in MOJIBAKE_MARKERS) * 3
        )

    return repaired if repaired and score(repaired) > score(text) else text


def normalize_token_text(text: str) -> str:
    text = repair_mojibake(text.strip())
    text = text.replace("\u2212", "-")
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def is_noise_token(text: str, confidence: float) -> bool:
    stripped = text.strip()
    if not stripped:
        return True
    if NOISE_ONLY_PATTERN.fullmatch(stripped):
        return True
    if confidence < 0.6 and len(stripped) <= 2:
        return True
    if confidence < 0.75 and stripped in {"i", "ii", "u", "n"}:
        return True
    return False


def suppress_red_spellcheck_marks(image_bgr: Any) -> Any:
    hsv = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2HSV)
    lower_red_1 = np.array([0, 90, 90], dtype=np.uint8)
    upper_red_1 = np.array([12, 255, 255], dtype=np.uint8)
    lower_red_2 = np.array([168, 90, 90], dtype=np.uint8)
    upper_red_2 = np.array([180, 255, 255], dtype=np.uint8)
    mask = cv2.inRange(hsv, lower_red_1, upper_red_1) | cv2.inRange(hsv, lower_red_2, upper_red_2)
    cleaned = image_bgr.copy()
    cleaned[mask > 0] = (25, 25, 25)
    return cleaned


def gray_to_bgr(gray_image: Any) -> Any:
    return cv2.cvtColor(gray_image, cv2.COLOR_GRAY2BGR)


def build_gray_variant(image_bgr: Any) -> Any:
    return gray_to_bgr(cv2.cvtColor(image_bgr, cv2.COLOR_BGR2GRAY))


def build_threshold_variant(image_bgr: Any) -> Any:
    gray = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2GRAY)
    _, threshold = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    return gray_to_bgr(threshold)


def build_contrast_variant(image_bgr: Any) -> Any:
    lab = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2LAB)
    lightness, a_channel, b_channel = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=2.2, tileGridSize=(8, 8))
    enhanced_lightness = clahe.apply(lightness)
    enhanced_lab = cv2.merge((enhanced_lightness, a_channel, b_channel))
    return cv2.cvtColor(enhanced_lab, cv2.COLOR_LAB2BGR)


def mask_to_text_variant(mask: Any) -> Any:
    kernel = np.ones((2, 2), dtype=np.uint8)
    refined = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
    refined = cv2.dilate(refined, kernel, iterations=1)
    binary = np.full(refined.shape, 255, dtype=np.uint8)
    binary[refined > 0] = 0
    return gray_to_bgr(binary)


def build_dark_text_variant(image_bgr: Any) -> Any:
    hsv = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2HSV)
    dark_mask = cv2.inRange(
        hsv,
        np.array([0, 0, 0], dtype=np.uint8),
        np.array([180, 120, 175], dtype=np.uint8),
    )
    return mask_to_text_variant(dark_mask)


def build_color_text_variant(image_bgr: Any, *, lower_hsv: tuple[int, int, int], upper_hsv: tuple[int, int, int]) -> Any:
    hsv = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2HSV)
    color_mask = cv2.inRange(
        hsv,
        np.array(lower_hsv, dtype=np.uint8),
        np.array(upper_hsv, dtype=np.uint8),
    )
    return mask_to_text_variant(color_mask)


def load_paddleocr() -> Any:
    global _PADDLE_OCR_INSTANCE

    if _PADDLE_OCR_INSTANCE is not None:
        return _PADDLE_OCR_INSTANCE

    try:
        os.environ.setdefault("PADDLE_PDX_DISABLE_MODEL_SOURCE_CHECK", "True")
        from paddleocr import PaddleOCR  # type: ignore
    except ImportError as exc:  # pragma: no cover - environment-specific
        raise RuntimeError(
            "PaddleOCR is not installed. Install PaddlePaddle and paddleocr first."
        ) from exc

    _PADDLE_OCR_INSTANCE = PaddleOCR(
        use_doc_orientation_classify=PADDLEOCR_USE_DOC_ORIENTATION_CLASSIFY,
        use_doc_unwarping=PADDLEOCR_USE_DOC_UNWARPING,
        use_textline_orientation=PADDLEOCR_USE_TEXTLINE_ORIENTATION,
        lang=PADDLEOCR_LANG,
    )
    return _PADDLE_OCR_INSTANCE


def iter_input_images(argv: list[str]) -> list[Path]:
    if len(argv) > 1:
        image_paths = [Path(value).expanduser().resolve() for value in argv[1:]]
    else:
        INPUT_DIR.mkdir(parents=True, exist_ok=True)
        image_paths = sorted(
            path.resolve()
            for path in INPUT_DIR.iterdir()
            if path.is_file() and path.suffix.lower() in SUPPORTED_IMAGE_EXTENSIONS
        )
    return [path for path in image_paths if path.is_file()]


def load_results(path: Path) -> dict[str, Any]:
    if not path.exists():
        return {"schema_version": 1, "entries_by_day": {}}

    raw = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(raw, dict):
        return {"schema_version": 1, "entries_by_day": {}}

    raw.setdefault("schema_version", 1)
    raw.setdefault("entries_by_day", {})
    if not isinstance(raw["entries_by_day"], dict):
        raw["entries_by_day"] = {}
    return raw


def save_results(path: Path, results: dict[str, Any]) -> None:
    path.write_text(json.dumps(results, indent=JSON_INDENT, ensure_ascii=False), encoding="utf-8")


def is_ocr_line(value: Any) -> bool:
    if not isinstance(value, (list, tuple)) or len(value) != 2:
        return False
    box, text_info = value
    if not isinstance(box, (list, tuple, np.ndarray)) or not isinstance(text_info, (list, tuple)):
        return False
    return len(text_info) >= 2


def extract_result_payload(raw_result: Any) -> dict[str, Any]:
    if isinstance(raw_result, list):
        if not raw_result:
            return {}
        if len(raw_result) == 1:
            return extract_result_payload(raw_result[0])
        if is_ocr_line(raw_result[0]):
            return {}

    if isinstance(raw_result, dict):
        return raw_result

    json_attr = getattr(raw_result, "json", None)
    if isinstance(json_attr, dict):
        if "res" in json_attr and isinstance(json_attr["res"], dict):
            return json_attr["res"]
        return json_attr

    if hasattr(raw_result, "items"):
        try:
            return dict(raw_result.items())
        except Exception:
            return {}

    return {}


def normalize_ocr_lines(raw_result: Any) -> list[Any]:
    payload = extract_result_payload(raw_result)
    if not payload:
        return []

    rec_texts = payload.get("rec_texts") or []
    rec_scores = payload.get("rec_scores") or []
    rec_polys = payload.get("rec_polys") or []
    normalized_lines: list[Any] = []

    line_count = min(len(rec_texts), len(rec_scores), len(rec_polys))
    for index in range(line_count):
        normalized_lines.append((rec_polys[index], (rec_texts[index], rec_scores[index])))
    return normalized_lines


def round_point(value: float) -> float:
    return round(float(value), 1)


def to_bbox_points(raw_box: Any) -> list[list[float]]:
    points: list[list[float]] = []
    if isinstance(raw_box, np.ndarray):
        iterable = raw_box.tolist()
    elif isinstance(raw_box, (list, tuple)):
        iterable = raw_box
    else:
        return points

    for point in iterable:
        if isinstance(point, np.ndarray):
            point = point.tolist()
        if not isinstance(point, (list, tuple)) or len(point) < 2:
            continue
        points.append([round_point(point[0]), round_point(point[1])])
    return points


def translate_bbox_points(bbox: list[list[float]], *, x_offset: float = 0.0, y_offset: float = 0.0) -> list[list[float]]:
    return [[round_point(point[0] + x_offset), round_point(point[1] + y_offset)] for point in bbox]


def average(values: list[float]) -> float:
    return sum(values) / len(values) if values else 0.0


def axis_bucket(center: float, extent: int, labels: tuple[str, str, str]) -> str:
    if extent <= 0:
        return labels[1]
    ratio = center / extent
    if ratio < 1 / 3:
        return labels[0]
    if ratio < 2 / 3:
        return labels[1]
    return labels[2]


def classify_position(center_x: float, center_y: float, width: int, height: int) -> dict[str, Any]:
    horizontal = axis_bucket(center_x, width, ("left", "mid", "right"))
    vertical = axis_bucket(center_y, height, ("top", "mid", "bottom"))
    return {
        "label": f"{vertical}-{horizontal}",
        "vertical_band": vertical,
        "horizontal_band": horizontal,
        "center": {"x": round_point(center_x), "y": round_point(center_y)},
    }


def ensure_debug_dir() -> None:
    DEBUG_DIR.mkdir(parents=True, exist_ok=True)


def make_json_safe(value: Any) -> Any:
    if isinstance(value, (str, int, float, bool)) or value is None:
        return value
    if isinstance(value, Path):
        return str(value)
    if isinstance(value, np.ndarray):
        return value.tolist()
    if isinstance(value, np.generic):
        return value.item()
    if isinstance(value, dict):
        return {str(key): make_json_safe(item) for key, item in value.items()}
    if isinstance(value, (list, tuple, set)):
        return [make_json_safe(item) for item in value]
    if hasattr(value, "items"):
        try:
            return {str(key): make_json_safe(item) for key, item in value.items()}
        except Exception:
            pass
    return repr(value)


def summarize_payload(payload: dict[str, Any]) -> dict[str, Any]:
    if not isinstance(payload, dict):
        return {}
    summary: dict[str, Any] = {}
    for key in ("input_path", "page_index", "text_type", "text_rec_score_thresh", "return_word_box"):
        if key in payload:
            summary[key] = make_json_safe(payload[key])
    for key in ("rec_texts", "rec_scores", "rec_polys", "rec_boxes", "dt_polys", "textline_orientation_angles"):
        if key in payload:
            summary[key] = make_json_safe(payload[key])
    if "model_settings" in payload:
        summary["model_settings"] = make_json_safe(payload["model_settings"])
    if "text_det_params" in payload:
        summary["text_det_params"] = make_json_safe(payload["text_det_params"])
    return summary


def crop_to_focus_region(image_bgr: Any) -> tuple[Any, dict[str, int]]:
    image_height, image_width = image_bgr.shape[:2]
    left = max(0, min(OCR_FOCUS_LEFT - OCR_FOCUS_PADDING_LEFT, image_width - 1))
    right = max(left + 1, min(OCR_FOCUS_RIGHT + OCR_FOCUS_PADDING_RIGHT, image_width))
    top = max(0, min(OCR_FOCUS_TOP - OCR_FOCUS_PADDING_TOP, image_height - 1))
    bottom = max(top + 1, min(OCR_FOCUS_BOTTOM + OCR_FOCUS_PADDING_BOTTOM, image_height))
    focus_region = {
        "left": left,
        "top": top,
        "width": right - left,
        "height": bottom - top,
        "right": right,
        "bottom": bottom,
    }
    return image_bgr[top:bottom, left:right].copy(), focus_region


def compute_detection_side_len(image_bgr: Any) -> int:
    height, width = image_bgr.shape[:2]
    return max(PADDLEOCR_MIN_DET_SIDE_LEN, min(max(height, width), PADDLEOCR_UPSCALE_TARGET_MAX_SIDE))


def build_ocr_variants(image_bgr: Any, *, include_retry_variants: bool = False) -> list[dict[str, Any]]:
    height, width = image_bgr.shape[:2]
    cleaned = suppress_red_spellcheck_marks(image_bgr)
    variants: list[dict[str, Any]] = []

    def add_variant(label: str, variant_image: Any, *, scale: float = 1.0, phase: str = BASE_VARIANT_PHASE) -> None:
        variants.append(
            {
                "label": label,
                "image": variant_image,
                "scale": round(float(scale), 3),
                "retry_phase": phase,
            }
        )

    add_variant("original", image_bgr)
    add_variant("red_cleaned", cleaned)
    add_variant("gray_native", build_gray_variant(cleaned))
    add_variant("threshold_native", build_threshold_variant(cleaned))

    if include_retry_variants:
        contrast = build_contrast_variant(cleaned)
        add_variant("contrast_native", contrast, phase=RETRY_VARIANT_PHASE)
        add_variant("dark_text_native", build_dark_text_variant(contrast), phase=RETRY_VARIANT_PHASE)
        add_variant(
            "blue_text_native",
            build_color_text_variant(contrast, lower_hsv=(88, 45, 35), upper_hsv=(132, 255, 255)),
            phase=RETRY_VARIANT_PHASE,
        )
        add_variant(
            "green_text_native",
            build_color_text_variant(contrast, lower_hsv=(34, 35, 30), upper_hsv=(92, 255, 255)),
            phase=RETRY_VARIANT_PHASE,
        )

    max_side = max(height, width)
    if max_side < PADDLEOCR_UPSCALE_TARGET_MAX_SIDE:
        scale = min(PADDLEOCR_UPSCALE_TARGET_MAX_SIDE / max_side, PADDLEOCR_MAX_UPSCALE_FACTOR)
        if scale > 1.05:
            resized_cleaned = cv2.resize(cleaned, None, fx=scale, fy=scale, interpolation=cv2.INTER_CUBIC)
            add_variant(f"upscaled_{scale:.2f}x".replace(".", "_"), resized_cleaned, scale=scale, phase=RETRY_VARIANT_PHASE)
            add_variant(
                f"gray_{scale:.2f}x".replace(".", "_"),
                build_gray_variant(resized_cleaned),
                scale=scale,
                phase=RETRY_VARIANT_PHASE,
            )
            add_variant(
                f"threshold_{scale:.2f}x".replace(".", "_"),
                build_threshold_variant(resized_cleaned),
                scale=scale,
                phase=RETRY_VARIANT_PHASE,
            )
            if include_retry_variants and scale >= PADDLEOCR_COLOR_VARIANT_MIN_SCALE:
                contrast_resized = build_contrast_variant(resized_cleaned)
                add_variant(
                    f"dark_text_{scale:.2f}x".replace(".", "_"),
                    build_dark_text_variant(contrast_resized),
                    scale=scale,
                    phase=RETRY_VARIANT_PHASE,
                )
                add_variant(
                    f"blue_text_{scale:.2f}x".replace(".", "_"),
                    build_color_text_variant(contrast_resized, lower_hsv=(88, 45, 35), upper_hsv=(132, 255, 255)),
                    scale=scale,
                    phase=RETRY_VARIANT_PHASE,
                )
                add_variant(
                    f"green_text_{scale:.2f}x".replace(".", "_"),
                    build_color_text_variant(contrast_resized, lower_hsv=(34, 35, 30), upper_hsv=(92, 255, 255)),
                    scale=scale,
                    phase=RETRY_VARIANT_PHASE,
                )

    if include_retry_variants and max_side >= PADDLEOCR_UPSCALE_TARGET_MAX_SIDE:
        retry_scale = min(1.35, PADDLEOCR_MAX_UPSCALE_FACTOR)
        if retry_scale > 1.05:
            resized_retry = cv2.resize(cleaned, None, fx=retry_scale, fy=retry_scale, interpolation=cv2.INTER_CUBIC)
            add_variant(
                f"retry_upscaled_{retry_scale:.2f}x".replace(".", "_"),
                resized_retry,
                scale=retry_scale,
                phase=RETRY_VARIANT_PHASE,
            )
            add_variant(
                f"retry_threshold_{retry_scale:.2f}x".replace(".", "_"),
                build_threshold_variant(resized_retry),
                scale=retry_scale,
                phase=RETRY_VARIANT_PHASE,
            )

    return variants


def run_ocr_variant(ocr_instance: Any, variant: dict[str, Any]) -> dict[str, Any]:
    image_bgr = variant["image"]
    raw_result = ocr_instance.predict(
        image_bgr,
        use_doc_orientation_classify=PADDLEOCR_USE_DOC_ORIENTATION_CLASSIFY,
        use_doc_unwarping=PADDLEOCR_USE_DOC_UNWARPING,
        use_textline_orientation=PADDLEOCR_USE_TEXTLINE_ORIENTATION,
        text_det_limit_side_len=compute_detection_side_len(image_bgr),
        text_det_limit_type=PADDLEOCR_TEXT_DET_LIMIT_TYPE,
        text_det_thresh=PADDLEOCR_TEXT_DET_THRESH,
        text_det_box_thresh=PADDLEOCR_TEXT_DET_BOX_THRESH,
        text_rec_score_thresh=PADDLEOCR_TEXT_REC_SCORE_THRESH,
        return_word_box=False,
    )
    raw_lines = normalize_ocr_lines(raw_result)
    texts = [str(text_info[0]).strip() for _, text_info in raw_lines if str(text_info[0]).strip()]
    confidences = [float(text_info[1]) for _, text_info in raw_lines]
    return {
        "label": variant["label"],
        "scale": variant["scale"],
        "retry_phase": str(variant.get("retry_phase", BASE_VARIANT_PHASE)),
        "image": image_bgr,
        "raw_result": raw_result,
        "raw_line_count": len(texts),
        "texts": texts,
        "total_text_length": sum(len(text) for text in texts),
        "average_confidence": round(sum(confidences) / len(confidences), 4) if confidences else 0.0,
        "det_side_len": compute_detection_side_len(image_bgr),
        "det_limit_type": PADDLEOCR_TEXT_DET_LIMIT_TYPE,
        "image_size": {"width": int(image_bgr.shape[1]), "height": int(image_bgr.shape[0])},
        "payload": extract_result_payload(raw_result),
    }


def save_debug_artifacts(
    image_path: Path,
    focus_region: dict[str, int],
    variant_runs: list[dict[str, Any]],
    *,
    selected_variant_label: str,
    selected_transcript: dict[str, Any],
    variant_analyses: list[dict[str, Any]] | None = None,
) -> Path:
    ensure_debug_dir()
    debug_json_path = DEBUG_DIR / f"{image_path.stem}.json"
    analysis_by_label: dict[str, dict[str, Any]] = {}
    for analysis in variant_analyses or []:
        label = str(analysis.get("label", "")).strip()
        if label:
            analysis_by_label[label] = analysis
    debug_payload = {
        "timestamp": datetime.now().isoformat(timespec="seconds"),
        "source_image": str(image_path),
        "focus_region": focus_region,
        "selected_variant": selected_variant_label,
        "selected_transcript": make_json_safe(selected_transcript),
        "variants": [],
    }

    for variant_run in variant_runs:
        debug_variant = {
            "label": variant_run["label"],
            "scale": variant_run["scale"],
            "retry_phase": variant_run.get("retry_phase", BASE_VARIANT_PHASE),
            "image_size": variant_run["image_size"],
            "det_side_len": variant_run["det_side_len"],
            "det_limit_type": variant_run["det_limit_type"],
            "raw_line_count": variant_run["raw_line_count"],
            "total_text_length": variant_run["total_text_length"],
            "average_confidence": variant_run["average_confidence"],
            "texts": variant_run["texts"],
            "payload": summarize_payload(variant_run["payload"]),
        }
        analysis = analysis_by_label.get(str(variant_run["label"]))
        if analysis:
            debug_variant["selection_score"] = list(analysis.get("selection_score", ()))
            debug_variant["selected_transcript"] = make_json_safe(analysis.get("selected_transcript", {}))
        debug_image_path = DEBUG_DIR / f"{image_path.stem}__{variant_run['label']}.png"
        cv2.imwrite(str(debug_image_path), variant_run["image"])
        debug_variant["debug_image"] = str(debug_image_path)
        debug_payload["variants"].append(debug_variant)

    debug_json_path.write_text(json.dumps(debug_payload, indent=JSON_INDENT, ensure_ascii=False), encoding="utf-8")
    return debug_json_path


def choose_best_variant(variant_runs: list[dict[str, Any]]) -> dict[str, Any]:
    def score(item: dict[str, Any]) -> tuple[float, float, float, float]:
        raw_line_count = max(1, int(item["raw_line_count"]))
        average_chars_per_line = item["total_text_length"] / raw_line_count
        return (
            1.0 if item["raw_line_count"] > 0 else 0.0,
            average_chars_per_line,
            float(item["average_confidence"]),
            -float(raw_line_count),
        )

    return max(variant_runs, key=score)


def line_count_distance_from_expected(line_count: int) -> int:
    if 3 <= line_count <= 6:
        return 0
    if line_count < 3:
        return 3 - line_count
    return line_count - 6


def ocr_text_region(image_bgr: Any) -> dict[str, Any]:
    ocr_instance = load_paddleocr()
    variant_runs = [run_ocr_variant(ocr_instance, variant) for variant in build_ocr_variants(image_bgr)]
    best_variant = choose_best_variant(variant_runs)
    grouped_lines, raw_line_count = build_grouped_lines(
        best_variant["raw_result"],
        analysis_width=int(image_bgr.shape[1]),
        analysis_height=int(image_bgr.shape[0]),
        x_offset=0,
        y_offset=0,
    )
    grouped_text = " ".join(line["text"] for line in grouped_lines if line["text"]).strip()
    return {
        "text": grouped_text,
        "lines": grouped_lines,
        "raw_line_count": raw_line_count,
        "variant": best_variant["label"],
        "variant_runs": [
            {
                "label": variant_run["label"],
                "raw_line_count": variant_run["raw_line_count"],
                "total_text_length": variant_run["total_text_length"],
                "average_confidence": variant_run["average_confidence"],
                "det_side_len": variant_run["det_side_len"],
                "det_limit_type": variant_run["det_limit_type"],
            }
            for variant_run in variant_runs
        ],
    }


def bbox_metrics(bbox: list[list[float]]) -> dict[str, float]:
    xs = [point[0] for point in bbox]
    ys = [point[1] for point in bbox]
    min_x = min(xs)
    max_x = max(xs)
    min_y = min(ys)
    max_y = max(ys)
    return {
        "min_x": min_x,
        "max_x": max_x,
        "min_y": min_y,
        "max_y": max_y,
        "width": max_x - min_x,
        "height": max_y - min_y,
        "center_x": average(xs),
        "center_y": average(ys),
    }


def interval_gap(a_min: float, a_max: float, b_min: float, b_max: float) -> float:
    if a_max < b_min:
        return b_min - a_max
    if b_max < a_min:
        return a_min - b_max
    return 0.0


def interval_overlap(a_min: float, a_max: float, b_min: float, b_max: float) -> float:
    return max(0.0, min(a_max, b_max) - max(a_min, b_min))


def should_merge_segments(left: dict[str, Any], right: dict[str, Any]) -> bool:
    left_box = left["metrics"]
    right_box = right["metrics"]
    horizontal_gap = interval_gap(left_box["min_x"], left_box["max_x"], right_box["min_x"], right_box["max_x"])
    vertical_gap = interval_gap(left_box["min_y"], left_box["max_y"], right_box["min_y"], right_box["max_y"])
    horizontal_overlap = interval_overlap(left_box["min_x"], left_box["max_x"], right_box["min_x"], right_box["max_x"])
    vertical_overlap = interval_overlap(left_box["min_y"], left_box["max_y"], right_box["min_y"], right_box["max_y"])

    row_alignment = max(BLOCK_ROW_ALIGNMENT_PX, min(left_box["height"], right_box["height"]) * 0.7)
    same_row = vertical_overlap > 0 or abs(left_box["center_y"] - right_box["center_y"]) <= row_alignment
    close_horizontally = same_row and horizontal_gap <= max(BLOCK_HORIZONTAL_GAP_PX, min(left_box["height"], right_box["height"]) * 3.0)

    column_overlap_required = min(left_box["width"], right_box["width"]) * 0.15
    close_vertically = horizontal_overlap >= column_overlap_required and vertical_gap <= max(BLOCK_VERTICAL_GAP_PX, min(left_box["height"], right_box["height"]) * 1.8)

    return close_horizontally or close_vertically


def should_merge_row_segments(left: dict[str, Any], right: dict[str, Any]) -> bool:
    left_box = left["metrics"]
    right_box = right["metrics"]
    horizontal_gap = interval_gap(left_box["min_x"], left_box["max_x"], right_box["min_x"], right_box["max_x"])
    vertical_overlap = interval_overlap(left_box["min_y"], left_box["max_y"], right_box["min_y"], right_box["max_y"])
    min_height = min(left_box["height"], right_box["height"])
    row_alignment = max(6.0, min_height * 0.35)
    required_vertical_overlap = min_height * 0.35
    same_row = vertical_overlap >= required_vertical_overlap or abs(left_box["center_y"] - right_box["center_y"]) <= row_alignment
    return same_row and horizontal_gap <= max(BLOCK_HORIZONTAL_GAP_PX, min_height * 3.0)


def group_segments(segments: list[dict[str, Any]]) -> list[list[dict[str, Any]]]:
    if not segments:
        return []

    parent = list(range(len(segments)))

    def find(index: int) -> int:
        while parent[index] != index:
            parent[index] = parent[parent[index]]
            index = parent[index]
        return index

    def union(a_index: int, b_index: int) -> None:
        a_root = find(a_index)
        b_root = find(b_index)
        if a_root != b_root:
            parent[b_root] = a_root

    for left_index in range(len(segments)):
        for right_index in range(left_index + 1, len(segments)):
            if should_merge_segments(segments[left_index], segments[right_index]):
                union(left_index, right_index)

    grouped: dict[int, list[dict[str, Any]]] = defaultdict(list)
    for index, segment in enumerate(segments):
        grouped[find(index)].append(segment)

    return sorted(
        grouped.values(),
        key=lambda cluster: (
            min(item["metrics"]["min_y"] for item in cluster),
            min(item["metrics"]["min_x"] for item in cluster),
        ),
    )


def group_row_segments(segments: list[dict[str, Any]]) -> list[list[dict[str, Any]]]:
    if not segments:
        return []

    parent = list(range(len(segments)))

    def find(index: int) -> int:
        while parent[index] != index:
            parent[index] = parent[parent[index]]
            index = parent[index]
        return index

    def union(a_index: int, b_index: int) -> None:
        a_root = find(a_index)
        b_root = find(b_index)
        if a_root != b_root:
            parent[b_root] = a_root

    for left_index in range(len(segments)):
        for right_index in range(left_index + 1, len(segments)):
            if should_merge_row_segments(segments[left_index], segments[right_index]):
                union(left_index, right_index)

    grouped: dict[int, list[dict[str, Any]]] = defaultdict(list)
    for index, segment in enumerate(segments):
        grouped[find(index)].append(segment)

    return sorted(
        grouped.values(),
        key=lambda cluster: (
            min(item["metrics"]["min_y"] for item in cluster),
            min(item["metrics"]["min_x"] for item in cluster),
        ),
    )


def merge_cluster(cluster: list[dict[str, Any]], analysis_width: int, analysis_height: int, x_offset: int, y_offset: int) -> dict[str, Any]:
    cluster = sorted(cluster, key=lambda item: (item["metrics"]["min_y"], item["metrics"]["min_x"]))
    rows: list[list[dict[str, Any]]] = []

    for item in cluster:
        if not rows:
            rows.append([item])
            continue
        previous_row = rows[-1]
        previous_center_y = average([entry["metrics"]["center_y"] for entry in previous_row])
        row_tolerance = max(BLOCK_ROW_ALIGNMENT_PX, average([entry["metrics"]["height"] for entry in previous_row]) * 0.8)
        if abs(item["metrics"]["center_y"] - previous_center_y) <= row_tolerance:
            previous_row.append(item)
        else:
            rows.append([item])

    row_texts: list[str] = []
    for row in rows:
        row = sorted(row, key=lambda item: item["metrics"]["min_x"])
        row_text = " ".join(item["text"] for item in row if item["text"])
        if row_text:
            row_texts.append(row_text)

    merged_text = "\n".join(row_texts).strip()
    all_bbox_points = [point for item in cluster for point in item["bbox"]]
    min_x = min(point[0] for point in all_bbox_points)
    max_x = max(point[0] for point in all_bbox_points)
    min_y = min(point[1] for point in all_bbox_points)
    max_y = max(point[1] for point in all_bbox_points)
    bbox = [
        [round_point(min_x + x_offset), round_point(min_y + y_offset)],
        [round_point(max_x + x_offset), round_point(min_y + y_offset)],
        [round_point(max_x + x_offset), round_point(max_y + y_offset)],
        [round_point(min_x + x_offset), round_point(max_y + y_offset)],
    ]
    position = classify_position((min_x + max_x) / 2, (min_y + max_y) / 2, analysis_width, analysis_height)
    average_confidence = average([item["confidence"] for item in cluster])

    return {
        "text": merged_text,
        "confidence": round(average_confidence, 4),
        "bbox": bbox,
        "position": position,
        "raw_item_count": len(cluster),
    }


def build_grouped_lines(raw_result: Any, *, analysis_width: int, analysis_height: int, x_offset: int, y_offset: int) -> tuple[list[dict[str, Any]], int]:
    raw_lines = normalize_ocr_lines(raw_result)
    segments: list[dict[str, Any]] = []

    for raw_box, text_info in raw_lines:
        bbox = to_bbox_points(raw_box)
        if not bbox:
            continue
        text = normalize_token_text(str(text_info[0]))
        confidence = float(text_info[1])
        if is_noise_token(text, confidence):
            continue
        metrics = bbox_metrics(bbox)
        segments.append({"text": text, "confidence": confidence, "bbox": bbox, "metrics": metrics})

    grouped_lines = [merge_cluster(cluster, analysis_width, analysis_height, x_offset, y_offset) for cluster in group_segments(segments)]
    grouped_lines = [item for item in grouped_lines if item["text"]]
    return grouped_lines, len(segments)


def build_row_lines(raw_result: Any, *, analysis_width: int, analysis_height: int, x_offset: int, y_offset: int) -> list[dict[str, Any]]:
    raw_lines = normalize_ocr_lines(raw_result)
    segments: list[dict[str, Any]] = []

    for raw_box, text_info in raw_lines:
        bbox = to_bbox_points(raw_box)
        if not bbox:
            continue
        text = normalize_token_text(str(text_info[0]))
        confidence = float(text_info[1])
        if is_noise_token(text, confidence):
            continue
        metrics = bbox_metrics(bbox)
        segments.append({"text": text, "confidence": confidence, "bbox": bbox, "metrics": metrics})

    row_lines = [merge_cluster(cluster, analysis_width, analysis_height, x_offset, y_offset) for cluster in group_row_segments(segments)]
    return [item for item in row_lines if item["text"]]


def is_price_like_line(text: str) -> bool:
    normalized = normalize_token_text(text)
    if not normalized:
        return False
    if PRICE_LIKE_PATTERN.search(normalized):
        return True

    digit_count = len(re.findall(r"\d", normalized))
    if digit_count < 2:
        return False

    token_count = len(normalized.split())
    if token_count > 4:
        return False

    alpha_count = len(re.findall(r"[A-Za-z]", normalized))
    if alpha_count > 1 and not re.search(r"[.,]", normalized):
        if not (
            re.search(r"[A-Za-z]{1,4}\s+\d", normalized)
            or re.search(r"\d\s+[A-Za-z]{1,4}\b", normalized)
        ):
            return False

    return True


def is_retailer_like_line(text: str) -> bool:
    normalized = normalize_token_text(text)
    if not normalized or is_price_like_line(normalized) or not re.search(r"[A-Za-z]", normalized):
        return False

    token_count = len(normalized.split())
    return token_count <= 4 or "." in normalized or normalized.isupper()


def has_letter_character(text: str) -> bool:
    return bool(re.search(r"[A-Za-z]", normalize_token_text(text)))


def analyze_line_color_hint(line: dict[str, Any], source_image_bgr: Any | None) -> dict[str, Any]:
    if source_image_bgr is None:
        return {"dominant": "unknown", "ratios": {}, "ink_pixel_count": 0}

    bbox = line.get("bbox")
    if not isinstance(bbox, list) or not bbox:
        return {"dominant": "unknown", "ratios": {}, "ink_pixel_count": 0}

    metrics = bbox_metrics(bbox)
    min_x = max(0, int(np.floor(metrics["min_x"])))
    max_x = min(int(source_image_bgr.shape[1]), int(np.ceil(metrics["max_x"])))
    min_y = max(0, int(np.floor(metrics["min_y"])))
    max_y = min(int(source_image_bgr.shape[0]), int(np.ceil(metrics["max_y"])))
    if max_x <= min_x or max_y <= min_y:
        return {"dominant": "unknown", "ratios": {}, "ink_pixel_count": 0}

    crop = source_image_bgr[min_y:max_y, min_x:max_x]
    if crop.size == 0:
        return {"dominant": "unknown", "ratios": {}, "ink_pixel_count": 0}

    hsv = cv2.cvtColor(crop, cv2.COLOR_BGR2HSV)
    gray = cv2.cvtColor(crop, cv2.COLOR_BGR2GRAY)
    ink_mask = gray < 245
    ink_pixel_count = int(np.count_nonzero(ink_mask))
    if ink_pixel_count <= 0:
        return {"dominant": "unknown", "ratios": {}, "ink_pixel_count": 0}

    blue_mask = ink_mask & (hsv[..., 0] >= 88) & (hsv[..., 0] <= 132) & (hsv[..., 1] >= 40)
    green_mask = ink_mask & (hsv[..., 0] >= 34) & (hsv[..., 0] <= 92) & (hsv[..., 1] >= 35)
    dark_mask = ink_mask & (hsv[..., 1] <= 80) & (hsv[..., 2] <= 165)

    ratios = {
        "blue": round(float(np.count_nonzero(blue_mask)) / ink_pixel_count, 3),
        "green": round(float(np.count_nonzero(green_mask)) / ink_pixel_count, 3),
        "dark": round(float(np.count_nonzero(dark_mask)) / ink_pixel_count, 3),
    }
    dominant = max(ratios, key=ratios.get)
    dominant_ratio = ratios[dominant]
    if dominant_ratio < 0.22:
        dominant = "other"

    return {
        "dominant": dominant,
        "dominant_ratio": dominant_ratio,
        "ratios": ratios,
        "ink_pixel_count": ink_pixel_count,
    }


def analyze_product_signature(bottom_block_lines: list[dict[str, Any]], *, source_image_bgr: Any | None = None) -> dict[str, Any]:
    normalized_lines = [normalize_token_text(str(line.get("text", ""))) for line in bottom_block_lines if isinstance(line, dict)]
    normalized_lines = [line for line in normalized_lines if line]
    line_color_hints = [analyze_line_color_hint(line, source_image_bgr) for line in bottom_block_lines if isinstance(line, dict)]

    price_line_indexes = [index for index, line in enumerate(normalized_lines) if is_price_like_line(line)]
    has_title_like_first_line = bool(
        normalized_lines
        and len(normalized_lines[0]) >= 8
        and not is_price_like_line(normalized_lines[0])
        and re.search(r"[A-Za-z]", normalized_lines[0])
    )
    has_retailer_like_bottom_line = bool(normalized_lines and is_retailer_like_line(normalized_lines[-1]))
    has_green_like_retailer_line = bool(line_color_hints and line_color_hints[-1].get("dominant") == "green")
    retailer_index = len(normalized_lines) - 1 if normalized_lines else None

    dark_price_line_indexes = [
        index
        for index in price_line_indexes
        if retailer_index is not None
        and index < retailer_index
        and index < len(line_color_hints)
        and line_color_hints[index].get("dominant") == "dark"
    ]
    price_anchor_index = dark_price_line_indexes[-1] if dark_price_line_indexes else None
    if price_anchor_index is None and retailer_index is not None:
        fallback_price_indexes = [index for index in price_line_indexes if index < retailer_index]
        price_anchor_index = fallback_price_indexes[-1] if fallback_price_indexes else None

    has_price_like_line_above_retailer = bool(price_anchor_index is not None and retailer_index is not None and price_anchor_index < retailer_index)
    has_dark_like_price_line = bool(
        price_anchor_index is not None
        and price_anchor_index < len(line_color_hints)
        and line_color_hints[price_anchor_index].get("dominant") == "dark"
    )
    blue_title_line_indexes = [
        index
        for index in range(price_anchor_index if price_anchor_index is not None else 0)
        if index < len(line_color_hints) and line_color_hints[index].get("dominant") == "blue"
    ]
    has_blue_like_title_line = bool(blue_title_line_indexes)
    has_lettered_blue_title_line = any(
        index < len(normalized_lines) and has_letter_character(normalized_lines[index]) for index in blue_title_line_indexes
    )

    reasons: list[str] = []
    line_count = len(normalized_lines)
    if line_count < 3 or line_count > 6:
        reasons.append(f"expected 3-6 product lines, got {line_count}")
    if not has_price_like_line_above_retailer:
        reasons.append("missing price-like line above retailer")
    if not has_dark_like_price_line:
        reasons.append("missing dark price-like line above retailer")
    if not has_retailer_like_bottom_line:
        reasons.append("missing retailer-like bottom line")
    if not has_green_like_retailer_line:
        reasons.append("missing green retailer line")
    if not has_blue_like_title_line:
        reasons.append("missing blue title line above price")
    if not has_lettered_blue_title_line:
        reasons.append("missing letters in blue title lines")

    return {
        "is_complete_like": not reasons,
        "line_count": line_count,
        "price_line_indexes": price_line_indexes,
        "dark_price_line_indexes": dark_price_line_indexes,
        "price_anchor_index": price_anchor_index,
        "blue_title_line_indexes": blue_title_line_indexes,
        "has_title_like_first_line": has_title_like_first_line,
        "has_price_like_line_above_retailer": has_price_like_line_above_retailer,
        "has_retailer_like_bottom_line": has_retailer_like_bottom_line,
        "has_blue_like_title_line": has_blue_like_title_line,
        "has_lettered_blue_title_line": has_lettered_blue_title_line,
        "has_dark_like_price_line": has_dark_like_price_line,
        "has_green_like_retailer_line": has_green_like_retailer_line,
        "line_color_hints": line_color_hints,
        "reasons": reasons,
    }


def build_selected_transcript(
    raw_result: Any,
    *,
    analysis_width: int,
    analysis_height: int,
    x_offset: int,
    y_offset: int,
    source_image_bgr: Any | None = None,
) -> dict[str, Any]:
    row_lines = build_row_lines(
        raw_result,
        analysis_width=analysis_width,
        analysis_height=analysis_height,
        x_offset=x_offset,
        y_offset=y_offset,
    )
    if not row_lines:
        return {
            "strategy": "bottom_block_plus_query",
            "gap_threshold_px": BOTTOM_BLOCK_VERTICAL_GAP_PX,
            "query_prefix": QUERY_LINE_PREFIX,
            "text": "",
            "query_line": None,
            "bottom_block_text": "",
            "selected_lines": [],
            "bottom_block_lines": [],
            "row_lines": [],
        }

    def line_metrics(line: dict[str, Any]) -> dict[str, float]:
        return bbox_metrics(line["bbox"])

    ordered_rows = sorted(
        row_lines,
        key=lambda line: (
            line_metrics(line)["min_y"],
            line_metrics(line)["min_x"],
        ),
    )
    rows_with_metrics = [{"line": line, "metrics": line_metrics(line)} for line in ordered_rows]

    selected_bottom_block: list[dict[str, Any]] = [rows_with_metrics[-1]]
    current_top = rows_with_metrics[-1]["metrics"]["min_y"]
    first_excluded_above_bottom_block: dict[str, Any] | None = None

    for candidate in reversed(rows_with_metrics[:-1]):
        gap_to_current = current_top - candidate["metrics"]["max_y"]
        if gap_to_current > BOTTOM_BLOCK_VERTICAL_GAP_PX:
            first_excluded_above_bottom_block = {
                "line": candidate["line"],
                "gap_px": round_point(gap_to_current),
            }
            break
        selected_bottom_block.insert(0, candidate)
        current_top = candidate["metrics"]["min_y"]

    query_match = next(
        (
            item
            for item in rows_with_metrics
            if normalize_token_text(item["line"]["text"]).casefold().startswith(QUERY_LINE_PREFIX)
        ),
        None,
    )

    selected_items = list(selected_bottom_block)
    if query_match is not None and all(query_match["line"] is not item["line"] for item in selected_items):
        selected_items.insert(0, query_match)
        selected_items = sorted(selected_items, key=lambda item: (item["metrics"]["min_y"], item["metrics"]["min_x"]))

    selected_lines = [item["line"] for item in selected_items]
    bottom_block_lines = [item["line"] for item in selected_bottom_block]
    product_signature = analyze_product_signature(bottom_block_lines, source_image_bgr=source_image_bgr)

    return {
        "strategy": "bottom_block_plus_query",
        "gap_threshold_px": BOTTOM_BLOCK_VERTICAL_GAP_PX,
        "query_prefix": QUERY_LINE_PREFIX,
        "text": "\n".join(line["text"] for line in selected_lines if line["text"]).strip(),
        "query_line": query_match["line"] if query_match is not None else None,
        "bottom_block_text": "\n".join(line["text"] for line in bottom_block_lines if line["text"]).strip(),
        "selected_lines": selected_lines,
        "bottom_block_lines": bottom_block_lines,
        "product_signature": product_signature,
        "first_excluded_above_bottom_block": first_excluded_above_bottom_block,
        "row_lines": ordered_rows,
    }


def score_capture_attempt(variant_run: dict[str, Any], selected_transcript: dict[str, Any]) -> tuple[float, ...]:
    product_signature = selected_transcript.get("product_signature", {})
    line_count = int(product_signature.get("line_count", 0) or 0) if isinstance(product_signature, dict) else 0
    return (
        1.0 if bool(product_signature.get("is_complete_like", False)) else 0.0,
        1.0 if selected_transcript.get("query_line") else 0.0,
        1.0 if bool(product_signature.get("has_title_like_first_line", False)) else 0.0,
        1.0 if bool(product_signature.get("has_price_like_line_above_retailer", False)) else 0.0,
        1.0 if bool(product_signature.get("has_retailer_like_bottom_line", False)) else 0.0,
        1.0 if bool(product_signature.get("has_blue_like_title_line", False)) else 0.0,
        1.0 if bool(product_signature.get("has_lettered_blue_title_line", False)) else 0.0,
        1.0 if bool(product_signature.get("has_dark_like_price_line", False)) else 0.0,
        1.0 if bool(product_signature.get("has_green_like_retailer_line", False)) else 0.0,
        -float(line_count_distance_from_expected(line_count)),
        float(line_count),
        float(len(str(selected_transcript.get("bottom_block_text", "")))),
        float(variant_run.get("average_confidence", 0.0)),
        float(variant_run.get("total_text_length", 0)),
        -float(variant_run.get("raw_line_count", 0)),
    )


def evaluate_capture_variant(
    variant_run: dict[str, Any],
    *,
    analysis_width: int,
    analysis_height: int,
    x_offset: int,
    y_offset: int,
    source_image_bgr: Any,
) -> dict[str, Any]:
    selected_transcript = build_selected_transcript(
        variant_run["raw_result"],
        analysis_width=analysis_width,
        analysis_height=analysis_height,
        x_offset=x_offset,
        y_offset=y_offset,
        source_image_bgr=source_image_bgr,
    )
    selection_score = score_capture_attempt(variant_run, selected_transcript)
    return {
        "label": variant_run["label"],
        "retry_phase": variant_run.get("retry_phase", BASE_VARIANT_PHASE),
        "variant_run": variant_run,
        "selected_transcript": selected_transcript,
        "selection_score": selection_score,
    }


def choose_best_capture_attempt(variant_analyses: list[dict[str, Any]]) -> dict[str, Any]:
    return max(variant_analyses, key=lambda item: tuple(float(value) for value in item.get("selection_score", ())))


def should_retry_capture_attempt(best_attempt: dict[str, Any]) -> bool:
    selected_transcript = best_attempt.get("selected_transcript", {})
    product_signature = selected_transcript.get("product_signature", {}) if isinstance(selected_transcript, dict) else {}
    if not isinstance(product_signature, dict):
        return True
    if not selected_transcript.get("query_line"):
        return True
    if not str(selected_transcript.get("bottom_block_text", "")).strip():
        return True
    return not bool(product_signature.get("is_complete_like", False))


def build_entry(
    image_path: Path,
    full_image_bgr: Any,
    raw_result: Any,
    *,
    focus_region: dict[str, int],
    variant_label: str,
    variant_runs: list[dict[str, Any]],
    debug_json_path: Path,
    selected_transcript: dict[str, Any],
) -> dict[str, Any]:
    analysis_width = focus_region["width"]
    analysis_height = focus_region["height"]
    grouped_lines, raw_line_count = build_grouped_lines(
        raw_result,
        analysis_width=analysis_width,
        analysis_height=analysis_height,
        x_offset=focus_region["left"],
        y_offset=focus_region["top"],
    )
    texts_by_region: dict[str, list[str]] = defaultdict(list)
    for line in grouped_lines:
        texts_by_region[line["position"]["label"]].append(line["text"])

    ordered_summary = {
        label: texts_by_region[label]
        for label in (
            "top-left",
            "top-mid",
            "top-right",
            "mid-left",
            "mid-mid",
            "mid-right",
            "bottom-left",
            "bottom-mid",
            "bottom-right",
        )
        if texts_by_region.get(label)
    }

    return {
        "timestamp": datetime.now().isoformat(timespec="seconds"),
        "source_image": str(image_path),
        "image_size": {"width": int(full_image_bgr.shape[1]), "height": int(full_image_bgr.shape[0])},
        "focus_region": focus_region,
        "ocr_variant": variant_label,
        "ocr_debug_path": str(debug_json_path),
        "ocr_variants_tried": [
            {
                "label": variant_run["label"],
                "raw_line_count": variant_run["raw_line_count"],
                "total_text_length": variant_run["total_text_length"],
                "average_confidence": variant_run["average_confidence"],
                "image_size": variant_run["image_size"],
                "det_side_len": variant_run["det_side_len"],
                "det_limit_type": variant_run["det_limit_type"],
            }
            for variant_run in variant_runs
        ],
        "raw_line_count": raw_line_count,
        "selected_transcript": selected_transcript,
        "summary_by_region": ordered_summary,
        "lines": grouped_lines,
    }


def append_entry(results: dict[str, Any], entry: dict[str, Any]) -> None:
    timestamp = datetime.fromisoformat(entry["timestamp"])
    day_key = timestamp.strftime("%Y-%m-%d")
    hour_key = timestamp.strftime("%H")
    day_group = results["entries_by_day"].setdefault(day_key, {})
    if not isinstance(day_group, dict):
        day_group = {}
        results["entries_by_day"][day_key] = day_group
    hour_group = day_group.setdefault(hour_key, [])
    if not isinstance(hour_group, list):
        hour_group = []
        day_group[hour_key] = hour_group
    hour_group.append(entry)


def process_image_path(
    image_path: Path,
    *,
    ocr: Any | None = None,
    results: dict[str, Any] | None = None,
    pre_cropped_focus_region: dict[str, Any] | None = None,
) -> dict[str, Any]:
    ocr_instance = ocr if ocr is not None else load_paddleocr()
    result_store = results if results is not None else load_results(OUTPUT_PATH)

    image_bgr = cv2.imread(str(image_path), cv2.IMREAD_COLOR)
    if image_bgr is None:
        raise RuntimeError(f"Unable to read image: {image_path}")

    if pre_cropped_focus_region is None:
        focus_image_bgr, focus_region = crop_to_focus_region(image_bgr)
        source_image_bgr = image_bgr
    else:
        focus_image_bgr = image_bgr
        focus_region = pre_cropped_focus_region
        source_image_bgr = image_bgr

    variant_runs = [run_ocr_variant(ocr_instance, variant) for variant in build_ocr_variants(focus_image_bgr)]
    variant_analyses = [
        evaluate_capture_variant(
            variant_run,
            analysis_width=focus_region["width"],
            analysis_height=focus_region["height"],
            x_offset=focus_region["left"],
            y_offset=focus_region["top"],
            source_image_bgr=source_image_bgr,
        )
        for variant_run in variant_runs
    ]
    best_attempt = choose_best_capture_attempt(variant_analyses)
    retry_attempted = False
    if should_retry_capture_attempt(best_attempt):
        retry_attempted = True
        existing_labels = {str(variant_run["label"]) for variant_run in variant_runs}
        retry_variants = [
            variant
            for variant in build_ocr_variants(focus_image_bgr, include_retry_variants=True)
            if str(variant["label"]) not in existing_labels
        ]
        retry_runs = [run_ocr_variant(ocr_instance, variant) for variant in retry_variants]
        variant_runs.extend(retry_runs)
        variant_analyses.extend(
            evaluate_capture_variant(
                variant_run,
                analysis_width=focus_region["width"],
                analysis_height=focus_region["height"],
                x_offset=focus_region["left"],
                y_offset=focus_region["top"],
                source_image_bgr=source_image_bgr,
            )
            for variant_run in retry_runs
        )
        best_attempt = choose_best_capture_attempt(variant_analyses)

    best_variant = best_attempt["variant_run"]
    selected_transcript = dict(best_attempt["selected_transcript"])
    selected_transcript["retry_attempted"] = retry_attempted
    selected_transcript["selected_variant_retry_phase"] = str(best_variant.get("retry_phase", BASE_VARIANT_PHASE))
    debug_json_path = save_debug_artifacts(
        image_path,
        focus_region,
        variant_runs,
        selected_variant_label=best_variant["label"],
        selected_transcript=selected_transcript,
        variant_analyses=variant_analyses,
    )
    entry = build_entry(
        image_path,
        source_image_bgr,
        best_variant["raw_result"],
        focus_region=focus_region,
        variant_label=best_variant["label"],
        variant_runs=variant_runs,
        debug_json_path=debug_json_path,
        selected_transcript=selected_transcript,
    )
    append_entry(result_store, entry)
    if results is None:
        save_results(OUTPUT_PATH, result_store)
    return entry


def save_manual_capture_image(image_bgr: Any, *, prefix: str = DEFAULT_CAPTURE_PREFIX) -> Path:
    INPUT_DIR.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
    image_path = INPUT_DIR / f"{prefix}_{timestamp}.png"
    if not cv2.imwrite(str(image_path), image_bgr):
        raise RuntimeError(f"Failed to save manual screenshot to {image_path}")
    return image_path


def capture_and_process_image(image_bgr: Any, *, prefix: str = DEFAULT_CAPTURE_PREFIX) -> dict[str, Any]:
    focus_image_bgr, screen_focus_region = crop_to_focus_region(image_bgr)
    image_path = save_manual_capture_image(focus_image_bgr, prefix=prefix)
    results = load_results(OUTPUT_PATH)
    entry = process_image_path(
        image_path,
        results=results,
        pre_cropped_focus_region={
            "left": 0,
            "top": 0,
            "width": int(focus_image_bgr.shape[1]),
            "height": int(focus_image_bgr.shape[0]),
            "right": int(focus_image_bgr.shape[1]),
            "bottom": int(focus_image_bgr.shape[0]),
            "source_screen_region": screen_focus_region,
        },
    )
    save_results(OUTPUT_PATH, results)
    return {"image_path": image_path, "entry": entry}


def main(argv: list[str]) -> int:
    image_paths = iter_input_images(argv)
    if not image_paths:
        print(f"No input images found. Put screenshots in {INPUT_DIR} or pass file paths.", flush=True)
        return 1

    ocr = load_paddleocr()
    results = load_results(OUTPUT_PATH)

    processed_count = 0
    for image_path in image_paths:
        entry = process_image_path(image_path, ocr=ocr, results=results)
        processed_count += 1
        print(
            f"Processed {image_path.name}: {len(entry['lines'])} grouped blocks from {entry['raw_line_count']} raw lines via {entry['ocr_variant']} -> {OUTPUT_PATH.name}",
            flush=True,
        )

    save_results(OUTPUT_PATH, results)
    print(f"Saved {processed_count} OCR entr{'y' if processed_count == 1 else 'ies'} to {OUTPUT_PATH}", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
