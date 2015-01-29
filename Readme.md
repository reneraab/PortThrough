PortThrough
===========
PortThrough is a WIP tool especially for people who can't open ports in their routers (or sit behind other routers because they use the internet access provided by their dorm etc.).

The client (behind firewall w/o open port) connects to a script running on a "server" that can be accessed from the internet.

Packets sent to the server will be passed through to the client (via socket.io) ~~and from there distributed in the NAT to the receiver~~ which then forwards them to any listening program on the same machine.

WARNING: A lot of the stuff is not yet fully tested nor documented. Some things are still hard-coded (socket.io port).

Usage
-----
Run `npm install` to install socket.io and socket.io-client.

On the server (the one that's not behind a firewall) run `node server.js` (or use forever).

On the client (the machine that's behind a firewall that you can't control) run `node client.js [socket.io url]` where `[socket.io url]` is `http://[your ip/hostname]:37423`.
You can then interactively control the forwarded ports from the client. (`(add|remove) (tcp|udp) [port]` or `list`)

Future
------
* More documentation.
* More control (config files, forward to other machine in NAT, be able to change socket.io-port).
