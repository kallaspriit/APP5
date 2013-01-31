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
	var App = {};

	/**
	 * Validates and redraws the application with updated data.
	 *
	 * @method validate
	 * @return {App} Self
	 */
	App.validate = function() {
		for (var i = 0; i < this.scopes.length; i++) {
			if (this.scopes[i].$$phase !== null) {
				continue;
			}

			this.scopes[i].$apply();
		}

		return this;
	};
	
	return App;
});