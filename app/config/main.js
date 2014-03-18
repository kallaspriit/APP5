define(
['config/base', 'underscore'],

/**
 * Developer-specific configuration file.
 *
 * Extends the base configuration and should generally not be versioned so developers wouldn't overwrite each other's
 * special options.
 *
 * @class config-main
 * @module Config
 * @static
 */
function(base, _) {
	'use strict';

	var options = _.clone(base);

	// override any developer-specific options
	options.debug = true;

	return options;
});