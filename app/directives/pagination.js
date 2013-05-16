define(
['Util', 'Navi', 'Keyboard'],
function(util, navi, keyboard) {
	'use strict';

	var link = function($scope, $element, $attrs/*, $controller*/) {
			var currentAction = navi.getCurrent(),
				page = 1;

			if (
				util.isObject(currentAction)
				&& util.isObject(currentAction.parameters)
				&& !util.isUndefined(currentAction.parameters.page)
			) {
				page = parseInt(currentAction.parameters.page, 10);

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

			$scope.$watch($attrs.data, function(data) {
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

				navi.setUrlParameter('page', nextPage);
			};

			$scope.showPreviousPage = function() {
				var previousPage = Math.max($scope.currentPage - 1, 1);

				navi.setUrlParameter('page', previousPage);
			};

			var naviBind = navi.bind(navi.Event.PARAMETERS_CHANGED, function(e) {
					$scope.currentPage = e.parameters.page;
					$scope.$parent.pagination = $scope.data.slice(
						($scope.currentPage - 1) * $scope.itemsPerPage,
						$scope.currentPage * $scope.itemsPerPage
					);
				}),
				keyboardBind = keyboard.bind(keyboard.Event.KEYDOWN, function(e) {
					if (e.info.name === 'RIGHT') {
						$scope.showNextPage();
					} else if (e.info.name === 'LEFT') {
						$scope.showPreviousPage();
					}
				});

			$element.bind('$destroy', function() {
				console.log('ELEMENT DESTROYED');

				naviBind.unbind();
				keyboardBind.unbind();
			});
		};

	/**
	 * Pagination directive.
	 *
	 * @class pagination
	 * @module Directives
	 * @static
	 */
	return [function() {
		return {
			scope: true,        // use data from parent scope
			restrict: 'E',      // restrict to elements
			transclude: true,   // we need the contents of the tag
			replace: true,      // replace the <pagination> tag
			link: link,
			templateUrl: 'partials/pagination.html'
		};
	}];
});