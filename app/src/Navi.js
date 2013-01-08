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
		this._stack = [];
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
	 * @param {Function} [doneCallback=null] Optional callback to call when ready
	 * @return {Navi} Self
	 */
	Navi.prototype.open = function(module, action, parameters, doneCallback) {
		action = action || 'index';
		parameters = parameters || [];

		dbg.log('! Opening module' + module + '::' + action + ' ' + util.str(parameters));

		var self = this,
			className = util.convertEntityName(module) + 'Module',
			actionName = util.convertCallableName(action) + 'Action';

		window.app = window.app || {};
		window.app.modules = window.app.modules || {};

		resourceManager.loadModule(module, function(moduleObj) {
			resourceManager.loadView(module, action, function(viewContent) {
				self._appendNavigation(module, action, parameters);

				window.app.modules[className] = moduleObj;

				var contentWrap = $('#main-content');

				contentWrap
					.html(viewContent)
					.attr('ng-controller', 'app.modules.' + className + '.' + actionName);

				angular.bootstrap(contentWrap, ['app']);

				if (util.typeOf(doneCallback) === 'function') {
					doneCallback(module, action, parameters, moduleObj);
				}
			});
		});

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

	/**
	 * Append an item to the navigation stack.
	 *
	 * @param {String} module Name of the module to use
	 * @param {String} action Module action to call, defaults to index
	 * @param {Object} parameters Map of parameters to pass to action
	 */
	Navi.prototype._appendNavigation = function(module, action, parameters) {
		var duplicate = false,
			allowDuplicate = util.typeOf(parameters._allowDuplicate) === 'undefined'
				? false
				: parameters._allowDuplicate,
			last;

		if (!allowDuplicate && this._stack.length > 0) {
			last = this._stack[this._stack.length - 1];

			if (last.module == module && last.action == action) {
				duplicate = true;
			}
		}

		if (duplicate) {
			this._stack.pop();
		}

		this._stack.push({
			module: module,
			action: action,
			parameters: parameters
		});

		if (
			(
				util.typeOf(parameters._allowLoops) === 'undefined'
				|| parameters._allowLoops != true
			)
			&& !allowDuplicate
		) {
			var lastItem = this._stack[this._stack.length - 1],
				lastModule = lastItem.module,
				lastAction = lastItem.action,
				newStack = [],
				i;

			for (i = 0; i < this._stack.length; i++) {
				newStack.push(this._stack[i]);

				if (
					this._stack[i].module == lastModule
					&& this._stack[i].action == lastAction
				) {
					newStack[newStack.length - 1].parameters = parameters;

					break;
				}
			}

			this._stack = newStack;
		}
	};

	return new Navi();
});