define(
['BaseEvent', 'Util'],
function(BaseEvent, util) {
"use strict";

/**
    Creates a new Person.
    @constructor
	@class Test..
*/
var Debug = function() {
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
};

/**
 * Extend the BaseEvent for custom event handling.
 */
Debug.prototype = new BaseEvent();

/**
 * Debugger event types.
 */
Debug.prototype.Event = {
	ERROR: 'error',
	CONSOLE: 'console',
	SCREEN: 'screen',
	ALERT: 'alert'
};

/**
 * Initializes the debugger.
 */
Debug.prototype.init = function() {

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

	if (this.numEventListeners(this.Event.ERROR) === 0) {
		return;
	}

	while (this.queue.error.length > 0) {
		this.fire({
			type: this.Event.ERROR,
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

	if (this.numEventListeners(this.Event.SCREEN) === 0) {
		return;
	}

	while (this.queue.screen.length > 0) {
		this.fire({
			type: this.Event.SCREEN,
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

	if (this.numEventListeners(this.Event.ALERT) === 0) {
		return;
	}

	var propagate = true,
		result;

	while (this.queue.alert.length > 0) {
		result = this.fire({
			type: this.Event.ALERT,
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

	if (this.numEventListeners(this.Event.CONSOLE) === 0) {
		return;
	}

	while (this.queue.console.length > 0) {
		this.fire({
			type: this.Event.CONSOLE,
			args: this.queue.console.shift()
		});
	}
};

return new Debug();

});