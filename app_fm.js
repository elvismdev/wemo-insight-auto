#!/usr/bin/env node
const pkg = require('./package');
const DEBUG = require('./debug');
const forever = require('forever-monitor');

const wia = new (forever.Monitor)('app.js');

// wia.on('restart', function () {
// 	console.log('app.js has restarted');
// 	wia.restart();
// });

wia.on('start', function () {
	DEBUG.log(pkg.name + ' has started.');
});

// wia.on('exit', function () {
// 	console.log('app.js has exited after 3 restarts');
// });

wia.start();