define(
['core/App', 'core/ResourceManager', 'Util', 'config/main'],
function(app, resourceManager, util, config) {
	'use strict';

	/**
	 * Partial directive.
	 *
	 * @class partial
	 * @module Directives
	 * @static
	 */
	return ['$compile', function($compile) {
		var link = function($scope, $element, $attrs) {
				var module = $attrs.module,
					activity = $attrs.activity,
					parameters = {},
					controllerName = module + '.' + activity,
					moduleCssFilename = 'modules/' + module + '/style/' + module + '-module.css',
					viewFilename = 'modules/' + module + '/views/' + module + '-' + activity + '.html',
					cssPrefix = config.cssPrefix,
					viewElement,
					key;

				for (key in $attrs) {
					if (key.substr(0, 1) === '$') {
						continue;
					}

					parameters[key] = $attrs[key];
				}

				util.when(
					resourceManager.loadActivity(module, activity),
					resourceManager.loadView(viewFilename),
					resourceManager.loadCss(moduleCssFilename)
				).done(function(activityInstance, viewContent) {
					activityInstance.setParameters(parameters);

					app.registerController(
						controllerName,
						app.getAnnotatedController(activityInstance.onCreate, activityInstance)
					);

					viewElement = $(viewContent);
					viewElement.attr('ng-controller', controllerName);
					viewElement.addClass(
						cssPrefix + 'partial ' + module + '-module ' + activity + '-activity ' +
						cssPrefix + 'partial-loading'
					);

					$element.replaceWith(viewElement);

					$compile(viewElement)($scope);

					$scope.$evalAsync(function () {
						viewElement.removeClass(cssPrefix + 'partial-loading');
					}.bind(this));
				});
			};

		return {
			scope: true,
			restrict: 'E',			// restrict to elements
			replace: true,			// replace the <partial> tag
			link: link,
			template: '<div class="loading-partial"></div>'
		};
	}];
});