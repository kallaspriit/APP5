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
		this.activities = {};
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
	 * Registers a module activity controller.
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
	 * Preannotates the controller and sets correct _this_ context.
	 *
	 * @method getAnnotatedController
	 * @param {Function} controller Controller method to annotate
	 * @param {Object} [context] Optional context to bind to
	 * @param
	 */
	App.prototype.getAnnotatedController = function(controller, context) {
		// angular caches previous inject, remove it
		if (typeof(controller.$inject) !== 'undefined') {
			delete controller.$inject;
		}

		// preannotate the controller so it can be binded to the right instance
		var preannotatedController = this.injector.annotate(controller);

		// add controller binded to the actual activity instance if available
		if (typeof(context) === 'object') {
			preannotatedController.push(controller.bind(context));
		} else {
			preannotatedController.push(controller);
		}


		return preannotatedController;
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
