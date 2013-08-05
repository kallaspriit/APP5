define(
[
	'directives/translate',
	'directives/ngTap',
	'directives/paginate',
	'addons/datepick/datepick'
],
function(
	translate,
	ngTap,
	paginate,
    datepick
) {
	'use strict';

	/*
	 * This file includes the directives required and maps them to some name.
	 */
	return {
		translate: translate,
		ngTap: ngTap,
		paginate: paginate,
		datepick: datepick
	};
});