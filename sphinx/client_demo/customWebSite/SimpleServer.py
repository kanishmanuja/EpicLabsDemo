#!/usr/bin/python

import SimpleHTTPServer, SocketServer, socket, json

class KaldiServer(SimpleHTTPServer.SimpleHTTPRequestHandler):
    def do_POST(self):
        length = int(self.headers.getheader('content-length',0))
        post_body = self.rfile.read(length)
        print post_body
        jsonArry = json.loads(post_body)
        print jsonArry
        if HS_socket:
            HS_socket.sendall("<COMMAND>" + jsonArry["keyword"] + "~" + jsonArry["txt"] + "</COMMAND>")


def run(handler_class=KaldiServer, port=8000, IP=""):
    httpd = SocketServer.TCPServer(("", port), handler_class)
    print 'Starting httpd on port',port
    global HS_socket
    HS_socket = None
    if not (IP == ""):
        HS_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        HS_socket.connect((IP, 8080))
        httpd.serve_forever()
        HS_socket.close()
    else:
        httpd.serve_forever()

if __name__ == "__main__":
    from sys import argv

if len(argv) == 2:
    run(IP=argv[1])
if len(argv) == 3:
    run(port=int(argv[1]),IP=int(argv[2]))
else:
    run()
