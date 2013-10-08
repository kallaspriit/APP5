/*
 * TODO Refactor APP5 to use the new custom events style?
 * TODO Add support for IE
 * TODO Optimize for mobile browsers
 * TODO Add option to disable back-functionality (preserving previous views)
 * TODO Check for memory leaks
 * TODO Get rid of self.. in favor of .bind?
 * TODO Rename resources based on class/instance e.g. Navi > navi so it's clear whether we get a class or instance?
 * TODO Merge & compress CSS
 * TODO Timeouts & Intervals on deferred
 * TODO Consider http://jsfiddle.net/gVEq5/ for model design
 * TODO Figure out better way to get action parameters
 * TODO Better document the events
 * TODO Review the build system
 * TODO Create node scripts to generate modules, actions, views
 */

// Configuration for RequireJS.
require.config({

	// base url for application scripts requested without a prefix
	baseUrl: 'src',

	// paths to various resources
	paths: {
		// application resource directories
		lib:                '../lib',
		core:               '../app5',
		modules:            '../modules',
		models:             '../models',
		config:             '../config',
		directives:         '../directives',
		addons:             '../addons',
		translations:       '../translations/core-translations',

		// individual components
		underscore:         '../lib/underscore/underscore',
		angular:            '../lib/angular/angular',
		jquery:             '../lib/jquery/jquery',
		twitterBootstrap:   '../lib/bootstrap/js/bootstrap',
		twitterBootstrapUI:   '../lib/bootstrap/js/ui-bootstrap-tpls-0.4.0'
	},

	// shim configuration for external non-requirejs dependencies
	shim: {
		underscore: {
			exports: '_'
		},
        angular: {
            exports: 'angular'
        },
		twitterBootstrap: {
			deps: ['jquery']
		},
		twitterBootstrapUI: {
			deps: ['twitterBootstrap', 'angular']
		}
	}
});

// require resources needed for startup
require(
	[
		'Bootstrapper',
		'twitterBootstrap',
		'twitterBootstrapUI'
	],
	function(bootstrapper) {
		'use strict';

		// bootstrap the application
        bootstrapper.bootstrap();
	}
);