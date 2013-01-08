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
		 * Converts any type of argument to a string
		 *
		 * @method toString
		 * @param {*} arg
		 * @return {*}
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

		typeOf: (function toType(global) {
			return function(obj) {
				if (typeof(obj) === 'undefined') {
					return 'undefined';
				} else if (obj === global) {
					return 'global';
				} else {
					return ({}).toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
				}
			};
		})(this),

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
		 * Does absolutely nothing.
		 *
		 * Can be useful for hiding unused parameters etc.
		 *
		 * @method noop
		 */
		noop: function() {}
	};
});