(function() {
	'use strict';

	var WebSocket = require('ws'),
		ws = new WebSocket('ws://127.0.0.1:8080/');

	ws.on('open', function() {
		ws.send('Hey dude!');
	});

	ws.on('message', function(data, flags) {
		ws.send('You sent: ' + data);
		// flags.binary will be set if a binary data is received
		// flags.masked will be set if the data was masked
	});
})();