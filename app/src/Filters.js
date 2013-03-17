define(
function() {
	'use strict';

	/**
	 * Custom angularjs directives.
	 *
	 * @class Directives
	 * @module Core
	 * @static
	 */
	return {

		/**
		 * Formats unit to millions/thousands.
		 *
		 * @method formatAmount
		 * @param {Number} input Input number
		 * @return {String}
		 */
		formatAmount: ['util', function(util) {
			return function(input) {
				return util.formatAmount(input);
			};
		}]
	};
});