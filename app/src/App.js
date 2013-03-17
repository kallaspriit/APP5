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
		this.config = null;
		this.bootstrapper = null;
		this.dbg = null;
		this.resourceManager = null;
		this.keyboard = null;
		this.mouse = null;
		this.ui = null;
		this.translator = null;
		this.navi = null;
		this.scheduler = null;
		this.util = null;
		this.module = null;
		this.injector = null;
		this.models = {};
		this.modules = {};
		this.scopes = [];
	};

	/**
	 * Validates and redraws the application with updated data.
	 *
	 * @method validate
	 * @return {App} Self
	 */
	App.prototype.validate = function() {
		for (var i = 0; i < this.scopes.length; i++) {
			if (this.scopes[i].$$phase !== null) {
				continue;
			}

			this.scopes[i].$apply();
		}

		return this;
	};

	return new App();
});
