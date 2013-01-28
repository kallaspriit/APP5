define(
['models/MainMenu'],
function(menus) {
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
		 * @method mainMenuAction
		 * @param {$scope} $scope Angular scope
		 * @param {Debug} dbg Debugger
		 * @param {Navi} navi Navigation
		 */
		mainMenuAction: function($scope, dbg, navi) {
			$scope.menus = menus;

			$scope.open = function(index) {
				navi.open(
					menus[index].module,
					menus[index].action || 'index',
					menus[index].parameters || []
				)/*.done(function() {
					menus.markOpen(index);
					$scope.$apply(); // needs apply when using callback
				})*/;

				menus.markOpen(index);
			}
		}
	};
});