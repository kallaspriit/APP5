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
		var self = this;

		this._app = {
			dbg: dbg.init(),
			resourceManager: resourceManager.init(),
			ui: ui.init(),
			navi: navi.init(),
			util: util,
			modules: {}
		};

		// register the core application components in global scope for debugging, never rely on this
		if (config.debug) {
			window.app = this._app;
		}

		angular.module('app', []).
			config(function($provide) {
				// register module resources

				for (var key in self._app) {
					$provide.value(key, self._app[key]);
				}

				/*$provide.value('dbg', self._app.dbg);
				$provide.value('resourceManager', self._app.resourceManager);
				$provide.value('ui', self._app.ui);
				$provide.value('navi', self._app.navi);
				$provide.value('util', self._app.util);
				$provide.value('modules', self._app.modules);*/
			});



		angular.element(document).ready(function() {
			// navigate to the index action
			navi.open(
				config.index.module,
				config.index.action,
				config.index.parameters,
				function() {
					console.log('index action loaded');
				}
			);

			/*var $injector = angular.bootstrap(document, ['app']);

			console.log('bootstrap injector', $injector);*/
		});
	};

	return new Bootstrapper();
});