define(
['models/MainMenu'],
function(mainMenu) {
	'use strict';

	/**
	 * Site module.
	 *
	 * @class SiteModule
	 * @constructor
	 * @module Modules
	 */
	return {

		/**
		 * Displays main menu.
		 *
		 * @method indexAction
		 * @param {$scope} $scope Angular scope
		 */
		mainMenuAction: function($scope) {
			$scope.test = 'World';
		}
	}
});