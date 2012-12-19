define(['BaseEvent'], function(BaseEvent) {

	/**
	 * Debugging helper.
	 *
	 * Can fire the following events:
	 * > ERROR - fired when a user error occurs
	 *	message - error message
	 * > SCREEN - fired when a screen debug message is added
	 *	message - error message
	 * > CONSOLE - fired when user send something to display in console
	 *	args - console arguments
	 */
	var Debug = function() {
		console.log('DEBUG LOADED');

		this.messages = [];
		this.boxes = {};
		this.boxCount = 0;
		this.boxLifetime = 1.0;
		this.queue = {
			error: [],
			screen: [],
			console: [],
			alert: []
		};
		this.loggedErrors = [];

		var self = this,
			existingAlertFunction = window.alert;

		window.alert = function(message) {
			if (self.alert(message) !== false) {
				existingAlertFunction(message);
			}
		};

		window.setInterval(function() {
			//self.update();
		}, 500);
	};

	/**
	 * Extend the BaseEvent for custom event handling.
	 */
	Debug.prototype = new BaseEvent();

	/**
	 * Debugger event types.
	 */
	Debug.Event = {
		ERROR: 'error',
		CONSOLE: 'console',
		SCREEN: 'screen',
		ALERT: 'alert'
	};

	/**
	* Triggers a error message.
	*
	* The message is passed on to any listeners of given type.
	*
	* @param {string} message Message
	*/
	Debug.prototype.error = function(message) {
		this.queue.error.push(message);

		if (this.numEventListeners(Debug.Event.ERROR) === 0) {
			return;
		}

		while (this.queue.error.length > 0) {
			this.fire({
				type: Debug.Event.ERROR,
				message: this.queue.error.shift()
			});
		}
	};

	/**
	 * Triggers a screen log message.
	 *
	 * The message is passed on to any listeners of given type.
	 */
	Debug.prototype.screen = function() {
		this.queue.screen.push(arguments);

		if (this.numEventListeners(Debug.Event.SCREEN) === 0) {
			return;
		}

		while (this.queue.screen.length > 0) {
			this.fire({
				type: Debug.Event.SCREEN,
				args: this.queue.screen.shift()
			});
		}
	};

	/**
	 * Triggers a alert log message.
	 *
	 * Usually you dont use this directly but captures normal alerts instead.
	 *
	 * The message is passed on to any listeners of given type.
	 *
	 * @param {string} message Message
	 */
	Debug.prototype.alert = function(message) {
		this.queue.alert.push(message);

		if (this.numEventListeners(Debug.Event.ALERT) === 0) {
			return;
		}

		var propagate = true,
			result;

		while (this.queue.alert.length > 0) {
			result = this.fire({
				type: Debug.Event.ALERT,
				message: this.queue.alert.shift()
			});

			if (result === false) {
				propagate = false;
			}
		}

		return propagate;
	};

	/**
	 * Logs data to console if available.
	*/
	Debug.prototype.console = function() {
		this.queue.console.push(arguments);

		if (this.numEventListeners(Debug.Event.CONSOLE) === 0) {
			return;
		}

		while (this.queue.console.length > 0) {
			this.fire({
				type: Debug.Event.CONSOLE,
				args: this.queue.console.shift()
			});
		}
	};

	/**
	* Displays a debugging box on the screen.
	*
	* This disappears in a little while if not updated with the same name.
	*
	* @param {string} name Name of the box
	* @param {any} [value] Value of the property
	* @param {integer} [numberDecimals] For optionally rounding value
	*
	Debug.prototype.box = function(name, value, numberDecimals) {
		if (!config.debug) {
			return;
		}

		if (this.boxes[name] == null) {
			var container = $('#debug-wrap');

			if (container.length == 0) {
				$(document.body).append($('<ul/>', {
					'id': 'debug-wrap'
				}));

				container = $('#debug-wrap');
			}

			var boxId = 'debug-box-' + this.boxCount;

			container.append($('<li/>', {
				'id': boxId,
				'class': 'debug-value'
			}));

			var boxElement = $('#' + boxId);

			this.boxes[name] = {
				id: boxId,
				element: boxElement,
				firstValue: value,
				lastValue: value,
				lastUpdated: Util.getMicrotime()
			};

			this.boxCount++;
		}

		var box = this.boxes[name],
			element = box.element,
			displayValue = value;

		box.lastUpdated = Util.getMicrotime();

		if (typeof(value) == 'number' && typeof(numberDecimals) == 'number') {
			displayValue = Util.round(value, numberDecimals);
		}

		element.html('<strong>' + name + '</strong>' + (typeof(displayValue) != 'undefined' ? ': <span>' + displayValue + '</span>' : ''));

		box.lastValue = value;
	};

	/**
	* Updates the debug interface, removing boxes as they age.
	*
	Debug.prototype.update = function() {
		for (var name in this.boxes) {
			if (Util.getMicrotime() - this.boxes[name].lastUpdated > this.boxLifetime) {
				$(this.boxes[name].element).remove();

				delete this.boxes[name];
			}
		}
	};*/

	/**
	* Logs an error to a server.
	*
	Debug.prototype.log = function(message, filename, line) {
		var version = config.version,
			serial = device.getSerialNumber(),
			mac = device.getMACAddress(),
			messageDNA = message + '|' + filename + '|' + line;

		for (var i = 0; i < this.loggedErrors.length; i++) {
			if (this.loggedErrors[i] == messageDNA) {
				return;
			}
		}

		this.loggedErrors.push(messageDNA);
	};*/

	return new Debug();
});