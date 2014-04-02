({
    appDir: '../../_app',
	mainConfigFile: '../../_app/app.js',
    dir: '../../build',
	baseUrl: 'src',
    //optimize: "none",
	optimize: "uglify2",
	//uglify2: {
	//	reserved: '$scope'
	//},
	//generateSourceMaps: true,
    modules: [
        {
            name: '../app'
        }
    ]
})
