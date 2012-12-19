require.config({
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

require(
	['Bootstrapper'],
	function(bootstrapper) {
		bootstrapper.bootstrap();
	}
);