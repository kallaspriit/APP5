define(
['Bindable', 'Debug', 'Util', 'ResourceManager', 'Keyboard', 'config/main', 'angular'],
function(Bindable, dbg, util, resourceManager, keyboard, config, angular) {
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
		this._naviCounter = 0;
		this._module = null;
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
		var self = this;

		keyboard.bind(keyboard.Event.KEY_DOWN, function(e) {
			self._onKeyEvent(e.info);
		});

		return this;
	};

	/**
	 * Sets the angular app module to use.
	 *
	 * @method setModule
	 * @param {angular.Module} module Module to use
	 * @return {Navi} Self
	 */
	Navi.prototype.setModule = function(module) {
		this._module = module;

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

		this.fire({
			type: this.Event.PRE_NAVIGATE,
			module: module,
			action: action,
			parameters: parameters
		});

		resourceManager.loadModule(module, function(moduleObj) {
			resourceManager.loadView(module, action, function(viewContent) {
				if (config.debug) {
					window.app.modules[className] = moduleObj;
				}
				
				self._showView(
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
	 */
	Navi.prototype.back = function(additionalParameters) {
		var currentItem = this.getCurrent(),
			previousItem = this.getPrevious();

		if (currentItem !== null) {
			if (previousItem !== null && previousItem.module !== currentItem.module) {
				if (util.isFunction(currentItem.instance.onExit)) {
					currentItem.instance.onExit.apply(currentItem.instance, [previousItem.module]);
				}
			} else {
				if (util.isFunction(currentItem.instance.onWakeup)) {
					currentItem.instance.onWakeup.apply(
						currentItem.instance,
						[previousItem.action]
					);
				}
			}

			var currentItemWrapId = 'content-' + currentItem.id,
				currentItemContentWrap = $('#' + currentItemWrapId);

			if (currentItemContentWrap.length > 0) {
				currentItemContentWrap.remove();
			}

			this._stack.pop();
		}

		if (previousItem === null) {
			this.open(
				config.index.module,
				config.index.action,
				config.index.parameters
			);

			return;
		}

		if (
			additionalParameters !== null
			&& util.isObject(additionalParameters)
		) {
			previousItem.parameters = util.extend(previousItem.parameters, additionalParameters);
		}

		previousItem.parameters._back = true;

		if (util.isFunction(previousItem.onWakeup)) {
			previousItem.onWakeup.apply(previousItem.instance, [previousItem.action]);
		}

		var wrapId = 'content-' + previousItem.id,
			contentWrap = $('#' + wrapId);

		if (contentWrap.length > 0) {
			contentWrap.addClass('active');
		}

		//this.open(previousItem.module, previousItem.action, parameters);
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
	 * Returns already open matching navi item if available.
	 *
	 * @method getExistingItem
	 * @param {String} module Module name
	 * @param {String} action Action name
	 * @return {Object|null} Navi info or null if not exists
	 */
	Navi.prototype.getExistingItem = function(module, action) {
		var i,
			item;

		for (i = 0; i < this._stack.length; i++) {
			item = this._stack[i];

			if (item.module === module && item.action === action) {
				return item;
			}
		}

		return null;
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
	Navi.prototype._showView = function(
		module,
		action,
		className,
		actionName,
		parameters,
		moduleObj,
		viewContent,
		doneCallback
	) {
		var currentItem = this.getCurrent(),
			existingItem = this.getExistingItem(module, action),
			i;

		if (existingItem !== null) {
			for (i = this._stack.length - 1; i >= 0; i--) {
				if (this._stack[i].module === module && this._stack[i].action === action) {
					break;
				}

				if (module !== this._stack[i].module) {
					if (util.isFunction(this._stack[i].instance.onExit)) {
						this._stack[i].instance.onExit.apply(this._stack[i].instance, [module]);
					}
				}

				this._stack[i].container.remove();
				this._stack.pop();
			}

			existingItem.container.addClass('active');

			if (util.isFunction(existingItem.instance.onWakeup)) {
				existingItem.instance.onWakeup.apply(existingItem.instance, [action]);
			}

			return;
		}

		var newItem = this._appendNavigation(module, action, parameters, moduleObj),
			outerWrap = $(config.viewSelector),
			wrapId = 'content-' + newItem.id,
			contentWrap;

		if (currentItem !== null && util.isFunction(currentItem.instance.onSleep)) {
			currentItem.instance.onSleep.apply(currentItem.instance, [currentItem.action]);
		}

		if (currentItem === null || currentItem.module !== module) {
			if (util.isFunction(newItem.instance.onEnter)) {
				newItem.instance.onEnter.apply(newItem.instance, [currentItem !== null ? currentItem.module : null]);
			}
		} else {
			if (util.isFunction(newItem.instance.onChangeAction)) {
				newItem.instance.onChangeAction.apply(newItem.instance, [currentItem.action, action]);
			}
		}

		outerWrap.append('<div id="' + wrapId + '" class="content"></div>');

		contentWrap = $('#' + wrapId);

		this._containerIndex = (this._containerIndex + 1) % 2;

		contentWrap
			.html(viewContent)
			.attr('ng-controller', className + '.' + actionName);

		newItem.container = contentWrap;

		this._module.value('parameters', parameters);
		this._module.controller(className + '.' + actionName, moduleObj[actionName]);

		newItem.injector = angular.bootstrap(contentWrap, ['app']);
		newItem.fire = function(type, parameters) {
			this.injector.get('$rootScope').$broadcast(type, parameters);
		};

		newItem.fire('test', {a: 'b', c: 'd'});

		outerWrap.find('.active').removeClass('active');
		contentWrap.addClass('active');

		if (util.isFunction(doneCallback)) {
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
	 * @return {Number} Content id
	 * @private
	 */
	Navi.prototype._appendNavigation = function(module, action, parameters, instance) {
		var duplicate = false,
			allowDuplicate = util.isUndefined(parameters._allowDuplicate) ? false : parameters._allowDuplicate,
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
			id: this._naviCounter++,
			module: module,
			action: action,
			parameters: parameters,
			instance: instance,
			level: this._stack.length,
			container: null
		});

		if ((util.isUndefined(parameters._allowLoops) || parameters._allowLoops !== true) && !allowDuplicate) {
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

		return this._stack[this._stack.length - 1];
	};

	/**
	 * Triggered on key events.
	 *
	 * Passes the key event on to currently active module action controller.
	 *
	 * @method _onKeyEvent
	 * @param {Keyboard.KeyEvent} event Key event
	 * @private
	 */
	Navi.prototype._onKeyEvent = function(event) {
		var currentItem = this.getCurrent();

		if (currentItem === null) {
			return;
		}

		currentItem.fire(event.type, event);
	};

	return new Navi();
});