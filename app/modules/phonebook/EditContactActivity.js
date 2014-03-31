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
	 * @class EditContactActivity
	 * @extends Activity
	 * @constructor
	 * @module ContactsModule
	 */
	var EditContactActivity = function() {
		Activity.call(this);
	};

	EditContactActivity.prototype = Object.create(Activity.prototype);

	EditContactActivity.prototype.onCreate = function($scope, $modalInstance, navi, util) {
		$scope.contact = util.clone(phonebook.get(this.parameters.id));

		$scope.update = function(contact) {
			phonebook.update(contact.id, contact);

			$modalInstance.close(contact);
		};
	};

	return EditContactActivity;

});