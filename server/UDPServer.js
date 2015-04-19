var net = require("net");
var dgram = require("dgram");

var UDPServer = function() {
	this.sockets = {};
	this.socketCounter = 0;
};

UDPServer.servers = {};


UDPServer.getServer = function(port) {
	return UDPServer.servers[port];
}

UDPServer.prototype.create = function(port, sio, cb) {
	if (UDPServer.servers[port]) {
		cb("EADDRINUSE");
		return;
	} else {
		var self = this;
		var server = dgram.createSocket("udp4");

		// an error occured.
		server.on("error", function (err) {
			cb(err.code);
		});

		server.on("message", function(msg, rinfo) {
			console.log("UDP: Received " + rinfo.size + " bytes from " + rinfo.address + ":" + rinfo.port + " on port " + self.port);
			sio.emit("UDPdata", {
				port: port,
				data: msg,
				rinfo: rinfo
			});
		});

		// let the server listen on port
		server.bind(port, function() {
			console.log("UDP listening on " + port);
			cb(null);
		});

		this.server = server;
		this.port = port;

		UDPServer.servers[port] = this;
	}
};

UDPServer.prototype.destroy = function() {
	this.server.close();
	delete UDPServer.servers[this.port];
	console.log("removed UDPServer on port " + this.port);
};

module.exports = UDPServer;
