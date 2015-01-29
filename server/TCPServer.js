var net = require("net");

var TCPServer = function() {
  this.sockets = {};
  this.socketCounter = 0;
};

TCPServer.servers = {};


TCPServer.getServer = function(port) {
  return TCPServer.servers[port];
}

// create takes the port, a socket.io socket and a callback
// it creates a listening tcp server which will be conntected to the socket.io connection
TCPServer.prototype.create = function(port, sio, cb) {
  if (TCPServer.servers[port]) {
    cb("EADDRINUSE");
    return;
  } else {
    var self = this;
    var server = net.createServer();

    // an error occured.
    server.on("error", function (err) {
      cb(err.code);
    });

    // we have a new connected socket
    server.on("connection", function(s) {
      var sid = self.addSocket(s);

      // tell the client
      sio.emit("TCPconnection", {
        port: port,
        sid: sid
      });

      // there is new data! forward the data to the sio client
      s.on("data", function(buf) {
        sio.emit("TCPdata", {
          port: port,
          sid: sid,
          data: buf
        });
      });

      // the connection has ended. inform the client. remove the socket from the storage.
      s.on("end", function() {
        sio.emit("TCPend", {
          port: port,
          sid: sid
        });
        self.deleteSocket(sid);
      });
    });

    // let the server listen on port
    server.listen(port, function() {
      console.log("TCP listening on " + port);
      cb(null);
    });

    this.server = server;
    this.port = port;

    TCPServer.servers[port] = this;
  }
};

TCPServer.prototype.sendData = function(sid, data) {
  this.sockets[sid].write(data);
};

// This functions adds a socket to an object to rememeber it
// The socket will be associated with an id
TCPServer.prototype.addSocket = function(sock) {
  var sid = this.socketCounter;
  this.sockets[sid] = sock;
  this.socketCounter++;
  return sid;
};

TCPServer.prototype.deleteSocket = function(sid) {
  try {
    this.sockets[sid].destroy();
  } catch(e) {
    console.log(e);
  }
  delete this.sockets[sid];
};

TCPServer.prototype.destroy = function() {
  this.server.close();
  delete TCPServer.servers[this.port];
  console.log("removed TCPServer on port " + this.port);
};

module.exports = TCPServer;
