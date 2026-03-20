#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PYTHON_EXE="$SCRIPT_DIR/.venv/Scripts/python.exe"
BRIDGE_SCRIPT="$SCRIPT_DIR/screen_bridge.py"

get_bridge_port() {
  grep -E 'HTTP_PORT\s*=\s*[0-9]+' "$BRIDGE_SCRIPT" | sed -E 's/.*=\s*([0-9]+).*/\1/' | head -n 1
}

stop_stale_bridge_listeners() {
  local port="$1"
  mapfile -t pids < <(netstat -ano | grep "127.0.0.1:$port" | awk '$4 == "LISTENING" { print $5 }' | sort -u)

  for pid in "${pids[@]:-}"; do
    [[ -z "$pid" ]] && continue
    echo "Stopping process listening on port $port (PID $pid)..."
    cmd.exe /c taskkill /PID "$pid" /F >/dev/null
  done
}

BRIDGE_PORT="$(get_bridge_port)"
stop_stale_bridge_listeners "$BRIDGE_PORT"

if [[ ! -f "$PYTHON_EXE" ]]; then
  echo "Creating virtual environment..."
  python -m venv "$SCRIPT_DIR/.venv"
fi

echo "Ensuring dependencies are installed..."
"$PYTHON_EXE" -m pip install -r "$SCRIPT_DIR/requirements.txt"

echo "Starting screen bridge on port $BRIDGE_PORT..."
"$PYTHON_EXE" "$BRIDGE_SCRIPT"
