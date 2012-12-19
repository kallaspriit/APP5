requirejs.config({
    baseUrl: 'app/src',
    paths: {
        lib: '../../lib',
		modules: '../modules',
		config: '../config',
		underscore: '../../lib/underscore/underscore',
		jquery: 'empty:'
    },
	shim: {
		underscore: {
		  exports: '_'
		}
	}
});

require(['jquery', 'config/main', 'Debug', 'Navi'], function($, config, dbg, navi) {
	dbg.console('test');
	navi.open('index');

	console.log('CONFIG', config);

    $(function() {
		console.log('PAGE READY');

		$(document.body).css('background-color', '#F00');
    });
});
