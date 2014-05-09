define(
[
	'core/Activity',
	'modules/phonebook/models/Phonebook'
],
function(Activity, phonebook) {
	'use strict';

	/**
	 * Add new contact activity.
	 *
	 * @class PhonebookAddContactActivity
	 * @extends Activity
	 * @constructor
	 * @module ContactsModule
	 */
	var AddContactActivity = function() {
		Activity.call(this);
	};

	AddContactActivity.prototype = Object.create(Activity.prototype);

	AddContactActivity.prototype.onCreate = function($scope, navi) {
		$scope.setTitle('Add Contact');

		//$scope.birthdate = '01.01.1990';

		$scope.addContact = function(name, number, birthdate) {
			phonebook.add(name, number, birthdate);

			navi.open('contacts');
		};
	};

	return AddContactActivity;

});