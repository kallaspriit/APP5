define(
[
	'angular',
	'jquery',
	'underscore',
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
	'RootController',
	'translations'
],
function(
	angular,
	$,
	_,
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
	RootController,
	translations
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
				_:                  _,
				$:                  $,
				config:             config,
				dbg:                dbg.init(),
				resourceManager:    resourceManager.init(),
				keyboard:           keyboard.init(),
				mouse:              mouse.init(),
				ui:                 ui.init(),
				translator:         translator.init(translations, config.language),
				navi:               navi.init(),
				scheduler:          scheduler.init(),
				testClient:         testClient.init(),
				util:               util
			},
			directiveName,
			filterName;

		app.module = angular.module('app', []);

		app.module.config([
			'$provide', '$locationProvider', '$controllerProvider',
			function($provide, $locationProvider, $controllerProvider) {
				// provide the components to module actions
				for (var key in components) {
					$provide.value(key, components[key]);
				}

				// listen for angular expections
				// TODO Try to disable angular expection handling
				$provide.factory('$exceptionHandler', function() {
					return function(exception) {
						dbg.error(exception);

						return false;
					};
				});

				// use HTML5 url-rewrite mode
				$locationProvider
					.html5Mode(config.useUrlHTML5)
					.hashPrefix(config.urlHashPrefix);

				app.provide = $provide;
				app.controllerProvider = $controllerProvider;

				// register the root-controller
				app.registerController('RootController', RootController);
			}
		]);

		// register directives
		for (directiveName in directives) {
			app.module.directive(directiveName, directives[directiveName]);
		}

		// register filters
		for (filterName in filters) {
			app.module.filter(filterName, filters[filterName]);
		}

		// register callback for module run
		app.module.run([
			'$rootScope', '$location', '$compile',
			function($rootScope, $location, $compile) {
				self._onModuleRun($rootScope, $location, $compile);
			}
		]);

		// redraw the application when language changes
		components.translator.bind(components.translator.Event.LANGUAGE_CHANGED, function() {
			app.validate();
		});

		// listen for dom ready event
		$(document).ready(function() {
			self._onDomReady();
		});

		// register the core application components in global scope for debugging, never rely on this
		if (config.debug) {
			window.app = app;
		}
	};

	/**
	 * Called when all base bootstrapping has been completed and DOM is ready.
	 *
	 * @method _onDomReady
	 * @private
	 */
	Bootstrapper.prototype._onDomReady = function() {
		// bootstrap the application, results in _onModuleRun below
		app.injector = angular.bootstrap($('HTML'), ['app']);
	};

	/**
	 * Called when angular injector has performed loading all the modules.
	 *
	 * @method _onModuleRun
	 * @param {Scope} $rootScope Root scope
	 * @param {Location} $location The location service
	 * @param {Compile} $compile The compiler service
	 * @private
	 */
	Bootstrapper.prototype._onModuleRun = function($rootScope, $location, $compile) {
		app.rootScope = $rootScope;
		app.location = $location;
		app.compile = $compile;

		this._setupUrlListener($rootScope, $location);

		if (config.testClient.active) {
			testClient.open(
				config.testClient.host,
				config.testClient.port
			);
		}
	};

	/**
	 * Sets up listener for URL changes.
	 *
	 * @method _setupUrlListener
	 * @private
	 */
	Bootstrapper.prototype._setupUrlListener = function($scope, $location) {
		$scope.$watch(function () {
			return $location.absUrl();
		}, function() {
			var parameters = $location.search(),
				current = navi.getCurrent();

			// TODO Move to a seperate router
			if (
				util.isString(parameters.module)
				&& util.isString(parameters.action)
				&& (current === null || parameters.module !== current.module || parameters.action !== current.action)
			) {
				navi._open(
					parameters.module,
					parameters.action,
					util.isObject(parameters.parameters) ? parameters.parameters : {}
				);
			} else {
				navi._open(
					config.index.module,
					config.index.action,
					config.index.parameters
				);
			}
		});
	};

	return new Bootstrapper();
});
