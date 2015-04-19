var address = process.argv[2] || "http://127.0.0.1:37423"
console.log("Using server " + address + ".");

var net = require("net");
var io = require("socket.io-client")(address);

var TCPPort = require("./client/TCPPort.js");
var UDPPort = require("./client/UDPPort.js");

io.on("connect", function() {
	console.log("Connected to server.");

	io.on("TCPconnection", function(cfg) {
		TCPPort.ports[cfg.port].newConnection(cfg.sid);
	});
	io.on("TCPdata", function(cfg) {
		TCPPort.ports[cfg.port].sendData(cfg.sid, cfg.data);
	});
	io.on("TCPend", function(cfg) {
		TCPPort.ports[cfg.port].closeConnection(cfg.sid);
	});

	io.on("UDPdata", function(cfg) {
		UDPPort.ports[cfg.port].sendData(cfg.data);
	});

	io.on("disconnect", function() {
		TCPPort.clearAll();
	});
});



process.stdin.resume();
process.stdin.setEncoding("utf8");

function returnUsage() {
	console.log(" ");
	console.log("Usage");
	console.log("* list: Returns a list of all current ports.");
	console.log("* (add|remove) (tcp|udp) [port]: Adds/removes [port] for tcp/udp.")
	console.log(" ");
}
process.stdin.on("data", function(chunk) {
	chunk = chunk.toString().trim();
	if (chunk !== null) {
		if (chunk === "list") {
			console.log("TCP ports: " + Object.keys(TCPPort.ports).join(", "));
			console.log("UDP ports: " + Object.keys(UDPPort.ports).join(", "));
		} else if (chunk == "usage") {
			returnUsage();
		} else {
			var parts = chunk.split(" ");
			var port = parseInt(parts[2]);
			var type = parts[1];
			var method = parts[0];
			if (type == "tcp") {
				if (method == "add") {
					new TCPPort(port, io);
				} else if (method == "remove") {
					try {
						TCPPort.ports[port].destroy();
					} catch(e) {
						console.log(e);
					}
				} else {
					returnUsage();
				}
			} else if (type == "udp") {
				if (method == "add") {
					new UDPPort(port, io);
				} else if (method == "remove") {
					try {
						UDPPort.ports[port].destroy();
					} catch(e) {
						console.log(e);
					}
				} else {
					returnUsage();
				}
			} else {
				returnUsage();
			}
		}
	} else {
		returnUsage();
	}
});
