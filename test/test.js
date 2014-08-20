suite("All", function() {
	var FAKE_KEY = "fakekey";
	var FAKE_MASTER_KEY = "fakemasterkey";
	var FAKE_SECRET = "fakesecret";
	var UA = require("../lib/urban-airship");
	var assert = require("assert");

	test("All", function() {
		// In all tests, override _transport() to check request payloads. We're not integration
		// testing the Urban Airship API, rather unit testing the library's functions.
		describe("getDeviceTokenCounts", function() {
			it("should return total and active device tokens", function(done) {
				var ua = new UA(FAKE_KEY, FAKE_MASTER_KEY, FAKE_SECRET);
				var num_device_tokens = 137;
				var num_active_tokens = 64;
		
				// Override/mock the _transport function to test other functions.
				ua._transport = function(path, method, request_data, callback) {
					assert.equal(path, "/api/device_tokens/count/", "Incorrect path for device token retrieval.");
					assert.equal(method, "GET", "Incorrect request method for device token retrieval.");
					assert.ok(request_data instanceof Function, "No data should be passed to _transport for device token retrieval.");
					request_data(null, {"device_tokens_count": num_device_tokens, "active_device_tokens_count": num_active_tokens});
				};

				ua.getDeviceTokenCounts(function(error, num_devices, num_devices_active) {
					assert.equal(num_device_tokens, num_devices, "Incorrect device token count.");
					assert.equal(num_active_tokens, num_devices_active, "Incorrect device token count.");
					done();
				});
			});
		});
	});
});