define(
[
	'core/Activity',
	'modules/phonebook/models/Phonebook'
],
function(Activity, phonebook) {
	'use strict';

	/**
	 * Contacts list activity.
	 *
	 * @class ContactsActivity
	 * @extends Activity
	 * @constructor
	 * @module ContactsModule
	 */
	var ContactsActivity = function() {
		Activity.call(this);
	};

	ContactsActivity.prototype = Object.create(Activity.prototype);

	ContactsActivity.prototype.onCreate = function($scope, $parameters, ui) {
		$scope.phonebook = phonebook;
		$scope.filter = '';
		$scope.order = 'name';
		$scope.orderOptions = ['name', 'number'];

		$scope.orderBy = function(property) {
			$scope.order = property;
		};
		$scope.edit = function(id) {
			ui.openModal(
				'phonebook',
				'edit-contact',
				{
					id : id,
					callback: function() {
						ui.hideModal();
					}
				}
			);
		};
		$scope.remove = function(id) {
			var contact = phonebook.get(id);

			ui.confirm(
				function() {
					phonebook.remove(id);
				},
				'phonebook.confirm-delete',
				'phonebook.confirm-delete-text(name)',
				contact.name
			);
		};
	};

	return ContactsActivity;

});