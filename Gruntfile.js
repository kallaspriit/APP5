module.exports = function (grunt) {
	'use strict';

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		clean: ['dist'],
		copy: {
			main: {
				files: [{
					expand: true,
					cwd: 'app',
					src: ['**'],
					dest: 'dist'
				}]
			}
		},
		annotate: {
			main: {
				modules: 'dist/modules'
			}
		},
		requirejs: {
			compile: {
				options: {
					baseUrl: 'dist/src',
					mainConfigFile: 'dist/app.js',
					optimize: 'none',
					optimizeCss: 'none',
					skipDirOptimize: true,
					useStrict: true,
					name: '../app',
					out: 'dist/app.compiled.js'
				}
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			build: {
				files: [{
					expand: true,
					cwd: 'dist',
					src: '**/*.js',
					dest: 'dist2',
				}]
			}
		}
	});

	// Annotates activities
	// ContactsActivity.prototype.onCreate = function($scope, ui) {
	// ContactsActivity.prototype.onCreate = ['$scope', 'ui', function($scope, ui) {
	grunt.registerMultiTask('annotate', 'Annotates activities for compression', function() {
		var fs = require('fs'),
			getModules = function(moduleBaseDir) {
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
			getActivities = function(moduleDirectory) {
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
			getActivityInfo = function(activityFilename, activityCode) {
				var activityFilenameTokens = activityFilename.split('/'),
					activityNameToken = activityFilenameTokens[activityFilenameTokens.length - 1],
					activityName = activityNameToken.substr(0, activityNameToken.length - 11),
					regex = new RegExp(
						'([\\t]*)(' + activityName + 'Activity.prototype.onCreate = function\\()([\\w, $]*)(\\))'
					),
					matches = activityCode.match(regex);

				if (matches === null) {
					grunt.log.error('Failed to find activity definition in "' + activityFilename + '"');

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
			annotateActivity = function(code, activityInfo) {
				annotatedCode = code.substr(0, activityInfo.closingPosition) + '}]'
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
			writeFile = function(filename, contents) {
				var file = fs.openSync(filename, 'w');

				fs.write(file, contents);
				fs.close(file);
			};

		grunt.log.writeln('Annotate target: ' + this.target);
		grunt.log.writeln('  Modules:');

		var modules = getModules(this.data.modules),
			activities,
			activityInfo,
			activityCode,
			annotatedCode,
			i, j;

		for (i = 0; i < modules.length; i++) {
			grunt.log.writeln('  > ' + modules[i]);

			activities = getActivities(modules[i]);

			for (j = 0; j < activities.length; j++) {
				grunt.log.writeln('    > ' + activities[j]);

				activityCode = fs.readFileSync(activities[j], 'utf-8');
				activityInfo = getActivityInfo(activities[j], activityCode);

				if (!activityInfo) {
					continue;
				}

				annotatedCode = annotateActivity(activityCode, activityInfo);

				writeFile(activities[j], annotatedCode);

				//grunt.log.writeln('      > ', activityInfo, annotatedCode);
			}
		}
	});

	// Used to clean directories
	grunt.loadNpmTasks('grunt-contrib-clean');

	// Provides file copying
	grunt.loadNpmTasks('grunt-contrib-copy');

	// Require.js build tool
	//grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-requirejs');

	// Load the plugin that provides the angular minification preprocessing task
	grunt.loadNpmTasks('grunt-ngmin');

	// Load the plugin that provides the "uglify" task
	grunt.loadNpmTasks('grunt-contrib-uglify');

	// TODO Next append activities, models, views then uglify

	// Default task
	grunt.registerTask('default', ['clean', 'copy', 'annotate', 'requirejs'/*, 'ngmin', 'uglify'*/]);
};