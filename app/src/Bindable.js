define(
function() {
"use strict";

/**
 * Event target base class used for custom events system.
 *
 * @class Bindable
 * @constructor
 */
var Bindable = function() {
	this.listeners = {};
};

/**
 * Adds a new listener of given type.
 *
 * @method bind
 * @param {String} type Type of listener to add
 * @param {Function} listener The listener function to add
 * @return {Function} The added listener
 */
Bindable.prototype.bind = function(type, listener) {
	if (typeof(type) === 'string') {
		type = [type];
	}

	for (var i = 0; i < type.length; i++) {
		// first of given type, create array
		if (typeof(this.listeners[type[i]]) === 'undefined') {
			this.listeners[type[i]] = [];
		}

		// check for an already existing listener for the same type
		for (var j = 0; j < this.listeners[type[i]].length; j++) {
			if (this.listeners[type[i]][j] === listener) {
				return listener;
			}
		}

		this.listeners[type[i]].push(listener);
	}

	return listener;
};

/**
 * Removes listener of given type.
 *
 * @method unbind
 * @param {String} type Type of listener to remove
 * @param {Function} listener The listener function to remove
 */
Bindable.prototype.unbind = function(type, listener) {
	// give up if none or requested type exist
	if (typeof(this.listeners[type]) === 'undefined') {
		return false;
	}

	// find it
	for (var i = 0; i < this.listeners[type].length; i++) {
		if (this.listeners[type][i] === listener) {
			// splice it out of the array
			this.listeners[type].splice(i, 1);

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
 * @method fire
 * @param {Object} event Event to fire
 */
Bindable.prototype.fire = function(event) {
	if (typeof(event) === 'string') {
		event = {
			type: event
		};
	}

	if (typeof(event.target) === 'undefined') {
		event.target = this;
	}

	if (typeof(event.type) === 'undefined') {
		throw 'Event "type" attribute is missing';
	}

	var propagate = true;

	if (typeof(this.listeners[event.type]) === 'object') {
		for (var i = 0; i < this.listeners[event.type].length; i++) {
			if (this.listeners[event.type][i].call(this, event) === false) {
				propagate = false;
			}
		}
	}

	return propagate;
};

/**
 * Returns the number of event listeners of given type.
 *
 * @method numEventListeners
 * @param {String} type Type of listener to add
 * @return {Number}
 */
Bindable.prototype.numEventListeners = function(type) {
	if (typeof(this.listeners[type]) === 'undefined') {
		return 0;
	}

	return this.listeners[type].length;
};

/**
 * Clears all listeners of a type or all if no type is given
 *
 * @method clearListeners
 * @param {String} type Type to clear, leave empty for all
 */
Bindable.prototype.clearListeners = function(type) {
	if (typeof(type) === 'undefined') {
		this.listeners = {};
	} else {
		this.listeners[type] = [];
	}
};

/**
 * Returns list of all listeners.
 *
 * If type is given, returns listeners for it, if not, returns all listeners
 * for all types.
 *
 * @method getListeners
 * @param {String} [type] Optional type
 * @return {object} Listeners
 */
Bindable.prototype.getListeners = function(type) {
	if (typeof(type) === 'string') {
		if (typeof(this.listeners[type]) !== 'undefined') {
			return this.listeners[type];
		} else {
			return null;
		}
	}

	return this.listeners;
};

return Bindable;

});