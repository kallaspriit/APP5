require.config({
	baseUrl: 'src',
	paths: {
		lib: '../lib',
		modules: '../modules',
		config: '../config',
		angular: '../lib/angular/angular',
		underscore: '../lib/underscore/underscore',
		jquery: 'empty:'
	},
	shim: {
		underscore: {
			exports: '_'
		},
        angular: {
            exports: 'angular'
        }
	}
});

require(
	['Bootstrapper'],
	function(bootstrapper) {
		"use strict";

        bootstrapper.bootstrap();
	}
);