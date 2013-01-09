require.config({
	baseUrl: 'src',
	paths: {
		lib: '../lib',
		modules: '../modules',
		config: '../config',
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