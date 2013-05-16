define(
[
	'directives/translate',
	'directives/ngTap',
	'directives/pagination',
	'addons/datepicker/datepicker'
],
function(
	translate,
	ngTap,
	pagination,
    datepicker
) {
	'use strict';

	/*
	 * This file includes the directives required and maps them to some name.
	 */
	return {
		translate: translate,
		ngTap: ngTap,
		pagination: pagination,
		datepicker: datepicker
	};
});