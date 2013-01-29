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
			$scope.backPossible = false;

			$scope.open = function(index) {
				navi.open(
					menus[index].module,
					menus[index].action || 'index',
					menus[index].parameters || []
				);

				//menus.markOpen(index);
			};

			navi.bind(navi.Event.STACK_CHANGED, function() {
				var page = navi.getCurrent();

				menus.markActive(page.module, page.action);

				$scope.backPossible = navi.isBackPossible();
				$scope.$safeApply();
			});
		}
	};
});