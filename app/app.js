// Configuration for RequireJS.
require.config({

	// base url for application scripts requested without a prefix
	baseUrl: 'src',

	// paths to various resources
	paths: {
		// application resource directories
		lib:                '../lib',
		core:               '../lib/app5',
		modules:            '../modules',
		models:             '../models',
		config:             '../config',
		directives:         '../directives',
		addons:             '../addons',
		views:				'../views',
		translations:       '../translations/core-translations',

		// individual components
		underscore:         '../lib/underscore/underscore',
		angular:            '../lib/angular/angular',
		jquery:             '../lib/jquery/jquery',
		twitterBootstrapUI: '../lib/bootstrap/js/ui-bootstrap-tpls-0.10.0'
	},

	// shim configuration for external non-requirejs dependencies
	shim: {
		underscore: {
			exports: '_'
		},
        angular: {
            exports: 'angular'
        },
		twitterBootstrapUI: {
			deps: ['angular']
		}
	}
});

// require resources needed for startup
require(
	[
		'Bootstrapper',
		'twitterBootstrapUI'
	],
	function(bootstrapper) {
		'use strict';

		// bootstrap the application
        bootstrapper.bootstrap();
	}
);