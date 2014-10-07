define(
[
	'core/Activity',
	'modules/phonebook/models/Phonebook'
],
function(Activity, phonebook) {
	'use strict';

	/**
	 * Edit contact activity.
	 *
	 * @class PhonebookEditContactActivity
	 * @extends Activity
	 * @constructor
	 * @module ContactsModule
	 */
	var PhonebookEditContactActivity = function() {
		Activity.call(this);
	};

	PhonebookEditContactActivity.prototype = Object.create(Activity.prototype);

	PhonebookEditContactActivity.prototype.onCreate = function($scope, $modalInstance, navi, util) {
		$scope.contact = util.clone(phonebook.get(this.parameters.id));

		$scope.update = function(contact) {
			phonebook.update(contact.id, contact);

			$modalInstance.close(contact);
		};
	};

	return PhonebookEditContactActivity;

});