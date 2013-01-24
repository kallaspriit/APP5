/*
 * TODO Fix build system
 * TODO Mouse events
 * TODO Touch events
 * TODO Example application
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
	['Bootstrapper'],
	function(bootstrapper) {
		'use strict';

        bootstrapper.bootstrap();
	}
);