define(
function() {
	'use strict';

	/**
	 * $(Model) model.
	 *
	 * @property $(Model)
	 * @module Models
	 */
	var $(Model) = [{
		name: 'Test'
	}];

	/**
	 * Adds a new item.
	 *
	 * @method add
	 * @param {String} name Item name
	 */
	$(Model).add = function(name) {
		this.push({
			name: name
		});
	};

	return $(Model);
});