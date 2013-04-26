define(
['Deferred', 'underscore'],
function(Deferred, _) {
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
				try {
					return JSON.stringify(arg);
				} catch (e) {
					return '[obj]';
				}
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
			return this.typeOf(arg) === 'object' && arg !== null;
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
		 * Returns whether given argument is empty.
		 *
		 * @method isEmpty
		 * @param {*} arg Argument to check
		 * @return {Boolean}
		 */
		isEmpty: function(arg) {
			return _.isEmpty(arg);
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
		 * Formats unit to millions/thousands.
		 *
		 * @method formatBytes
		 * @param {Number} amount Amount to format
		 * @return {String}
		 */
		formatBytes: function(amount) {
			amount = parseFloat(amount);

			if (isNaN(amount)) {
				return 'n/a';
			}

			var sign = amount >= 0 ? 1.0 : -1.0,
				absAmount = Math.abs(amount),
				unit = '',
				result;

			if (absAmount > 1000000) {
				result = (Math.floor(absAmount / 10000.0) / 100.0);
				unit = 'm';
			} else if (absAmount > 1000) {
				result = (Math.floor(absAmount / 100.0) / 10.0);
				unit = 'k';
			} else if (absAmount > 1) {
				result = Math.floor(absAmount);
			} else {
				result = Math.round(absAmount * 100.0) / 100.0;
			}

			return (result * sign).toString() + unit;
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
		 * Parses a URI into the following components:
		 * - source
		 * - protocol
		 * - authority
		 * - userInfo
		 * - user
		 * - password
		 * - host
		 * - port
		 * - relative
		 * - path
		 * - directory
		 * - file
		 * - query
		 * - anchor
		 *
		 * http://blog.stevenlevithan.com/archives/parseuri
		 * (c) Steven Levithan <stevenlevithan.com>
		 *
		 * @method parseUri
		 * @param {String} uri URI to parse
		 * @return {Object}
		 */
		parseURI: function(uri) {
			var	options = {
				strictMode: false,
				key: [
					'source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port',
					'relative', 'path', 'directory', 'file', 'query', 'anchor'
				],
				q: {
					name: 'queryKey',
					parser: /(?:^|&)([^&=]*)=?([^&]*)/g
				},
				parser: {
					/*jshint maxlen: 1024*/
					strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
					loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
					/*jshint maxlen: 120*/
				}
			},
			matches = options.parser[options.strictMode ? 'strict' : 'loose'].exec(uri),
			result = {},
			i = 14;

			while (i--) {
				result[options.key[i]] = matches[i] || '';
			}

			result[options.q.name] = {};
			result[options.key[12]].replace(options.q.parser, function ($0, $1, $2) {
				if ($1) {
					result[options.q.name][$1] = $2;
				}
			});

			return result;
		},

		/**
		 * Returns base URL.
		 *
		 * For http://example.com/dir/file?params it returns http://example.com/dir/.
		 *
		 * @method getBaseUrl
		 * @param {String} [uri] URI to use or window.location.href if not given
		 * @return {String}
		 */
		getBaseUrl: function(uri) {
			var tokens = this.parseURI(uri || window.location.href);

			return tokens.protocol + '://' + tokens.host + tokens.directory;
		},

		/**
		 * Normalizes object value types from generic string to int/float/boolean if possible.
		 *
		 * @method normalizeType
		 * @param {*} param Variable to normalize
		 * @return {*}
		 */
		normalizeType: function(param) {
			var type = this.typeOf(param);

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
		 * Converts names from some_var to someVar style.
		 *
		 * @method convertToCamelCase
		 * @param {String} str String to process
		 * @return {String}
		 */
		convertToCamelCase: function(str) {
			var underscorePos;

			while ((underscorePos = str.indexOf('_')) != -1) {
				str = str.substr(0, underscorePos) +
					(str.substr(underscorePos + 1, 1)).toUpperCase() + str.substr(underscorePos + 2);
			}

			return str;
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
				var index = _.indexOf(collection, item);

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

		/**
		 * Parses a line of a stack trace.
		 *
		 * Returns method, filename, line and column.
		 *
		 * @method parseStackLine
		 * @param {String} line Line to parse
		 * @return {Object}
		 */
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
			function getType(variable) {
				return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase();
			}

			function strRepeat(input, multiplier) {
				var output = [],
					i;

				for (i = multiplier; multiplier > 0; multiplier--) {
					output[multiplier] = input;
				}

				return output.join('');
			}

			var strFormat = function() {
				if (!strFormat.cache.hasOwnProperty(arguments[0])) {
					strFormat.cache[arguments[0]] = strFormat.parse(arguments[0]);
				}

				return strFormat.format.call(null, strFormat.cache[arguments[0]], arguments);
			};

			strFormat.format = function(parseTree, argv) {
				var cursor = 1,
					treeLength = parseTree.length,
					nodeType = '', arg,
					output = [],
					i,
					k,
					match,
					pad,
					padCharacter,
					padLength;

				for (i = 0; i < treeLength; i++) {
					nodeType = getType(parseTree[i]);

					if (nodeType === 'string') {
						output.push(parseTree[i]);
					}

					else if (nodeType === 'array') {
						match = parseTree[i]; // convenience purposes only

						if (match[2]) { // keyword argument
							arg = argv[cursor];

							for (k = 0; k < match[2].length; k++) {
								if (!arg.hasOwnProperty(match[2][k])) {
									throw new Error('[sprintf] property "' + match[2][k] + '" does not exist');
								}

								arg = arg[match[2][k]];
							}
						} else if (match[1]) { // positional argument (explicit)
							arg = argv[match[1]];
						} else { // positional argument (implicit)
							arg = argv[cursor++];
						}

						if (/[^s]/.test(match[8]) && (getType(arg) !== 'number')) {
							throw new Error('[sprintf] expecting number but found ' + getType(arg));
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
						padCharacter = match[4] ? match[4] == '0' ? '0' : match[4].charAt(1) : ' ';
						padLength = match[6] - String(arg).length;
						pad = match[6] ? strRepeat(padCharacter, padLength) : '';
						output.push(match[5] ? arg + pad : pad + arg);
					}
				}

				return output.join('');
			};

			strFormat.cache = {};

			var regex = /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/;

			strFormat.parse = function(fmt) {
				var _fmt = fmt,
					match = [],
					parseTree = [],
					argNames = 0;

				/*jshint bitwise: false*/
				while (_fmt) {
					if ((match = /^[^\x25]+/.exec(_fmt)) !== null) {
						parseTree.push(match[0]);
					} else if ((match = /^\x25{2}/.exec(_fmt)) !== null) {
						parseTree.push('%');
					} else if ((match = regex.exec(_fmt)) !== null) {
						if (match[2]) {
							argNames |= 1;

							var fieldList = [],
								replacementField = match[2],
								fieldMatch = [];

							if ((fieldMatch = /^([a-z_][a-z_\d]*)/i.exec(replacementField)) !== null) {
								fieldList.push(fieldMatch[1]);

								while ((replacementField = replacementField.substring(fieldMatch[0].length)) !== '') {
									if ((fieldMatch = /^\.([a-z_][a-z_\d]*)/i.exec(replacementField)) !== null) {
										fieldList.push(fieldMatch[1]);
									} else if ((fieldMatch = /^\[(\d+)\]/.exec(replacementField)) !== null) {
										fieldList.push(fieldMatch[1]);
									} else {
										throw new Error('[sprintf] huh?');
									}
								}
							} else {
								throw new Error('[sprintf] huh?');
							}
							match[2] = fieldList;
						} else {
							argNames |= 2;
						}

						if (argNames === 3) {
							throw new Error('[sprintf] mixing positional and named placeholders is not supported');
						}

						parseTree.push(match);
					} else {
						throw new Error('[sprintf] huh?');
					}

					_fmt = _fmt.substring(match[0].length);
				}
				/*jshint bitwise: true*/

				return parseTree;
			};

			return strFormat;
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
		 * Proxy to Deferred.when().
		 *
		 * @method when
		 */
		when: function() {
			return Deferred.when.apply(window, arguments);
		},

		/**
		 * Returns unique id.
		 *
		 * @method uid
		 * @return {String}
		 */
		uid: function () {
			/*jshint bitwise: false*/
			var S4 = function () {
				return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
			};
			/*jshint bitwise: true*/

			return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4());
		},

		/**
		 * Limits the given number to a range.
		 *
		 * If a single limit is given, limits maximum to given value. If both limits are given, limits the number
		 * between a..b.
		 *
		 * @method limit
		 * @param {Number} number Number to limit
		 * @param {Number} a First limit, max for single argument, min for two
		 * @param {Number} [b] Second max limit
		 * @return {Number}
		 */
		limit: function(number, a, b) {
			if (!this.isNumber(number)) {
				return number;
			}

			if (this.isUndefined(b)) {
				return Math.max(number, a);
			} else {
				return Math.min(Math.max(number, a), b);
			}
		},

		/**
		 * Does absolutely nothing.
		 *
		 * Can be useful for hiding unused parameters or || default callback etc.
		 *
		 * @method noop
		 */
		noop: function() {}
	};
});
