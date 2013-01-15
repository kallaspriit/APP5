define(
['Debug', 'config/main', 'ResourceManager', 'Keyboard', 'UI', 'Navi', 'Scheduler', 'Util', 'angular'],
function(dbg, config, resourceManager, keyboard, ui, navi, scheduler, util, angular) {
	'use strict';

	/**
	 * Responsible for bootstrapping the application.
	 *
	 * @class Bootstrapper
	 * @constructor
	 * @module Core
	 */
	var Bootstrapper = function() {
		this._app = {};
	};

	/**
	 * Bootstraps the application.
	 *
	 * @method bootstrap
	 */
	Bootstrapper.prototype.bootstrap = function() {
		var self = this;

		this._app = {
			dbg: dbg.init(),
			resourceManager: resourceManager.init(),
			keyboard: keyboard.init(),
			ui: ui.init(),
			navi: navi.init(),
			scheduler: scheduler.init(),
			util: util,
			module: null,
			injector: null,
			modules: {}
		};

		this._app.module = angular.module('app', []);

		this._app.module.config(function($provide) {
				// register module resources
				for (var key in self._app) {
					$provide.value(key, self._app[key]);
				}

				$provide.factory('$exceptionHandler', function() {
					return function(exception) {
						dbg.error(exception);

						return false;
					};
				});
			});

		this._app.injector = angular.injector(['ng', 'app']);
		this._app.root = this._app.injector.get('$rootScope');
		this._app.navi.setModule(this._app.module);

		// register the core application components in global scope for debugging, never rely on this
		if (config.debug) {
			window.app = this._app;
		}

		angular.element(document).ready(function() {
			// navigate to the index action
			navi.open(
				config.index.module,
				config.index.action,
				config.index.parameters
			);
		});

		dbg.log('+ Bootstrap complete');
	};

	return new Bootstrapper();
});