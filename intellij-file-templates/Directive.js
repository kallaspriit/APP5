define(
[],
function() {
	'use strict';

	var link = function($scope, $element, $attrs/*, $controller*/) {
		$element.bind('$destroy', function() {
			// unload
		});
	};

	/**
	 * ${NAME} directive.
	 *
	 * @class ${NAME}
	 * @module Directives
	 * @static
	 */
	return [function() {
		return {
			scope: true,
			restrict: 'E', // EACM
			transclude: true,
			replace: true,
			link: link,
			templateUrl: 'partials/${NAME}.html'
		};
	}];
});