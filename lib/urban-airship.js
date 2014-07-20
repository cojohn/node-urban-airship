var https = require("https");

/**
 * Node-urban-airship is a simple wrapper for the Urban Airship API.
 *
 *      _..--=--..._
 *   .-'            '-.  .-.
 *  /.'              '.\/  /
 * |=-                -=| (
 *  \'.              .'/\  \
 *   '-.,_____ _____.-'  '-'
 * jgs    [_____]=8
 *
 * @param {String} key Urban Airship API key
 * @param {String} secret Urban Airship secret key
 * @param {String} master Urban Airship master secret
 */
var UrbanAirship = function(key, secret, master) {
	this._key = key;
	this._secret = secret;
	this._master = master;
};

/**
 * Gets the Segments for this application.
 *
 */

UrbanAirship.prototype.getSegments = function(callback) {
	this._auth = new Buffer(this._key + ":" + this._master, "utf8").toString("base64");
	this._transport('/api/segments/', "GET", null, false, callback);
}

/**
 * Add new segment to this application.
 *
 * @params
 *	payload the object being sent to Urban Airship as specified http://docs.urbanairship.com/reference/api/v3/segments.html
 *	callback
 */

UrbanAirship.prototype.addSegment = function(payload, callback) {
	this._auth = new Buffer(this._key + ":" + this._master, "utf8").toString("base64");
	this._transport('/api/segments/', "POST", payload, true, callback);
}

/**
 * Gets the tags for this application.
 *
 * @params
 *	callback
 */

UrbanAirship.prototype.getTags = function(callback) {
	this._auth = new Buffer(this._key + ":" + this._master, "utf8").toString("base64");
	this._transport('/api/tags/', "GET", null, true, callback);
}

/**
 * Add tag for this application.
 *
 * @params
 *	tag to be added.
 *	callback
 */

UrbanAirship.prototype.addTag = function(tag, callback) {
	this._auth = new Buffer(this._key + ":" + this._master, "utf8").toString("base64");
	this._transport('/api/tags/' + tag, "PUT", null, true, callback);
}

/**
 * Add tag to the list of tokens for this application.
 *
 * @params
 *	tag to be added.
 *	callback
 */

UrbanAirship.prototype.addTagToDevices = function(tag, tokensArray, callback) {
	this._auth = new Buffer(this._key + ":" + this._master, "utf8").toString("base64");
	var payload = {
		"device_tokens": {
			"add": tokensArray
		}
	};

	this._transport('/api/tags/' + tag, "POST", payload, true, callback);
}

/**
 * remvoe tag from the list of tokens for this application.
 *
 * @params
 *	tag to be added.
 *	callback
 */

UrbanAirship.prototype.removeTagFromDevices = function(tag, tokensArray, callback) {
	this._auth = new Buffer(this._key + ":" + this._master, "utf8").toString("base64");
	var payload = {
		"device_tokens": {
			"remove": tokensArray
		}
	};

	this._transport('/api/tags/' + tag, "POST", payload, true, callback);
}

/**
 * add/ remove tags for a specific device for this application.
 *
 * @params
 *	tag to be added.
 *	callback
 */

UrbanAirship.prototype.updateDevicesTags = function(device_id, tags, callback) {
	this._auth = new Buffer(this._key + ":" + this._master, "utf8").toString("base64");
	var payload = {
		"tags": tags
	};
	var path = "/api/" + UrbanAirship.device_endpoint(device_id) + "/" + device_id;

	this._transport(path, "PUT", payload, true, callback);
}

/**
 * Gets the number of devices tokens authenticated with the application.
 *
 * @params callback(error, total, active)
 */
UrbanAirship.prototype.getDeviceTokenCounts = function(callback) {
	this._auth = new Buffer(this._key + ":" + this._master, "utf8").toString("base64");

	this._transport("/api/device_tokens/count/", "GET", true, function(error, response_data) {
		callback(error, response_data.device_tokens_count || 0, response_data.active_device_tokens_count || 0);
	});
}

/*
 * Push a notification to a registered device.
 *
 * @params
 *	path of the push Notification.
 *	payload the object being sent to Urban Airship as specified http://urbanairship.com/docs/push.html
 *	callback
 */
