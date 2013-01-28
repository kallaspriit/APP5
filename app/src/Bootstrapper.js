define(
[
	'Debug',
	'config/main',
	'ResourceManager',
	'Keyboard',
	'Mouse',
	'UI',
	'Translator',
	'Navi',
	'Scheduler',
	'Util',
	'Directives',
	'translations',
	'angular',
	'jquery',
	'underscore'
],
function(
	dbg,
	config,
	resourceManager,
	keyboard,
	mouse,
	ui,
	translator,
	navi,
	scheduler,
	util,
	directives,
	translations,
	angular,
	$,
    _
) {
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
			config: config,
			bootstrapper: this,
			dbg: dbg.init(),
			resourceManager: resourceManager.init(),
			keyboard: keyboard.init(),
			mouse: mouse.init(),
			ui: ui.init(),
			translator: translator.init(translations, config.language),
			navi: navi.init(),
			scheduler: scheduler.init(),
			util: util,
			module: null,
			injector: null,
			models: {},
			modules: {}
		};

		this._app.module = angular.module('app', []);

		this._app.module.config(function($provide) {
				// register module resources
				for (var key in self._app) {
					$provide.value(key, self._app[key]);
				}

				// provide underscore and jQuery too
				$provide.value('_', _);
				$provide.value('$', $);

				$provide.factory('$exceptionHandler', function() {
					return function(exception) {
						dbg.error(exception);

						return false;
					};
				});
			});

		for (var directiveName in directives) {
			this._app.module.directive(directiveName, directives[directiveName]);
		}

		this._app.injector = angular.injector(['ng', 'app']);
		this._app.root = this._app.injector.get('$rootScope');
		this._app.navi.setModule(this._app.module);

		this._app.module.run(function($rootScope) {
			self._app.root = $rootScope;

			for (var key in self._app) {
				self._app.root[key] = self._app[key];
			}
		});

		/*this._app.root.languages = translator.getLanguages();
		this._app.root.language = translator.getLanguage();
		this._app.root.navi = navi;*/

		// register the core application components in global scope for debugging, never rely on this
		if (config.debug) {
			window.app = this._app;
		}

		$(document).ready(function() {
			self._run();
		});
	};

	/**
	 * Called when all base bootstrapping has been completed and DOM is ready.
	 *
	 * @method _run
	 * @private
	 */
	Bootstrapper.prototype._run = function() {
		navi.partial(
			'#header',
			'site',
			'main-menu'
		);

		// navigate to the index action
		navi.open(
			config.index.module,
			config.index.action,
			config.index.parameters
		);
	};

	return new Bootstrapper();
});