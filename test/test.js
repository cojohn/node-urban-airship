var UA = require("../lib/urban-airship"),
	ua = new UA("<api key>", "<api secret key>", "<api master key>");

var payload0 = {
	"device_tokens": ['device_id(s)'],
	"aps": {
		"alert": alert,
		"badge": badge
	}
};

ua.registerDevice("<token>", function(error) {
	ua.pushNotification("/api/push", payload0, function(error) {
		ua.unregisterDevice("<token>", function(error) {

		});
	});
});

var payload1 = {
	"aps": {
		 "badge": 15,
		 "alert": "Calling Urban Airship!",
		 "sound": "cat.caf"
	}/*,
	"exclude_tokens": [
		"device token you want to skip",
		"another device token you want to skip"
	]*/
};


ua.pushNotification("/api/push/broadcast/", payload1, function(error) {

});
