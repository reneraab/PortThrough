var net = require("net");

var TCPPort = function(port, io) {
	this.io = io;
	this.io.emit("newTCP", port);
	this.port = port;
	this.sockets = {};
	TCPPort.ports[port] = this;
};

TCPPort.ports = {};

TCPPort.clearAll = function() {
	var ports = Object.keys(TCPPort.ports);
	for (var i = 0; i < ports.length; i++) {
		TCPPort.ports[ports[i]].destroy();
	}
}

TCPPort.prototype.newConnection = function(sid) {
	var self = this;
	var sock = net.createConnection(this.port);
	sock.on("error", function(err) {
		self.io.emit("TCPerror", {
			port: self.port,
			sid: sid,
			error: err
		});
	});
	sock.on("data", function(buf) {
		self.io.emit("TCPdata", {
			port: self.port,
			sid: sid,
			data: buf
		});
	});
	sock.on("end", function() {
		self.io.emit("TCPend", {
			port: self.port,
			sid: sid
		});
	});
	this.sockets[sid] = sock;
};

TCPPort.prototype.sendData = function(sid, data) {
	this.sockets[sid].write(data);
};

TCPPort.prototype.closeConnection = function(sid) {
	try {
		this.sockets[sid].destroy();
	} catch (e) {
		console.log(e);
	}
	delete this.sockets[sid];
};

TCPPort.prototype.destroy = function() {
	var keys = Object.keys(this.sockets);
	for (var i = 0; i < keys.length; i++) {
		this.closeConnection(keys[i]);
	}
	delete TCPPort.ports[this.port];
};

module.exports = TCPPort;
