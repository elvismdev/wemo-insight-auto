#!/usr/bin/env node
const pkg = require('./package');
const DEBUG = require('./debug');
const forever = require('forever-monitor');

const wia = new (forever.Monitor)(__dirname + '/app.js');

// Error code we look for to restart the app.
const errCode = 'EHOSTUNREACH';

wia.on('start', () => {
	DEBUG.log(pkg.name + ' has started with forever-monitor.');
});

wia.on('restart', () => {
	DEBUG.log(pkg.name + ' has restarted.');
	DEBUG.log('Restart count: ' + wia.times);
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