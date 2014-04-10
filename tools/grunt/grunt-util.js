(function(module) {
	'use strict';

	var fs = require('fs'),
		glob = require('glob'),
		mkdirp = require('mkdirp'),
		cheerio = require('cheerio');

	module.exports = {
		getModules: function(moduleBaseDir, namesOnly) {
			var moduleDirectories = fs.readdirSync(moduleBaseDir),
				modules = [],
				i;

			for (i = 0; i < moduleDirectories.length; i++) {
				if (!fs.lstatSync(moduleBaseDir + '/' + moduleDirectories[i])) {
					continue;
				}

				if (namesOnly === true) {
					modules.push(moduleDirectories[i]);
				} else {
					modules.push(moduleBaseDir + '/' + moduleDirectories[i]);
				}
			}

			return modules;
		},
		moduleExists: function(moduleBaseDir, name) {
			return this.getModules(moduleBaseDir, true).indexOf(name) !== -1;
		},
		getActivityFiles: function(moduleDirectory) {
			var activityFiles = fs.readdirSync(moduleDirectory),
				activityFile,
				activities = [],
				i;

			for (i = 0; i < activityFiles.length; i++) {
				activityFile = moduleDirectory + '/' + activityFiles[i];

				if (activityFile.substr(-11) !== 'Activity.js') {
					continue;
				}

				activities.push(activityFile);
			}

			return activities;
		},
		getActivityNames: function(moduleDirectory) {
			var modules = this.getModules(moduleDirectory),
				activityFiles = [],
				activities = [],
				activityFileTokens,
				activityFile,
				i;

			for (i = 0; i < modules.length; i++) {
				activityFiles = activityFiles.concat(this.getActivityFiles(modules[i]));
			}

			for (i = 0; i < activityFiles.length; i++) {
				activityFileTokens = activityFiles[i].split('/');

				// remove first part
				activityFileTokens.splice(0, 1);

				activityFile = activityFileTokens.join('/');

				activities.push(activityFile.substr(
					0,
					activityFile.length - 3
				));
			}

			return activities;
		},
		getActivityInfo: function(activityFilename, activityCode) {
			var activityFilenameTokens = activityFilename.split('/'),
				activityNameToken = activityFilenameTokens[activityFilenameTokens.length - 1],
				activityName = activityNameToken.substr(0, activityNameToken.length - 11),
				regex = new RegExp(
					'([\\t]*)(' + activityName + 'Activity.prototype.onCreate = function\\()([\\w, $]*)(\\))'
				),
				matches = activityCode.match(regex);

			if (matches === null) {
				return false;
			}

			// TODO Find a better way to find the closing brace position
			var args = [],
				argTokens = matches[3].split(','),
				i,
				actionPos = activityCode.indexOf(matches[0]),
				actionContents = activityCode.substr(actionPos),
				closingPosition = actionContents.indexOf('\n' + matches[1] + '}')
					+ matches[1].length + actionPos + 1;

			for (i = 0; i < argTokens.length; i++) {
				args.push(argTokens[i].trim());
			}

			var result = {
				declaration: matches[0],
				name: activityName,
				args: args,
				whitespace: matches[1],
				closingPosition: closingPosition
			};

			//grunt.log.writeln('matches', activityName/*, matches*/, result);

			return result;
		},
		getViews: function(directory) {
			var viewFiles = glob.sync(directory + '/**/views/*.html'),
				views = [],
				module,
				viewTokens,
				viewBasename,
				viewNameTokens,
				view,
				i;

			for (i = 0; i < viewFiles.length; i++) {
				viewTokens = viewFiles[i].split('/');
				viewBasename = viewTokens[viewTokens.length - 1];
				viewNameTokens = viewBasename.split('-');

				// remove module name
				module = viewNameTokens.shift();
				view = viewNameTokens.join('-');
				view = view.substr(0, view.length - 5);

				views.push({
					module: module,
					view: view,
					filename: viewFiles[i]
				});
			}

			return views;
		},
		getViewDefinition: function(viewInfo) {
			var contents = this.readFile(viewInfo.filename);

			return 'define(\'views/' + viewInfo.module + '.' + viewInfo.view + '\', [], function() {\n'
				+ '\treturn \''
				+ contents
					.replace(/\r/g, '')
					.replace(/'/g, '\\\'')
					.replace(/\n/g, '\' +\n\t\t\'')
				+ '\';\n'
				+ '});';
		},
		annotateActivity: function(code, activityInfo) {
			var annotatedCode = code.substr(0, activityInfo.closingPosition) + '}]'
				+ code.substr(activityInfo.closingPosition + 1);

			annotatedCode = annotatedCode.replace(
				activityInfo.declaration,
				activityInfo.whitespace
					+ activityInfo.name + 'Activity.prototype.onCreate = '
					+ '[\'' + activityInfo.args.join('\', \'')
					+ '\', function(' + activityInfo.args.join(', ') + ')'
			);

			return annotatedCode;
		},
		createDirectory: function(directory) {
			return mkdirp.sync(directory);
		},
		readFile: function(filename) {
			return fs.readFileSync(filename, 'utf-8');
		},
		writeFile: function(filename, contents) {
			var file = fs.openSync(filename, 'w');

			fs.write(file, contents);
			fs.close(file);
		},
		replaceInFile: function(filename, find, replace) {
			var contents = this.readFile(filename);

			while (contents.indexOf(find) !== -1) {
				contents = contents.replace(find, replace);
			}

			this.writeFile(filename, contents);
		},
		augmentIndex: function(filename) {
			var contents = this.readFile(filename),
				$ = cheerio.load(contents),
				stylesheetElements = $('LINK[rel="stylesheet"]'),
				updatedContents,
				i;

			// add merged stylesheet
			$(stylesheetElements[stylesheetElements.length - 1]).after(
				'<link rel="stylesheet" type="text/css" href="style/min.css">'
			);

			// remove others
			for (i = 0; i < stylesheetElements.length; i++) {
				$(stylesheetElements[i]).remove();
			}

			updatedContents = $.html();

			this.writeFile(filename, updatedContents);
		},
		convertEntityName: function(name) {
			var dashPos;

			while ((dashPos = name.indexOf('-')) != -1) {
				name = name.substr(0, dashPos) + (name.substr(dashPos + 1, 1)).toUpperCase() + name.substr(dashPos + 2);
			}

			return name.substr(0, 1).toUpperCase() + name.substr(1);
		},
		copyTemplate: function(from, to, replace) {
			var contents = this.readFile(from),
				key,
				token,
				value;

			for (key in replace) {
				value = replace[key];
				token = '$(' + key + ')';

				while (contents.indexOf(token) !== -1) {
					contents = contents.replace(token, value);
				}
			}

			this.writeFile(to, contents);
		},
		createModule: function(dir, name) {
			// create module and views directories
			this.createDirectory(dir + '/' + name);
			this.createDirectory(dir + '/' + name + '/views');

			// create stylesheet file
			this.copyTemplate(
				'tools/grunt/generator-templates/module.css',
				dir + '/' + name + '/' + name + '-module.css', {
					module: name,
					Module: this.convertEntityName(name)
				}
			);

			// create translations file
			this.copyTemplate(
				'tools/grunt/generator-templates/translations.js',
				dir + '/' + name + '/' + name + '-translations.js', {
					module: name,
					Module: this.convertEntityName(name)
				}
			);
		},
		createActivity: function(dir, moduleName, activityName) {
			var activityClassName = this.convertEntityName(activityName) + 'Activity';

			this.copyTemplate(
				'tools/grunt/generator-templates/activity.js',
				dir + '/' + moduleName + '/' + activityClassName + '.js', {
					module: moduleName,
					Module: this.convertEntityName(moduleName),
					activity: activityName,
					Activity: this.convertEntityName(activityName)
				}
			);

			this.copyTemplate(
				'tools/grunt/generator-templates/view.html',
				dir + '/' + moduleName + '/views/' + moduleName + '-' + activityName + '.html', {
					module: moduleName,
					Module: this.convertEntityName(moduleName),
					activity: activityName,
					Activity: this.convertEntityName(activityName)
				}
			);
		},
		createRoute: function(routesFile, path, module, activity) {
			var contents = this.readFile(routesFile),
				tabs = '\t\t\t',
				def = tabs + 'path: \'' + path + '\',\n' +
					tabs + 'module: \'' + module + '\',\n' +
					tabs + 'activity: \'' + activity + '\'\n';

			contents = contents.replace(
				'\t\t} // routes',
				'\t\t},\n\t\t\'' + activity + '\': {\n' + def + '\t\t} // routes'
			);

			this.writeFile(routesFile, contents);
		}
	};

})(module);