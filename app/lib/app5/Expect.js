define(
['Util', 'underscore'],
function(util, _) {
	'use strict';

	return function(value) {
		return {
			toBe: function(ref) {
				if (value !== ref) {
					throw new Error('Expected "' + value + '" to be "' + ref + '"');
				}
			},
			toContain: function(ref) {
				if (!util.isArray(value) && !util.isObject(value)) {
					throw new Error(
						'Expected "' + value + '" (' + typeof(value) + ') to be a collection and contain "' + ref + '"'
					);
				}

				if (util.isArray(value) && value.indexOf(ref) === -1) {
					throw new Error('Expected "' + JSON.stringify(value) + '" to contain "' + ref + '"');
				} else if (util.isObject(value) && !_.contains(_.values(value), ref)) {
					throw new Error('Expected "' + JSON.stringify(value) + '" to contain "' + ref + '"');
				}
			}
		};
	};
});