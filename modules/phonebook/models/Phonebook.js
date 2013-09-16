define(
['jquery', 'underscore', 'core/App', 'Util'],
function($, _, app, util) {
	'use strict';

	/**
	 * Phonebook model
	 *
	 * @class Phonebook
	 * @constructor
	 * @module Models
	 */
	var Phonebook = [];

	Phonebook.get = function(id) {
		return _.find(this, function(contact) { return contact.id === id; });
	};

	Phonebook.add = function(name, number, birthdate) {
		this.push({
			id: this.length + 1,
			name: name,
			number: number,
			birthdate: birthdate,
			image: ((this.length % 6) + 1) + '.png'
		});
	};

	Phonebook.update = function(id, properties) {
		var contact = this.get(id);

		util.extend(contact, properties);
	};

	Phonebook.remove = function(id) {
		var contact = this.get(id);

		util.remove(contact, this);
	};

	/*app.injector.invoke(['$http', function($http) {
		$http
			.get('data/contacts.json')
			.success(function(data) {
				console.log('phonebook data', data);
				util.extend(Phonebook, data);
			});
	}]);*/

	$.ajax({
		url: 'data/contacts.json',
		type: 'GET',
		dataType: 'JSON'
	}).success(function(data) {
		util.extend(Phonebook, data);

		app.validate();

		/*window.setTimeout(function() {
			Phonebook = [1, 2, 3];

			app.validate();
		}, 1000);*/
	}).fail(function() {

	});

	return Phonebook;
});