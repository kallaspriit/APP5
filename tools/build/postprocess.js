(function() {
	var common = require('./common.js'),
		fs = require('fs');

	function renameVersion(dir) {
		common.getVersion(function(versionInfo) {
			var newAppFilename = 'app-' + versionInfo.major + '.' + versionInfo.minor + '.js',
				filename = dir + '/index.html',
				contents = fs.readFileSync(filename, 'utf-8'),
				file = fs.openSync(filename, 'w');

			contents = contents.replace('data-main="app.js"', 'data-main="' + newAppFilename + '"');

			fs.write(file, contents);
			fs.close(file);

			fs.renameSync(dir + '/app.js', dir + '/' + newAppFilename);
		});
	}

	// postprocess
	renameVersion('build');
})();