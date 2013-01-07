define(
['jquery', 'Bindable', 'Debug'],
function($, Bindable, dbg) {
	'use strict';

	/**
	 * Manages the user interface.
	 *
	 * Can fire the following events:
	 *
	 *	> READY - fired when ui is ready
	 *
	 * @class UI
	 * @extends Bindable
	 * @constructor
	 * @module Core
	 */
	var UI = function() {

	};

	UI.prototype = new Bindable();

	/**
	 * Debugger event types.
	 *
	 * @event
	 * @param {Object} Event
	 * @param {String} Event.READY UI is ready
	 */
	UI.prototype.Event = {
		READY: 'ready'
	};

	/**
	 * Initializes the debugger.
	 *
	 * @method init
	 * @return {UI} Self
	 */
	UI.prototype.init = function() {
		var self = this;

		this._initDebugListeners();

		$(document).ready(function() {
			self._onDocumentReady();
		});

		return this;
	};

	/**
	 * Initializes the debug listeners.
	 *
	 * @method _initDebugListeners
	 * @return {Debug} Self
	 * @private
	 */
	UI.prototype._initDebugListeners = function() {
		dbg.bind(dbg.Event.CONSOLE, function(e) {
			console.log('CONSOLE', e);
		});

		return this;
	};

	/**
	 * Called on document ready.
	 *
	 * @method _onDocumentReady
	 * @private
	 */
	UI.prototype._onDocumentReady = function() {
		this.fire({
			type: this.Event.READY
		});

		$(document.body).css('background-color', '#0F0');
	};

	return new UI();
});