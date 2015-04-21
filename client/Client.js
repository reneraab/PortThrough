var TCPPort = require("./TCPPort.js");
var UDPPort = require("./UDPPort.js");

var Client = function(config) {
	this.io = require("socket.io-client")(config.address);

	if (config.tcp) this.addTCPPorts(config.tcp);
	if (config.udp) this.addUDPPorts(config.udp);

	this.io.on("connect", function() {
		console.log("Connected to server.");

		this.io.on("TCPconnection", function(cfg) {
			TCPPort.ports[cfg.port].newConnection(cfg.sid);
		});

		this.io.on("TCPdata", function(cfg) {
			TCPPort.ports[cfg.port].sendData(cfg.sid, cfg.data);
		});

		this.io.on("TCPend", function(cfg) {
			TCPPort.ports[cfg.port].closeConnection(cfg.sid);
		});

		this.io.on("UDPdata", function(cfg) {
			UDPPort.ports[cfg.port].sendData(cfg.data);
		});

		this.io.on("disconnect", function() {
			TCPPort.clearAll();
		});
	});
};

Client.prototype.removeTCPPort = function(port) {
	TCPPort.ports[port].destroy();
};

Client.prototype.addTCPPort = function(port) {
	new TCPPort(port, this.io);
};

Client.prototype.addTCPPorts = function(ports) {
	if (ports instanceof Array) {
		for (var i = 0; i < ports.length; i++) {
			this.addTCPPort(ports[i]);
		}
	} else {
		this.addTCPPort(ports);
	}
};

Client.prototype.getTCPPorts = function() {
	return Object.keys(TCPPort.ports);
};



Client.prototype.removeUDPPort = function(port) {
	UDPPort.ports[port].destroy();
};

Client.prototype.addUDPPort = function(port) {
	new UDPPort(port, this.io);
};

Client.prototype.addUDPPorts = function(ports) {
	if (ports instanceof Array) {
		for (var i = 0; i < ports.length; i++) {
			this.addUDPPort(ports[i]);
		}
	} else {
		this.addUDPPort(ports);
	}
};

Client.prototype.getUDPPorts = function() {
	return Object.keys(UDPPort.ports);
};

module.exports = Client;
