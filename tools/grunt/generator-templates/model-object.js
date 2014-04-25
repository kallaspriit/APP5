define(
function() {
	'use strict';

	/**
	 * $(Model) model.
	 *
	 * @class $(Model)
	 * @constructor
	 * @module Models
	 */
	var $(Model) = function() {
		this.data = [];
	};

	/**
	 * Adds a new item.
	 *
	 * @method add
	 * @param {String} name Item name
	 */
	$(Model).prototype.add = function(name) {
		this.data.push({
			name: name
		});
	};

	return $(Model);
});