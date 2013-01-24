define(
['Bindable', 'Util'],
function(Bindable, util) {
	'use strict';

	/**
	 * Provides mouse events.
	 *
	 * Can fire the following events:
	 *
	 *	> MOUSEDOWN - fired on mouse down
	 *		info - Mouse.MouseEvent info
	 *	> MOUSEUP - fired on mouse up
	 *		info - Mouse.MouseEvent info
	 *	> MOUSEMOVE - fired on mouse move
	 *		info - Mouse.MouseEvent info
	 *
	 * @class Mouse
	 * @extends Bindable
	 * @constructor
	 * @module Core
	 */
	var Mouse = function() {
		this._buttonDown = [];
	};

	Mouse.prototype = new Bindable();

	/**
	 * Event types.
	 *
	 * @event
	 * @param {Object} Event
	 * @param {String} Event.MOUSEDOWN Triggered on mouse down
	 * @param {String} Event.MOUSEUP Triggered on mouse up
	 * @param {String} Event.MOUSEMOVE Triggered on mouse move
	 */
	Mouse.prototype.Event = {
		MOUSEDOWN: 'mousedown',
		MOUSEUP: 'mouseup',
		MOUSEMOVE: 'mousemove'
	};

	/**
	 * Represents mouse buttons.
	 *
	 * @property Button
	 * @type {Object}
	 */
	Mouse.prototype.Button = {
		LEFT: 0,
		MIDDLE: 1,
		RIGHT: 2
	};

	/**
	 * Represent a mouse event.
	 *
	 * @class Mouse.MouseEvent
	 * @param {Mouse.Event} type Either mousedown/mouseup/mousemove
	 * @param {Number} button Button id
	 * @param {Number} offsetX Relative to target element
	 * @param {Number} offsetY Relative to target element
	 * @param {Number} clientX Relative to the upper left edge of the browser window
	 * @param {Number} clientY Relative to the upper left edge of the browser window
	 * @param {Number} screenX Relative to the top left of the physical screen/monitor
	 * @param {Number} screenY Relative to the top left of the physical screen/monitor
	 * @param {Number} pageX Relative the to the top left of the fully rendered content area in the browser
	 * @param {Number} pageY Relative the to the top left of the fully rendered content area in the browser
	 * @param {Object} target Target element
	 * @param {Object} original Original event if available
	 * @constructor
	 * @module Core
	 */
	Mouse.MouseEvent = function(
		type,
		button,
		offsetX, offsetY,
		clientX, clientY,
		screenX, screenY,
		pageX, pageY,
		target,
		original
	) {
		this.type = type;
		this.button = button;
		this.offsetX = offsetX;
		this.offsetY = offsetY;
		this.clientX = clientX;
		this.clientY = clientY;
		this.screenX = screenX;
		this.screenY = screenY;
		this.pageX = pageX;
		this.pageY = pageY;
		this.target = target;
		this.original = original;
	};

	/**
	 * Initiates the component.
	 *
	 * @method init
	 * @return {Mouse} Self
	 */
	Mouse.prototype.init = function() {
		var self = this;

		$(document.body).bind('mousedown mouseup mousemove', function(e) {
			self.consume(self.generate(
				e.type,
				e.button,
				e.offsetX, e.offsetY,
				e.clientX, e.clientY,
				e.screenX, e.screenY,
				e.pageX, e.pageY,
				e.target,
				e.originalEvent
			));
		});

		return this;
	};

	/**
	 * Represent a mouse event.
	 *
	 * @method generate
	 * @param {String} type Either mousedown/mouseup/mousemove
	 * @param {Number} button Button id
	 * @param {Number} offsetX Relative to target element
	 * @param {Number} offsetY Relative to target element
	 * @param {Number} clientX Relative to the upper left edge of the browser window
	 * @param {Number} clientY Relative to the upper left edge of the browser window
	 * @param {Number} screenX Relative to the top left of the physical screen/monitor
	 * @param {Number} screenY Relative to the top left of the physical screen/monitor
	 * @param {Number} pageX Relative the to the top left of the fully rendered content area in the browser
	 * @param {Number} pageY Relative the to the top left of the fully rendered content area in the browser
	 * @param {Object} [target] Target element
	 * @param {Object} [original] Original event if available
	 * @constructor
	 * @module Core
	 */
	Mouse.prototype.generate = function(
		type,
		button,
		offsetX, offsetY,
		clientX, clientY,
		screenX, screenY,
		pageX, pageY,
		target,
		original
	) {
		button = util.isNumber(button) ? button : 0;
		clientX = util.isNumber(clientX) ? clientX : offsetX;
		clientY = util.isNumber(clientY) ? clientY : offsetY;
		screenX = util.isNumber(screenX) ? screenX : offsetX;
		screenY = util.isNumber(screenY) ? screenY : offsetY;
		pageX = util.isNumber(pageX) ? pageX : offsetX;
		pageY = util.isNumber(pageY) ? pageY : offsetY;
		original = !util.isUndefined(original) ? original : null;
		target = !util.isUndefined(target) ? target : null;

		return new Mouse.MouseEvent(
			type,
			button,
			offsetX, offsetY,
			clientX, clientY,
			screenX, screenY,
			pageX, pageY,
			target,
			original
		);
	};

	/**
	 * Consumes mouse event, passing it on to all listeners.
	 *
	 * @method consume
	 * @param {Mouse.MouseEvent} event Event to consume
	 */
	Mouse.prototype.consume = function(event) {
		if (event.type === this.Event.MOUSEDOWN) {
			if (!util.contains(this._buttonDown, event.button)) {
				this._buttonDown.push(event.button);
			}
		} else if (event.type === this.Event.MOUSEUP) {
			if (util.contains(this._buttonDown, event.button)) {
				util.remove(event.button, this._buttonDown);
			}
		} else if (event.type !== this.Event.MOUSEMOVE) {
			throw new Error('Unexpected mouse event type "' + event.type + '"');
		}

		this.fire({
			type: event.type,
			info: event
		});
	};

	/**
	 * Returns whether given button is currently down.
	 *
	 * @method isButtonDown
	 * @param {Number} button Button id
	 * @return {Boolean}
	 */
	Mouse.prototype.isButtonDown = function(button) {
		return util.contains(this._buttonDown, button);
	};

	return new Mouse();
});