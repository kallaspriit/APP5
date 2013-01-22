define(
function() {
	'use strict';

	/**
	 * Phonebook model
	 *
	 * @class Phonebook
	 * @constructor
	 * @module Models
	 */
	var Phonebook = [{
			name: 'First',
			number: '+372 6234623'
		},{
			name: 'Second',
			number: '+372 3254523'
		}];

	Phonebook.add = function(name, number) {
		this.push({
			name: name,
			number: number
		});
	};

	return Phonebook;
});