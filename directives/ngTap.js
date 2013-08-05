define(function() {
	'use strict';

	/**
	 * Tag directive.
	 *
	 * Provides instant-click functionality in place of ng-click.
	 *
	 * @class ngTap
	 * @module Directives
	 * @static
	 */
	return [function() {
		return function($scope, $element, $attrs) {
			if ('ontouchstart' in document) {
				$element.bind('touchstart', function() {
					$scope.$apply($attrs.ngTap);
				});
			} else {
				$element.bind('click', function() {
					$scope.$apply($attrs.ngTap);
				});
			}
		};
	}];
});