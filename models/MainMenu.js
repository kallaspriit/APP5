define(
function() {
	'use strict';

	/**
	 * Main menu model
	 *
	 * @class MainMenu
	 * @constructor
	 * @module Models
	 */
	var MainMenu = [{
			name: 'contacts',
			module: 'phonebook',
			action: 'contacts',
			route: 'contacts'
		}, {
			name: 'add-contact',
			module: 'phonebook',
			action: 'add-contact',
			route: 'add-contact'
		}];

	MainMenu.markActive = function(module, action) {
		for (var i = 0; i < this.length; i++) {
			this[i].active = false;

			if (this[i].module === module && this[i].action === action) {
				this[i].active = true;
			}
		}
	};

	return MainMenu;
});