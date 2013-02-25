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

		liveDate: ['$timeout', 'dateFilter', function($timeout, dateFilter) {
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
			};
		}],

		translate: ['translator', 'util', '_', function(translator, util, _) {
			return function(scope, element, attrs) {
				var key = element.html(),
					params = [],
					map = {},
					args,
					validArgs,
					i;

				if (util.isString(attrs.translate) && attrs.translate.length > 0) {
					_.extend(params, attrs.translate.split(/, ?/));
				}

				if (translator.has(key)) {
					if (params.length > 0) {
						for (i = 0; i < params.length; i++) {
							map[params[i]] = null;

							scope.$watch(params[i], function(value) {
								map[this.param] = value;

								args = _.values(map);
								args.unshift(key);
								util.normalizeType(args);

								validArgs = _.reduce(args, function(memo, arg) {
									return arg !== null && memo === true;
								}, true);

								if (validArgs) {
									try {
										element.html(translator.translate.apply(translator, args));
									} catch (e) { util.noop(e); }

									translator.bind(translator.Event.LANGUAGE_CHANGED, function() {
										this.element.html(translator.translate.apply(translator, this.args));
									}.bind({args: args, element: element}));
								}
							}.bind({i: i, param: params[i], values: map}));
						}
					} else {
						element.html(translator.translate(key));

						translator.bind(translator.Event.LANGUAGE_CHANGED, function() {
							this.element.html(translator.translate(this.key));
						}.bind({key: key, element: element}));
					}
				}
			};
		}]
	};
});