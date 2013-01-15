define(
['Bindable', 'Util', 'jquery'],
function(Bindable, util, $) {
	'use strict';

	/**
	 * Provides key press events.
	 *
	 * Can fire the following events:
	 *
	 *	> KEY_DOWN - fired when key is pressed down
	 *		info - Keyboard.KeyEvent event
	 *	> KEY_UP - fired when key is released
	 *		info - Keyboard.KeyEvent event
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
		KEY_DOWN: 'key-down',
		KEY_UP: 'key-up'
	};

	/**
	 * Mapping of key-codes to key names.
	 *
	 * @property KN
	 * @type {Object}
	 */
	Keyboard.prototype.KN = {
		8: 'KEY_BACKSPACE',
		9: 'KEY_TAB',
		13: 'KEY_RETURN',
		16: 'KEY_SHIFT',
		17: 'KEY_CTRL',
		18: 'KEY_ALT',
		19: 'KEY_PAUSEBREAK',
		20: 'KEY_CAPSLOCK',
		27: 'KEY_ESCAPE',
		32: 'KEY_SPACE',
		33: 'KEY_PAGEUP',
		34: 'KEY_PAGEDOWN',
		35: 'KEY_END',
		36: 'KEY_HOME',
		37: 'KEY_LEFT',
		38: 'KEY_UP',
		39: 'KEY_RIGHT',
		40: 'KEY_DOWN',
		43: 'KEY_PLUS',
		44: 'KEY_PRINTSCREEN',
		45: 'KEY_INSERT',
		46: 'KEY_DELETE',
		48: 'KEY_0',
		49: 'KEY_1',
		50: 'KEY_2',
		51: 'KEY_3',
		52: 'KEY_4',
		53: 'KEY_5',
		54: 'KEY_6',
		55: 'KEY_7',
		56: 'KEY_8',
		57: 'KEY_9',
		65: 'KEY_A',
		66: 'KEY_B',
		67: 'KEY_C',
		68: 'KEY_D',
		69: 'KEY_E',
		70: 'KEY_F',
		71: 'KEY_G',
		72: 'KEY_H',
		73: 'KEY_I',
		74: 'KEY_J',
		75: 'KEY_K',
		76: 'KEY_L',
		77: 'KEY_M',
		78: 'KEY_N',
		79: 'KEY_O',
		80: 'KEY_P',
		81: 'KEY_Q',
		82: 'KEY_R',
		83: 'KEY_S',
		84: 'KEY_T',
		85: 'KEY_U',
		86: 'KEY_V',
		87: 'KEY_W',
		88: 'KEY_X',
		89: 'KEY_Y',
		90: 'KEY_Z',
		96: 'KEY_0',
		97: 'KEY_1',
		98: 'KEY_2',
		99: 'KEY_3',
		100: 'KEY_4',
		101: 'KEY_5',
		102: 'KEY_6',
		103: 'KEY_7',
		104: 'KEY_8',
		105: 'KEY_9',
		106: 'KEY_STAR',
		107: 'KEY_PLUS',
		109: 'KEY_DASH',
		111: 'KEY_SLASH',
		112: 'KEY_F1',
		113: 'KEY_F2',
		114: 'KEY_F3',
		115: 'KEY_F4',
		116: 'KEY_F5',
		117: 'KEY_F6',
		118: 'KEY_F7',
		119: 'KEY_F8',
		120: 'KEY_F9',
		121: 'KEY_F10',
		122: 'KEY_F11',
		123: 'KEY_F12',
		144: 'KEY_NUMLOCK',
		145: 'KEY_SCROLLLOCK',
		186: 'KEY_SEMICOLON',
		187: 'KEY_EQUALS',
		188: 'KEY_COMMA',
		189: 'KEY_DASH',
		190: 'KEY_FULLSTOP',
		192: 'KEY_APOSTROPHE',
		219: 'KEY_LEFT_SQUARE_BRACKET',
		220: 'KEY_ESC',
		221: 'KEY_RIGHT_SQUARE_BRACKET',
		222: 'KEY_SINGLE_QUATE'
	};

	/**
	 * Mapping of key names to key-codes.
	 *
	 * @property KC
	 * @type {Object}
	 */
	Keyboard.prototype.KC = {
		'KEY_BACKSPACE': 8,
		'KEY_TAB': 9,
		'KEY_RETURN': 13,
		'KEY_SHIFT': 16,
		'KEY_CTRL': 17,
		'KEY_ALT': 18,
		'KEY_PAUSEBREAK': 19,
		'KEY_CAPSLOCK': 20,
		'KEY_ESCAPE': 27,
		'KEY_SPACE': 32,
		'KEY_PAGEUP': 33,
		'KEY_PAGEDOWN': 34,
		'KEY_END': 35,
		'KEY_HOME': 36,
		'KEY_LEFT': 37,
		'KEY_UP': 38,
		'KEY_RIGHT': 39,
		'KEY_DOWN': 40,
		'KEY_PLUS': 107,
		'KEY_PRINTSCREEN': 44,
		'KEY_INSERT': 45,
		'KEY_DELETE': 46,
		'KEY_0': 96,
		'KEY_1': 97,
		'KEY_2': 98,
		'KEY_3': 99,
		'KEY_4': 100,
		'KEY_5': 101,
		'KEY_6': 102,
		'KEY_7': 103,
		'KEY_8': 104,
		'KEY_9': 105,
		'KEY_A': 65,
		'KEY_B': 66,
		'KEY_C': 67,
		'KEY_D': 68,
		'KEY_E': 69,
		'KEY_F': 70,
		'KEY_G': 71,
		'KEY_H': 72,
		'KEY_I': 73,
		'KEY_J': 74,
		'KEY_K': 75,
		'KEY_L': 76,
		'KEY_M': 77,
		'KEY_N': 78,
		'KEY_O': 79,
		'KEY_P': 80,
		'KEY_Q': 81,
		'KEY_R': 82,
		'KEY_S': 83,
		'KEY_T': 84,
		'KEY_U': 85,
		'KEY_V': 86,
		'KEY_W': 87,
		'KEY_X': 88,
		'KEY_Y': 89,
		'KEY_Z': 90,
		'KEY_STAR': 106,
		'KEY_DASH': 189,
		'KEY_SLASH': 111,
		'KEY_F1': 112,
		'KEY_F2': 113,
		'KEY_F3': 114,
		'KEY_F4': 115,
		'KEY_F5': 116,
		'KEY_F6': 117,
		'KEY_F7': 118,
		'KEY_F8': 119,
		'KEY_F9': 120,
		'KEY_F10': 121,
		'KEY_F11': 122,
		'KEY_F12': 123,
		'KEY_NUMLOCK': 144,
		'KEY_SCROLLLOCK': 145,
		'KEY_SEMICOLON': 186,
		'KEY_EQUALS': 187,
		'KEY_COMMA': 188,
		'KEY_FULLSTOP': 190,
		'KEY_APOSTROPHE': 192,
		'KEY_LEFT_SQUARE_BRACKET': 219,
		'KEY_ESC': 220,
		'KEY_RIGHT_SQUARE_BRACKET': 221,
		'KEY_SINGLE_QUATE': 222
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
	 * Initiates the component.
	 *
	 * @method init
	 * @return {Keyboard} Self
	 * @for Keyboard
	 */
	Keyboard.prototype.init = function() {
		var self = this;

		$(document.body).keydown(function(e) {
			self.consume(self.generate(
				'keydown',
				e.keyCode,
				e.altKey,
				e.ctrlKey,
				e.shiftKey,
				e.originalEvent
			));
		});

		$(document.body).keyup(function(e) {
			self.consume(self.generate(
				'keyup',
				e.keyCode,
				e.altKey,
				e.ctrlKey,
				e.shiftKey,
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
		if (util.isString(this.KN[keyCode])) {
			return this.KN[keyCode];
		} else {
			return 'KEY_UNKNOWN';
		}
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
		original = util.isObject(original) ? original : null;

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
		var eventType;

		if (event.type === 'keydown') {
			if (util.contains(this._keyDown, event.keyCode)) {
				event.repeated = true;
			} else {
				event.repeated = false;

				this._keyDown.push(event.keyCode);
			}

			eventType = this.Event.KEY_DOWN;
		} else if (event.type === 'keyup') {
			if (util.contains(this._keyDown, event.keyCode)) {
				util.remove(event.keyCode, this._keyDown);
			}

			eventType = this.Event.KEY_UP;
		} else {
			throw new Error('Unexpected key event type "' + event.type + '"');
		}

		this.fire({
			type: eventType,
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