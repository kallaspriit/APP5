define(
['Bindable'],
function (Bindable) {
	'use strict';

	/**
	 * Provides application debugging capabilities.
	 *
	 * Can fire the following events:
	 *
	 *	> ERROR - fired when a user error occurs
	 *		message - error message
	 *	> LOG - fired when a log message is added
	 *		message - log message
	 *	> CONSOLE - fired when user send something to display in console
	 *		args - console arguments
	 *	> ALERT - fired when alert is triggered
	 *		message - alert message
	 *
	 * @class Debug
	 * @extends Bindable
	 * @constructor
	 * @module Core
	 */
	var Debug = function () {
		this._queue = {
			error: [],
			log: [],
			console: [],
			alert: []
		};
		this._archive = {
			error: [],
			log: [],
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
	 * Event types.
	 *
	 * @event
	 * @param {Object} Event
	 * @param {String} Event.ERROR Error event
	 * @param {String} Event.CONSOLE Log to console
	 * @param {String} Event.LOG Log message
	 * @param {String} Event.ALERT Display alert to user
	 */
	Debug.prototype.Event = {
		ERROR: 'error',
		CONSOLE: 'console',
		LOG: 'log',
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

		if (this.numListeners(this.Event.ERROR) === 0) {
			return this;
		}

		while (this._queue.error.length > 0) {
			var msg = this._queue.error.shift();

			this.fire({
				type: this.Event.ERROR,
				message: msg
			});

			this._archive.error.push(msg);
		}

		return this;
	};

	/**
	 * Logs a message.
	 *
	 * The message is passed on to any listeners of given type.
	 *
	 * @method log
	 * @chainable
	 */
	Debug.prototype.log = function () {
		this._queue.log.push(arguments);

		if (this.numListeners(this.Event.LOG) === 0) {
			return this;
		}

		while (this._queue.log.length > 0) {
			var args = this._queue.log.shift();

			this.fire({
				type: this.Event.LOG,
				args: args
			});

			this._archive.log.push(args);
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

		if (this.numListeners(this.Event.CONSOLE) === 0) {
			return this;
		}

		while (this._queue.console.length > 0) {
			var args = this._queue.log.shift();

			this.fire({
				type: this.Event.CONSOLE,
				args: this._queue.console.shift()
			});

			this._archive.console.push(args);
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

		if (this.numListeners(this.Event.ALERT) === 0) {
			return this;
		}

		var propagate = true,
			result;

		while (this._queue.alert.length > 0) {
			var msg = this._queue.alert.shift();

			result = this.fire({
				type: this.Event.ALERT,
				message: msg
			});

			if (result === false) {
				propagate = false;
			}

			this._archive.alert.push(msg);
		}

		return propagate;
	};

	return new Debug();
});