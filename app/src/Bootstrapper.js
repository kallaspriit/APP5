define(
['Debug', 'config/main', 'ResourceManager', 'UI', 'Navi', 'Scheduler', 'Util', 'angular'],

function(dbg, config, resourceManager, ui, navi, scheduler, util, angular) {
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
			ui: ui.init(),
			navi: navi.init(),
			scheduler: scheduler.init(),
			util: util,
			modules: {}
		};

		// register the core application components in global scope for debugging, never rely on this
		if (config.debug) {
			window.app = this._app;
		}

		angular.module('app', [])
			.config(function($provide) {
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