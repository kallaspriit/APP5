define(
function() {
	'use strict';

	/**
	 * Base router implementation.
	 *
	 * @class RouterBase
	 * @constructor
	 * @module Core
	 */
	var RouterBase = function() {};

	/**
	 * Initiates the component.
	 *
	 * @method init
	 * @return {RouterBase} Self
	 */
	RouterBase.prototype.init = function() {
		return this;
	};

	/**
	 * Composes a URL that matches given module action.
	 *
	 * @method navigate
	 * @param {String} module Module name
	 * @param {String} [action=index] Action name
	 * @param {Object} [parameters] Action parameters
	 */
	RouterBase.prototype.navigate = function(/*module, action, parameters*/) {
		throw new Error('RouterBase::navigate() should be implemented in child class');
	};

	return RouterBase;
});