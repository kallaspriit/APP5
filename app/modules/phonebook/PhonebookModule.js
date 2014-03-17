define(
['modules/phonebook/models/Phonebook'],
function(phonebook) {
	'use strict';

	/**
	 * Phonebook module.
	 *
	 * @class PhonebookModule
	 * @constructor
	 * @module Modules
	 */
	return {

		/**
		 * Contact list activity.
		 *
		 * @method contactsActivity
		 * @param {Scope} $scope Angular scope
		 * @param {Function} $parameters Activity parameters
		 * @param {UI} ui User interface
		 */
		contactsActivity: function($scope, $parameters, ui) {
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
		},

		/**
		 * Add new contact activity.
		 *
		 * @method addContactActivity
		 * @param {Scope} $scope Angular scope
		 * @param {Navi} navi Navigation
		 */
		addContactActivity: function($scope, navi) {
			$scope.setTitle('Add Contact');

			//$scope.birthdate = '01.01.1990';

			$scope.addContact = function(name, number, birthdate) {
				phonebook.add(name, number, birthdate);

				navi.open('contacts');
			};
		},

		/**
		 * Enables editing contact information.
		 *
		 * @method addContactActivity
		 * @param {Scope} $scope Angular scope
		 * @param {Object} $parameters Activity parameters
		 * @param {Navi} navi Navigation
		 * @param {Util} util Utilities
		 */
		editContactActivity: function($scope, $parameters, navi, util) {
			// TODO Find a better way
			var params = $parameters();

			$scope.contact = util.clone(phonebook.get(params.id));

			$scope.update = function(contact) {
				phonebook.update(contact.id, contact);

				if (util.isFunction(params.callback)) {
					params.callback();
				}
			};
		}
	};
});