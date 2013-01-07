define(
['Bindable', 'Debug', 'Util'],
function(Bindable, dbg, util) {
	'use strict';

	/**
	 * Provides functionality to navigate between module actions.
	 *
	 * @class Navi
	 * @extends Bindable
	 * @constructor
	 * @module Core
	 */
	var Navi = function() {
		this._activeModule = null;
	};

	Navi.prototype = new Bindable();

	/**
	 * Initiates the component.
	 *
	 * @method init
	 * @return {Navi} Self
	 */
	Navi.prototype.init = function() {
		return this;
	};

	/**
	 * Navigates to a module action.
	 *
	 * @method open
	 * @param {String} module Module to open
	 * @param {String} [action=index] Action to navigate to
	 * @param {Array} [parameters=null] Action parameters
	 * @return {Navi} Self
	 */
	Navi.prototype.open = function(module, action, parameters) {
		action = action || 'index';
		parameters = parameters || null;

		this._activeModule = module;

		dbg.log('! Opening module' + module + '::' + action + ' ' + util.str(parameters));

		return this;
	};

	/**
	 * Returns currently active module name.
	 *
	 * @method getActiveModuleName
	 * @return {String}
	 */
	Navi.prototype.getActiveModuleName = function() {
		return this._activeModule;
	};

	return new Navi();
});