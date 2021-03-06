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
	 * @class PhonebookContactsActivity
	 * @extends Activity
	 * @constructor
	 * @module ContactsModule
	 */
	var PhonebookContactsActivity = function() {
		Activity.call(this);
	};

	PhonebookContactsActivity.prototype = Object.create(Activity.prototype);

	PhonebookContactsActivity.prototype.onCreate = function($scope, ui) {
		console.log('onCreate', arguments);

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
				'edit-contact', {
					id : id
				},
				function(result) {
					console.log('edit closed', result);
				}
			);
		};

		$scope.remove = function(id) {
			phonebook.remove(id);
		};
	};

	/**
	 * Called after onRestart(), or onPause(), for your activity to start interacting with the user.
	 *
	 * @method onResume
	 */
	PhonebookContactsActivity.prototype.onResume = function() {
		console.log('onResume', arguments);
	};

	/**
	 * Called as part of the activity lifecycle when an activity is going into the background, but has not (yet) been
	 * killed. The counterpart to onResume().
	 *
	 * When activity B is launched in front of activity A, this callback will be invoked on A. B will not be created
	 * until A's onPause() returns, so be sure to not do anything lengthy here.
	 *
	 * @method onPause
	 */
	PhonebookContactsActivity.prototype.onPause = function() {
		console.log('onPause', arguments);
	};

	/**
	 * Perform any final cleanup before an activity is destroyed.
	 *
	 * @method onDestroy
	 */
	PhonebookContactsActivity.prototype.onDestroy = function() {
		console.log('onDestroy', arguments);
	};

	/**
	 * Called when the url parameters such as page number changes.
	 *
	 * @method onParametersChanged
	 */
	PhonebookContactsActivity.prototype.onParametersChanged = function() {
		console.log('onParametersChanged', arguments);
	};

	/**
	 * Called on keyboard key down.
	 *
	 * @method onKeyDown
	 */
	PhonebookContactsActivity.prototype.onKeyDown = function() {
		console.log('onKeyDown', arguments);
	};

	/**
	 * Called on keyboard key up.
	 *
	 * @method onKeyUp
	 */
	PhonebookContactsActivity.prototype.onKeyUp = function() {
		console.log('onKeyUp', arguments);
	};

	/**
	 * Called on mouse key down.
	 *
	 * @method onMouseDown
	 */
	PhonebookContactsActivity.prototype.onMouseDown = function() {
		console.log('onMouseDown', arguments);
	};

	/**
	 * Called on mouse cursor move.
	 *
	 * @method onMouseMove
	 */
	PhonebookContactsActivity.prototype.onMouseMove = function() {
		//console.log('onMouseMove', arguments);
	};

	/**
	 * Called on mouse key up.
	 *
	 * @method onMouseUp
	 */
	PhonebookContactsActivity.prototype.onMouseUp = function() {
		console.log('onMouseUp', arguments);
	};

	return PhonebookContactsActivity;

});