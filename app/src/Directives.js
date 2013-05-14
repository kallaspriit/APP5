define(
['directives/translate', 'directives/ngTap', 'directives/pagination'],
function(translate, ngTap, pagination) {
	'use strict';

	/*
	 * This file includes the directives required and maps them to some name.
	 */
	return {
		translate: translate,
		ngTap: ngTap,
		pagination: pagination
	};
});