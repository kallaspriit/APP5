define(
[
	'config/main',
	'translations',
	'angular',
	'jquery',
	'core/Debug',
	'core/App',
	'core/ResourceManager',
	'core/Router',
	'core/Keyboard',
	'core/Mouse',
	'core/Translator',
	'core/Navi',
	'core/Scheduler',
	'UI',
	'Util',
	'Directives',
	'Filters',
	'RootController'

],
function(
	config,
	translations,
	angular,
	$,
	dbg,
	app,
	resourceManager,
	router,
	keyboard,
	mouse,
	translator,
	navi,
	scheduler,
	ui,
	util,
	directives,
	filters,
	RootController
) {
	'use strict';

	/**
	 * Responsible for bootstrapping the application.
	 *
	 * @class BaseBootstrapper
	 * @constructor
	 * @module Core
	 */
	var BaseBootstrapper = function() {};

	/**
	 * Bootstraps the application.
	 *
	 * @method bootstrap
	 */
	BaseBootstrapper.prototype.bootstrap = function() {
		var self = this,
			components = {
				config:             config,
				dbg:                dbg.init(),
				resourceManager:    resourceManager.init(),
				router:             router.init(config.navigation.mode),
				keyboard:           keyboard.init(),
				mouse:              mouse.init(),
				ui:                 ui,
				translator:         translator.init(translations, config.language),
				navi:               navi.init(),
				scheduler:          scheduler.init(),
				util:               util
			},
			additionalComponents = {},
			directiveName,
			filterName;

		if (util.isFunction(this.preBootstrap)) {
			additionalComponents = this.preBootstrap();

			if (util.isObject(additionalComponents)) {
				util.extend(components, additionalComponents);
			}
		}

		navi.router = components.router;
		app.module = angular.module('app', this.getModuleDependencies());

		app.module.config([
			'$provide', '$locationProvider', '$controllerProvider',
			function($provide, $locationProvider, $controllerProvider) {
				app.provide = $provide;
				app.controllerProvider = $controllerProvider;

				// provide the components to module activities
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

        app.module.factory('$exceptionHandler', function () {
            return function (exception, cause) {
                if (typeof(cause) !== 'undefined') {
                    exception.message += ' (caused by "' + cause + '")';
                }

                dbg.error(exception.message);

                throw exception;
            };
        });

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
		components.translator.on(components.translator.Event.LANGUAGE_CHANGED, function() {
			app.validate();
		});

		// listen for dom ready event
		$(document).ready(function() {
			self._onDomReady();
		});

		// register the core application components in global scope through window.app
		util.extend(app, components);

		// app may already be defined before this point
        if (typeof(window.app) === 'undefined') {
            window.app = app;
        } else {
            util.extend(window.app, app);
        }

		// initialize the ui
		ui.init();

		if (util.isFunction(this.postBootstrap)) {
			this.postBootstrap();
		}
	};

    /**
     * Returns the list of module dependencies for current application.
     *
     * Override this in your bootstrapper to include additional resources.
     *
     * @return {Array}
     */
    BaseBootstrapper.prototype.getModuleDependencies = function() {
        return [];
    };

	/**
	 * Called when all base bootstrapping has been completed and DOM is ready.
	 *
	 * @method _onDomReady
	 * @private
	 */
	BaseBootstrapper.prototype._onDomReady = function() {
		config.distributionBuild = this._isDistributionBuild();

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
	BaseBootstrapper.prototype._onModuleRun = function($rootScope, $location, $compile) {
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
	BaseBootstrapper.prototype._setupRouter = function($scope, $location) {
		$scope.$on('$locationChangeSuccess', function () {
			$scope.actualLocation = $location.path();
		});

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
				protocol:   $location.protocol(),
				isBack:     $scope.actualLocation === $location.path()
			};

			navi._onUrlChanged(parameters);
		});
	};

	/**
	 * Returns whether we're running a distribution minimized and combined version
	 *
	 * @method _isDistributionBuild
	 * @private
	 * @return {Boolean}
	 */
	BaseBootstrapper.prototype._isDistributionBuild = function() {
		var scriptTag = $('SCRIPT[data-main]'),
			mainScriptName;

		if (scriptTag.length > 0) {
			mainScriptName = scriptTag.data('main');

			// distribution build has a name like "app.min.js"
			if (typeof(mainScriptName) === 'string' && mainScriptName.indexOf('.min.js') !== -1) {
				return true;
			}
		}

		return false;
	};

	return BaseBootstrapper;
});
