define(
['Util'],
function(util) {
	'use strict';

	/**
	 * Phonebook model
	 *
	 * @class Phonebook
	 * @constructor
	 * @module Models
	 */
	var Phonebook = [{
			id: 1,
			name: 'Alice',
			number: '+372 6234623',
			image: '1.png'
		},{
			id: 2,
			name: 'Damian',
			number: '+455 1254523',
			image: '2.png'
		},{
			id: 3,
			name: 'Dave',
			number: '+372 5535256',
			image: '3.png'
		},{
			id: 4,
			name: 'Carol',
			number: '+372 2553265',
			image: '4.png'
		},{
			id: 5,
			name: 'Susan',
			number: '+372 5540125',
			image: '5.png'
		},{
			id: 6,
			name: 'Jack',
			number: '+82 5565226',
			image: '3.png'
		},{
			id: 7,
			name: 'Eve',
			number: '+172 3543265',
			image: '4.png'
		},{
			id: 8,
			name: 'Katrin',
			number: '+372 8246364',
			image: '5.png'
		}];

	Phonebook.get = function(id) {
		return _.find(this, function(contact) { return contact.id === id; });
	};

	Phonebook.add = function(name, number) {
		this.push({
			id: this.length,
			name: name,
			number: number,
			image: ((this.length % 6) + 1) + '.png'
		});
	};

	Phonebook.update = function(id, properties) {
		var contact = this.get(id);

		util.extend(contact, properties);
	};

	return Phonebook;
});