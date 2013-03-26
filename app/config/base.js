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
		 * Should the HTML5 URL-rewrite method be used.
		 *
		 * @property useUrlHTML5
		 * @type Boolean
		 */
		useUrlHTML5: true,

		/**
		 * What URL has prefix to use.
		 *
		 * @property urlHashPrefix
		 * @type String
		 */
		urlHashPrefix: '!',

		/**
		 * URL mode.
		 *
		 * Defines how URL's should be generated. For action "add-contact" in module "phonebook":
		 * - "path" will create http://example.com/phonebook/add-contact
		 * - "query" will create http://example.com/?module=phonebook&action=contacts
		 *
		 * @property urlMode
		 * @type String
		 */
		urlMode: 'query',

		/**
		 * Setup for the test client.
		 *
		 * @property testClient
		 * @type Object
		 */
		testClient: {
			active: true,
			host: '127.0.0.1',
			port: 10082
		}
	};
});