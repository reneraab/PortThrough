#! /usr/bin/env node
function ports(val) {
	return val.split(',').map(function(v) {
		return parseInt(v);
	});
}


var program = require('commander');

program
	.version("0.1.0")

program.command("client <address>")
	.description("start PortThrough client")
	.option("-t, --tcp <ports>", "A list of TCP ports", ports)
	.option("-u, --udp <ports>", "A list of UDP ports", ports)
	.action(function(address, options) {
		console.log(address);
		console.log(options.tcp);
		var client = new (require("./client/Client.js"))({
			address: address,
			tcp: options.tcp,
			udp: options.udp
		});

	});

program.command("server <port>")
	.description("start PortThrough server")
	.action(function(port) {
		var srv = new (require("./server/Server.js"))();
		srv.listen(port);
	});





program.parse(process.argv);
