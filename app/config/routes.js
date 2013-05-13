define(
['config/main'],
function(config) {
	'use strict';

	/*
	 * Routes configuration.
	 */
	return {
		'index': {
			path: '',
			module: config.index.module,
			action: config.index.action,
			parameters: config.index.parameters
		},
		'add-contact': {
			path: 'add-contact',
			module: 'phonebook',
			action: 'add-contact'
		},
		'contacts': {
			path: 'contacts/:category/:page[+int]',
			module: 'phonebook',
			action: 'contacts',
			parameters: {
				category: 'all'
			}
		}
	};
});