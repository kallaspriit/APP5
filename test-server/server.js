(function() {
	'use strict';

	// https://github.com/einaros/ws
	var WebSocketServer = require('ws').Server,
		wss = new WebSocketServer({
			host: '127.0.0.1',
			port: 10082
		}),
		clients = [],
		clientIdCounter = 0,
		masterId = null;

	function notifySlaves(request) {
		for (var i = 0; i < clients.length; i++) {
			if (clients[i].id == masterId) {
				continue;
			}

			clients[i].send(JSON.stringify(request));
		}
	}

	function updateConfig() {
		for (var i = 0; i < clients.length; i++) {
			clients[i].send(JSON.stringify({
				type: 'setup',
				id: clients[i].id,
				masterId: masterId,
				clients: clients.length
			}));
		}
	}

	var handlers = {
		becomeMaster: function(parameters, ws) {
			masterId = ws.id;

			console.log('! Master is now #' + masterId);
		},

		forward: function(action, parameters) {
			notifySlaves({
				type: 'request',
				action: action,
				parameters: parameters
			});
		}
	};

	wss.on('connection', function(ws) {
		ws.id = clientIdCounter++;

		if (masterId === null) {
			handlers.becomeMaster({}, ws);
		}

		clients.push(ws);

		console.log('! Client #' + ws.id + ' connected (' + clients.length + ' total)');

		ws.on('message', function(message) {
			console.log('[' + ws.id + '] > %s', message);

			if (message.substr(0, 1) === '{') {
				var request = JSON.parse(message),
					parameters = request.parameters,
					responseData;

				if (typeof(handlers[request.handler]) === 'function') {
					responseData = handlers[request.handler].call(handlers[request.handler], parameters, ws);
				} else {
					responseData = handlers.forward.call(handlers.forward, request.handler, parameters, ws);
				}

				if (request.expectResponse) {
					var response = {
						type: 'response',
						requestId: request.id,
						data: responseData
					};

					ws.send(JSON.stringify(response));
				}
			}
		});

		ws.on('close', function() {
			var newClients = [],
				i;

			for (i = 0; i < clients.length; i++) {
				if (clients[i] === ws) {
					console.log('! Client #' + clients[i].id + ' disconnected');

					if (clients[i].id === masterId) {
						masterId = null;
					}

					continue;
				}

				newClients.push(clients[i]);
			}

			clients = newClients;

			updateConfig();
		});

		ws.send = function(data) {
			if (this.ws.readyState !== 1) {
				console.log(
					'- Unable to send message to #' + this.ws.id + ', invalid state: ' + this.ws.readyState, data
				);

				return;
			}

			console.log('[' + this.ws.id + '] < %s', data);

			return this.realSend.call(this.ws, data);
		}.bind({ ws: ws, realSend: ws.send });

		updateConfig();
	});
})();