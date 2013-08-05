define(
['ResourceManager', 'App', 'Util', 'addons/datepick/glDatePicker'],
function(resourceManager, app, util) {
	'use strict';

	var formatDate = function(date) {
			return (date.getDate() < 10 ? '0' : '') + date.getDate()
				+ '.' + (date.getMonth() + 1 < 10 ? '0' : '') + (date.getMonth() + 1)
				+ '.' + date.getFullYear();
		},

		parseDate = function(date) {
			var currentDate = new Date(),
				year = currentDate.getFullYear(),
				month = currentDate.getMonth(),
				day = currentDate.getDate(),
				tokens = date.split('.');

			if (tokens.length === 3) {
				day = parseInt(tokens[0], 10);
				month = parseInt(tokens[1], 10) - 1;
				year = parseInt(tokens[2], 10);
			}

			return new Date(year, month, day);
		},

		link = function($scope, $element, $attrs) {
			resourceManager.loadCss('addons/datepick/glDatePicker.default.css');

			var unwatchData = null,
				datePicker = null,
				date = new Date();

			if (!util.isUndefined($attrs.ngModel)) {
				unwatchData = $scope.$watch('model', function(data) {
					if (util.isString(data)) {
						date = parseDate(data);

						$element.val(formatDate(date));
					}
				});
			}

			window.setTimeout(function() {
				datePicker = $($element).glDatePicker({
					onClick: function(el, _, date) {
						var dateStr = formatDate(date);

						el.val(dateStr);

						if (!util.isUndefined($attrs.ngModel)) {
							$scope.model = dateStr;

							app.validate();
						}
					},
					selectedDate: date,
					zIndex: 10000,
					/*selectableDateRange: [{
						from: new Date(1900, 1, 1),
						to: new Date()
					}]*/
					startDate: new Date(1900, 0, 1),
					endDate: new Date()
				}).glDatePicker(true);


			}, 500); // TODO Animation makes the position calculation fail

			$element.bind('$destroy', function() {
				if (util.isFunction(unwatchData)) {
					unwatchData();
				}

				if (datePicker !== null) {
					$(datePicker.calendar[0]).remove();
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
			//scope: true,
			scope: {
				model: '=ngModel'
			},
			restrict: 'E', // EACM
			transclude: true,
			replace: true,
			link: link,
			templateUrl: 'addons/datepick/datepick.html'
		};
	}];
});