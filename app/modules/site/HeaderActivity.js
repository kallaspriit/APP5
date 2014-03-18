define(
[
	'core/Activity',
	'models/MainMenu'
],
function(Activity, menus) {
	'use strict';

	/**
	 * Site header activity.
	 *
	 * @class HeaderActivity
	 * @extends Activity
	 * @constructor
	 * @module SiteModule
	 */
	var HeaderActivity = function() {
		Activity.call(this);
	};

	HeaderActivity.prototype = Object.create(Activity.prototype);

	HeaderActivity.prototype.onCreate = function($scope, $location, dbg, navi) {
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
	};

	return HeaderActivity;

});