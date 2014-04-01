module.exports = function (grunt) {
	'use strict';

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
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
		ngmin: {
			controllers: {
				src: ['dist/modules/*/*Activity.js'],
				dest: 'dist/modules.js'
			},
			directives: {
				expand: true,
				cwd: 'dist/directives',
				src: ['*.js'],
				dest: 'dist/directives'
			}
		},
		requirejs: {
			compile: {
				options: {
					baseUrl: './',
					mainConfigFile: 'dist/app.js',
					name: 'tools/almond/almond.js', // assumes a production build using almond
					out: 'dist/app.build.js'
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

	// Provides file copying
	grunt.loadNpmTasks('grunt-contrib-copy');

	// Require.js build tool
	grunt.loadNpmTasks('grunt-contrib-requirejs');

	// Load the plugin that provides the angular minification preprocessing task
	grunt.loadNpmTasks('grunt-ngmin');

	// Load the plugin that provides the "uglify" task
	grunt.loadNpmTasks('grunt-contrib-uglify');

	// Default tasks
	grunt.registerTask('default', ['copy', 'requirejs'/*, 'ngmin', 'uglify'*/]);
};