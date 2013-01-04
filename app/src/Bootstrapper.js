define(
['Debug', 'ResourceManager', 'UI', 'Navi', 'angular'],
function (dbg, resourceManager, ui, navi, angular) {
	"use strict";

	/**
	 * Responsible for bootstrapping the application.
	 *
	 * @class Bootstrapper
	 * @constructor
	 */
	var Bootstrapper = function () {

	};

	/**
	 * Bootstraps the application.
	 *
	 * @method bootstrap
	 */
	Bootstrapper.prototype.bootstrap = function () {
		window.app = {
			dbg: dbg.init(),
			resourceManager: resourceManager.init(),
			ui: ui.init(),
			navi: navi.init(),
			controllers: {
				TestController: function ($scope) {
					$scope.title = 'Testing AngularJS!';
					$scope.phones = [
						{"name": "Nexus S",
							"snippet": "Fast just got faster with Nexus S.",
							"age": 0},
						{"name": "Motorola XOOM™ with Wi-Fi",
							"snippet": "The Next, Next Generation tablet.",
							"age": 1},
						{"name": "MOTOROLA XOOM™",
							"snippet": "The Next, Next Generation tablet.",
							"age": 2}
					];
					$scope.order = 'age';
				}
				/*TestController: ['$scope', function($scope) {
				$scope.title = 'Testing AngularJS!';
				$scope.phones = [
				{"name": "Nexus S",
				"snippet": "Fast just got faster with Nexus S.",
				"age": 0},
				{"name": "Motorola XOOM™ with Wi-Fi",
				"snippet": "The Next, Next Generation tablet.",
				"age": 1},
				{"name": "MOTOROLA XOOM™",
				"snippet": "The Next, Next Generation tablet.",
				"age": 2}
				];
				$scope.order = 'age';
				}]*/
			}
		};

		// minification..
		window.app.controllers.TestController.$inject = ['$scope'];

		/*var scope = angular.scope();
		_.extend(scope, {
		IndexController: function($scope) {

		}
		});

		angular.compile(window.document)(scope);*/

		//angular.element(document).ready(function() {
		angular.bootstrap(document);
		//});
	};

	return new Bootstrapper();
});