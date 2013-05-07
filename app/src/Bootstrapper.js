define(
[
	'angular',
	'jquery',
	'underscore',
	'Debug',
	'config/main',
	'App',
	'ResourceManager',
	'router/QueryRouter', // also try router/PathRouter
	'Keyboard',
	'Mouse',
	'UI',
	'Translator',
	'Navi',
	'Scheduler',
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
	router,
	keyboard,
	mouse,
	ui,
	translator,
	navi,
	scheduler,
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
				router:             router.init(config.navigation.mode),
				keyboard:           keyboard.init(),
				mouse:              mouse.init(),
				ui:                 ui.init(),
				translator:         translator.init(translations, config.language),
				navi:               navi.init(),
				scheduler:          scheduler.init(),
				util:               util
			},
			directiveName,
			filterName;

		app.router = components.router;
		app.module = angular.module('app', []);

		app.module.config([
			'$provide', '$locationProvider', '$controllerProvider',
			function($provide, $locationProvider, $controllerProvider) {
				app.provide = $provide;
				app.controllerProvider = $controllerProvider;

				// provide module action parameters
				// TODO Can this be done without returning function, damn cache
				$provide.provider('$parameters', {
					$get: function() {
						return function() {
							return app.parameters;
						};
					}
				});

				// provide the components to module actions
				for (var key in components) {
					$provide.value(key, components[key]);
				}

				// listen for angular expections
				$provide.factory('$exceptionHandler', function() {
					return function(exception) {
						dbg.error(exception);

						return false;
					};
				});

				// configure HTML5 url-rewrite mode
				$locationProvider
					.html5Mode(config.navigation.html5Mode)
					.hashPrefix(config.navigation.hashPrefix);

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
			util.extend(app, components);

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

		this._setupRouter($rootScope, $location);
	};

	/**
	 * Sets up listener for URL changes.
	 *
	 * @method _setupRouter
	 * @private
	 */
	Bootstrapper.prototype._setupRouter = function($scope, $location) {
		$scope.$watch(function () {
			return $location.absUrl();
		}, function() {
			var parameters = {
				url:        $location.absUrl(),
				hash:       $location.hash(),
				path:       $location.path(),
				query:      $location.url(),
				args:       $location.search(),
				host:       $location.host(),
				port:       $location.port(),
				protocol:   $location.protocol()
			};

			navi._onUrlChanged(parameters);
		});
	};

	return new Bootstrapper();
});
