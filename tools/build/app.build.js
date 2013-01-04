({
    appDir: '../../app',
	mainConfigFile: '../../app/app.js',
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
