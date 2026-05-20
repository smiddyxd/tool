from __future__ import annotations

import json
import re
import subprocess
from dataclasses import dataclass
from ipaddress import ip_address
from pathlib import Path
from typing import Any

REPO_ROOT = Path(__file__).resolve().parent.parent
SERVICE_WORKER_PATH = REPO_ROOT / "chrome_extension" / "service_worker.js"
MANIFEST_PATH = REPO_ROOT / "chrome_extension" / "manifest.json"
README_PATH = REPO_ROOT / "README.md"
IPV4_RE = re.compile(r"\b(?:\d{1,3}\.){3}\d{1,3}\b")
SERVICE_WORKER_BRIDGE_RE = re.compile(
    r'(const\s+BRIDGE_BASE_URL\s*=\s*"http://)([^":/]+)(?::(\d+))?(";)',
)
LAN_HOST_PERMISSION_RE = re.compile(r"^http://((?:\d{1,3}\.){3}\d{1,3})/\*$")


@dataclass(frozen=True)
class LanIpDetection:
    ipv4: str
    adapter_name: str
    gateway: str


@dataclass(frozen=True)
class BridgeEndpointConfig:
    host: str
    port: int | None


def extract_ipv4s(text: str) -> list[str]:
    return [candidate for candidate in IPV4_RE.findall(text) if is_usable_ipv4(candidate)]


def is_usable_ipv4(value: str) -> bool:
    try:
        parsed = ip_address(value)
    except ValueError:
        return False
    return (
        parsed.version == 4
        and not parsed.is_loopback
        and not parsed.is_link_local
        and not parsed.is_unspecified
    )


def split_ipconfig_sections(output: str) -> list[tuple[str, list[str]]]:
    sections: list[tuple[str, list[str]]] = []
    current_title = ""
    current_lines: list[str] = []

    for raw_line in output.splitlines():
        line = raw_line.rstrip()
        if line and not line[0].isspace() and line.endswith(":"):
            if current_title:
                sections.append((current_title, current_lines))
            current_title = line[:-1].strip()
            current_lines = []
        elif current_title:
            current_lines.append(line)

    if current_title:
        sections.append((current_title, current_lines))
    return sections


def extract_gateway_ipv4(lines: list[str]) -> str:
    for index, line in enumerate(lines):
        if "Default Gateway" not in line:
            continue

        after_colon = line.split(":", 1)[1] if ":" in line else line
        gateway_ips = extract_ipv4s(after_colon)
        if gateway_ips:
            return gateway_ips[0]

        for continuation in lines[index + 1 : index + 5]:
            stripped = continuation.strip()
            if not stripped:
                continue
            if " . " in continuation:
                break
            gateway_ips = extract_ipv4s(stripped)
            if gateway_ips:
                return gateway_ips[0]

    return ""


def extract_section_ipv4(lines: list[str]) -> str:
    for line in lines:
        if "IPv4" not in line:
            continue
        ips = extract_ipv4s(line)
        if ips:
            return ips[0]
    return ""


def detect_lan_ipv4_from_ipconfig() -> LanIpDetection | None:
    try:
        completed = subprocess.run(
            ["ipconfig"],
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            timeout=10,
            check=False,
        )
    except Exception:
        return None

    output = f"{completed.stdout}\n{completed.stderr}"
    for adapter_name, lines in split_ipconfig_sections(output):
        gateway = extract_gateway_ipv4(lines)
        if not gateway:
            continue
        ipv4 = extract_section_ipv4(lines)
        if ipv4:
            return LanIpDetection(ipv4=ipv4, adapter_name=adapter_name, gateway=gateway)
    return None


def read_service_worker_bridge_endpoint(path: Path = SERVICE_WORKER_PATH) -> BridgeEndpointConfig | None:
    try:
        text = path.read_text(encoding="utf-8")
    except FileNotFoundError:
        return None

    match = SERVICE_WORKER_BRIDGE_RE.search(text)
    if not match:
        return None

    port_text = match.group(3)
    return BridgeEndpointConfig(
        host=match.group(2),
        port=int(port_text) if port_text and port_text.isdigit() else None,
    )


def update_service_worker_bridge_ip(ipv4: str, path: Path = SERVICE_WORKER_PATH) -> bool:
    text = path.read_text(encoding="utf-8")

    def replace(match: re.Match[str]) -> str:
        port = match.group(3) or ""
        port_segment = f":{port}" if port else ""
        return f"{match.group(1)}{ipv4}{port_segment}{match.group(4)}"

    updated = SERVICE_WORKER_BRIDGE_RE.sub(replace, text, count=1)
    if updated == text:
        return False
    path.write_text(updated, encoding="utf-8")
    return True


def update_manifest_bridge_host_permission(ipv4: str, path: Path = MANIFEST_PATH) -> bool:
    manifest = json.loads(path.read_text(encoding="utf-8"))
    host_permissions = manifest.get("host_permissions")
    if not isinstance(host_permissions, list):
        return False

    next_host_permissions: list[Any] = []
    inserted_lan_host = False
    target = f"http://{ipv4}/*"
    changed = False

    for permission in host_permissions:
        permission_match = LAN_HOST_PERMISSION_RE.fullmatch(permission) if isinstance(permission, str) else None
        if permission_match and is_usable_ipv4(permission_match.group(1)):
            if not inserted_lan_host:
                next_host_permissions.append(target)
                inserted_lan_host = True
            changed = changed or permission != target
            continue
        next_host_permissions.append(permission)

    if not inserted_lan_host:
        next_host_permissions.append(target)
        changed = True

    if not changed:
        return False

    manifest["host_permissions"] = next_host_permissions
    path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return True


def update_readme_bridge_ip(ipv4: str, path: Path = README_PATH, port: int | None = None) -> bool:
    text = path.read_text(encoding="utf-8")
    updated = text
    if port is not None:
        updated = re.sub(
            rf"http://((?:\d{{1,3}}\.){{3}}\d{{1,3}}):{port}",
            lambda match: f"http://{ipv4}:{port}" if is_usable_ipv4(match.group(1)) else match.group(0),
            updated,
        )
    updated = re.sub(
        r"http://((?:\d{1,3}\.){3}\d{1,3})/\*",
        lambda match: f"http://{ipv4}/*" if is_usable_ipv4(match.group(1)) else match.group(0),
        updated,
    )
    updated = re.sub(
        r"current detected IP is `((?:\d{1,3}\.){3}\d{1,3})`",
        lambda match: f"current detected IP is `{ipv4}`" if is_usable_ipv4(match.group(1)) else match.group(0),
        updated,
    )
    if updated == text:
        return False
    path.write_text(updated, encoding="utf-8")
    return True


def update_bridge_ip(ipv4: str, port: int | None = None) -> list[Path]:
    if not is_usable_ipv4(ipv4):
        raise ValueError(f"Not a usable IPv4 address: {ipv4}")

    endpoint = read_service_worker_bridge_endpoint()
    effective_port = port if port is not None else endpoint.port if endpoint is not None else None
    changed_paths: list[Path] = []

    if update_service_worker_bridge_ip(ipv4):
        changed_paths.append(SERVICE_WORKER_PATH)
    if update_manifest_bridge_host_permission(ipv4):
        changed_paths.append(MANIFEST_PATH)
    if update_readme_bridge_ip(ipv4, port=effective_port):
        changed_paths.append(README_PATH)
    return changed_paths
