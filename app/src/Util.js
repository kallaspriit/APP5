define(
['underscore'],
function(_) {
	'use strict';

	/**
	 * Provides generic utility methods.
	 *
	 * @class Util
	 * @static
	 * @module Core
	 */
	return {

		/**
		 * Rounds a number to precision.
		 *
		 * @method round
		 * @param {Number} value Value to round
		 * @param {Number} decimals Number of decimal places to keep
		 * @return {Number}
		 */
		round: function(value, decimals) {
			var d = Math.pow(10, decimals);

			return Math.round(value * d) / d;
		},

		/**
		 * Returns current date.
		 *
		 * @method date
		 * @return {Date}
		 */
		date: function() {
			return new Date();
		},

		/**
		 * Returns current microtime in seconds.
		 *
		 * @method microtime
		 * @return {Number}
		 */
		microtime: function() {
			return this.date().getTime() / 1000;
		},

		/**
		 * Clones given object.
		 *
		 * @method clone
		 * @param {Object} obj Object to clone
		 * @return {Object}
		 */
		clone: function(obj) {
			return _.clone(obj);
		},

		/**
		 * Extends given object.
		 *
		 * @method extend
		 * @param {Object} destination Object to extend
		 * @param {Object} sources* Any number of sources to extend with
		 * @return {Object}
		 */
		extend: function(destination, sources) {
			this.noop(destination, sources);

			return _.extend.apply(_, _.toArray(arguments));
		},

		/**
		 * Returns whether given collection contains an element.
		 *
		 * @method contains
		 * @param {Object} collection Collection to check
		 * @param {*} element Element to check for
		 * @return {Boolean}
		 */
		contains: function(collection, element) {
			return _.contains(collection, element);
		},

		/**
		 * Converts any type of argument to a string
		 *
		 * @method str
		 * @param {*} arg Argument to convert
		 * @return {String}
		 */
		str: function(arg) {
			if (arg === null) {
				return 'null';
			} else if (this.typeOf(arg) === 'string') {
				return arg;
			} else {
				return JSON.stringify(arg);
			}
		},

		/**
		 * Converts any type of argument to a boolean.
		 *
		 * @method bool
		 * @param {*} arg Argument to convert
		 * @return {Boolean}
		 */
		bool: function(arg) {
			return arg ? true : false;
		},

		/**
		 * Returns the type of given argument, always lowercase.
		 *
		 * Possible return values:
		 *
		 *	- string
		 *	- array
		 *	- number
		 *	- object
		 *	- function
		 *	- date
		 *	- math
		 *	- undefined
		 *	- null
		 *
		 * @method typeOf
		 * @param {*} arg Argument to get type of
		 * @return {String}
		 */
		typeOf: (function toType(global) {
			return function(arg) {
				if (typeof(arg) === 'undefined') {
					return 'undefined';
				} else if (arg === global) {
					return 'global';
				} else {
					return ({}).toString.call(arg).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
				}
			};
		})(this),

		/**
		 * Returns whether given argument is a function.
		 *
		 * @method isFunction
		 * @param {*} arg Argument to check
		 * @return {Boolean}
		 */
		isFunction: function(arg) {
			return this.typeOf(arg) === 'function';
		},

		/**
		 * Returns whether given argument is a string.
		 *
		 * @method isString
		 * @param {*} arg Argument to check
		 * @return {Boolean}
		 */
		isString: function(arg) {
			return this.typeOf(arg) === 'string';
		},

		/**
		 * Returns whether given argument is a boolean.
		 *
		 * @method isBoolean
		 * @param {*} arg Argument to check
		 * @return {Boolean}
		 */
		isBoolean: function(arg) {
			return this.typeOf(arg) === 'boolean';
		},

		/**
		 * Returns whether given argument is a number.
		 *
		 * @method isNumber
		 * @param {*} arg Argument to check
		 * @return {Boolean}
		 */
		isNumber: function(arg) {
			return this.typeOf(arg) === 'number';
		},

		/**
		 * Returns whether given argument is an array.
		 *
		 * @method isArray
		 * @param {*} arg Argument to check
		 * @return {Boolean}
		 */
		isArray: function(arg) {
			return this.typeOf(arg) === 'array';
		},

		/**
		 * Returns whether given argument is an array.
		 *
		 * @method isObject
		 * @param {*} arg Argument to check
		 * @return {Boolean}
		 */
		isObject: function(arg) {
			return this.typeOf(arg) === 'object';
		},

		/**
		 * Returns whether given argument is null.
		 *
		 * @method isNull
		 * @param {*} arg Argument to check
		 * @return {Boolean}
		 */
		isNull: function(arg) {
			return this.typeOf(arg) === 'null';
		},

		/**
		 * Returns whether given argument is date.
		 *
		 * @method isDate
		 * @param {*} arg Argument to check
		 * @return {Boolean}
		 */
		isDate: function(arg) {
			return this.typeOf(arg) === 'date';
		},

		/**
		 * Returns whether given argument is an error object.
		 *
		 * @method isError
		 * @param {*} arg Argument to check
		 * @return {Boolean}
		 */
		isError: function(arg) {
			return this.typeOf(arg) === 'error';
		},

		/**
		 * Returns whether given argument is undefined.
		 *
		 * @method isUndefined
		 * @param {*} arg Argument to check
		 * @return {Boolean}
		 */
		isUndefined: function(arg) {
			return this.typeOf(arg) === 'undefined';
		},

		/**
		 * Parses URL parameters from given path.
		 *
		 * @method parseUrlParameters
		 * @param {String} queryString The URL query string
		 * @return {Object}
		 */
		parseUrlParameters: function(queryString) {
			var parts = queryString.split('&'),
				parameters = {},
				part,
				tokens,
				tokenName,
				tokenValue,
				partKey;

			for (partKey in parts) {
				part = parts[partKey];
				tokens = part.split('=');
				tokenName = tokens[0];
				tokenValue = true;

				if (tokens.length === 2) {
					tokenValue = tokens[1];
				}

				parameters[tokenName] = tokenValue;
			}

			return this.normalizeType(parameters);
		},

		/**
		 * Returns map of URL parameters.
		 *
		 * @method getUrlParameters
		 * @return {Object}
		 */
		getUrlParameters: function() {
			var href = window.location.href,
				paramPos = href.indexOf('?');

			if (paramPos == -1) {
				return {};
			}

			return this.parseUrlParameters(href.substr(paramPos + 1));
		},

		/**
		 * Returns map of URL hash parameters.
		 *
		 * @method getHashParameters
		 * @return {Object}
		 */
		getHashParameters: function() {
			var hash = window.location.hash,
				paramPos = hash.indexOf('#');

			if (paramPos == -1) {
				return {};
			}

			return this.parseUrlParameters(hash.substr(paramPos + 1));
		},

		/**
		 * Normalizes object value types from generic string to int/float/boolean if possible.
		 *
		 * @method normalizeType
		 * @param {*} param Variable to normalize
		 * @return {*}
		 */
		normalizeType: function(param) {
			var type = this.type(param);

			if (type === 'string') {
				if (parseInt(param, 10) == param) {
					return parseInt(param, 10);
				} else if (parseFloat(param) == param) {
					return parseFloat(param);
				} else if (param.toLowerCase(param) === 'true') {
					return true;
				} else if (param.toLowerCase(param) === 'false') {
					return false;
				} else if (param.toLowerCase(param) === 'null') {
					return null;
				} else {
					return param;
				}
			} else if (type === 'object') {
				for (var key in param) {
					if (!param.hasOwnProperty(key)) {
						continue;
					}

					param[key] = this.normalizeType(param[key]);
				}

				return param;
			} else if (type === 'array') {
				for (var i = 0; i < param.length; i++) {
					param[i] = this.normalizeType(param[i]);
				}

				return param;
			} else {
				return param;
			}
		},

		/**
		 * Converts from controller-name to ControllerName style.
		 *
		 * @method convertEntityName
		 * @param {String} name Name to convert
		 * @return {String}
		 */
		convertEntityName: function(name) {
			var dashPos;

			while ((dashPos = name.indexOf('-')) != -1) {
				name = name.substr(0, dashPos) + (name.substr(dashPos + 1, 1)).toUpperCase() + name.substr(dashPos + 2);
			}

			return name.substr(0, 1).toUpperCase() + name.substr(1);
		},

		/**
		 * Converts from action-name to actionName style.
		 *
		 * @method convertCallableName
		 * @param {String} name Name to convert
		 * @return {String}
		 */
		convertCallableName: function(name) {
			var dashPos;

			while ((dashPos = name.indexOf('-')) != -1) {
				name = name.substr(0, dashPos) + (name.substr(dashPos + 1, 1)).toUpperCase() + name.substr(dashPos + 2);
			}

			return name;
		},

		/**
		 * Formats path for shorter read.
		 *
		 * @method formatPath
		 * @param {String} path Path to format
		 * @return {String}
		 */
		formatPath: function(path) {
			var regex = /http:\/\/.+?\/(.+)/,
				matches = regex.exec(path);

			if (matches === null) {
				return path;
			}

			return matches[1];
		},

		/**
		 * Removes an item from collection.
		 *
		 * @method remove
		 * @param {*} item Item to remove
		 * @param {Array|Object} collection Collection to remove from
		 * @return {Boolean}
		 */
		remove: function(item, collection) {
			var type = this.typeOf(collection);

			if (type === 'array') {
				var index = collection.indexOf(item);

				if (index === -1) {
					return false;
				}

				collection.splice(index, 1);

				return true;
			} else if (type === 'object') {
				var key;

				for (key in collection) {
					if (collection[key] === item) {
						delete collection[key];

						return true;
					}
				}

				return false;
			} else {
				throw new Error('Unable to remove item, invalid collection');
			}
		},

		parseStackLine: function(line) {
			var regex = /at (.+) \((.+):(\d+):(\d+)\)/,
				matches = regex.exec(line);

			if (matches === null) {
				return null;
			}

			return {
				method: matches[1],
				filename: matches[2],
				line: parseInt(matches[3], 10),
				column: parseInt(matches[4], 10)
			};
		},

		/**
		 * Provides string formatting functionality.
		 *
		 * http://www.diveintojavascript.com/projects/javascript-sprintf
		 *
		 * @method sprintf
		 */
		sprintf: (function() {
			function get_type(variable) {
				return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase();
			}
			function str_repeat(input, multiplier) {
				for (var output = []; multiplier > 0; output[--multiplier] = input) {/* do nothing */}
				return output.join('');
			}

			var str_format = function() {
				if (!str_format.cache.hasOwnProperty(arguments[0])) {
					str_format.cache[arguments[0]] = str_format.parse(arguments[0]);
				}
				return str_format.format.call(null, str_format.cache[arguments[0]], arguments);
			};

			str_format.format = function(parse_tree, argv) {
				var cursor = 1, tree_length = parse_tree.length, node_type = '', arg, output = [], i, k, match, pad, pad_character, pad_length;
				for (i = 0; i < tree_length; i++) {
					node_type = get_type(parse_tree[i]);
					if (node_type === 'string') {
						output.push(parse_tree[i]);
					}
					else if (node_type === 'array') {
						match = parse_tree[i]; // convenience purposes only
						if (match[2]) { // keyword argument
							arg = argv[cursor];
							for (k = 0; k < match[2].length; k++) {
								if (!arg.hasOwnProperty(match[2][k])) {
									throw(sprintf('[sprintf] property "%s" does not exist', match[2][k]));
								}
								arg = arg[match[2][k]];
							}
						}
						else if (match[1]) { // positional argument (explicit)
							arg = argv[match[1]];
						}
						else { // positional argument (implicit)
							arg = argv[cursor++];
						}

						if (/[^s]/.test(match[8]) && (get_type(arg) != 'number')) {
							throw(sprintf('[sprintf] expecting number but found %s', get_type(arg)));
						}
						switch (match[8]) {
							case 'b': arg = arg.toString(2); break;
							case 'c': arg = String.fromCharCode(arg); break;
							case 'd': arg = parseInt(arg, 10); break;
							case 'e': arg = match[7] ? arg.toExponential(match[7]) : arg.toExponential(); break;
							case 'f': arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg); break;
							case 'o': arg = arg.toString(8); break;
							case 's': arg = ((arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg); break;
							case 'u': arg = Math.abs(arg); break;
							case 'x': arg = arg.toString(16); break;
							case 'X': arg = arg.toString(16).toUpperCase(); break;
						}
						arg = (/[def]/.test(match[8]) && match[3] && arg >= 0 ? '+'+ arg : arg);
						pad_character = match[4] ? match[4] == '0' ? '0' : match[4].charAt(1) : ' ';
						pad_length = match[6] - String(arg).length;
						pad = match[6] ? str_repeat(pad_character, pad_length) : '';
						output.push(match[5] ? arg + pad : pad + arg);
					}
				}
				return output.join('');
			};

			str_format.cache = {};

			str_format.parse = function(fmt) {
				var _fmt = fmt, match = [], parse_tree = [], arg_names = 0;
				while (_fmt) {
					if ((match = /^[^\x25]+/.exec(_fmt)) !== null) {
						parse_tree.push(match[0]);
					}
					else if ((match = /^\x25{2}/.exec(_fmt)) !== null) {
						parse_tree.push('%');
					}
					else if ((match = /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(_fmt)) !== null) {
						if (match[2]) {
							arg_names |= 1;
							var field_list = [], replacement_field = match[2], field_match = [];
							if ((field_match = /^([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
								field_list.push(field_match[1]);
								while ((replacement_field = replacement_field.substring(field_match[0].length)) !== '') {
									if ((field_match = /^\.([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
										field_list.push(field_match[1]);
									}
									else if ((field_match = /^\[(\d+)\]/.exec(replacement_field)) !== null) {
										field_list.push(field_match[1]);
									}
									else {
										throw('[sprintf] huh?');
									}
								}
							}
							else {
								throw('[sprintf] huh?');
							}
							match[2] = field_list;
						}
						else {
							arg_names |= 2;
						}
						if (arg_names === 3) {
							throw('[sprintf] mixing positional and named placeholders is not (yet) supported');
						}
						parse_tree.push(match);
					}
					else {
						throw('[sprintf] huh?');
					}
					_fmt = _fmt.substring(match[0].length);
				}
				return parse_tree;
			};

			return str_format;
		})(),

		/**
		 * Provides string formatting functionality.
		 *
		 * This one expects the arguments as an array.
		 *
		 * http://www.diveintojavascript.com/projects/javascript-sprintf
		 *
		 * @method vsprintf
		 */
		vsprintf: function(fmt, argv) {
			argv.unshift(fmt);

			return this.sprintf.apply(null, argv);
		},

		/**
		 * Returns unique id.
		 *
		 * @return {String}
		 */
		uid: function () {
			var S4 = function () {
				return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
			};
			return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
		},

		/**
		 * Does absolutely nothing.
		 *
		 * Can be useful for hiding unused parameters etc.
		 *
		 * @method noop
		 */
		noop: function() {}
	};
});