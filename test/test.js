var UA = require("../lib/urban-airship"),
	ua = new UA("<api key>", "<api secret key>", "<api master key>");

ua.registerDevice("<token>", function(error) {
	ua.pushNotification("<token", "Hi!", 42, function(error) {
		ua.unregisterDevice("<token>", function(error) {
			process.exit();
		});
	});
});