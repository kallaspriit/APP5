define(
['core/Navi', 'core/Keyboard', 'Util'],
function(navi, keyboard, util) {
	'use strict';

	/**
	 * Pagination directive.
	 *
	 * @class pagination
	 * @module Directives
	 * @static
	 */
	return [function() {
		var link = function($scope, $element, $attrs/*, $controller*/) {
			var currentActivity = navi.getCurrentItem(),
				page = 1;

			if (
				util.isObject(currentActivity)
				&& util.isObject(currentActivity.parameters)
				&& !util.isUndefined(currentActivity.parameters.page)
			) {
				page = parseInt(currentActivity.parameters.page, 10);

				if (isNaN(page) || page < 1) {
					page = 1;
				}
			}

			$scope.currentPage = page;
			$scope.itemsPerPage = 10;
			$scope.pageCount = 0;
			$scope.pageNumbers = [];
			$scope.data = null;
			$scope.$parent.pagination = [];

			if (!util.isUndefined($attrs.itemsPerPage)) {
				var itemsPerPage = parseInt($attrs.itemsPerPage, 10);

				if (itemsPerPage >= 1) {
					$scope.itemsPerPage = itemsPerPage;
				}
			}

			var unwatchData = $scope.$watch($attrs.data, function(data) {
				if (!util.isObject(data) && !util.isArray(data)) {
					data = [];
				}

				$scope.data = data;
				$scope.pageCount = Math.ceil(util.sizeOf(data) / $scope.itemsPerPage);

				if ($scope.currentPage > $scope.pageCount) {
					$scope.currentPage = 1;
				}

				$scope.$parent.pagination = $scope.data.slice(
					($scope.currentPage - 1) * $scope.itemsPerPage,
					$scope.currentPage * $scope.itemsPerPage
				);

				$scope.pageNumbers = [];

				for (var i = 1; i <= $scope.pageCount; i++) {
					$scope.pageNumbers.push(i);
				}
			}, true);

			$scope.showNextPage = function() {
				var nextPage = Math.min($scope.currentPage + 1, $scope.pageCount);

				navi.setUrlParameter('page', nextPage, true);
			};

			$scope.showPreviousPage = function() {
				var previousPage = Math.max($scope.currentPage - 1, 1);

				navi.setUrlParameter('page', previousPage, true);
			};

			var naviBind = navi.on(navi.Event.PARAMETERS_CHANGED, function(e) {
					if (util.isUndefined(e.parameters.page)) {
						return;
					}

					var page = parseInt(e.parameters.page, 10);

					if (!util.isNumber(page)) {
						page = 1;
					}

					if (page <= 0) {
						page = 1;
					}

					if (page > $scope.pageCount) {
						page = $scope.pageCount;
					}

					$scope.currentPage = page;
					$scope.$parent.pagination = $scope.data.slice(
						($scope.currentPage - 1) * $scope.itemsPerPage,
						$scope.currentPage * $scope.itemsPerPage
					);
				}),
				keyboardBind = keyboard.on(keyboard.Event.KEYDOWN, function(e) {
					if (e.info.name === 'RIGHT') {
						$scope.showNextPage();
					} else if (e.info.name === 'LEFT') {
						$scope.showPreviousPage();
					}
				});

			$element.bind('$destroy', function() {
				unwatchData();
				naviBind.removeListener();
				keyboardBind.removeListener();
			});
		};

		return {
			scope: true,        // use data from parent scope
			restrict: 'E',      // restrict to elements
			transclude: true,   // we need the contents of the tag
			replace: true,      // replace the <pagination> tag
			link: link,
			templateUrl: 'partials/paginate.html'
		};
	}];
});