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
		var controller = function($scope, $element, $attrs) {
				var module = $attrs.module,
					activity = $attrs.activity,
					controllerName = module + '.' + activity,
					//className = util.convertEntityName(module) + 'Module',
					moduleCssFilename = 'modules/' + module + '/style/' + module + '-module.css',
					viewFilename = 'modules/' + module + '/views/' + module + '-' + activity + '.html',
					cssPrefix = config.cssPrefix;

				util.when(
					resourceManager.loadActivity(module, activity),
					resourceManager.loadView(viewFilename),
					resourceManager.loadCss(moduleCssFilename)
				).done(function(activityInstance, viewContent) {
					app.registerController(controllerName, activityInstance.onCreate);

					var viewElement = $(viewContent);

					//$element.html(viewContent);
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

					//app.validate();

					//$compile(viewElement)($scope);

					//app.compile($element)(app.baseScope);

					console.log('loaded partial', activityInstance, viewContent);
				});

				console.log('controller', module, activity, $attrs);

				//$attrs.$set('ngController', 'test');
			},
			link = function($scope, $element, $attrs) {
				console.log('link', $scope, $element, $attrs);

				//$attrs.$set('ngController', 'test');
			};

		return {
			scope: true,
			restrict: 'E',			// restrict to elements
			replace: true,			// replace the <partial> tag
			transclude: 'element',	// transclude the whole element including any directives defined at lower priority
			controller: controller,
			link: link,
			//template: '<div ng-controller>!{{message}}!</div>'
			template: '<div class="loading-partial"></div>'
		};
	}];
});