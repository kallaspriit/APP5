define(function() {
	'use strict';

	/**
	 * Custom angularjs directives.
	 *
	 * @class Directives
	 * @module Core
	 * @static
	 */
	return {

		liveDate: function($timeout, dateFilter) {
			// return the directive link function. (compile function not needed)
			return function(scope, element, attrs) {
				var format,  // date format
					timeoutId; // timeoutId, so that we can cancel the time updates

				// used to update the UI
				function updateTime() {
					element.text(dateFilter(new Date(), format));
				}

				// watch the expression, and update the UI on change.
				scope.$watch(attrs.liveDate, function(value) {
					format = value;
					updateTime();
				});

				// schedule update in one second
				function updateLater() {
					// save the timeoutId for canceling
					timeoutId = $timeout(function() {
						updateTime(); // update DOM
						updateLater(); // schedule another update
					}, 1000);
				}

				// listen on DOM destroy (removal) event, and cancel the next UI update
				// to prevent updating time ofter the DOM element was removed.
				element.bind('$destroy', function() {
					$timeout.cancel(timeoutId);
				});

				updateLater(); // kick off the UI update process.
			}
		}
	};
});