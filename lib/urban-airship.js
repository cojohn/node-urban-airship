var https = require("https");

/*
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
 * @params
 *	key - Your API key
 *	secret - Your secret key
 */
var UrbanAirship = module.exports = function(key, secret) {
	this._key = key;
	this._secret = secret;
	this._auth = new Buffer(key + ":" + secret, "utf8").toString("base64");
	console.log(this._key, this._secret, this._auth);
}

/*
 * Push a notification to a registered device.
 *
 * @params
 *	device_id - The device identifier
 */
UrbanAirship.prototype.pushNotification = function(device_id) {
	
}

/*
 * Register a new device.
 *
 * @params
 *	device_id - The device identifier
 *	data - The JSON payload (optional)
 *	callback
 */
UrbanAirship.prototype.registerDevice = function(device_id, data, callback) {
	var path = "/api/device_tokens/" + device_id;
	
	if (data) {
		// Registration with optional data
		this._transport(path, "PUT", data, callback);
	}
	else {
		// Simple registration with no additional data
		this._transport(path, "PUT", callback);
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
	this._transport("/api/device_tokens/" + device_id, "DELETE", callback);
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
UrbanAirship.prototype._transport = function(path, method, request_data, callback) {
	var self = this,
		response_data = "",
		https_opts = {
			"host": "go.urbanairship.com",
			"port": 443,
			"path": path,
			"method": method,
			"headers": {
				"Authorization": "Basic " + this._auth
			}
		};
	
	// We don't necessarily send data
	if (request_data instanceof Function) {
		callback = request_data;
		request_data = null;
	}
	
	// Set a Content-Type and Content-Length header if we are sending data
	if (request_data) {
		https_opts.headers["Content-Type"] = "application/json";
		https_opts.headers["Content-Length"] = 0;
	}
	else {
		https_opts.headers["Content-Length"] = 0;
	}
		
	console.log(https_opts);
	
	var request = https.request(https_opts, function(response) {
		response.setEncoding("utf8");
		
		response.on("data", function(chunk) {
			response_data += chunk;
		});
		
		response.on("end", function() {
			// response 'OK' on 200
			console.log(response.statusCode);
			console.log(response_data);
			callback();
		});
		
		response.on("error", function(error) {
			callback(error);
		});
	});
	
	request.on("error", function(error) {
		callback(error);
	});
	
	if (request_data) {
		request.write(JSON.stringify(request_data));
	}
	
	request.end();
}