var net = require("net");
var dgram = require("dgram");

var UDPPort = function(port, io) {
  this.io = io;
  this.io.emit("newUDP", port);
  this.port = port;
  UDPPort.ports[port] = this;
};

UDPPort.ports = {};

UDPPort.clearAll = function() {
  var ports = Object.keys(UDPPort.ports);
  for (var i = 0; i < ports.length; i++) {
    UDPPort.ports[ports[i]].destroy();
  }
}

UDPPort.prototype.sendData = function(data) {
  var client = dgram.createSocket("udp4");
  var self = this;
  client.send(data, 0, data.length, this.port, "localhost", function(err, bytes) {
    console.log("UDP: Sent " + bytes + " bytes to localhost:" + self.port);
    client.close();
  });
};

UDPPort.prototype.destroy = function() {
  this.io.emit("removeUDP", this.port);
  delete UDPPort.ports[this.port];
};

module.exports = UDPPort;
