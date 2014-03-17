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
			activity: 'contacts',
			route: 'contacts'
		}, {
			name: 'add-contact',
			module: 'phonebook',
			activity: 'add-contact',
			route: 'add-contact'
		}];

	MainMenu.markActive = function(module, activity) {
		for (var i = 0; i < this.length; i++) {
			this[i].active = false;

			if (this[i].module === module && this[i].activity === activity) {
				this[i].active = true;
			}
		}
	};

	return MainMenu;
});