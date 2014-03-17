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
		 * @method headerActivity
		 * @param {Scope} $scope Angular scope
		 * @param {Location} $location Angular location service
		 * @param {Debug} dbg Debugger
		 * @param {Navi} navi Navigation
		 */
		headerActivity: function($scope, $location, dbg, navi) {
			$scope.menus = menus;
			$scope.backPossible = false;

			$scope.open = function(index) {
				navi.open(menus[index].route, menus[index].parameters || {});
			};

			$scope.updateActive = function() {
				var page = navi.getCurrentItem();

				if (page === null) {
					return;
				}

				menus.markActive(page.module, page.activity);

				$scope.backPossible = navi.isBackPossible();
			};

			$scope.back = function() {
				if (navi.isBackPossible()) {
					navi.back();
				} else {
					navi.open('index', {page: 1});
				}
			};

			navi.on(navi.Event.STACK_CHANGED, function() {
				$scope.updateActive();
			});

			$scope.updateActive();
		}
	};
});