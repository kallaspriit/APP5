define(
[
	'Util',
	'core/BaseFilters'
],
function(util, baseFilters) {
	'use strict';

	/**
	 * Additional app-specific filters.
	 *
	 * @class Filters
	 * @extends BaseFilters
	 * @module App
	 * @static
	 */
	return util.extend({}, baseFilters, {

		/**
		 * Formats unit to millions/thousands.
		 *
		 * @method formatBytes
		 * @param {Number} input Input number
		 * @return {String}
		 */
		formatBytes: function() {
			return function(input) {
				return util.formatBytes(input);
			};
		}
	});
});
