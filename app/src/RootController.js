define(
['core/App', 'config/main'],
function(app, config) {
	'use strict';

	/**
	 * Main root controller.
	 *
	 * TODO Annotate this function automatically in the preprocess build script
	 *
	 * @class RootController
	 * @constructor
	 * @module App
	 */
	return ['$scope', '$modal', 'translator', 'navi',
		function($scope, $modal, translator, navi) {
		// register the base scope that is used for compiling module actions
		app.baseScope = $scope;
		app.modalService = $modal;

		// data accessible to all controllers
		$scope.title = 'APP5 Demo Application';
        $scope.version = config.version;

		// methods accessible to all controllers
		$scope.setTitle = function(/*title*/) {
			// TODO Exceeds call stack for some reason
			//$scope.title = 'APP5 :: ' + title;
		};

		// components accessible to all controllers
		$scope.translator = translator;
		$scope.navi = navi;
	}];
});