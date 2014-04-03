module.exports = function (grunt) {
	'use strict';

	// configuration
	var appDirectory = 'app',
		distDirectory = 'dist',
		modulesDirectory = distDirectory + '/modules',
		applicationModule = 'app';

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
		annotate: {
			main: {
				modules: modulesDirectory
			}
		},
		requirejs: {
			compile: {
				options: {
					baseUrl: distDirectory + '/src',
					mainConfigFile: distDirectory + '/' + applicationModule + '.js',
					optimize: 'none',
					optimizeCss: 'none',
					skipDirOptimize: true,
					removeCombined: true,
					useStrict: true,
					name: '../' + applicationModule,
					include: requireIncludes,
					out: distDirectory + '/' + applicationModule + '.js'
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
					cwd: distDirectory,
					src: '**/*.js',
					dest: distDirectory,
				}]
			}
		}
	});

	/**
	 * Annotates activities
	 * So ContactsActivity.prototype.onCreate = function($scope, ui) {
	 * becomes ContactsActivity.prototype.onCreate = ['$scope', 'ui', function($scope, ui) {
	*/
	grunt.registerMultiTask('annotate', 'Annotates activities for compression', function() {
		grunt.log.writeln('Annotate target: ' + this.target);
		grunt.log.writeln('  Modules:');

		var modules = util.getModules(this.data.modules),
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
	grunt.registerTask('default', ['clean', 'copy', 'annotate', 'requirejs'/*, 'uglify'*/]);
};