module.exports = function (grunt) {
	'use strict';

	// configuration
	var appDirectory = 'app',
		distDirectory = 'dist',
		modulesDirectory = distDirectory + '/modules',
		appName = 'app',
		compiledJsFile = distDirectory + '/' + appName + '.compiled.js',
		jsMapFile = distDirectory + '/' + appName + '.map';

	// helpers
	var util = require('./tools/grunt/grunt-util.js');

	// build a list of module activities to merge in build
	var activities = util.getActivityNames(modulesDirectory, distDirectory),
		requireIncludes = activities;

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		clean: [distDirectory],
		copy: {
			main: {
				files: [{
					expand: true,
					cwd: appDirectory,
					src: ['**'],
					dest: distDirectory
				}]
			}
		},
		requirejs: {
			compile: {
				options: {
					baseUrl: distDirectory + '/src',
					mainConfigFile: distDirectory + '/' + appName + '.js',
					optimize: 'none',
					optimizeCss: 'none',
					skipDirOptimize: true,
					useStrict: true,
					name: '../' + appName,
					include: requireIncludes,
					out: compiledJsFile
				}
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
				sourceMap: true,
				sourceMapIncludeSources: true,
				sourceMapName: jsMapFile
			},
			build: {
				files: [{
					// TODO Make it use config
					'dist/app.min.js': [compiledJsFile]
				}]
			}
		},
		cssmin: {
			combine: {
				options: {
					banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
					report: 'gzip'
				},
				files: {
					// TODO Make it use config
					'dist/style/merged.css': [
						distDirectory + '/style/*.css',
						distDirectory + '/lib/**/*.css',
						distDirectory + '/modules/**/*.css'
					]
				}
			}
		}
	});

	/**
	 * Annotates activities
	 * So ContactsActivity.prototype.onCreate = function($scope, ui) {
	 * becomes ContactsActivity.prototype.onCreate = ['$scope', 'ui', function($scope, ui) {
	*/
	grunt.registerTask('annotate', 'Annotates activities for compression', function() {
		grunt.log.writeln('  Modules:');

		var modules = util.getModules(modulesDirectory),
			activities,
			activityInfo,
			activityCode,
			annotatedCode,
			i, j;

		for (i = 0; i < modules.length; i++) {
			grunt.log.writeln('  > ' + modules[i]);

			activities = util.getActivityFiles(modules[i]);

			for (j = 0; j < activities.length; j++) {
				grunt.log.writeln('    > ' + activities[j]);

				activityCode = util.readFile(activities[j]);
				activityInfo = util.getActivityInfo(activities[j], activityCode);

				if (!activityInfo) {
					continue;
				}

				annotatedCode = util.annotateActivity(activityCode, activityInfo);

				util.writeFile(activities[j], annotatedCode);
			}
		}
	});

	grunt.registerTask('use-minified', 'Renames the app.js in index.html to app.min.js', function() {
		util.replaceInFile(distDirectory + '/index.html', appName + '.js', appName + '.min.js');
	});

	// Used to clean directories
	grunt.loadNpmTasks('grunt-contrib-clean');

	// Provides file copying
	grunt.loadNpmTasks('grunt-contrib-copy');

	// Require.js build tool
	grunt.loadNpmTasks('grunt-contrib-requirejs');

	// Load the plugin that provides the "uglify" task
	grunt.loadNpmTasks('grunt-contrib-uglify');

	// Load the plugin that provides the "uglify" task
	grunt.loadNpmTasks('grunt-contrib-cssmin');

	// TODO append views, merge and compress CSS, jshint, yuidoc

	// Default task
	grunt.registerTask('default', ['clean', 'copy', 'annotate', 'requirejs', 'uglify', 'use-minified', 'cssmin']);
};