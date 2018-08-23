// Debug to console with date.
module.exports = (function(){
	var timestamp = function(){};
	timestamp.toString = function(){
		let options = { weekday: "short", month: "short", day: "2-digit", hour12: false, year: "numeric" };
		return "[" + (new Date).toLocaleTimeString('en-US', options).replace(/,/g, '') + "]";
	};

	return {
		log: console.log.bind(console, '%s', timestamp)
	}
})();