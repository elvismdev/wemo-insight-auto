# Wemo Insight Auto
Small Node.js app for autocontrolling Wemo Insight Switch devices (yet others not tested). Subscribes an event to get live updates from a group of devices defined as controllers. Binary state changes on controllers _(enter standby, left standby)_ switches on/off another group of controlled devices.

## Install

[`nodejs`](https://nodejs.org) and [`npm`](https://npmjs.com) are required to install and use this service.

```bash
$ npm install -g wemo-insight-auto
```

## Usage

```bash
$ wemo-insight-auto -c /path/to/config.json
```

