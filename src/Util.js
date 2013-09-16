define(
['core/BaseUtil'],
function(baseUtil) {
	'use strict';

	/**
	 * Provides app-specific utility functions.
	 *
	 * @class Util
	 * @extends BaseUtil
	 * @static
	 * @module App
	 */
	return baseUtil.extend({}, baseUtil, {

		/**
		 * Example of extending the utilities.
		 *
		 * @method test
		 */
		test: function() {
			alert('test!'); // TODO Remove test / better example
		}
	});
});
