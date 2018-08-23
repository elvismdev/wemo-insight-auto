#!/usr/bin/env node
const pkg = require('./package');
const DEBUG = require('./debug');
const forever = require('forever-monitor');

const wia = new (forever.Monitor)('app.js');

wia.on('start', () => {
	DEBUG.log(pkg.name + ' has started.');
});

wia.on('restart', () => {
	DEBUG.log(pkg.name + ' has restarted');
});

wia.on('stderr', () => {
	console.log('app.js has exited after 3 restarts');
});

wia.start();