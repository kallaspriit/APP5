define(function() {
"use strict";

/**
 * @class Util
 * @static
 */
return {
	/**
	 * Returns current date.
	 *
	 * @method getDate
	 * @return {Date}
	 */
	getDate: function() {
		return new Date();
	},

	/**
	 * Returns current microtime in seconds.
	 *
	 * @method microtime
	 * @return {Number}
	 */
	microtime: function() {
		return this.getDate().getTime() / 1000;
	}
};

});