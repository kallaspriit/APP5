define(
function() {
	'use strict';

	/**
	 * Event target base class used for custom events system.
	 *
	 * @class EventEmitter
	 * @constructor
	 * @module Core
	 */
	var EventEmitter = function() {
		this._listeners = {};
	};

	/**
	 * Adds a new listener of given type.
	 *
	 * @method on
	 * @param {String|Array} type Type of listener to add (or array of them)
	 * @param {Function} listener The listener function to add
	 * @return {Object} Containing the type, listener and removeListener method
	 */
	EventEmitter.prototype.on = function(type, listener) {
		if (typeof(type) === 'string') {
			type = [type];
		}

		var self = this,
			i;

		for (i = 0; i < type.length; i++) {
			// first of given type, create array
			if (typeof(this._listeners[type[i]]) === 'undefined') {
				this._listeners[type[i]] = [];
			}

			// check for an already existing listener for the same type
			for (var j = 0; j < this._listeners[type[i]].length; j++) {
				if (this._listeners[type[i]][j] === listener) {
					return listener;
				}
			}

			this._listeners[type[i]].push(listener);
		}

		this._onListenerAdded(type, listener);

		return {
			type: type,
			listener: listener,
			removeListener: function() {
				self.removeListener(type, listener);
			}
		};
	};

	/**
	 * Alias to on().
	 *
	 * @method addListener
	 * @param {String|Array} type Type of listener to add (or array of them)
	 * @param {Function} listener The listener function to add
	 * @return {Object} Containing the type, listener and removeListener method
	 */
	EventEmitter.prototype.addListener = function(type, listener) {
		return this.on(type, listener);
	};

	/**
	 * Called when a new listener is binded.
	 *
	 * This does noting by default but can be overriden in child class to do something when a listener is added.
	 *
	 * @method _onListenerAdded
	 * @param {String} type Type of listener added
	 * @param {Function} listener The added listener function
	 * @protected
	 */
	EventEmitter.prototype._onListenerAdded = function(/*type, listener*/) {};

	/**
	 * Removes listener of given type.
	 *
	 * If no type is given, all listeners are removed. If no listener is given, all listeners of given type are removed.
	 *
	 * @method removeListener
	 * @param {String|Array} [type] Type of listener to remove (or array of them)
	 * @param {Function} [listener] The listener function to remove
	 * @return {Boolean} Was removing the listener successful
	 */
	EventEmitter.prototype.removeListener = function(type, listener) {
		var i;

		if (typeof(type) === 'undefined') {
			this._listeners = {};

			return true;
		} else if (typeof(type) === 'object' && typeof(type.length) === 'number') {
			var result = true;

			for (i = 0; i < type.length; i++) {
				if (!this.removeListener(type[i], listener)) {
					result = false;
				}
			}

			return result;
		}

		if (typeof(listener) === 'undefined') {
			this._listeners[type] = [];

			return true;
		}

		// give up if none or requested type exist
		if (typeof(this._listeners[type]) === 'undefined') {
			return false;
		}

		// find it
		for (i = 0; i < this._listeners[type].length; i++) {
			if (this._listeners[type][i] === listener) {
				// splice it out of the array
				this._listeners[type].splice(i, 1);

				return true;
			}
		}

		return false;
	};

	/**
	 * Fire event
	 *
	 * The event can be a simple string meaning the event type to fire or
	 * an object containing type as key and optionally a target. If no
	 * target is given, the current context is used.
	 *
	 * Supports two formats:
	 * obj.emit('event-name', 'parameter 1', 'parameter 2..')
	 *
	 * And
	 * obj.emit({ type: 'event-name', parameter: 'something', another: 1);
	 *
	 * @method emit
	 * @param {Object} event Event to fire
	 */
	EventEmitter.prototype.emit = function(event) {
		var propagate = true,
			listType = false,
			result,
			i;

		if (typeof(event) === 'string') {
			event = {
				type: event,
				_arguments: []
			};

			if (arguments.length > 0) {
				for (i = 1; i < arguments.length; i++) {
					event._arguments.push(arguments[i]);
				}
			}

			listType = true;
		}

		if (typeof(event.target) === 'undefined') {
			event.target = this;
		}

		if (typeof(event.type) === 'undefined') {
			throw 'Event "type" attribute is missing';
		}

		if (typeof(this._listeners[event.type]) === 'object') {
			for (i = 0; i < this._listeners[event.type].length; i++) {
				if (listType) {
					result = this._listeners[event.type][i].apply(this, event._arguments);
				} else {
					result = this._listeners[event.type][i].call(this, event);
				}

				if (result === false) {
					propagate = false;
				}
			}
		}

		return propagate;
	};

	/**
	 * Returns the number of event listeners of given type.
	 *
	 * @method listenerCount
	 * @param {String} type Type of listener to get count of
	 * @return {Number}
	 */
	EventEmitter.prototype.listenerCount = function(type) {
		if (typeof(this._listeners[type]) === 'undefined') {
			return 0;
		}

		return this._listeners[type].length;
	};

	/**
	 * Clears all listeners of a type or all if no type is given
	 *
	 * @method removeAllListeners
	 * @param {String} type Type to clear, leave empty for all
	 */
	EventEmitter.prototype.removeAllListeners = function(type) {
		if (typeof(type) === 'undefined') {
			this._listeners = {};
		} else {
			this._listeners[type] = [];
		}
	};

	/**
	 * Returns list of all listeners.
	 *
	 * If type is given, returns listeners for it, if not, returns all listeners
	 * for all types.
	 *
	 * @method listeners
	 * @param {String} [type] Optional type
	 * @return {object} Listeners
	 */
	EventEmitter.prototype.listeners = function(type) {
		if (typeof(type) === 'string') {
			if (typeof(this._listeners[type]) !== 'undefined') {
				return this._listeners[type];
			} else {
				return [];
			}
		}

		return this._listeners;
	};

	return EventEmitter;
});