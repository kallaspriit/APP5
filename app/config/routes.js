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
			activity: config.index.activity,
			parameters: config.index.parameters
		},
		'add-contact': {
			path: 'add-contact',
			module: 'phonebook',
			activity: 'add-contact'
		},
		'contacts': {
			path: 'contacts/:page[+int]',
			module: 'phonebook',
			activity: 'contacts',
			parameters: {
				page: 1 // +int actually defaults to 1 so not needed
			}
		}
	};
});