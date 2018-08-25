# Wemo Insight Auto
Small Node.js app for autocontrolling Wemo Insight Switch devices. Subscribes an event to get live updates from a group of Wemo devices defined as controllers. Binary state changes on controllers _(enter standby, exit standby)_ switches on/off another group of controlled Wemo devices.

_E.g. when the microwave turns on, turn off the AC. And, when the microwave turns back off, turn on the AC._

## Install

[`nodejs`](https://nodejs.org) and [`npm`](https://npmjs.com) are required to install and use this service.

```bash
$ npm install -g wemo-insight-auto
```

## Usage

```bash
$ wemo-insight-auto -c /path/to/config.json
```

## Config

The script takes it's configuration from a JSON object following this format:

```json
{
	"devControlled": [
		{
			"wid": 762
		}
	],
	"devController": [
		{
			"wid": 766
		},
		{
			"wid": 708
		}
	]
}
```

A [`config.json.sample`](config.json.sample) file is provided in this package as a template. Feel free to copy and save it as `.json` on any location, just make sure to point out the full path to this file when running the script with the `-c | --config` command option (_-c /path/to/config.json_).

__Controlled vs Controller__

The `devControlled` property sets the Wemo devices that are going to be auto-managed by those defined in the `devController` property. Meaning, when a binary state changes on Wemo devices set under the `devController` key, it will trigger a signal to turn on/off the devices set under the `devControlled` key.

| Binary State on `devController` Devices | Action on `devControlled` Devices |
| ------------------- |---------------|
| enter standby mode  | turn ON Wemo switch |
| exit standby mode   | turn OFF Wemo switch |
| Wemo switch turned OFF | turn ON Wemo switch |

__Wemo Device ID__

The `"wid"` key stands for Wemo ID. The value for this key are the last three alphanumeric characters of the Wemo ID, (_e.g. WeMo.Insight.xxx_). This can be found at the back of the Wemo unit, or from the app at the edit device screen.

### Troubleshooting

It might happen the main app script to get stuck on error code `EHOSTUNREACH` after several hours running (maybe due to poor network performace). To get around this the app can also be run in _forever-monitor mode_. The app will restart itself everytime an instance of this error occurs.

```bash
$ wemo-insight-auto-forever -c /path/to/config.json
```
