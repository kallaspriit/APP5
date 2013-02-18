/*
 * TODO Make browser back button to work
 * TODO Standalone modules - partials (header menu etc)
 * TODO Each module has its own translation files?
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
		translations: '../translations/core-translations',
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
	[
		'Bootstrapper',
		'lib/es5-shim/es5-shim.js',
		'lib/hammer/hammer.js',
		'lib/hammer/jquery.hammer.js',
		'lib/bootstrap/js/bootstrap.js'
	],
	function(bootstrapper) {
		'use strict';

        bootstrapper.bootstrap();
	}
);