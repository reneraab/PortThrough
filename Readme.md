PortThrough
===========
PortThrough is a tool especially for people who can't open ports in their routers (or sit behind other routers because they use the internet access provided by their dorm etc.).

The client (behind firewall w/o open port) connects to a script running on a "server" that can be accessed from the internet.

Packets sent to the server will be passed through to the client (via socket.io) which then forwards them to any listening program on the same machine (later: other computers in the NAT).

WARNING: A lot of the stuff is not yet fully tested.

Installation
-----
As PortThrough is not yet in the npm repository, you need to clone it from GitHub first. From within the directory, do the following:

Run `npm install` to install dependencies.

You can also run `npm install -g` to install PortThrough globally, which lets you access PortThrough via the command `portthrough` (equivalent to `cli.js` - see below).

To run Portthrough you can either use `cli.js` directly (make sure it's executable), or the aforementioned `portthrough`.


Usage: Server
------
To start the server use `portthrough server <port>` where port defines the port socket.io is listening on.


Usage: Client
------
To start the client use `portthrough client <address> [options]` where address defines the address the PortThrough server is listening on (`http://<your ip/hostname>:<port>`).
The following options are available for the client:
* `-t, --tcp <ports>`: A comma-seperated list of TCP ports
* `-u, --udp <ports>`: A comma-seperated list of UDP ports

Usage: Server - Programmatically
-----
```js
var srv = new (require("[path]/api.js").Server)();
srv.listen(PORT); // PORT is the port the server will be listening on
```

Usage: Client - Programmatically
----
Example:
```js
var client = new (require("[path]/api.js").Client)({
	address: "address", // the address the server is listening on (see client cli usage above)
	udp: [42,1337], // array of udp ports or just one port
	tcp: 1337 // array of tcp ports or just one port
});

client.addTCPPort(1337); // add a TCP port

client.removeUDPPort(1337); // remove a UDP port
```

ToDo: add more documentation. For now, see `./client/Client.js` for more information.

Future
------
* config files
* forward to other machine in NAT
* encryption for socket.io (after the implementation of config files)
