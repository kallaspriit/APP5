(function(module) {
	'use strict';

	var fs = require('fs');

	module.exports = {
		getModules: function(moduleBaseDir) {
			var moduleDirectories = fs.readdirSync(moduleBaseDir),
				modules = [],
				i;

			for (i = 0; i < moduleDirectories.length; i++) {
				if (!fs.lstatSync(moduleBaseDir + '/' + moduleDirectories[i])) {
					continue;
				}

				modules.push(moduleBaseDir + '/' + moduleDirectories[i]);
			}

			return modules;
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
		getActivityNames: function(moduleDirectory, distDirectory) {
			var modules = this.getModules(moduleDirectory),
				activityFiles = [],
				activities = [],
				i;

			for (i = 0; i < modules.length; i++) {
				activityFiles = activityFiles.concat(this.getActivityFiles(modules[i]));
			}

			for (i = 0; i < activityFiles.length; i++) {
				activities.push(activityFiles[i].substr(
					distDirectory.length + 1,
					activityFiles[i].length - distDirectory.length - 4
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
		readFile: function(filename) {
			return fs.readFileSync(filename, 'utf-8');
		},
		writeFile: function(filename, contents) {
			var file = fs.openSync(filename, 'w');

			fs.write(file, contents);
			fs.close(file);
		}
	};

})(module);