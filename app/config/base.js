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
			module: 'phonebook',
			action: 'contacts',
			parameters: []
		},

		/**
		 * Selector for the container where views are loaded into.
		 *
		 * @property viewSelector
		 * @type String
		 */
		viewSelector: '#pages',

		/**
		 * Prefix for system CSS rules.
		 *
		 * @property cssPrefix
		 * @type String
		 */
		cssPrefix: 'app5-',

		/**
		 * Page transition to use.
		 *
		 * One of:
		 * - fade
		 * - pop
		 * - flip
		 * - turn
		 * - flow
		 * - slide
		 * - slideup
		 * - slidedown
		 *
		 * @property pageTransition
		 * @type String
		 */
		pageTransition: 'slide',

		/**
		 * Default language.
		 *
		 * @property language
		 * @type String
		 */
		language: 'en',

		/**
		 * Navigation settings.
		 *
		 * @property navigation
		 * @type Boolean
		 */
		navigation: {
			html5Mode: true,
			hashPrefix: '!',
			mode: 'path' // path/query, see Router.Mode enumeration
		}
	};
});