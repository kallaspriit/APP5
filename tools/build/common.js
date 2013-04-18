(function() {
	'use strict';

	function exec(command, callback) {
		require('child_process').exec(command, function(error, response) {
			callback(response.replace(/\s$/, ''));
		});
	}

	function getVersion(callback) {
		exec('git describe --tags --long', function(response) {
			var tokens = response.split('-');

			if (tokens.length !== 3) {
				callback(null);

				return null;
			}

			callback({
				major: tokens[0],
				minor: tokens[1],
				hash: tokens[2]
			});
		});
	}

	function getHostname(callback) {
		exec('hostname', callback);
	}

	module.exports = {
		exec: exec,
		getVersion: getVersion,
		getHostname: getHostname
	};
})();