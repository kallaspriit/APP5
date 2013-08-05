define(
['underscore', 'core/EventEmitter', 'core/BaseUtil'],
function(_, EventEmitter, util) {
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
	 * @extends EventEmitter
	 * @constructor
	 * @module Core
	 */
	var Debug = function() {
		EventEmitter.call(this);

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

		var self = this;

		this._nativeAlert = window.alert;

		window.alert = function(message) {
			self.alert(message);
		};

		window.onerror = function(message, filename, line) {
			if (self._onError(message, filename, line) === false) {
				return false;
			}

			return true;
		};
	};

	Debug.prototype = Object.create(EventEmitter.prototype);

	/**
	 * Event types.
	 *
	 * @event Event
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

		this._queue.error.push([_.toArray(arguments), source]);
		this._flush();

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

		this._queue.log.push([_.toArray(arguments), source]);
		this._flush();

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

		this._queue.console.push([_.toArray(arguments), source]);
		this._flush();

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

		this._queue.alert.push([_.toArray(arguments), source]);
		this._flush();

		return this;
	};

	/**
	 * Called when a new listener is binded.
	 *
	 * Flushes debug events.
	 *
	 * @method _onBind
	 * @param {String} type Type of listener added
	 * @param {Function} listener The added listener function
	 * @protected
	 */
	Debug.prototype._onListenerAdded = function(/*type, listener*/) {
		this._flush();
	};

	/**
	 * Flushes all events to listeners.
	 *
	 * @method _flush
	 * @private
	 */
	Debug.prototype._flush = function() {
		var info,
			args,
			source;

		if (this.listenerCount(this.Event.ERROR) > 0) {
			while (this._queue.error.length > 0) {
				info = this._queue.error.shift();
				args = info[0];
				source = info[1];

				this.emit({
					type: this.Event.ERROR,
					args: args,
					source: source
				});

				this._archive.error.push(args);
			}
		}

		if (this.listenerCount(this.Event.LOG) > 0) {
			while (this._queue.log.length > 0) {
				info = this._queue.log.shift();
				args = info[0];
				source = info[1];

				this.emit({
					type: this.Event.LOG,
					args: args,
					source: source
				});

				this._archive.log.push(args);
			}
		}

		if (this.listenerCount(this.Event.CONSOLE) > 0) {
			while (this._queue.console.length > 0) {
				info = this._queue.console.shift();
				args = info[0];
				source = info[1];

				this.emit({
					type: this.Event.CONSOLE,
					args: args,
					source: source
				});

				this._archive.console.push(args);
			}
		}

		if (this.listenerCount(this.Event.ALERT) > 0) {
			while (this._queue.alert.length > 0) {
				info = this._queue.alert.shift();
				args = info[0];
				source = info[1];

				this.emit({
					type: this.Event.ALERT,
					args: args,
					source: source
				});

				this._archive.alert.push(args);
			}
		}
	};

	/**
	 * Called on JavaScript error.
	 *
	 * @method _onError
	 * @param {String} message Error message
	 * @param {String} filename Error source file
	 * @param {Number} line Line number
	 * @private
	 */
	Debug.prototype._onError = function(message, filename, line) {
		window.console.log('error', arguments);

		this.error(message, filename, line);
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

		// TODO Safari doesn't support the new Error() approach
		try {
			var stack = (new Error()).stack.split('\n'),
				stackLine = stack[index],
				matches = util.parseStackLine(stackLine);

			if (matches === null) {
				return null;
			} else if (matches.filename.substr(matches.filename.length - 8) == 'Debug.js' && index === 3) {
				return this._getSource(5);
			} else {
				return matches;
			}
		} catch (e) {
			return null;
		}
	};

	return new Debug();
});
