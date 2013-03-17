define(
['Bindable', 'Util', 'jquery'],
function(Bindable, util, $) {
	'use strict';

	/**
	 * Provides key press events.
	 *
	 * Can fire the following events:
	 *
	 *	> KEYDOWN - fired when key is pressed down
	 *		info - Keyboard.KeyEvent info
	 *	> KEYUP - fired when key is released
	 *		info - Keyboard.KeyEvent info
	 *
	 * @class Keyboard
	 * @extends Bindable
	 * @constructor
	 * @module Core
	 */
	var Keyboard = function() {
		this._keyDown = [];
	};

	Keyboard.prototype = new Bindable();

	/**
	 * Event types.
	 *
	 * @event
	 * @param {Object} Event
	 * @param {String} Event.KEY_DOWN Triggered on key down
	 * @param {String} Event.KEY_UP Triggered on key up
	 */
	Keyboard.prototype.Event = {
		KEYDOWN: 'keydown',
		KEYUP: 'keyup'
	};

	/**
	 * Mapping of key names to key-codes.
	 *
	 * @property KC
	 * @type {Object}
	 */
	Keyboard.prototype.KC = {
		'BACKSPACE': 8,
		'TAB': 9,
		'ENTER': 13,
		'SHIFT': 16,
		'CTRL': 17,
		'ALT': 18,
		'PAUSEBREAK': 19,
		'CAPSLOCK': 20,
		'ESCAPE': 27,
		'SPACE': 32,
		'PAGEUP': 33,
		'PAGEDOWN': 34,
		'END': 35,
		'HOME': 36,
		'LEFT': 37,
		'UP': 38,
		'RIGHT': 39,
		'DOWN': 40,
		'PLUS': 107,
		'PRINTSCREEN': 44,
		'INSERT': 45,
		'DELETE': 46,
		'NUM_0': 96,
		'NUM_1': 97,
		'NUM_2': 98,
		'NUM_3': 99,
		'NUM_4': 100,
		'NUM_5': 101,
		'NUM_6': 102,
		'NUM_7': 103,
		'NUM_8': 104,
		'NUM_9': 105,
		'A': 65,
		'B': 66,
		'C': 67,
		'D': 68,
		'E': 69,
		'F': 70,
		'G': 71,
		'H': 72,
		'I': 73,
		'J': 74,
		'K': 75,
		'L': 76,
		'M': 77,
		'N': 78,
		'O': 79,
		'P': 80,
		'Q': 81,
		'R': 82,
		'S': 83,
		'T': 84,
		'U': 85,
		'V': 86,
		'W': 87,
		'X': 88,
		'Y': 89,
		'Z': 90,
		'STAR': 106,
		'DASH': 189,
		'SLASH': 111,
		'F1': 112,
		'F2': 113,
		'F3': 114,
		'F4': 115,
		'F5': 116,
		'F6': 117,
		'F7': 118,
		'F8': 119,
		'F9': 120,
		'F10': 121,
		'F11': 122,
		'F12': 123,
		'NUMLOCK': 144,
		'SCROLLLOCK': 145,
		'SEMICOLON': 186,
		'EQUALS': 187,
		'COMMA': 188,
		'FULLSTOP': 190,
		'APOSTROPHE': 192,
		'LEFT_SQUARE_BRACKET': 219,
		'ESC': 220,
		'RIGHT_SQUARE_BRACKET': 221,
		'SINGLE_QUATE': 222
	};

	/**
	 * Represent a key event.
	 *
	 * @class Keyboard.KeyEvent
	 * @param {String} type Either keydown/keyup
	 * @param {Number} keyCode Key code
	 * @param {String} name Name of the key
	 * @param {Boolean} alt Is alt key pressed
	 * @param {Boolean} ctrl Is ctrl key pressed
	 * @param {Boolean} shift Is shift key pressed
	 * @param {Boolean} repeated Is this event repeated
	 * @param {Object} [original] Original event if available
	 * @constructor
	 * @module Core
	 */
	Keyboard.KeyEvent = function(type, keyCode, name, alt, ctrl, shift, repeated, original) {
		this.type = type;
		this.keyCode = keyCode;
		this.name = name;
		this.alt = alt;
		this.ctrl = ctrl;
		this.shift = shift;
		this.repeated = repeated;
		this.original = original;
	};

	/**
	 * Stops the propagation of the event.
	 *
	 * @method stopPropagation
	 */
	Keyboard.KeyEvent.prototype.stopPropagation = function() {
		if (this.original === null) {
			return;
		}

		this.original.stopPropagation();
	};

	/**
	 * Initiates the component.
	 *
	 * @method init
	 * @return {Keyboard} Self
	 * @for Keyboard
	 */
	Keyboard.prototype.init = function() {
		var self = this;

		$(document.body).keydown(function(e) {
			return self.consume(self.generate(
				self.Event.KEYDOWN,
				e.keyCode,
				e.altKey,
				e.ctrlKey,
				e.shiftKey,
				false,
				e.originalEvent
			));
		});

		$(document.body).keyup(function(e) {
			return self.consume(self.generate(
				self.Event.KEYUP,
				e.keyCode,
				e.altKey,
				e.ctrlKey,
				e.shiftKey,
				false,
				e.originalEvent
			));
		});

		return this;
	};

	/**
	 * Returns human-readable name of a key-code.
	 *
	 * If mapping is missing, "KEY_UNKNOWN" is returned.
	 *
	 * @method getKeyName
	 * @param {Number} keyCode Key-code to fetch
	 * @return {String}
	 */
	Keyboard.prototype.getKeyName = function(keyCode) {
		for (var keyName in this.KC) {
			if (this.KC[keyName] === keyCode) {
				return keyName;
			}
		}

		return 'KEY_UNKNOWN';
	};

	/**
	 * Generates a key event.
	 *
	 * @method generate
	 * @param {String} type Either keydown/keyup
	 * @param {Number} keyCode Key code
	 * @param {Boolean} [alt=false] Is alt key pressed
	 * @param {Boolean} [ctrl=false] Is ctrl key pressed
	 * @param {Boolean} [shift=false] Is shift key pressed
	 * @param {Boolean} [repeated=false] Is the event repeated
	 * @param {Object} [original=null] Original event if available
	 * @return {Keyboard.KeyEvent}
	 * @private
	 */
	Keyboard.prototype.generate = function(
		type,
		keyCode,
		alt,
		ctrl,
		shift,
		repeated,
		original
	) {
		alt = util.isBoolean(alt) ? alt : false;
		ctrl = util.isBoolean(ctrl) ? ctrl : false;
		shift = util.isBoolean(shift) ? shift : false;
		repeated = util.isBoolean(repeated) ? repeated : false;
		original = !util.isUndefined(original) ? original : null;

		return new Keyboard.KeyEvent(
			type,
			keyCode,
			this.getKeyName(keyCode),
			alt,
			ctrl,
			shift,
			repeated,
			original
		);
	};

	/**
	 * Consumes key event, passing it on to all listeners.
	 *
	 * @method consume
	 * @param {Keyboard.KeyEvent} event Event to consume
	 */
	Keyboard.prototype.consume = function(event) {
		if (event.type === this.Event.KEYDOWN) {
			if (util.contains(this._keyDown, event.keyCode)) {
				event.repeated = true;
			} else {
				event.repeated = false;

				this._keyDown.push(event.keyCode);
			}
		} else if (event.type === this.Event.KEYUP) {
			if (util.contains(this._keyDown, event.keyCode)) {
				util.remove(event.keyCode, this._keyDown);
			}
		} else {
			throw new Error('Unexpected key event type "' + event.type + '"');
		}

		return this.fire({
			type: event.type,
			info: event
		});
	};

	/**
	 * Returns whether given key is currently down.
	 *
	 * @method isKeyDown
	 * @param {Number} keyCode Key code
	 * @return {Boolean}
	 */
	Keyboard.prototype.isKeyDown = function(keyCode) {
		return util.contains(this._keyDown, keyCode);
	};

	return new Keyboard();
});
