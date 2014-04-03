({
    appDir: 'dist',
	mainConfigFile: 'dist/app.js',
    dir: 'dist2',
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
