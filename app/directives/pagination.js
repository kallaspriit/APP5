// Research
// http://jsfiddle.net/kelvo/zZURe/17/
// http://jsfiddle.net/SAWsA/11/
// http://jsfiddle.net/xncuF/

define(
['Util', 'Navi'],
function(util, navi) {
	'use strict';

	var controller = [
		'$scope', '$element', '$attrs',
		function(/*$scope, $element, $attrs*/) {
			//console.log('CONTROLLER', $scope, $element, $attrs);
		}],

		link = function($scope, $element, $attrs/*, $controller*/) {
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
			$scope.itemsPerPage = 4;
			$scope.pageCount = 0;
			$scope.pageNumbers = [];
			$scope.data = null;
			$scope.routeName = 'contacts'; // TODO Where to get it and what if using other routers?

			$scope.$parent.pagination = [];

			$scope.$watch($attrs.data, function(data) {
				$scope.data = data;
				$scope.pageCount = Math.ceil(util.sizeOf(data)) / $scope.itemsPerPage;

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

				navi.open($scope.routeName, {page: nextPage});
			};

			$scope.showPreviousPage = function() {
				var previousPage = Math.max($scope.currentPage - 1, 1);

				navi.open($scope.routeName, {page: previousPage});
			};

			navi.bind(navi.Event.PARAMETERS_CHANGED, function(e) {
				$scope.currentPage = e.parameters.page;
				$scope.$parent.pagination = $scope.data.slice(
					($scope.currentPage - 1) * $scope.itemsPerPage,
					$scope.currentPage * $scope.itemsPerPage
				);
			});

			$element.bind('$destroy', function() {
				console.log('ELEMENT DESTROYED');
			});

			//console.log('LINK', $scope, $element, $attrs, $controller);
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
			controller: controller,
			link: link,
			templateUrl: 'partials/pagination.html'
		};
	}];
});