/*
 * TODO Standalone modules - partials (header menu etc)
 * TODO Fix build system
 * TODO Example application
 * TODO Opening a module action in a modal
 * TODO Merge & compress CSS
 * TODO Timeouts & Intervals on deferred
 */

require.config({
	baseUrl: 'src',
	paths: {
		lib: '../lib',
		modules: '../modules',
		models: '../models',
		config: '../config',
		translations: '../translations/translations',
		angular: '../lib/angular/angular',
		underscore: '../lib/underscore/underscore',
		moment: '../lib/moment/moment',
		jquery: 'empty:'
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
		}
	}
});

require(
	['Bootstrapper', 'lib/jquery/jquery.mobile-events.js'],
	function(bootstrapper) {
		'use strict';

        bootstrapper.bootstrap();
	}
);