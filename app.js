/*
 * TODO Rename resources based on class/instance e.g. Navi > navi
 * TODO Merge & compress CSS
 * TODO Timeouts & Intervals on deferred
 * TODO Consider http://jsfiddle.net/gVEq5/ for model design
 * TODO Make back optional
 * TODO Only use back when actually pressing back
 * TODO New page cloaking
 */

// Configuration for RequireJS.
require.config({

	// base url for application scripts requested without a prefix
	baseUrl: 'src',

	// paths to various resources
	paths: {
		// application resource directories
		lib:                '../lib',
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