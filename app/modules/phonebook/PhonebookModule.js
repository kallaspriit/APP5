define(
['models/Phonebook'],
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
		 * Contact list action.
		 *
		 * @method contactsAction
		 * @param {Scope} $scope Angular scope
		 * @param {UI} ui User interface
		 */
		contactsAction: function($scope, ui) {
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
		 * Add new contact action.
		 *
		 * @method addContactAction
		 * @param {Scope} $scope Angular scope
		 * @param {Navi} navi Navigation
		 */
		addContactAction: function($scope, navi) {
			$scope.setTitle('Add Contact');

			$scope.addContact = function(name, number) {
				phonebook.add(name, number);

				navi.open('phonebook', 'contacts');
			};
		},

		/**
		 * Enables editing contact information.
		 *
		 * @method addContactAction
		 * @param {Scope} $scope Angular scope
		 * @param {Object} parameters Action parameters
		 * @param {Navi} navi Navigation
		 * @param {Util} util Utilities
		 */
		editContactAction: function($scope, parameters, navi, util) {
			$scope.contact = util.clone(phonebook.get(parameters.id));

			$scope.update = function(contact) {
				phonebook.update(contact.id, contact);

				if (util.isFunction(parameters.callback)) {
					parameters.callback();
				}
			};
		}
	};
});