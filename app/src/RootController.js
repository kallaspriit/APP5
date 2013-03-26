define(
['App'],
function(app) {
	'use strict';

	/**
	 * Main root controller.
	 *
	 * @class RootController
	 * @constructor
	 * @module Core
	 */
	return function($scope, translator, navi) {
		// register the base scope that is used for compiling module actions
		app.baseScope = $scope;

		// data accessible to all controllers
		$scope.title = 'APP5 Demo Application';

		// methods accessible to all controllers
		$scope.setTitle = function(/*title*/) {
			// TODO Exceeds call stack for some reason
			//$scope.title = 'APP5 :: ' + title;
		};

		// TODO This is legal
		//$scope.setTitle('test');

		// components accessible to all controllers
		$scope.translator = translator;
		$scope.navi = navi;

		navi.partial(
			'#header',
			'site',
			'main-menu'
		);
	};
});