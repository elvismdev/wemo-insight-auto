#!/usr/bin/env node
const pkg = require('./package');
const DEBUG = require('./debug');
const forever = require('forever-monitor');

const wia = new (forever.Monitor)(__dirname + '/app.js');

// Error code we look for to restart the app.
const errCode = 'EHOSTUNREACH';

wia.on('start', () => {
	DEBUG.log(pkg.name + ' has started in forever-monitor mode.');
});

wia.on('restart', () => {
	DEBUG.log(pkg.name + ' has restarted.');
	DEBUG.log('Restart count: ' + wia.times);
});

wia.on('stderr', () => {
	// Stop monitoring if there was a fatal error with app process.
	DEBUG.log(pkg.name + ' had a fatal error during execution. Stop monitoring now.');
	wia.stop();
});

// Monitor stdout to look when error happens.
wia.on('stdout', (data) => {
	// If message is the error we look for.
	if (data.includes(errCode)) {
		// Restart the app.
		DEBUG.log('Restarting ' + pkg.name + ' because of error code: ' + errCode);
		wia.restart();
	}
});

wia.start();