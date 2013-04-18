(function() {
	'use strict';

	var common = require('./common.js'),
		fs = require('fs');

	function renameVersion(dir) {
		common.getVersion(function(versionInfo) {
			if (versionInfo === null) {
				console.log('  @ create a tag on the repository to get a version number');
				console.log('    > git tag -a v1 -m "Version 1"');

				return;
			}

			var newAppFilename = 'app-' + versionInfo.major + '.' + versionInfo.minor + '.js',
				filename = dir + '/index.html',
				contents = fs.readFileSync(filename, 'utf-8'),
				file = fs.openSync(filename, 'w');

			contents = contents.replace('data-main="app.js"', 'data-main="' + newAppFilename + '"');

			fs.write(file, contents);
			fs.close(file);

			console.log('  > renaming "app.js" to "' + newAppFilename + '"');

			fs.renameSync(dir + '/app.js', dir + '/' + newAppFilename);
		});
	}

	// postprocess
	console.log('! Postprocessing build');
	renameVersion('build');
})();