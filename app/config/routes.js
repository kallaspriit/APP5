define(
['config/main'],
function(config) {
	'use strict';

	/*
	 * Routes configuration.
	 */
	return {
		'index': {
			path: 'contacts/:page[+int]',
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
			path: 'contacts/:page[+int]',
			module: 'phonebook',
			action: 'contacts',
			parameters: {
				page: 1 // +int actually defaults to 1 so not needed
			}
		}
	};
});