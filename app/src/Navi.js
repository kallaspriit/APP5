define(
['Bindable', 'Debug', 'Util', 'ResourceManager', 'config/main', 'angular'],
function(Bindable, dbg, util, resourceManager, config, angular) {
	'use strict';

	/**
	 * Provides functionality to navigate between module actions.
	 *
	 * Can fire the following events:
	 *
	 *	> PRE_NAVIGATE - fired before navigating to a new module action
	 *		module - module name
	 *		action - action name
	 *		parameters - action parameters
	 *	> POST_NAVIGATE - fired after navigating to a new module action
	 *		module - module name
	 *		action - action name
	 *		parameters - action parameters
	 *	> STACK_CHANGED - fired when navigation stack changes
	 *		stack - updated navigation stack
	 *
	 * @class Navi
	 * @extends Bindable
	 * @constructor
	 * @module Core
	 */
	var Navi = function() {
		this._stack = [];
		this._containers = ['content-a', 'content-b'];
		this._containerIndex = 0;
	};

	Navi.prototype = new Bindable();

	/**
	 * Event types.
	 *
	 * @event
	 * @param {Object} Event
	 * @param {String} Event.PRE_NAVIGATE Triggered just before navigation
	 * @param {String} Event.POST_NAVIGATE Triggered just after navigation
	 * @param {String} Event.STACK_CHANGED Called when navigation stack updates
	 */
	Navi.prototype.Event = {
		PRE_NAVIGATE: 'pre-navigate',
		POST_NAVIGATE: 'post-navigate',
		STACK_CHANGED: 'stack-changed'
	};

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

		var self = this,
			className = util.convertEntityName(module) + 'Module',
			actionName = util.convertCallableName(action) + 'Action';

		window.app = window.app || {};
		window.app.modules = window.app.modules || {};

		this.fire({
			type: this.Event.PRE_NAVIGATE,
			module: module,
			action: action,
			parameters: parameters
		});

		resourceManager.loadModule(module, function(moduleObj) {
			resourceManager.loadView(module, action, function(viewContent) {
				self._renderView(
					module,
					action,
					className,
					actionName,
					parameters,
					moduleObj,
					viewContent,
					doneCallback
				);
			});
		});

		return this;
	};

	/**
	 * Navigates back to previous action.
	 *
	 * @method back
	 * @param {Object} [additionalParameters] Extends the default parameters
	 * @param {Number} [steps = 1] How many steps to jump back
	 */
	Navi.prototype.back = function(additionalParameters, steps) {
		steps = steps || 1;

		var item = this._popLastAction(steps);

		if (item === null) {
			this.open(
				config.index.module,
				config.index.action,
				config.index.parameters
			);

			return;
		}

		var parameters = item.parameters;

		if (
			additionalParameters !== null
			&& util.typeOf(additionalParameters) === 'object'
		) {
			parameters = util.extend(parameters, additionalParameters);
		}

		parameters._back = true;

		this.open(item.module, item.action, parameters);
	};

	/**
	 * Returns currently active action info.
	 *
	 * @method getCurrent
	 * @return {Object|null}
	 */
	Navi.prototype.getCurrent = function() {
		if (this._stack.length === 0) {
			return null;
		}

		return this._stack[this._stack.length - 1];
	};

	/**
	 * Returns previously active action info.
	 *
	 * @method getPrevious
	 * @return {Object|null}
	 */
	Navi.prototype.getPrevious = function() {
		if (this._stack.length < 2) {
			return null;
		}

		return this._stack[this._stack.length - 2];
	};

	/**
	 * Clears navigation history.
	 *
	 * @method clearHistory
	 */
	Navi.prototype.clearHistory = function() {
		this._stack = [];

		this.fire({
			type: this.Event.STACK_CHANGED,
			stack: this._stack
		});
	};

	/**
	 * Renders module action view.
	 *
	 * @param {String} module Name of the module
	 * @param {String} action Name of the action
	 * @param {String} className Class name of the module
	 * @param {String} actionName Method name of the action
	 * @param {Array} parameters Action parameters
	 * @param {Object} moduleObj Module object
	 * @param {String} viewContent View content to render
	 * @param {Function} doneCallback Callback to call when done
	 * @private
	 */
	Navi.prototype._renderView = function(
		module,
		action,
		className,
		actionName,
		parameters,
		moduleObj,
		viewContent,
		doneCallback
	) {
		this._appendNavigation(module, action, parameters, moduleObj);

		window.app.modules[className] = moduleObj;

		//var contentWrap = $(config.viewSelector);
		var containerName = this._containers[this._containerIndex],
			contentWrap = $('#' + containerName);

		this._containerIndex = (this._containerIndex + 1) % 2;

		contentWrap
			.html(viewContent)
			.attr('ng-controller', 'app.modules.' + className + '.' + actionName);

		angular.bootstrap(contentWrap, ['app']);

		if (util.typeOf(doneCallback) === 'function') {
			doneCallback(module, action, parameters, moduleObj);
		}

		this.fire({
			type: this.Event.POST_NAVIGATE,
			module: module,
			action: action,
			parameters: parameters
		});
	};

	/**
	 * Pops an item from the end of the navigation stack.
	 *
	 * @method popLastAction
	 * @param {Number} [steps=1] How many steps to jump back
	 * @return {Object} Last action info
	 * @private
	 */
	Navi.prototype._popLastAction = function(steps) {
		steps = steps || 1;

		if (this._stack.length >= 2) {
			for (var i = 0; i < steps; i++) {
				this._removeCurrentAction();
			}

			var last = this._stack.pop();

			this.fire({
				type: this.Event.STACK_CHANGED,
				stack: this._stack
			});

			return last;
		} else {
			return null;
		}
	};

	/**
	 * Removes current item from the end of the navigation stack.
	 *
	 * @method removeCurrentAction
	 * @private
	 */
	Navi.prototype._removeCurrentAction = function() {
		if (this._stack.length >= 1) {
			this._stack.pop();
		}

		this.fire({
			type: this.Event.STACK_CHANGED,
			stack: this._stack
		});
	};

	/**
	 * Append an item to the navigation stack.
	 *
	 * @method _appendNavigation
	 * @param {String} module Name of the module to use
	 * @param {String} action Module action to call, defaults to index
	 * @param {Object} parameters Map of parameters to pass to action
	 * @param {Object} instance Instance of the module
	 * @private
	 */
	Navi.prototype._appendNavigation = function(module, action, parameters, instance) {
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
			parameters: parameters,
			instance: instance
		});

		if (
			(
				util.typeOf(parameters._allowLoops) === 'undefined'
				|| parameters._allowLoops !== true
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

		this.fire({
			type: this.Event.STACK_CHANGED,
			stack: this._stack
		});
	};

	return new Navi();
});