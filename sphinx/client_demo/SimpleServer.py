#!/usr/bin/python

import SimpleHTTPServer, SocketServer, socket

class KaldiServer(SimpleHTTPServer.SimpleHTTPRequestHandler):
    def do_POST(self):
        length = int(self.headers.getheader('content-length',0))
        post_body = self.rfile.read(length)
        if HS_socket:
	    print post_body
            HS_socket.sendall(post_body)


def run(handler_class=KaldiServer, port=8008, IP=""):
    httpd = SocketServer.TCPServer(("", port), handler_class)
    print 'Starting httpd on port',port
    print IP
    global HS_socket
    HS_socket = None
    if not (IP == ""):
        HS_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
	print "here12"
	HS_socket.connect((IP.strip(), 8080))
	print "here"
        httpd.serve_forever()
	print "herealso"
        HS_socket.close()
    else:
        httpd.serve_forever()

if __name__ == "__main__":
    from sys import argv
print "yele"
if len(argv) == 2:
    run(IP=(argv[1]))
if len(argv) == 3:
    run(port=int(argv[1]),IP=(argv[2]))
else:
    print "not here?"
    run()
