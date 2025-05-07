from http.server import HTTPServer, SimpleHTTPRequestHandler
import webbrowser
import os

class CORSRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

def run_server():
    port = 8000
    server_address = ('', port)
    httpd = HTTPServer(server_address, CORSRequestHandler)
    print(f"Server running at http://localhost:{port}")
    webbrowser.open(f'http://localhost:{port}/test_ai_model.html')
    httpd.serve_forever()

if __name__ == '__main__':
    run_server() 