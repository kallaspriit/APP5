define(
[
	'core/BaseDirectives',
	'Util',
	'directives/ngTap',
	'directives/paginate',
	'addons/datepick/datepick'
],
function(
	baseDirectives,
	util,
	ngTap,
	paginate,
    datepick
) {
	'use strict';

	/*
	 * This file includes additional app-specific directives and addons.
	 */
	return util.extend({}, baseDirectives, {
		ngTap: ngTap,
		paginate: paginate,
		datepick: datepick
	});
});