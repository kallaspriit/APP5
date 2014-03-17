define(
function() {
	'use strict';

	/**
	 * Provides global access to the application components.
	 *
	 * @class App
	 * @constructor
	 * @module Core
	 */
	var App = function() {
		this.location = null;
		this.injector = null;
		this.provide = null;
		this.compile = null;
		this.rootScope = null;
		this.baseScope = null;
		this.controllerProvider = null;
		this.models = {};
		this.modules = {};
		this.parameters = {};
		this._validateTimeout = null;
	};

	/**
	 * Validates and redraws the application with updated data.
	 *
	 * If force is not set to true, the validation are throttled to 100ms.
	 *
	 * @method validate
	 * @param {Function} [expression] Optional function to execute in angular context
	 * @param {Boolean} [force=false] Forces the validation to happen immediately
	 * @return {App} Self
	 */
	App.prototype.validate = function(expression, force) {
		if (!force) {
			if (this._validateTimeout !== null) {
				window.clearTimeout(this._validateTimeout);
			}

			this._validateTimeout = window.setTimeout(function() {
				this.validate(expression, true);
			}.bind(this), 100);

			return;
		}

        if (this.rootScope !== null) {
            if (this.rootScope.$$phase !== null) {
                if (typeof(expression) === 'function') {
                    expression();
                }
            } else {
                this.rootScope.$apply(expression);
            }
        }

		return this;
	};

	/**
	 * Registers a module action controller.
	 *
	 * @method registerController
	 * @param {String} name Name of the controller
	 * @param {Object} fn Controller function
	 * @return {App} Self
	 */
	App.prototype.registerController = function(name, fn) {
		//this.module.controller(name, fn); // _invokeQueue messes this up
		this.controllerProvider.register(name, fn);

		return this;
	};

	/**
	 * Broadcasts a global application event.
	 *
	 * @method broadcast
	 * @param {String} type Type of event
	 * @param {Array} [args] Event parameters
	 * @return {App} Self
	 */
	App.prototype.broadcast = function(type, args) {
		this.rootScope.$broadcast(type, args);

		return this;
	};

	return new App();
});
