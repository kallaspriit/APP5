define(
['jquery'],
function($) {
	'use strict';

	/**
	 * Deferred implementation.
	 *
	 * Proxies to jQuery.Deferred.
	 *
	 * @class Deferred
	 * @extends jQuery.Deferred
	 * @constructor
	 * @module Core
	 */
	var Deferred = $.Deferred;

	//Deferred.prototype = new $.Deferred();

	/**
	 * Provides a way to execute callback functions based on one or more objects, usually Deferred objects that
	 * represent asynchronous events.
	 *
	 * @method when
	 * @return {Deferred.Promise}
	 */
	Deferred.when = function() {
		return $.when.apply(window, arguments);
	};
	
	return Deferred;
});