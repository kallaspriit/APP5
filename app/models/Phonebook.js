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
			name: 'Alice',
			number: '+372 6234623',
			image: '1.png'
		},{
			name: 'Damian',
			number: '+155 1254523',
			image: '2.png'
		},{
			name: 'Dave',
			number: '+372 5535256',
			image: '3.png'
		},{
			name: 'Carol',
			number: '+372 2553265',
			image: '4.png'
		},{
			name: 'Susan',
			number: '+372 5540125',
			image: '5.png'
		},{
			name: 'Jack',
			number: '+82 5565226',
			image: '3.png'
		},{
			name: 'Eve',
			number: '+172 3543265',
			image: '4.png'
		},{
			name: 'Katrin',
			number: '+372 8246364',
			image: '5.png'
		}];

	Phonebook.add = function(name, number) {
		this.push({
			name: name,
			number: number,
			image: ((this.length % 6) + 1) + '.png'
		});
	};

	return Phonebook;
});