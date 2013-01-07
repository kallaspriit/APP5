define(
['Debug', 'config/main', 'ResourceManager', 'UI', 'Navi', 'Util', 'angular'],
function (dbg, config, resourceManager, ui, navi, util, angular) {
	'use strict';

	/**
	 * Responsible for bootstrapping the application.
	 *
	 * @class Bootstrapper
	 * @constructor
	 * @module Core
	 */
	var Bootstrapper = function () {
		this._app = {};
	};

	/**
	 * Bootstraps the application.
	 *
	 * @method bootstrap
	 */
	Bootstrapper.prototype.bootstrap = function () {
		this._app = {
			dbg: dbg.init(),
			resourceManager: resourceManager.init(),
			ui: ui.init(),
			navi: navi.init(),
			util: util,
			controllers: {
				TestController: function ($scope) {
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
				}
			}
		};

		// @TODO Needed for minification, any way around?
		this._app.controllers.TestController.$inject = ['$scope'];

		// register the core application components in global scope for debugging
		if (config.debug) {
			window.app = this._app;
		} else {
			// we still need global controllers for angular
			window.app = {
				controllers: this._app.controllers
			};
		}

		// navigate to the index action
		navi.open(
			config.index.module,
			config.index.action,
			config.index.parameters
		);

		angular.element(document).ready(function() {
			angular.bootstrap(document);
		});
	};

	return new Bootstrapper();
});