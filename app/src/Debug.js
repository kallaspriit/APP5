define(
['Bindable'],
function (Bindable) {
	"use strict";

	/**
	 * Provides application debugging capabilities.
	 *
	 * Can fire the following events:
	 *
	 *	> ERROR - fired when a user error occurs
	 *		message - error message
	 *	> SCREEN - fired when a screen debug message is added
	 *		message - error message
	 *	> CONSOLE - fired when user send something to display in console
	 *		args - console arguments
	 *	> ALERT - fired when alert is triggered
	 *		message - alert message
	 *
	 * @class Debug
	 * @extends Bindable
	 * @constructor
	 */
	var Debug = function () {
		this._queue = {
			error: [],
			screen: [],
			console: [],
			alert: []
		};

		var self = this,
			existingAlertFunction = window.alert;

		window.alert = function (message) {
			if (self.alert(message) !== false) {
				existingAlertFunction(message);
			}
		};
	};

	Debug.prototype = new Bindable();

	/**
	 * Debugger event types.
	 *
	 * @event
	 * @param {Object} Event
	 * @param {String} Event.ERROR Error event
	 * @param {String} Event.CONSOLE Log to console
	 * @param {String} Event.SCREEN Display on screen
	 * @param {String} Event.ALERT Display alert to user
	 */
	Debug.prototype.Event = {
		ERROR: 'error',
		CONSOLE: 'console',
		SCREEN: 'screen',
		ALERT: 'alert'
	};

	/**
	 * Initializes the debugger.
	 *
	 * @method init
	 * @return {Debug} Self
	 */
	Debug.prototype.init = function () {
		return this;
	};

	/**
	 * Triggers a error message.
	 *
	 * The message is passed on to any listeners of given type.
	 *
	 * @method error
	 * @param {String} message Message
	 * @chainable
	 */
	Debug.prototype.error = function (message) {
		this._queue.error.push(message);

		if (this.numEventListeners(this.Event.ERROR) === 0) {
			return this;
		}

		while (this._queue.error.length > 0) {
			this.fire({
				type: this.Event.ERROR,
				message: this._queue.error.shift()
			});
		}

		return this;
	};

	/**
	 * Triggers a screen log message.
	 *
	 * The message is passed on to any listeners of given type.
	 *
	 * @method screen
	 * @chainable
	 */
	Debug.prototype.screen = function () {
		this._queue.screen.push(arguments);

		if (this.numEventListeners(this.Event.SCREEN) === 0) {
			return this;
		}

		while (this._queue.screen.length > 0) {
			this.fire({
				type: this.Event.SCREEN,
				args: this._queue.screen.shift()
			});
		}

		return this;
	};

	/**
	 * Logs data to console if available.
	 *
	 * @method console
	 * @chainable
	 */
	Debug.prototype.console = function () {
		this._queue.console.push(arguments);

		if (this.numEventListeners(this.Event.CONSOLE) === 0) {
			return this;
		}

		while (this._queue.console.length > 0) {
			this.fire({
				type: this.Event.CONSOLE,
				args: this._queue.console.shift()
			});
		}

		return this;
	};

	/**
	 * Triggers a alert log message.
	 *
	 * Usually you don't use this directly but captures normal alerts instead.
	 *
	 * The message is passed on to any listeners of given type.
	 *
	 * @method alert
	 * @param {String} message Message
	 * @chainable
	 */
	Debug.prototype.alert = function (message) {
		this._queue.alert.push(message);

		if (this.numEventListeners(this.Event.ALERT) === 0) {
			return this;
		}

		var propagate = true,
			result;

		while (this._queue.alert.length > 0) {
			result = this.fire({
				type: this.Event.ALERT,
				message: this._queue.alert.shift()
			});

			if (result === false) {
				propagate = false;
			}
		}

		return propagate;
	};

	return new Debug();
});