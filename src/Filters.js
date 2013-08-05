define(
function() {
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
		}]
	};
});
