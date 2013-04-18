/**
 * TODO Combine CSS files
 */

(function() {
	'use strict';

	var common = require('./common.js'),
		fs = require('fs'),
		wrench = require('wrench');

	function cloneApp(from, to) {
		console.log('  > cloning application from "' + from + '" to "' + to + '"');

		wrench.copyDirSyncRecursive(from, to);
	}

	function annotateVersion(dir, readyCallback) {
		console.log('  > annotating version in "' + dir + '"');

		common.getVersion(function(versionInfo) {
			common.getHostname(function(hostname) {
				var versionStr = 'untagged';

				console.log('  > working on ' + hostname);

				if (versionInfo !== null) {
					versionStr = versionInfo.major + '.' + versionInfo.minor + ' #' + versionInfo.hash;

					console.log('  > annotating version ' + versionStr);
				} else {
					console.log('  ! create a tag on the repository to get a version number');
					console.log('    > git tag -a v1 -m "Version 1"');
				}

				var filename = dir + '/index.html',
					contents = fs.readFileSync(filename, 'utf-8'),
					file = fs.openSync(filename, 'w'),
					date = new Date();

				contents = '<!-- Version: ' + versionStr + ' by ' + hostname
					+ ' - ' + date.toString() + ' -->\r\n' + contents;

				fs.write(file, contents);
				fs.close(file);

				readyCallback();
			});
		});
	}

	function convertEntityName(name) {
		var dashPos;

		while ((dashPos = name.indexOf('-')) != -1) {
			name = name.substr(0, dashPos) + (name.substr(dashPos + 1, 1)).toUpperCase() + name.substr(dashPos + 2);
		}

		return name.substr(0, 1).toUpperCase() + name.substr(1);
	}

	function getModules(path) {
		var modules = [],
			files = fs.readdirSync(path),
			className,
			i;

		for (i = 0; i < files.length; i++) {
			className = convertEntityName(files[i]) + 'Module';

			modules.push({
				className: className,
				dirname: path + '/' + files[i],
				basename: className + '.js',
				filename: path + '/' + files[i] + '/' + className + '.js'
			});
		}

		return modules;
	}

	function processModules(modules) {
		for (var i = 0; i < modules.length; i++) {
			processModule(modules[i]);
		}
	}

	function processModule(moduleInfo) {
		console.log('  > processing ' + moduleInfo.filename);

		var contents = fs.readFileSync(moduleInfo.filename, 'utf-8'),
			action,
			file;

		while ((action = parseAction(contents)) !== null) {
			console.log('    > annotating', action.name);

			contents = contents.substr(0, action.closingPosition) + '}]' + contents.substr(action.closingPosition + 1);
			contents = contents.replace(action.declaration, action.whitespace + action.name
				+ ': [\'' + action.args.join('\', \'') + '\', function(' + action.args.join(', ') + ')');
		}

		file = fs.openSync(moduleInfo.filename, 'w');

		fs.write(file, contents);
		fs.close(file);
	}

	function parseAction(contents) {
		var regex = /([\t]*)(\w+Action)(: function\()([\w, $]*)(\))/,
			matches = contents.match(regex);

		if (matches === null) {
			return null;
		}

		var args = [],
			argTokens = matches[4].split(','),
			i,
			actionPos = contents.indexOf(matches[0]),
			actionContents = contents.substr(actionPos),
			closingPosition = actionContents.indexOf('\n' + matches[1] + '}') + matches[1].length + actionPos + 1;

		for (i = 0; i < argTokens.length; i++) {
			args.push(argTokens[i].trim());
		}

		return {
			declaration: matches[0],
			name: matches[2],
			args: args,
			whitespace: matches[1],
			closingPosition: closingPosition
		};
	}

	// preprocess
	console.log('! Preprocessing build');

	cloneApp('app', '_app');
	annotateVersion('_app', function() {
		processModules(getModules('_app/modules'));
	});
})();