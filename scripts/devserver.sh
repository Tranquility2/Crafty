#!/usr/bin/env bash
# Manage the live-server dev server as a background process.
#
# Usage:
#   scripts/devserver.sh start [port]   Start server in background (default port 8080)
#   scripts/devserver.sh stop           Stop the background server
#   scripts/devserver.sh restart [port] Stop, then start
#   scripts/devserver.sh status         Show running state, pid, port
#   scripts/devserver.sh logs           Tail the server log

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PID_FILE="$REPO_ROOT/.live-server.pid"
PORT_FILE="$REPO_ROOT/.live-server.port"
LOG_FILE="$REPO_ROOT/.live-server.log"
DEFAULT_PORT=8080

is_running() {
    [[ -f "$PID_FILE" ]] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null
}

cmd_start() {
    local port="${1:-$DEFAULT_PORT}"
    if is_running; then
        echo "Server already running (pid=$(cat "$PID_FILE"), port=$(cat "$PORT_FILE" 2>/dev/null || echo unknown))"
        return 0
    fi
    cd "$REPO_ROOT"
    setsid nohup npx live-server --port="$port" --no-browser >"$LOG_FILE" 2>&1 </dev/null &
    echo $! > "$PID_FILE"
    echo "$port" > "$PORT_FILE"
    sleep 1
    echo "Started server (pid=$(cat "$PID_FILE"), port=$port), logs: $LOG_FILE"
}

cmd_stop() {
    if [[ ! -f "$PID_FILE" ]]; then
        echo "No PID file ($PID_FILE); nothing to stop"
        return 0
    fi
    local pid
    pid="$(cat "$PID_FILE")"
    if kill -0 "$pid" 2>/dev/null; then
        # Kill the whole process group (setsid put us in one) so the
        # live-server child started by npx is also terminated.
        kill -- -"$pid" 2>/dev/null || kill "$pid"
        echo "Stopped server (pid=$pid)"
    else
        echo "No running process for pid=$pid"
    fi
    rm -f "$PID_FILE" "$PORT_FILE"
}

cmd_restart() {
    cmd_stop
    cmd_start "$@"
}

cmd_status() {
    if is_running; then
        echo "running (pid=$(cat "$PID_FILE"), port=$(cat "$PORT_FILE" 2>/dev/null || echo unknown))"
    else
        echo "stopped"
    fi
}

cmd_logs() {
    [[ -f "$LOG_FILE" ]] || { echo "No log file yet ($LOG_FILE)"; exit 1; }
    tail -f "$LOG_FILE"
}

case "${1:-}" in
    start)   shift; cmd_start "$@" ;;
    stop)    cmd_stop ;;
    restart) shift; cmd_restart "$@" ;;
    status)  cmd_status ;;
    logs)    cmd_logs ;;
    *)
        sed -n '2,9p' "$0" | sed 's/^# \{0,1\}//'
        exit 1
        ;;
esac
