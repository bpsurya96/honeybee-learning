#!/usr/bin/env python3
"""
HoneyBee Learning — Development Server with Byte-Range Support for HTML5 Video
Supports HTTP 206 Partial Content, Accept-Ranges, UTF-8 charsets, and progressive MP4 streaming.
"""

import os
import sys
import re
from functools import partial
from http.server import HTTPServer, SimpleHTTPRequestHandler

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
DOC_ROOT = sys.argv[2] if len(sys.argv) > 2 else ('dist' if os.path.isdir('dist') else '.')

class RangeHTTPRequestHandler(SimpleHTTPRequestHandler):
    def guess_type(self, path):
        ctype = super().guess_type(path)
        if ctype.startswith('text/') or ctype in ('application/javascript', 'application/json'):
            if 'charset' not in ctype:
                ctype += '; charset=utf-8'
        return ctype

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, must-revalidate')
        super().end_headers()

    def do_HEAD(self):
        path = self.translate_path(self.path)
        if os.path.isfile(path):
            ctype = self.guess_type(path)
            file_size = os.path.getsize(path)
            self.send_response(200)
            self.send_header('Content-Type', ctype)
            self.send_header('Content-Length', str(file_size))
            self.send_header('Accept-Ranges', 'bytes')
            self.end_headers()
        else:
            super().do_HEAD()

    def do_GET(self):
        range_header = self.headers.get('Range')
        path = self.translate_path(self.path)

        if not os.path.isfile(path) or not range_header:
            return super().do_GET()

        ctype = self.guess_type(path)
        try:
            file_size = os.path.getsize(path)
            f = open(path, 'rb')
        except OSError:
            self.send_error(404, "File not found")
            return

        range_match = re.match(r'bytes=(\d+)-(\d*)', range_header)
        if not range_match:
            f.close()
            return super().do_GET()

        start = int(range_match.group(1))
        end = int(range_match.group(2)) if range_match.group(2) else file_size - 1

        if start >= file_size:
            f.close()
            self.send_error(416, "Requested Range Not Satisfiable")
            return

        end = min(end, file_size - 1)
        length = end - start + 1

        self.send_response(206)
        self.send_header('Content-Type', ctype)
        self.send_header('Content-Range', f'bytes {start}-{end}/{file_size}')
        self.send_header('Content-Length', str(length))
        self.send_header('Accept-Ranges', 'bytes')
        self.end_headers()

        f.seek(start)
        self.wfile.write(f.read(length))
        f.close()

if __name__ == '__main__':
    handler_class = partial(RangeHTTPRequestHandler, directory=DOC_ROOT)
    server = HTTPServer(('0.0.0.0', PORT), handler_class)
    print(f"\n  🍯 HoneyBee Learning Server")
    print(f"  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print(f"  🌐 Running at: http://localhost:{PORT}")
    print(f"  📂 Serving from: {os.path.abspath(DOC_ROOT)}")
    print(f"  🔤 Default Charset: UTF-8")
    print(f"  🎥 HTML5 Video Streaming: Enabled")
    print(f"  🛑 Press Ctrl+C to stop\n")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server.")
