#node-urban-airship

[![NPM version](https://badge.fury.io/js/urban-airship.png)](http://badge.fury.io/js/urban-airship)
[![Build Status](https://travis-ci.org/cojohn/node-urban-airship.svg?branch=master)](https://travis-ci.org/cojohn/node-urban-airship)

Simple wrapper for the Urban Airship API.

##Installation

```sh
npm install urban-airship
```

```javascript
var UA = require("urban-airship");
var ua = new UA("<api key>", "<api secret key>", "<api master key>");
```

##Testing

Tests use the `mocha` library listed in `devDependencies`.

```sh
npm test
```

##Usage

Sample API Calls

1. Register a device

	ua.registerDevice("< token >", function(error) {...});

2. Create payloads for the push notification API needed.

	Information available here.
	http://urbanairship.com/docs/push.html

	Push Notification Examples (API v3): 

		a)	"/api/push/"

                var payload0 = {
                  "audience": {
                    "device_token": A single device token identifier
                  },
                  "notification": {
                          "ios": { specific options for iOS devices},
                          "android": { specific options for Android devices},
			  "alert": "The push text to send to devices"
                  },
                  "device_types" : "all"
                };

		ua.pushNotification("/api/push", payload0, function(error) {....});

		b) "/api/push/"

                var payload0 = {
                  "audience": "all",
                  "notification": {
                          "ios": { specific options for iOS devices},
                          "android": { specific options for Android devices},
			  "alert": "The push text to send to devices"
                  },
                  "device_types" : "all"
                };

		ua.pushNotification("/api/push/", payload1, function(error) {.....});

3. Unregister a device.

	ua.unregisterDevice("< token >", function(error) {....});



