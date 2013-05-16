define(
['ResourceManager', 'App', 'Util', 'addons/datepicker/glDatePicker.min'],
function(resourceManager, app, util) {
	'use strict';

	var link = function($scope, $element, $attrs) {
		resourceManager.loadCss('addons/datepicker/glDatePicker.default.css');

		$($element).glDatePicker({
			onClick: function(el, _, date) {
				var dateStr = (date.getDate() < 10 ? '0' : '') + date.getDate()
					+ '.' + (date.getMonth() + 1 < 10 ? '0' : '') + (date.getMonth() + 1)
					+ '.' + date.getFullYear();

				el.val(dateStr);

				if (!util.isUndefined($attrs.ngModel)) {
					$scope.$parent[$attrs.ngModel] = dateStr;

					app.validate();
				}
			}
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