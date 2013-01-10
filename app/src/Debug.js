define(
['Bindable', 'Util', 'underscore'],
function(Bindable, util, _) {
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
	var Debug = function() {
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
			existingAlertFunction = window.alert,
			existingErrorFunction = window.onerror;

		window.alert = function(message) {
			if (self.alert(message) !== false) {
				existingAlertFunction(message);
			}
		};

		window.onerror = function() {
			// @TODO Implement this

			existingErrorFunction.apply(existingErrorFunction, _.toArray(arguments));
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
	Debug.prototype.init = function() {
		return this;
	};

	/**
	 * Triggers a error message.
	 *
	 * The message is passed on to any listeners of given type.
	 *
	 * @method error
	 * @chainable
	 */
	Debug.prototype.error = function() {
		var source = this._getSource();

		this._queue.error.push(arguments);

		if (this.numListeners(this.Event.ERROR) === 0) {
			return this;
		}

		while (this._queue.error.length > 0) {
			var args = this._queue.error.shift();

			this.fire({
				type: this.Event.ERROR,
				args: args,
				source: source
			});

			this._archive.error.push(args);
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
	Debug.prototype.log = function() {
		var source = this._getSource();

		this._queue.log.push(arguments);

		if (this.numListeners(this.Event.LOG) === 0) {
			return this;
		}

		while (this._queue.log.length > 0) {
			var args = this._queue.log.shift();

			this.fire({
				type: this.Event.LOG,
				args: args,
				source: source
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
	Debug.prototype.console = function() {
		var source = this._getSource();

		this._queue.console.push(arguments);

		if (this.numListeners(this.Event.CONSOLE) === 0) {
			return this;
		}

		while (this._queue.console.length > 0) {
			var args = this._queue.log.shift();

			this.fire({
				type: this.Event.CONSOLE,
				args: this._queue.console.shift(),
				source: source
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
	 * @chainable
	 */
	Debug.prototype.alert = function() {
		var source = this._getSource();

		this._queue.alert.push(arguments);

		if (this.numListeners(this.Event.ALERT) === 0) {
			return this;
		}

		var propagate = true,
			result;

		while (this._queue.alert.length > 0) {
			var args = this._queue.alert.shift();

			result = this.fire({
				type: this.Event.ALERT,
				args: args,
				source: source
			});

			if (result === false) {
				propagate = false;
			}

			this._archive.alert.push(args);
		}

		return propagate;
	};

	/**
	 * Returns debug message source info.
	 *
	 * @method _getSource
	 * @param {Number} [index=3] Stack trace index
	 * @return {Object} Including method, filename, line, column
	 * @private
	 */
	Debug.prototype._getSource = function(index) {
		index = index || 3;

		var stack = (new Error()).stack,
			stackLine = stack.split('\n')[index],
			regex = /at (.+) \((.+):(\d+):(\d+)\)/;

		if (util.typeOf(stackLine) !== 'string' || !regex.test(stackLine)) {
			return null;
		}

		var	matches = regex.exec(stackLine);

		if (matches[2].substr(-8) == 'Debug.js' && index === 3) {
			return this._getSource(5);
		}

		return {
			method: matches[1],
			filename: matches[2],
			line: parseInt(matches[3], 10),
			column: parseInt(matches[4], 10)
		};
	};

	return new Debug();
});