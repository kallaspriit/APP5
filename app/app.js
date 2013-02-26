/*
 * TODO Merge & compress CSS
 * TODO Timeouts & Intervals on deferred
 */

/**
 * Configuration for RequireJS.
 */
require.config({
	baseUrl: 'src',
	paths: {
		lib: '../lib',
		modules: '../modules',
		models: '../models',
		config: '../config',
		translations: '../translations/core-translations',
		es5Shim: '../lib/es5-shim/es5-shim',
		underscore: '../lib/underscore/underscore',
		angular: '../lib/angular/angular',
		moment: '../lib/moment/moment',
		jquery: '../lib/jquery/jquery',
		hammer: '../lib/hammer/hammer',
		hammerjQuery: '../lib/hammer/jquery.hammer',
		twitterBootstrap: '../lib/bootstrap/js/bootstrap'
	},
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
			deps: ['jquery', 'hammer']
		},
		twitterBootstrap: {
			deps: ['jquery']
		}
	}
});

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

        bootstrapper.bootstrap();
	}
);