#!/bin/bash
# HoneyBee Learning — Local Development Server
# Usage: bash serve.sh [port]
# Default port: 8080

PORT=${1:-8080}

echo ""
echo "  🍯 HoneyBee Learning — Local Server"
echo "  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  🌐 Open in browser:"
echo "     http://localhost:$PORT"
echo ""
echo "  📂 Serving from: $(pwd)"
echo "  🛑 Press Ctrl+C to stop"
echo ""

python3 -m http.server $PORT --bind 0.0.0.0
