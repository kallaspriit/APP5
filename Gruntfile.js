module.exports = function (grunt) {
	'use strict';

	// configuration
	var appDirectory = 'app',
		distDirectory = 'dist',
		testDirectory = 'test',
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
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			all: [
				'Gruntfile.js',
				'karma.conf.js',
				'test/**/*.js',
				appDirectory + '/app.js',
				appDirectory + '/lib/app5/**/*.js',
				appDirectory + '/modules/**/*.js',
				appDirectory + '/models/**/*.js',
				appDirectory + '/directives/**/*.js'
			]
		},
        jsonlint: {
            main: {
                src: ['package.json']
            }
        },
		karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        },
		clean: [
			distDirectory,
			'docs'
		],
		copy: {
			main: {
				files: [{
					expand: true,
					cwd: appDirectory,
					src: ['**'],
					dest: distDirectory,
					dot: true
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
				//report: 'gzip' // take a long time..
			},
			build: {
				files: [{
					'dist/app.min.js': [compiledJsFile]
				}]
			}
		},
		cssmin: {
			combine: {
				options: {
					banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
					//report: 'gzip' // take a long time..
				},
				files: {
					'dist/style/min.css': [
						distDirectory + '/style/*.css',
						distDirectory + '/lib/**/*.css',
						distDirectory + '/modules/**/*.css',
						distDirectory + '/addons/**/*.css'
					]
				}
			}
		},
		yuidoc: {
			compile: {
				name: '<%= pkg.name %>',
				description: '<%= pkg.description %>',
				version: '<%= pkg.version %>',
				url: '<%= pkg.homepage %>',
				logo: 'media/logo-doc.png',
				options: {
					paths: [
						appDirectory + '/src',
						appDirectory + '/modules',
						appDirectory + '/directives',
						appDirectory + '/config',
						appDirectory + '/models',
						appDirectory + '/addons',
						appDirectory + '/lib/app5'
					],
					outdir: 'docs',
					linkNatives: 'true'
				}
			}
		},
        bump: {
            options: {
                files: ['package.json'],
                updateConfigs: [],
                commit: true,
                commitMessage: 'Release v%VERSION%',
                commitFiles: ['package.json', 'app/config/base.js'],
                createTag: true,
                tagName: 'v%VERSION%',
                tagMessage: 'Version %VERSION%',
                push: false,
                pushTo: 'origin',
                gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d'
            }
        },
		prompt: {
			activity: {
				options: {
					questions: [{
						message: 'Module',
						config: '_activity.main.module',
						type: 'list',
						choices: function() {
							var modules = util.getModules(appDirectory + '/modules', true);

							modules.push('Create new module');

							return modules;
						}
					}, {
						message: 'Module name',
						config: '_activity.main.module',
						type: 'input',
						when: function(answers) {
							return answers['_activity.main.module'] === 'Create new module';
						}
					}, {
						message: 'Activity name',
						config: '_activity.main.activity',
						type: 'input'
					}, {
						message: 'Route path',
						config: '_activity.main.route',
						type: 'input',
						default: function(answers) {
							return answers['_activity.main.module'] + '/' + answers['_activity.main.activity'];
						}
					}]
				}
			},
			model: {
				options: {
					questions: [{
						message: 'Name (use "model-name" format)',
						config: '_model.main.name',
						type: 'input'
					}, {
						message: 'Type',
						config: '_model.main.type',
						type: 'list',
						choices: ['Array', 'Object']
					}]
				}
			}
		},
		_activity: {
			main: {
				module: '',
				activity: '',
				route: ''
			}
		},
		_model: {
			main: {
				name: '',
				type: null
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

	// Generates documentation
	grunt.loadNpmTasks('grunt-contrib-yuidoc');

	// Test-runner
	grunt.loadNpmTasks('grunt-karma');

	// Used to prompt the user for some input
	grunt.loadNpmTasks('grunt-prompt');

    // Used to lint json files
    grunt.loadNpmTasks('grunt-jsonlint');

    // Used to bump version numbers
    grunt.loadNpmTasks('grunt-bump');

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

	// Combines the view html files into a single javascript file
	grunt.registerTask('combine-views', 'Combines the view html files into a single javascript file', function() {
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

	// Renames the app.js in index.html to app.min.js
	grunt.registerTask('use-minified', 'Renames the app.js in index.html to app.min.js', function() {
		util.replaceInFile(distDirectory + '/index.html', appName + '.js', appName + '.min.js');
	});

	// Augments the index.html file by replacing all stylesheet decorations with a single combined one etc
	grunt.registerTask('augment-index', 'Augments the index.html file', function() {
		util.augmentIndex(distDirectory + '/index.html');
	});

	// Replaces the user main.js with the default one
	grunt.registerTask('replace-config', 'Augments the index.html file', function() {
		util.copyTemplate(appDirectory + '/config/_main.js', distDirectory + '/config/main.js', {});
	});

	// Generates a new activity using a template
	grunt.registerMultiTask('_activity', 'Generates a new activity', function() {
		if (this.data.module === '' || this.data.activity === '') {
			grunt.log.writeln('Empty module or activity name, quitting');

			return;
		}

		var newModule = !util.moduleExists(appDirectory + '/modules', this.data.module);

		if (newModule) {
			util.createModule(appDirectory + '/modules', this.data.module);
		}

		util.createActivity(appDirectory + '/modules/', this.data.module, this.data.activity);

		if (this.data.route.length > 0) {
			util.createRoute(appDirectory + '/config/routes.js', this.data.route, this.data.module, this.data.activity);
		}

		console.log(
			'Created activity ' +
			(newModule ? ' and module ' : '') +
			util.convertEntityName(this.data.module) + '.' + util.convertEntityName(this.data.activity) + 'Activity' +
			(this.data.route.length > 0 ? ', route: /' + this.data.route : ', didn\'t create a route')
		);
	});

	// Generates a new model.
	grunt.registerMultiTask('_model', 'Generates a new model', function() {
		if (this.data.name === '') {
			grunt.log.writeln('Empty model name, quitting');

			return;
		}

		util.createModel(appDirectory + '/models', this.data.name, this.data.type);

		console.log('Created model called "' + this.data.name + '" of type "' + this.data.type + '"');
	});

    // Generates a new activity using a template
    grunt.registerTask('_update_version', 'Updates the application version number in application config', function() {
        var pkg = require('./package.json'),
            version = pkg.version,
            baseConfigFilename = appDirectory + '/config/base.js',
            baseConfigContents = util.readFile(baseConfigFilename),
            regex = /version: \'([0-9\.]+)\',/,
            matches = baseConfigContents.match(regex),
            updatedContents;

        if (matches === null) {
            grunt.fail.warn('Failed to find version definition in ' + baseConfigFilename);
        }

        updatedContents = baseConfigContents.replace(matches[0], 'version: \'' + version + '\',');

        util.writeFile(baseConfigFilename, updatedContents);
    });

    // Prepares karma testing
    grunt.registerTask('_prepare_karma', 'Prepares karma testing', function() {
        var appConfigContents = util.readFile(appDirectory + '/app.js'),
            testConfigContents = appConfigContents.replace(/\r/g, '');

        // prepends spec files list code
        testConfigContents = 'var tests = [];\n' +
            '\n' +
            'for (var file in window.__karma__.files) {\n' +
            '    if (window.__karma__.files.hasOwnProperty(file)) {\n' +
            '        if (/Spec\\.js$/.test(file)) {\n' +
            '            tests.push(file);\n' +
            '        }\n' +
            '    }\n' +
            '}\n\n' + testConfigContents;

        // replace the base url
        testConfigContents = testConfigContents.replace('baseUrl: \'src\',', 'baseUrl: \'/base/app/src\',');

        // add test dependencies and karma callback
        testConfigContents = testConfigContents.replace(
            '}\n\n\t// test configuration dependencies and callback are added here, don\'t remove this comment',
            '},\n\n\t// ask Require.js to load these files (all our tests)\n' +
            '\tdeps: tests,\n' +
            '\n' +
            '\t// start test run, once Require.js is done\n' +
            '\tcallback: window.__karma__.start'
        );

		// remove the bootstrapping code
		testConfigContents = testConfigContents.replace(/\n\nrequire\([\s\S]*\);/, '');

		// restore windows newline
		testConfigContents = testConfigContents.replace(/\n/g, '\r\n');

		// write test/test.js file
        util.writeFile(testDirectory + '/test.js', testConfigContents);
    });

	// TODO append partials

	// Default task
	grunt.registerTask(
		'default', [
			'jshint',
			'jsonlint',
            'clean',
			'copy',
			'replace-config',
			'annotate',
			'combine-views',
			'requirejs',
			'uglify',
			'use-minified',
			'cssmin',
			'augment-index',
			'yuidoc'
		]
	);

	// Alias yuidoc to just doc
	grunt.registerTask('doc', ['yuidoc']);

    // Bump version number and copy the new version number to application config once bumped
    grunt.registerTask('bump-patch', ['bump-only:patch', '_update_version', 'bump-commit']);
    grunt.registerTask('bump-minor', ['bump-only:minor', '_update_version', 'bump-commit']);
    grunt.registerTask('bump-major', ['bump-only:major', '_update_version', 'bump-commit']);

	// Generate an activity
	grunt.registerTask('activity', ['prompt:activity', '_activity']);

	// Generate a model
	grunt.registerTask('model', ['prompt:model', '_model']);

    // Test application
    grunt.registerTask('test', ['_prepare_karma', 'karma']);
};
