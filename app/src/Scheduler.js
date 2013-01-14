define(
['Bindable', 'Util', 'Navi'],
function(Bindable, util, navi) {
	'use strict';

	/**
	 * Provides functionality for scheduling timeout and interval events.
	 *
	 * @class Scheduler
	 * @constructor
	 * @module Core
	 */
	var Scheduler = function() {
		this._timeouts = {};
		this._intervals = {};
	};

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
			self.clear(null, false);
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
	 * @param {Boolean} interval Is the timeout of interval type
	 * @constructor
	 * @module Core
	 */
	Scheduler.Timeout = function(component, callback, milliseconds, persistent, parameters, interval) {
		var self = this;

		this._component = component;
		this._callback = callback;
		this._milliseconds = milliseconds;
		this._persistent = persistent;
		this._parameters = parameters;
		this._interval = interval;
		this._alive = true;
		this._counter = 0;

		if (this._interval) {
			this._id = window.setInterval(function() {
				self._counter++;

				if (util.isFunction(callback)) {
					callback.apply(self, parameters);
				}
			}, milliseconds);
		} else {
			this._id = window.setTimeout(function() {
				self._alive = false;

				if (util.isFunction(callback)) {
					callback.apply(self, parameters);
				}
			}, milliseconds);
		}
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
	 * Returns whether given timeout is of interval type.
	 *
	 * @method isInterval
	 * @for Scheduler.Timeout
	 * @return {Boolean}
	 */
	Scheduler.Timeout.prototype.isInterval = function() {
		return this._interval;
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

		if (this._interval) {
			window.clearInterval(this._id);
		} else {
			window.clearTimeout(this._id);
		}

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
		if (util.isFunction(component)) {
			component = 'general';
			callback = arguments[0];
			milliseconds = arguments[1];
			persistent = arguments[2];
			parameters = arguments[3];
		}

		persistent = util.isUndefined(persistent) ? false : util.bool(persistent);
		parameters = parameters || [];

		var isInterval = arguments.length === 6 && arguments[5] === true,
			timeout = new Scheduler.Timeout(component, callback, milliseconds, persistent, parameters, isInterval);

		if (util.isUndefined(this._timeouts[component])) {
			this._timeouts[component] = [];
		}

		this._timeouts[component].push(timeout);

		this._purge();

		return timeout;
	};

	/**
	 * Sets an interval.
	 *
	 * By default, intervals are cleared on every navigation event. This ensures that some intervals don't remain active
	 * when the view has already changed. Should you want to keep your event while navigating, set persistent to true.
	 *
	 * @method setInterval
	 * @param {String} [component=general] Optional component name
	 * @param {Function} callback Callback to call
	 * @param {Number} milliseconds Interval time in milliseconds
	 * @param {Boolean} [persistent=false] Should this timeout survive navigation
	 * @param {Array} [parameters] Optional parameters
	 * @return {Scheduler.Timeout}
	 */
	Scheduler.prototype.setInterval = function(component, callback, milliseconds, persistent, parameters) {
		return this.setTimeout(component, callback, milliseconds, persistent, parameters, true);
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
		includingPersistent = util.isUndefined(includingPersistent) ? true : util.bool(includingPersistent);

		var isInterval = arguments.length === 3 && arguments[2] === true,
			component,
			i;

		for (component in this._timeouts) {
			if (type !== null && component !== type) {
				continue;
			}

			for (i = 0; i < this._timeouts[component].length; i++) {
				if (
					(includingPersistent || !this._timeouts[component][i].isPersistent())
					&& this._timeouts[component][i].isInterval() === isInterval
				) {
					this._timeouts[component][i].cancel();
				}

				this._timeouts[component].splice(i, 1);
			}

			if (this._timeouts[component].length === 0) {
				delete this._timeouts[component];
			}
		}
	};

	/**
	 * Cancels and clears all intervals.
	 *
	 * @method clearIntervals
	 * @param {String|null} [type=null] Set this if you wish to clear specific component
	 * @param {Boolean} [includingPersistent=true] Should persistent intervals be cleared too
	 */
	Scheduler.prototype.clearIntervals = function(type, includingPersistent) {
		this.clearTimeouts(type, includingPersistent, true);
	};

	/**
	 * Cancels and clears all timeouts and intervals.
	 *
	 * @method clear
	 * @param {String|null} [type=null] Set this if you wish to clear specific component
	 * @param {Boolean} [includingPersistent=true] Should persistent timeouts be cleared too
	 */
	Scheduler.prototype.clear = function(type, includingPersistent) {
		this.clearTimeouts(type, includingPersistent);
		this.clearIntervals(type, includingPersistent);
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