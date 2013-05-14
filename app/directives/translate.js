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
	return ['translator', 'util', '_', function(translator, util, _) {
		return function($scope, $element, $attrs) {
			var key = $element.html(),
				params = [],
				map = {},
				args,
				validArgs,
				i;

			if (util.isString($attrs.translate) && $attrs.translate.length > 0) {
				_.extend(params, $attrs.translate.split(/, ?/));
			}

			if (translator.has(key)) {
				if (params.length > 0) {
					for (i = 0; i < params.length; i++) {
						map[params[i]] = null;

						$scope.$watch(params[i], function(value) {
							map[this.param] = value;

							args = _.values(map);
							args.unshift(key);
							util.normalizeType(args);

							validArgs = _.reduce(args, function(memo, arg) {
								return arg !== null && memo === true;
							}, true);

							if (validArgs) {
								try {
									$element.html(translator.translate.apply(translator, args));
								} catch (e) { util.noop(e); }

								translator.bind(translator.Event.LANGUAGE_CHANGED, function() {
									this.element.html(translator.translate.apply(translator, this.args));
								}.bind({args: args, element: $element}));
							}
						}.bind({i: i, param: params[i], values: map}));
					}
				} else {
					$element.html(translator.translate(key));

					translator.bind(translator.Event.LANGUAGE_CHANGED, function() {
						this.element.html(translator.translate(this.key));
					}.bind({key: key, element: $element}));
				}
			}
		};
	}];
});