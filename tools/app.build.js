({
    appDir: '../',
	//mainConfigFile: '../app/app.js',
    //baseUrl: './',
    dir: '../build',

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
	},

    //Comment out the optimize line if you want
    //the code minified by UglifyJS
    //optimize: "none",

    /*paths: {
		lib: '../../lib',
		modules: '../modules',
		config: '../config',
		underscore: '../../lib/underscore/underscore',
		jquery: 'empty:'
    },*/

    modules: [
        //Optimize the application files. jQuery is not
        //included since it is already in require-jquery.js
        {
            name: '../app'
        }
    ]
})
