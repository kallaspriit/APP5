define(
['moment'],
function(moment) {
	'use strict';

	/**
	 * Custom angularjs directives.
	 *
	 * @class Filters
	 * @module Core
	 * @static
	 */
	return {

		/**
		 * Formats unit to millions/thousands.
		 *
		 * @method formatBytes
		 * @param {Number} input Input number
		 * @return {String}
		 */
		formatBytes: ['util', function(util) {
			return function(input) {
				return util.formatBytes(input);
			};
		}],

		/**
		 * Formats date.
		 *
		 * @method formatDate
		 * @param {String|Date} input Input date
		 * @param {String} [format=DD.MM.YYYY HH:mm] Optional format
		 * @return {String}
		 */
		formatDate: [function() {
			return function(input, format) {
				if (input === null) {
					return input;
				}

				var date = moment(input);

				if (date === null) {
					return input;
				}

				format = format || 'DD.MM.YYYY HH:mm';

				return date.format(format);
			};
		}],

		/**
		 * Displays how long ago some date was.
		 *
		 * @method timeago
		 * @param {String|Date} input Input date
		 * @return {String}
		 */
		timeago: [function() {
			return function(input) {
				if (input === null) {
					return input;
				}

				var date = moment(input);

				if (date === null) {
					return input;
				}

				return date.fromNow();
			};
		}]
	};
});
