var TCPServer = require("./TCPServer.js");
var UDPServer = require("./UDPServer.js");

var Server = function() {
};

Server.prototype.listen = function(port) {
	var io = require("socket.io")(port);
	var sockets = {};
	io.on("connection", function(socket) {
		sockets[socket.id] = [];
		socket.on("newTCP", function (port) {
			var s = new TCPServer();
			s.create(port, socket, function(err) {
				if (err) {
					console.log(err);
				} else {
					sockets[socket.id].push(port);
				}
			});
		});
		socket.on("TCPdata", function(cfg) {
			TCPServer.getServer(cfg.port).sendData(cfg.sid, cfg.data);
		});
		socket.on("TCPerror", function(cfg) {
			console.log(cfg.error);
			if (cfg.sid) {
				TCPServer.getServer(cfg.port).deleteSocket(cfg.sid);
			} else {
				TCPServer.getServer(cfg.port).destroy();
			}
		});
		socket.on("TCPend", function(cfg) {
			TCPServer.getServer(cfg.port).deleteSocket(cfg.sid);
		});

		socket.on("newUDP", function(port) {
			var s = new UDPServer();
			s.create(port, socket, function(err) {
				if (err) {
					console.log(err);
				} else {
					sockets[socket.id].push(port);
				}
			});
		});

		socket.on("removeUDP", function(port) {
			UDPServer.servers[port].destroy();
		});


		socket.on("disconnect", function() {
			var ports = sockets[socket.id];
			for (var i = 0; i < ports.length; i++) {
				try {
					TCPServer.getServer(ports[i]).destroy();
				} catch(e) {
					console.log(e);
				}

				try {
					UDPServer.getServer(ports[i]).destroy();
				} catch(e) {
					console.log(e);
				}
			}
		});
	});
};

module.exports = Server;