UrbanAirship.prototype.pushNotification = function(path, payload, callback) {
	this._auth = new Buffer(this._key + ":" + this._master, "utf8").toString("base64");
	this._transport(path, "POST", payload, true, callback);
}

/*
 * Get the endpoint for a device token
 *
 * @params
 *   device_id – The device identifier
 * @return string
 */
UrbanAirship.device_endpoint = function(device_id) {
	switch (device_id.length) {
		case 64:
			return 'device_tokens';
		case 36:
			return 'apids';
		case 8:
			return 'device_pins';
		default:
			throw new Error("The device ID was not a valid length ID");
	}
};

/*
 * Register a new device.
 *
 * @params
 *	device_id - The device identifier
 *	data - The JSON payload (optional)
 *	callback
 */
UrbanAirship.prototype.registerDevice = function(device_id, data, callback) {
	this._auth = new Buffer(this._key + ":" + this._secret, "utf8").toString("base64");

	var path = "/api/" + UrbanAirship.device_endpoint(device_id) + "/" + device_id;

	if (data) {
		// Registration with optional data
		this._transport(path, "PUT", data, true, callback);
	} else {
		// Simple registration with no additional data
		this._transport(path, "PUT", null, true, callback);
	}
}

/*
 * Unregister a device.
 *
 * @params
 *	device_id - The device identifier
 *	callback
 */
UrbanAirship.prototype.unregisterDevice = function(device_id, callback) {
	this._auth = new Buffer(this._key + ":" + this._secret, "utf8").toString("base64");
	var path = "/api/" + UrbanAirship.device_endpoint(device_id) + "/" + device_id;
	this._transport(path, "DELETE", null, true, callback);
}

/*
 * Send things to UA!
 *
 * @params
 *	path - API route
 *	method - The HTTPS method to employ
 *	request_data - The JSON data we are sending (optional)
 *	callback
 */
UrbanAirship.prototype._transport = function(path, method, request_data, needAcceptHeader, callback) {
	var self = this,
		rd = "",
		response_data = "",
		https_opts = {
			"host": "go.urbanairship.com",
			"port": 443,
			"path": path,
			"method": method,
			"headers": {
				"Authorization": "Basic " + this._auth,
				"User-Agent": "node-urban-airship/0.3"
			}
		};

	if (needAcceptHeader) {
		https_opts.headers["Accept"] = "application/vnd.urbanairship+json; version=3;";
	}

	// We don't necessarily send data
	if (request_data instanceof Function) {
		callback = request_data;
		request_data = null;
	}

	// Set a Content-Type and Content-Length header if we are sending data
	if (request_data) {
		rd = JSON.stringify(request_data);

		https_opts.headers["Content-Type"] = "application/json";
		https_opts.headers["Content-Length"] = Buffer.byteLength(rd, "utf8");
	} else {
		https_opts.headers["Content-Length"] = 0;
	}

	var request = https.request(https_opts, function(response) {
		response.setEncoding("utf8");

		response.on("data", function(chunk) {
			response_data += chunk;
		});

		response.on("end", function() {
			// You probably forget the trailing '/'
			if ((response.statusCode == 301 || response.statusCode == 302) && response.headers && response.headers.location) {
				var url = require("url"),
					parsed_url = url.parse(response.headers.location);

				self._transport(parsed_url.pathname + (parsed_url.search || ""), method, request_data, needAcceptHeader, callback);
			}
			// Success on 200 or 204, 201 on new device registration
			else if ([200, 201, 202, 204].indexOf(response.statusCode) >= 0) {
				try {
					switch (true) {
						case /application\/json/.test(response.headers["content-type"]):
							callback(null, JSON.parse(response_data));
							break;
						default:
							callback(null, response_data);
					}
				} catch (ex) {
					callback(ex);
				}
			} else {
				callback(new Error(response_data));
			}
		});

		response.on("error", function(error) {
			callback(error);
		});
	});

	request.on("error", function(error) {
		callback(error);
	});

	if (request_data) {
		request.write(rd);
	}

	request.end();
};

module.exports = UrbanAirship;