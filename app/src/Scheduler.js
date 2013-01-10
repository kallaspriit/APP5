define(
['Bindable', 'Util', 'Navi'],
function(Bindable, util, navi) {
	'use strict';

	/**
	 * Provides functionality for scheduling timeout and interval events.
	 *
	 * Can fire the following events:
	 *
	 *	> TIMEOUT_ADDED - fired before navigating to a new module action
	 *		component - component name
	 *
	 * @class Scheduler
	 * @extends Bindable
	 * @constructor
	 * @module Core
	 */
	var Scheduler = function() {
		this._timeouts = {};
	};

	/**
	 * Event types.
	 *
	 * @event
	 * @param {Object} Event
	 * @param {String} Event.TIMEOUT_ADDED Triggered when a new timeout is added
	 */
	Scheduler.prototype.Event = {
		TIMEOUT_ADDED: 'timeout-added'
	};

	Scheduler.prototype = new Bindable();

	/**
	 * Initiates the component.
	 *
	 * @method init
	 * @return {Scheduler} Self
	 */
	Scheduler.prototype.init = function() {
		var self = this;

		navi.bind(navi.Event.PRE_NAVIGATE, function() {
			// does not clear persistent timeouts
			self.clearTimeouts(null, false);
		});

		return this;
	};

	/**
	 * Represents a scheduler timeout.
	 *
	 * You should not instantsiate this yourself.
	 *
	 * @class Scheduler.Timeout
	 * @param {String} component Component name
	 * @param {Function} callback Callback to call
	 * @param {Number} milliseconds Timeout time in milliseconds
	 * @param {Boolean} persistent Should this timeout survive navigation
	 * @param {Array} parameters Optional parameters
	 * @constructor
	 * @module Core
	 */
	Scheduler.Timeout = function(component, callback, milliseconds, persistent, parameters) {
		var self = this;

		this._component = component;
		this._callback = callback;
		this._milliseconds = milliseconds;
		this._persistent = persistent;
		this._parameters = parameters;
		this._alive = true;

		this._id = window.setTimeout(function() {
			self._alive = false;

			if (util.typeOf(callback) === 'function') {
				callback.apply(self, parameters);
			}
		}, milliseconds);
	};

	/**
	 * Returns whether given timeout is still alive.
	 *
	 * @method isAlive
	 * @for Scheduler.Timeout
	 * @return {Boolean}
	 */
	Scheduler.Timeout.prototype.isAlive = function() {
		return this._alive;
	};

	/**
	 * Returns whether given timeout is persistent across navigation.
	 *
	 * @method isPersistent
	 * @for Scheduler.Timeout
	 * @return {Boolean}
	 */
	Scheduler.Timeout.prototype.isPersistent = function() {
		return this._persistent;
	};

	/**
	 * Cancels the timeout.
	 *
	 * @method cancel
	 * @for Scheduler.Timeout
	 */
	Scheduler.Timeout.prototype.cancel = function() {
		if (!this._alive) {
			return;
		}

		window.clearTimeout(this._id);

		this._alive = false;
	};

	/**
	 * Sets a timeout.
	 *
	 * By default, timeouts are cleared on every navigation event. This ensures that some timeouts don't remain active
	 * when the view has already changed. Should you want to keep your event while navigating, set persistent to true.
	 *
	 * @method setTimeout
	 * @for Scheduler
	 * @param {String} [component=general] Optional component name
	 * @param {Function} callback Callback to call
	 * @param {Number} milliseconds Timeout time in milliseconds
	 * @param {Boolean} [persistent=false] Should this timeout survive navigation
	 * @param {Array} [parameters] Optional parameters
	 * @return {Scheduler.Timeout}
	 */
	Scheduler.prototype.setTimeout = function(component, callback, milliseconds, persistent, parameters) {
		if (util.typeOf(component) === 'function') {
			component = 'general';
			callback = arguments[0];
			milliseconds = arguments[1];
			persistent = arguments[2];
			parameters = arguments[3];
		}

		persistent = util.typeOf(persistent) === 'undefined' ? false : util.bool(persistent);
		parameters = parameters || [];

		var timeout = new Scheduler.Timeout(component, callback, milliseconds, persistent, parameters);

		if (util.typeOf(this._timeouts[component]) === 'undefined') {
			this._timeouts[component] = [];
		}

		this._timeouts[component].push(timeout);

		this._purge();

		return timeout;
	};

	/**
	 * Cancels and clears all timeouts.
	 *
	 * @method clearTimeouts
	 * @param {String|null} [type=null] Set this if you wish to clear specific component
	 * @param {Boolean} [includingPersistent=true] Should persistent timeouts be cleared too
	 */
	Scheduler.prototype.clearTimeouts = function(type, includingPersistent) {
		type = type || null;
		includingPersistent = util.typeOf(includingPersistent) === 'undefined' ? true : util.bool(includingPersistent);

		var component,
			i;

		for (component in this._timeouts) {
			if (type !== null && component !== type) {
				continue;
			}

			for (i = 0; i < this._timeouts[component].length; i++) {
				if (includingPersistent || !this._timeouts[component][i].isPersistent()) {
					this._timeouts[component][i].cancel();
				}
			}
		}

		this._timeouts = {};
	};

	/**
	 * Cancels and clears all timeouts.
	 *
	 * @method _purge
	 * @private
	 */
	Scheduler.prototype._purge = function() {
		var component,
			i;

		for (component in this._timeouts) {
			for (i = 0; i < this._timeouts[component].length; i++) {
				if (!this._timeouts[component][i].isAlive()) {
					this._timeouts[component].splice(i, 1);
				}
			}
		}
	};

	return new Scheduler();
});