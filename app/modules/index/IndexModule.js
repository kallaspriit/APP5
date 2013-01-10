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
		 * @param {Scheduler} scheduler Scheduler
		 */
		indexAction: function($scope, dbg, util, navi, scheduler) {
			//this.$inject = ['$scope', 'dbg', 'util', 'navi', 'scheduler'];

			dbg.console('IndexModule contructor', util.date());

			$scope.title = 'Testing AngularJS!';
			$scope.phones = [
				{
					'name': 'Nexus S',
					'snippet': 'Fast just got faster with Nexus S.',
					'age': 0
				}, {
					'name': 'Motorola XOOM™ with Wi-Fi',
					'snippet': 'The Next, Next Generation tablet.',
					'age': 1
				}, {
					'name': 'MOTOROLA XOOM™',
					'snippet': 'The Next, Next Generation tablet.',
					'age': 2
				}
			];
			$scope.order = 'age';

			$scope.navigationTest = function() {
				navi.open('index', 'test');
			};

			var timeout = scheduler.setTimeout('index', function() {
				dbg.log('! Scheduled event!', this);
			}, 3000);

			scheduler.clearTimeouts('index');

			var timeout2 = scheduler.setTimeout(function() {
				dbg.log('! Another event', this);
			}, 5000, true);

			scheduler.setInterval(function() {
				dbg.log('! Interval', this);
			}, 1000);

			util.noop(timeout, timeout2);

			/*dbg.log('! test', window.app);
			dbg.log('+ another', ['a', 'b'], {c: 'd', e: 'f'}, 52, true);
			dbg.log('- error', ['a', 'b'], {c: 'd', e: 'f'}, 52, true);

			alert('Native alert capture test');
			dbg.alert('Another alert');*/

			/*window.setInterval(function() {
				dbg.log('! Date', util.date());
			}, 100);*/
		},

		/**
		 * Test action.
		 *
		 * @method testAction
		 * @param {$scope} $scope Angular scope
		 * @param {Navi} navi Navigation
		 */
		testAction: function($scope, navi) {
			//this.$inject = ['$scope', 'navi'];

			$scope.name = 'APP5';

			$scope.back = function() {
				navi.back();
			};
		}
	};
});