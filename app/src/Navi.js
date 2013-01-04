define(
['Bindable', 'Debug', 'Util'],
function(Bindable, dbg, util) {
	"use strict";

	/**
	 * Provides functionality to navigate between module actions.
	 *
	 * @class Navi
	 * @extends Bindable
	 * @constructor
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
	 * @return {Navi} Self
	 */
	Navi.prototype.open = function(module) {
		this._activeModule = module;

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