#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

PID_FILE="$DIR/.site.pid"
LOG_FILE="$DIR/.site.log"
PORT=3000
URL="http://localhost:$PORT"

# Colored outputs
GREEN="\033[1;32m"
CYAN="\033[1;36m"
YELLOW="\033[1;33m"
RED="\033[1;31m"
RESET="\033[0m"

is_running() {
    if curl -s -o /dev/null -w "%{http_code}" "$URL" 2>/dev/null | grep -q "200"; then
        return 0
    fi
    return 1
}

open_browser() {
    echo -e "${CYAN}[+] Opening browser at $URL ...${RESET}"
    if command -v omarchy-launch-browser >/dev/null 2>&1; then
        omarchy-launch-browser "$URL" >/dev/null 2>&1 &
    elif command -v xdg-open >/dev/null 2>&1; then
        xdg-open "$URL" >/dev/null 2>&1 &
    fi
}

case "$1" in
    --stop|stop)
        echo -e "${YELLOW}[*] Stopping SimpleArch website server...${RESET}"
        if [ -f "$PID_FILE" ]; then
            PID=$(cat "$PID_FILE")
            if kill -0 "$PID" 2>/dev/null; then
                kill "$PID" 2>/dev/null || true
            fi
            rm -f "$PID_FILE"
        fi
        # Also clean up any lingering process on port 3000
        fuser -k -n tcp $PORT >/dev/null 2>&1 || true
        echo -e "${GREEN}[✓] SimpleArch website stopped.${RESET}"
        exit 0
        ;;

    --status|status)
        if is_running; then
            echo -e "${GREEN}[✓] SimpleArch website is LIVE and running on $URL${RESET}"
            if [ -f "$PID_FILE" ]; then
                echo -e "    PID: $(cat "$PID_FILE")"
            fi
        else
            echo -e "${RED}[-] SimpleArch website is NOT running.${RESET}"
        fi
        exit 0
        ;;

    --logs|logs)
        if [ -f "$LOG_FILE" ]; then
            echo -e "${CYAN}[*] Following logs from $LOG_FILE (Ctrl+C to exit)...${RESET}"
            tail -f "$LOG_FILE"
        else
            echo -e "${YELLOW}[-] No log file found yet.${RESET}"
        fi
        exit 0
        ;;

    --help|-h)
        echo "SimpleArch Website Runner"
        echo ""
        echo "Usage:"
        echo "  ./run.sh          Check/start website and open in browser"
        echo "  ./run.sh --status Check if website is running"
        echo "  ./run.sh --stop   Stop the website server"
        echo "  ./run.sh --logs   View live logs"
        exit 0
        ;;
esac

# Default action: start if needed and open browser
if is_running; then
    echo -e "${GREEN}[✓] SimpleArch website is already running at $URL${RESET}"
    open_browser
    exit 0
fi

echo -e "${CYAN}[*] Starting SimpleArch Next.js development server...${RESET}"
nohup npm run dev -- --hostname 0.0.0.0 --port $PORT > "$LOG_FILE" 2>&1 &
echo $! > "$PID_FILE"

# Wait for server to become healthy
echo -n "    Waiting for server to become ready"
READY=false
for i in {1..30}; do
    if is_running; then
        READY=true
        break
    fi
    echo -n "."
    sleep 0.5
done
echo ""

if [ "$READY" = true ]; then
    echo -e "${GREEN}[✓] SimpleArch website is now LIVE at $URL${RESET}"
    open_browser
else
    echo -e "${RED}[-] Server failed to start within 15 seconds. Check logs with: ./run.sh --logs${RESET}"
    exit 1
fi
