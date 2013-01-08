define(
['Bindable', 'Debug', 'Util', 'ResourceManager', 'angular'],
function(Bindable, dbg, util, resourceManager, angular) {
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
	 * @param {Function} [readyCallback=null] Optional callback to call when ready
	 * @return {Navi} Self
	 */
	Navi.prototype.open = function(module, action, parameters, readyCallback) {
		action = action || 'index';
		parameters = parameters || [];

		dbg.log('! Opening module' + module + '::' + action + ' ' + util.str(parameters));

		var className = util.convertEntityName(module) + 'Module',
			actionName = util.convertCallableName(action) + 'Action';

		window.app = window.app || {};
		window.app.modules = window.app.modules || {};

		resourceManager.loadModule(module, function(moduleObj) {
			resourceManager.loadView(module, action, function(viewContent) {
				console.log('navi loaded', moduleObj, viewContent);

				window.app.modules[className] = moduleObj;

				var contentWrap = $('#main-content');

				contentWrap
					.html(viewContent)
					.attr('ng-controller', 'app.modules.' + className + '.' + actionName);

				angular.bootstrap(contentWrap, ['app']);

				if (util.typeOf(readyCallback) === 'function') {
					readyCallback(module, action, parameters, moduleObj);
				}
			});
		});

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