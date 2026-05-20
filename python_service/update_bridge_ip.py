from __future__ import annotations

import sys

import bridge_ip_config


def main() -> int:
    requested_ip = sys.argv[1].strip() if len(sys.argv) > 1 else ""
    detected = None if requested_ip else bridge_ip_config.detect_lan_ipv4_from_ipconfig()
    ipv4 = requested_ip or (detected.ipv4 if detected is not None else "")

    if not ipv4:
        print("Could not detect a LAN IPv4 address from ipconfig.")
        print("Pass the IP explicitly, for example: python update_bridge_ip.py 192.168.0.34")
        return 1

    try:
        changed_paths = bridge_ip_config.update_bridge_ip(ipv4)
    except ValueError as exc:
        print(str(exc))
        return 1

    if detected is not None:
        print(f"Detected {detected.ipv4} on {detected.adapter_name} with gateway {detected.gateway}.")
    if changed_paths:
        print(f"Updated bridge IP to {ipv4}:")
        for path in changed_paths:
            print(f"- {path.relative_to(bridge_ip_config.REPO_ROOT)}")
        print("Reload the unpacked Chrome extension after changing the IP.")
    else:
        print(f"Bridge IP is already {ipv4}.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
