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
		name: 'home',
		module: 'index',
		action: 'index'
	}, {
		name: 'test',
		module: 'index',
		action: 'test'
	}];

	/*MainMenu.method = function(value) {
		this.push(value);
	};*/

	return MainMenu;
});