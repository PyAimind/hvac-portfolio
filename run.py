import http.server
import socketserver
import webbrowser
import os

PORT = 8080

# تغییر مسیر به پوشه فعلی
os.chdir(os.path.dirname(os.path.abspath(__file__)))

Handler = http.server.SimpleHTTPRequestHandler

print(f"Starting server at http://localhost:{PORT}")
print("Press Ctrl+C to stop.\n")

# باز کردن خودکار مرورگر
webbrowser.open(f"http://localhost:{PORT}")

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")