define(function() {
	'use strict';

	/**
	 * Base configuration properties.
	 *
	 * This file should be version-controlled and contain the default configuration properties. Every developer should
	 * have their own config/main.js that can override any of these and the app should the main configuration file.
	 *
	 * @class config-base
	 * @module Config
	 * @static
	 */
	return {
		/**
		 * Is debug-mode enabled.
		 *
		 * @property debug
		 * @type Boolean
		 */
		debug: false,

		/**
		 * Index module options.
		 *
		 * @property index
		 * @type Object
		 */
		index: {
			module: 'index',
			action: 'index',
			parameters: []
		},

		/**
		 * Selector for the container where views are loaded into.
		 *
		 * @property viewSelector
		 * @type String
		 */
		viewSelector: '#contents'
	};
});