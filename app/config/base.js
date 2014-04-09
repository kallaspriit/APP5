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
         * Application version number (http://semver.org/ format).
         *
         * This value is automatically incremented by
         * > grunt bump-patch
         * > grunt bump-minor
         * > grunt bump-major
         *
         * @property version
         * @type string
         */
        version: '0.15.0',

		/**
		 * Is debug-mode enabled.
		 *
		 * @property debug
		 * @type Boolean
		 */
		debug: false,

		/**
		 * Are we running in a distribution minimized and combined version
		 *
		 * @property distributionBuild
		 * @type Boolean
		 */
		distributionBuild: false,

		/**
		 * Index module options.
		 *
		 * @property index
		 * @type Object
		 */
		index: {
			module: 'phonebook',
			activity: 'contacts',
			parameters: {'page': 1},
			route: 'contacts'
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
		 * - none
		 * - fade
		 * - pop
		 * - flip
		 * - turn
		 * - flow
		 * - slide
		 * - slideup
		 * - slidedown
		 * - slidefade
		 *
		 * @property pageTransition
		 * @type String
		 */
		pageTransition: 'slide',
		//pageTransition: 'none',

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
		 * @type Object
		 */
		navigation: {
			html5Mode: true,
			hashPrefix: '!'
		}
	};
});
