var net = require("net");

var port = process.argv[2];

var clients = [];

var server = net.createServer(function(c) {
  console.log("client connected.");
  c.on("end", function() {
    console.log("client disconnected");
  });
  c.on("data", function(buf) {
    c.write(buf);
    console.log(new Buffer(buf).toString("utf8"));
  });
  clients.push(c);
});

process.stdin.on('readable', function() {
  var chunk = process.stdin.read();
  if (chunk !== null) {
    for (var i = 0; i < clients.length; i++) {
      try {
        clients[i].write(chunk);
      } catch (e) {
        console.log(e);
      };
    }
  }
});
server.listen(port);
