(function() {
	function cloneApp(from, to) {
		var wrench = require('wrench');

		wrench.copyDirSyncRecursive(from, to);
	}

	function convertEntityName(name) {
		var dashPos;

		while ((dashPos = name.indexOf('-')) != -1) {
			name = name.substr(0, dashPos) + (name.substr(dashPos + 1, 1)).toUpperCase() + name.substr(dashPos + 2);
		}

		return name.substr(0, 1).toUpperCase() + name.substr(1);
	}

	function getModules(path) {
		var fs = require('fs'),
			modules = [],
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
		var fs = require('fs'),
			contents = fs.readFileSync(moduleInfo.filename, 'utf-8'),
			action,
			file;

		while ((action = parseAction(contents)) !== null) {
			console.log('Annotating', action.name);

			contents = contents.substr(0, action.closingPosition) + '}]' + contents.substr(action.closingPosition + 1);
			contents = contents.replace(action.declaration, action.whitespace + action.name + ': [\'' + action.arguments.join('\', \'') + '\', function(' + action.arguments.join(', ') + ')');
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

		var arguments = [],
			argTokens = matches[4].split(','),
			i;

		for (i = 0; i < argTokens.length; i++) {
			arguments.push(argTokens[i].trim());
		}

		var actionPos = contents.indexOf(matches[0]),
			actionContents = contents.substr(actionPos),
			closingPosition = actionContents.indexOf('\n' + matches[1] + '}') + matches[1].length + actionPos + 1;

		return {
			declaration: matches[0],
			name: matches[2],
			arguments: arguments,
			whitespace: matches[1],
			closingPosition: closingPosition
		};
	}

	// preprocess
	cloneApp('app', '_app');
	processModules(getModules('_app/modules'));
})();