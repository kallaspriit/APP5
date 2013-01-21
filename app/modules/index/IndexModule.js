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

		/*onEnter: function(previousModule) {
			console.log('ENTER INDEX FROM', previousModule);
		},

		onChangeAction: function(lastAction, newAction) {
			console.log('CHANGE ACTION FROM', lastAction, 'TO', newAction);
		},

		onExit: function(newModule) {
			console.log('EXIT INDEX TO', newModule);
		},

		onWakeup: function(action) {
			console.log('WAKEUP TO', action);
		},

		onSleep: function(action) {
			console.log('SLEEP', action);
		},*/

		/**
		 * Index action.
		 *
		 * @method indexAction
		 * @param {$scope} $scope Angular scope
		 * @param {Debug} dbg Debugger
		 * @param {Util} util Utilities
		 * @param {Navi} navi Navigator
		 * @param {Scheduler} scheduler Scheduler
		 * @param {Keyboard} keyboard Scheduler
		 * @param {Object} parameters Action parameters
		 */
		indexAction: function($scope, dbg, util, navi, scheduler, keyboard, parameters) {
			console.log('PARAMETERS', parameters);
			//this.$inject = ['$scope', 'dbg', 'util', 'navi', 'scheduler'];

			//dbg.console('IndexModule contructor', util.date());

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
			$scope.dateFormat = 'MM.dd.yyyy H:mm:ss';

			$scope.name = 'APP5';
			$scope.age = 24;

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

			$scope.back = function() {
				navi.back();
			};

			$scope.$on(navi.Event.EXIT, function(e, args) {
				dbg.console('index::index EXIT', e, args);
			});

			$scope.$on(navi.Event.SLEEP, function(e, args) {
				dbg.console('index::index SLEEP', e, args);
			});

			$scope.$on(navi.Event.WAKEUP, function(e, args) {
				dbg.console('index::index WAKEUP', e, args);
			});

			$scope.$on(keyboard.Event.KEYDOWN, function(e, keyEvent) {
				dbg.console('MODULE KEY DOWN', keyEvent.name);
			});

			$scope.$on(keyboard.Event.KEYUP, function(e, keyEvent) {
				dbg.console('MODULE KEY UP', keyEvent.name);
			});

			//dbg.error('Test error', 'another');

			//errorTest();

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
		 * @param {Debug} dbg Debugger
		 */
		testAction: function($scope, navi, dbg) {
			//this.$inject = ['$scope', 'navi'];

			$scope.name = 'APP5';

			$scope.back = function() {
				navi.back();
			};

			$scope.indexTest = function() {
				navi.open('index', 'index', ['foo', 'bar']);
			};

			$scope.$on(navi.Event.EXIT, function(e, args) {
				dbg.console('index::test EXIT', e, args);
			});

			$scope.$on(navi.Event.SLEEP, function(e, args) {
				dbg.console('index::test SLEEP', e, args);
			});

			$scope.$on(navi.Event.WAKEUP, function(e, args) {
				dbg.console('index::test WAKEUP', e, args);
			});
		}
	};
});