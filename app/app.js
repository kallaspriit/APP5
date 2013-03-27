/*
 * TODO Merge & compress CSS
 * TODO Timeouts & Intervals on deferred
 * TODO Router, /some/page URLs
 * TODO Consider http://jsfiddle.net/gVEq5/ for model design
 * TODO Show multiple errors
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
		translations:       '../translations/core-translations',

		// individual components
		es5Shim:            '../lib/es5-shim/es5-shim',
		underscore:         '../lib/underscore/underscore',
		angular:            '../lib/angular/angular',
		moment:             '../lib/moment/moment',
		jquery:             '../lib/jquery/jquery',
		hammer:             '../lib/hammer/hammer',
		hammerjQuery:       '../lib/hammer/jquery.hammer',
		twitterBootstrap:   '../lib/bootstrap/js/bootstrap'
	},

	// shim configuration for external non-requirejs dependencies
	shim: {
		underscore: {
			exports: '_'
		},
        angular: {
            exports: 'angular'
        },
		moment: {
			exports: 'moment'
		},
		hammer: {
			deps: ['jquery']
		},
		hammerjQuery: {
			deps: ['hammer']
		},
		twitterBootstrap: {
			deps: ['jquery']
		}
	}
});

// require resources needed for startup
require(
	[
		'Bootstrapper',
		'es5Shim',
		'hammer',
		'hammerjQuery',
		'twitterBootstrap'
	],
	function(bootstrapper) {
		'use strict';

		// bootstrap the application
        bootstrapper.bootstrap();
	}
);