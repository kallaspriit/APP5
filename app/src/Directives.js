define(
[
	'Util',
	'directives/translate',
	'directives/ngTap',
	'directives/paginate',
	'directives/partial',
	'addons/datepick/datepick'
],
function(
	util,
	translate,
	ngTap,
	paginate,
	partial,
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
		partial: partial,
		datepick: datepick
	};
});