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
	var modules = util.getModules(appDirectory + '/modules'),
		activities = util.getActivityNames(appDirectory + '/modules'),
		views = util.getViews(appDirectory + '/modules'),
		requireIncludes = activities,
		moduleTokens,
		moduleName,
		i;

	// add translation files to require includes list
	for (i = 0; i < modules.length; i++) {
		moduleTokens = modules[i].split('/');
		moduleName = moduleTokens[moduleTokens.length - 1];

		requireIncludes.push('modules/' + moduleName + '/' + moduleName + '-translations');
	}

	// add merged view files to include list
	for (i = 0; i < views.length; i++) {
		requireIncludes.push('views/' + views[i].module + '.' + views[i].view);
	}

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		clean: [distDirectory],
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			all: [
				appDirectory + '/app.js',
				appDirectory + '/lib/app5/**/*.js',
				appDirectory + '/modules/**/*.js',
				appDirectory + '/directives/**/*.js',
			]
		},
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
				sourceMapName: jsMapFile,
				//report: 'gzip' // take a long time..
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
					//report: 'gzip' // take a long time..
				},
				files: {
					// TODO Make it use config
					'dist/style/min.css': [
						distDirectory + '/style/*.css',
						distDirectory + '/lib/**/*.css',
						distDirectory + '/modules/**/*.css'
					]
				}
			}
		}
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

	// Lints the code
	grunt.loadNpmTasks('grunt-contrib-jshint');

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

	grunt.registerTask('combine-views', 'Combined the view html files into a single javascript file', function() {
		grunt.log.writeln('  Views:');

		var views = util.getViews(modulesDirectory),
			viewDefinition,
			jsFilename,
			i;

		util.createDirectory(distDirectory + '/views');

		for (i = 0; i < views.length; i++) {
			viewDefinition = util.getViewDefinition(views[i]);
			jsFilename = distDirectory + '/views/' + views[i].module + '.' + views[i].view + '.js';

			util.writeFile(jsFilename, viewDefinition);

			grunt.log.writeln('  > ' + views[i].module + '.' + views[i].view + ' to ' + jsFilename);
		}
	});

	grunt.registerTask('use-minified', 'Renames the app.js in index.html to app.min.js', function() {
		util.replaceInFile(distDirectory + '/index.html', appName + '.js', appName + '.min.js');
	});

	grunt.registerTask('augment-index', 'Renames the app.js in index.html to app.min.js', function() {
		util.augmentIndex(distDirectory + '/index.html');
	});

	// TODO append views, yuidoc

	// Default task
	grunt.registerTask(
		'default', [
			'clean',
			'jshint',
			'copy',
			'annotate',
			'combine-views',
			'requirejs',
			'uglify',
			'use-minified',
			'cssmin',
			'augment-index'
		]
	);
};