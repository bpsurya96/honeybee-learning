#!/bin/bash
# HoneyBee Learning — Local Development Server
# Supports HTML5 Video Range Streaming (HTTP 206)
PORT=${1:-8080}

echo ""
echo "  🍯 HoneyBee Learning — Local Server"
echo "  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  🌐 Open in browser:"
echo "     http://localhost:$PORT"
echo ""
echo "  📂 Serving from: $(pwd)"
echo "  🎥 HTML5 Video Streaming: Enabled"
echo "  🛑 Press Ctrl+C to stop"
echo ""

python3 serve.py $PORT
