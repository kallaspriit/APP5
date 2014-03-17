define(
[
	'Util',
	'directives/translate',
	'directives/ngTap',
	'directives/paginate',
	'addons/datepick/datepick'
],
function(
	util,
	translate,
	ngTap,
	paginate,
    datepick
) {
	'use strict';

	/*
	 * This file includes additional app-specific directives and addons.
	 */
	return {
		translate: translate,
		ngTap: ngTap,
		paginate: paginate,
		datepick: datepick
	};
});