define(function() {
	'use strict';

	/**
	 * Index module.
	 *
	 * @class IndexModule
	 * @constructor
	 * @module Modules
	 */
	return {

		/**
		 * Index action.
		 *
		 * @method indexAction
		 * @param {$scope} $scope Angular scope
		 * @param {Debug} dbg Debugger
		 * @param {Util} util Utilities
		 * @param {Navi} navi Navigator
		 */
		indexAction: function($scope, dbg, util, navi) {
			this.$inject = ['$scope', 'dbg', 'util', 'navi'];

			dbg.console('IndexModule contructor', util.date());

			$scope.title = 'Testing AngularJS!';
			$scope.phones = [
				{'name': 'Nexus S',
					'snippet': 'Fast just got faster with Nexus S.',
					'age': 0},
				{'name': 'Motorola XOOM™ with Wi-Fi',
					'snippet': 'The Next, Next Generation tablet.',
					'age': 1},
				{'name': 'MOTOROLA XOOM™',
					'snippet': 'The Next, Next Generation tablet.',
					'age': 2}
			];
			$scope.order = 'age';

			$scope.navigationTest = function() {
				navi.open('index', 'test');
			};

			dbg.log('! test', window.app);
			dbg.log('+ another', ['a', 'b'], {c: 'd', e: 'f'}, 52, true);
			dbg.log('- error', ['a', 'b'], {c: 'd', e: 'f'}, 52, true);
		},

		/**
		 * Test action.
		 *
		 * @method testAction
		 * @param {$scope} $scope Angular scope
		 * @param {Navi} navi Navigation
		 */
		testAction: function($scope, navi) {
			this.$inject = ['$scope', 'navi'];

			$scope.name = 'APP5';

			$scope.back = function() {
				navi.back();
			};
		}
	};
});