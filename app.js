#!/usr/bin/env node
const pkg = require('./package.json');
const Wemo = require('wemo-client');
const program = require('commander');

// Command line options.
program
.version(pkg.version)
.option('-c, --config <path>', 'Path to the configuration file.', './config.json')
.parse(process.argv);

// Load config file.
const config = require(program.config);

// Set configured devices count.
const devCount = config.devControlled.length + config.devController.length;
// Set a counter to find out when we are done discovering all devices. 
var loopCounter = 0;

// Debug to console with date.
const DEBUG = (function(){
	var timestamp = function(){};
	timestamp.toString = function(){
		let options = { weekday: "short", month: "short", day: "2-digit", hour12: false, year: "numeric" };
		return "[" + (new Date).toLocaleTimeString('en-US', options).replace(/,/g, '') + "]";
	};

	return {
		log: console.log.bind(console, '%s', timestamp)
	}
})();

// Uppercase first letter of string.
function jsUcfirst(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

// Finds and organizes devices in config.
function findAndSetDevices(devType, client) {
	let property = 'dev'+jsUcfirst(devType);
	config[property].forEach((dev, index) => {
		// Check if device serial number ends with
		if (client.device.serialNumber.endsWith(dev.wid)) {
			DEBUG.log(client.device.friendlyName+' is a '+devType+' device.');
			config[property][index].client = client;
		}
	});
}

// Handle controlled devices.
function handleControlledDevs(toggle, referrerDev) {
	config.devControlled.forEach((dev) => {
		let deviceName = dev.client.device.friendlyName;
		if (toggle == 'off') {
			dev.client.setBinaryState(0);
		} else if (toggle == 'on') {
			dev.client.setBinaryState(1);
		}
		DEBUG.log(deviceName + ' turned ' + toggle + ' triggered by ' + referrerDev + '.');
	});
}

// Configure controller devices.
function confControllerDevs(controllers) {
	controllers.forEach((dev) => {
		// Handle BinaryState events in Controllers devices.
		dev.client.on('binaryState', (value) => {
			let deviceName = dev.client.device.friendlyName;

			// Check if attached appliance was turned on.
			if (value == 1) {
				DEBUG.log(deviceName + ' left standby mode.');
				handleControlledDevs('off', deviceName);
			}

			// Check if attached appliance was turned off.
			if (value == 8) {
				DEBUG.log(deviceName + ' entered standby mode.');
				handleControlledDevs('on', deviceName);
			}

			// Check if WeMo device switch was turned off.
			if (value == 0) {
				DEBUG.log('WeMo Insight Switch for ' + deviceName + ' was turned off.');
				handleControlledDevs('on', deviceName);
			}
		});
	});
}

// The app init.
function app() {
	const wemo = new Wemo();

	DEBUG.log('Discovering Wemo devices via UPnP...');

	// Discover all the WeMo devices.
	wemo.discover((err, deviceInfo) => {
		// Check if we have more than two devices to work with.
		if (devCount >= 2) {
			// Print in console what we found.
			DEBUG.log('Wemo Device Found: ' + deviceInfo.friendlyName);

			// Get the client for the found device
			let client = wemo.client(deviceInfo);

			// Load a Wemo client on each device and store in config.
			findAndSetDevices('controller', client);
			findAndSetDevices('controlled', client);

			// Listen to error events (e.g. device went offline),
			client.on('error', (err) => {
				DEBUG.log('Error: ' + err.code);
			});

			// If we found all the configured WeMo devices.
			if (loopCounter == (devCount - 1)) {
				confControllerDevs(config.devController);
			}

			// Increase the counter.
			loopCounter++;
		} else {
			DEBUG.log('Script requires at least 2 WeMo Insight Switch devices configured.');
			process.exit();
		}
	});
}

// RUN and Monitor...
app();
