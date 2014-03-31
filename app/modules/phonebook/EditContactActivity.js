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

	EditContactActivity.prototype.onCreate = function($scope, $modalInstance, $parameters, navi, util) {
		// TODO Find a better way
		var params = $parameters();

		$scope.contact = util.clone(phonebook.get(params.id));

		$scope.update = function(contact) {
			//phonebook.update(contact.id, contact);

			$modalInstance.close('xxx');
		};
	};

	return EditContactActivity;

});