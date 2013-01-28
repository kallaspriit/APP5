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
			active: true
		}, {
			name: 'add-contact',
			module: 'phonebook',
			action: 'add-contact',
			active: false
		}],
		i;

	MainMenu.activeIndex = 0;

	for (i = 0; i < MainMenu.length; i++) {
		if (MainMenu[i].active === true) {
			MainMenu.activeIndex = i;

			break;
		}
	}

	MainMenu.markOpen = function(index) {
		if (index === this.activeIndex) {
			return;
		}

		this[this.activeIndex].active = false;
		this[index].active = true;
		this.activeIndex = index;
	};

	return MainMenu;
});