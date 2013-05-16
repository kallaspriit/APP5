define(
[],
function() {
	'use strict';

	var link = function($scope, $element, $attrs, $controller) {
		$element.bind('$destroy', function() {
			// unload
		});
	};

	/**
	 * Datepicker directive.
	 *
	 * @class Datepicker
	 * @module Addons
	 * @static
	 */
	return [function() {
		return {
			scope: true,
			restrict: 'E', // EACM
			transclude: true,
			replace: true,
			link: link,
			templateUrl: 'addons/datepicker/datepicker.html'
		};
	}];
});