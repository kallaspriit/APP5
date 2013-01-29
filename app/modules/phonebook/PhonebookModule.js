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
		 * @param {$scope} $scope Angular scope
		 */
		contactsAction: function($scope) {
			$scope.phonebook = phonebook;
			$scope.filter = '';
			$scope.order = 'name';
			$scope.orderOptions = ['name', 'number'];

			$scope.orderBy = function(property) {
				$scope.order = property;
			};
		},

		/**
		 * Add new contact action.
		 *
		 * @method addContactAction
		 * @param {$scope} $scope Angular scope
		 * @param {Navi} navi Navigation
		 */
		addContactAction: function($scope, navi) {
			$scope.addContact = function(name, number) {
				phonebook.add(name, number);

				navi.back();
			};
		}
	};
});