var client = new (require("./client/Client.js"))({
	address: process.argv[2] || "http://127.0.0.1:37423"
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
			console.log("TCP ports: " + client.getTCPPorts().join(", "));
			console.log("UDP ports: " + client.getUDPPorts().join(", "));
		} else if (chunk == "usage") {
			returnUsage();
		} else {
			var parts = chunk.split(" ");
			var port = parseInt(parts[2]);
			var type = parts[1];
			var method = parts[0];
			if (type == "tcp") {
				if (method == "add") {
					client.addTCPPort(port);
				} else if (method == "remove") {
					try {
						client.removeTCPPort(port);
					} catch(e) {
						console.log(e);
					}
				} else {
					returnUsage();
				}
			} else if (type == "udp") {
				if (method == "add") {
					client.addUDPPort(port);
				} else if (method == "remove") {
					try {
						client.removeUDPPort(port);
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
