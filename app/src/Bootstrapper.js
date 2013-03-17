define(
[
	'Debug',
	'config/main',
	'App',
	'ResourceManager',
	'Keyboard',
	'Mouse',
	'UI',
	'Translator',
	'Navi',
	'Scheduler',
	'TestClient',
	'Util',
	'Directives',
	'Filters',
	'translations',
	'angular',
	'jquery',
	'underscore'
],
function(
	dbg,
	config,
	app,
	resourceManager,
	keyboard,
	mouse,
	ui,
	translator,
	navi,
	scheduler,
	testClient,
	util,
	directives,
	filters,
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
	var Bootstrapper = function() {};

	/**
	 * Bootstraps the application.
	 *
	 * @method bootstrap
	 */
	Bootstrapper.prototype.bootstrap = function() {
		var self = this,
			components = {
				config:             config,
				bootstrapper:       this,
				dbg:                dbg.init(),
				resourceManager:    resourceManager.init(),
				keyboard:           keyboard.init(),
				mouse:              mouse.init(),
				ui:                 ui.init(),
				translator:         translator.init(translations, config.language),
				navi:               navi.init(),
				scheduler:          scheduler.init(),
				testClient:         testClient.init(),
				util:               util,
				module:             null,
				injector:           null,
				models:             {},
				modules:            {},
				scopes:             []
			};

		components.module = angular.module('app', []);
		components.module.config(['$provide', '$locationProvider', function($provide, $locationProvider) {
			// register module resources
			for (var key in components) {
				if (key === 'module') {
					continue;
				}

				$provide.value(key, components[key]);
			}

			// provide underscore and jQuery too
			$provide.value('_', _);
			$provide.value('$', $);

			// listen for angular expections
			$provide.factory('$exceptionHandler', function() {
				return function(exception) {
					dbg.error(exception);

					return false;
				};
			});

			// use HTML5 url-rewrite mode
			$locationProvider.html5Mode(true).hashPrefix('!');
		}]);

		// register directives
		for (var directiveName in directives) {
			components.module.directive(directiveName, directives[directiveName]);
		}

		// register filters
		for (var filterName in filters) {
			components.module.filter(filterName, filters[filterName]);
		}

		// navi needs reference to the module
		components.ui.setModule(components.module);

		// register callback for module run
		components.module.run(['$rootScope', '$location', function($rootScope, $location) {
			self._onModuleRun(components, $rootScope, $location);
		}]);

		// redraw the application when language changes
		components.translator.bind(components.translator.Event.LANGUAGE_CHANGED, function() {
			app.validate();
		});

		// extends the app with component references
		util.extend(app, components);

		// register the core application components in global scope for debugging, never rely on this
		if (config.debug) {
			window.app = app;
		}

		// listen for dom ready event
		$(document).ready(function() {
			self._onDomReady();
		});
	};

	/**
	 * Called when angular injector has performed loading all the modules.
	 *
	 * @method _onModuleRun
	 * @param {Object} components Application components
	 * @param {Scope} scope Root scope
	 * @param {Location} location The location service
	 * @private
	 */
	Bootstrapper.prototype._onModuleRun = function(components, scope, location) {
		var key;

		components.scopes.push(scope);

		for (key in components) {
			if (key === 'root') {
				continue;
			}

			scope[key] = components[key];
		}

		components.navi.bind(components.navi.Event.POST_NAVIGATE, function(e) {
			var parameters = {
				module: e.module,
				action: e.action
			};

			if (e.parameters.length > 0) {
				parameters.parameters = util.str(e.parameters);
			}

			location.search(parameters);
		});

		/*scope.$on('$locationChangeStart', function(event) {
			dbg.console('URL CHANGED', event, this.scope.$id);
		}.bind({scope: scope}));*/

		scope.$on('$destroy', function(e) {
			util.remove(e.targetScope, this.scopes);
		}.bind({ scopes: components.scopes }));
	};

	/**
	 * Called when all base bootstrapping has been completed and DOM is ready.
	 *
	 * @method _onDomReady
	 * @private
	 */
	Bootstrapper.prototype._onDomReady = function() {
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

		if (config.testClient.active) {
			testClient.open(
				config.testClient.host,
				config.testClient.port
			);
		}
	};

	return new Bootstrapper();
});
