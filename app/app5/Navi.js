define(
[
	'underscore',
	'core/EventEmitter',
	'core/Deferred',
	'core/App',
	'core/Debug',
	'core/BaseUtil',
	'core/ResourceManager',
	'core/Keyboard',
	'core/Mouse',
	'UI'
],
function(_, EventEmitter, Deferred, app, dbg, util, resourceManager, keyboard, mouse, ui) {
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
	 *	> PRE_PARTIAL - fired before opening a partial view
	 *		containerSelector - selector for the partial container
	 *		module - module name
	 *		action - action name
	 *		parameters - action parameters
	 *	> POST_PARTIAL - fired after opening a partial view
	 *		containerSelector - selector for the partial container
	 *		module - module name
	 *		action - action name
	 *		parameters - action parameters
	 *	> STACK_CHANGED - fired when navigation stack changes
	 *		stack - updated navigation stack
	 *  > URL_CHANGED - fired when the URL changes
	 *		parameters - URL parameters (url, hash, path, query, args, host, port, protocol)
	 * > PARAMETERS_CHANGED - fired when current action parameters change
	 *		module - name of the module
	 *		action - name of the action
	 *		parameters - new parameters values
	 *
	 * @class Navi
	 * @extends EventEmitter
	 * @constructor
	 * @module Core
	 */
	var Navi = function() {
		EventEmitter.call(this);

		this.router = null;
		this.backPossible = false;
		this._stack = [];
		this._naviCounter = 0;
		this._partialRendering = false;
	};

	Navi.prototype = Object.create(EventEmitter.prototype);

	/**
	 * Event types.
	 *
	 * @event Event
	 * @param {Object} Event
	 * @param {String} Event.PRE_NAVIGATE Triggered just before navigation
	 * @param {String} Event.POST_NAVIGATE Triggered just after navigation
	 * @param {String} Event.PRE_PARTIAL Triggered just before opening partial
	 * @param {String} Event.POST_PARTIAL Triggered just after opening partial
	 * @param {String} Event.STACK_CHANGED Called when navigation stack updates
	 * @param {String} Event.URL_CHANGED Called when URL changes
	 * @param {String} Event.PARAMETERS_CHANGED Called when current action parameters change
	 * @param {String} Event.SLEEP Called on scope when action is put to sleep
	 * @param {String} Event.WAKEUP Called on scope when action is awaken
	 * @param {String} Event.EXIT Called on scope when action is killed
	 */
	Navi.prototype.Event = {
		PRE_NAVIGATE: 'pre-navigate',
		POST_NAVIGATE: 'post-navigate',
		PRE_PARTIAL: 'pre-partial',
		POST_PARTIAL: 'post-partial',
		STACK_CHANGED: 'stack-changed',
		URL_CHANGED: 'url-changed',
		PARAMETERS_CHANGED: 'parameters-changed',
		SLEEP: 'sleep',
		WAKEUP: 'wakeup',
		EXIT: 'exit'
	};

	/**
	 * Initiates the component.
	 *
	 * @method init
	 * @return {Navi} Self
	 */
	Navi.prototype.init = function() {
		var self = this;

		keyboard.on([keyboard.Event.KEYDOWN, keyboard.Event.KEYUP], function(e) {
			self._onKeyEvent(e.info);
		});

		mouse.on([mouse.Event.MOUSEDOWN, mouse.Event.MOUSEUP, mouse.Event.MOUSEMOVE], function(e) {
			self._onMouseEvent(e.info);
		});

		this.on(this.Event.STACK_CHANGED, function() {
			self.backPossible = self.isBackPossible();
		});

		return this;
	};

	/**
	 * Navigates to a module action.
	 *
	 * By default the action is opened in container defined by the configuration property viewSelector.
	 *
	 * @method open
	 * @param {String} module Module to open
	 * @param {String} [action=index] Action to navigate to
	 * @param {Array} [parameters] Action parameters
	 */
	Navi.prototype.open = function(module, action, parameters) {
		if (ui.isTransitioning()) {
			// TODO Handle this properly

			return;
		}

		this.router.navigate(module, action, parameters);
	};

	/**
	 * Opens module action.
	 *
	 * By default the action is opened in container defined by the configuration property viewSelector.
	 *
	 * @method _open
	 * @param {String} module Module to open
	 * @param {String} [action=index] Action to navigate to
	 * @param {Array} [parameters] Action parameters
	 * @param {Boolean} [isBack=false] Is the opening triggered by a back button
	 * @return {Deferred} Deferred promise
	 * @private
	 */
	Navi.prototype._open = function(module, action, parameters, isBack) {
		action = action || 'index';
		parameters = parameters || [];

		if (!util.isBoolean(isBack)) {
			isBack = false;
		}

		if (ui.isTransitioning()) {
			return;
		}

		var self = this,
			deferred = new Deferred(),
			className = util.convertEntityName(module) + 'Module',
			actionName = util.convertCallableName(action) + 'Action',
			moduleCssFilename = 'modules/' + module + '/style/' + module + '-module.css',
			viewFilename = 'modules/' + module + '/views/' + module + '-' + action + '.html';

		this.emit({
			type: this.Event.PRE_NAVIGATE,
			module: module,
			action: action,
			parameters: parameters
		});

		util.when(
			resourceManager.loadModule(module),
			resourceManager.loadView(viewFilename),
			resourceManager.loadCss(moduleCssFilename)
		).done(function(moduleObj, viewContent) {
			self._showAction(
				module,
				action,
				moduleObj,
				viewContent,
				className,
				actionName,
				deferred,
				parameters,
				isBack
			);
		}).fail(function() {
			throw new Error('Loading module "' + module + '" resources failed');
		});

		return deferred.promise();
	};

	/**
	 * Shows module action once the resources have been loaded.
	 *
	 * @method _showAction
	 * @param {String} module Module name
	 * @param {String} action Module action name
	 * @param {Object} moduleObj Module object
	 * @param {String} viewContent Action view content
	 * @param {String} className Name of the module class
	 * @param {String} actionName Name of the module action
	 * @param {Deferred} deferred Progress deferred
	 * @param {Array} parameters List of parameters
	 * @param {Boolean} isBack Is the view change triggered by back-button
	 * @private
	 */
	Navi.prototype._showAction = function(
		module,
		action,
		moduleObj,
		viewContent,
		className,
		actionName,
		deferred,
		parameters,
		isBackBtn
	) {
		if (!util.isFunction(moduleObj[actionName]) && !util.isArray(moduleObj[actionName])) {
			throw new Error('Invalid "' + module + '" module action "' + action + '" requested');
		}

		var self = this,
			currentItem = this.getCurrentItem(),
			existingItem = this.getExistingItem(module, action),
			newItem = null,
			isBack = false,
			isReopen = false,
			newItemContainer = null,
			stackChanged = false,
			stackItem,
			i;

		if (
			existingItem !== null
			&& (
				existingItem.container === null
				|| (typeof(existingItem.container.length) === 'number' && existingItem.container.length === 0)
			)
		) {
			// existing item container is missing, remove the item
			for (i = 0; i < this._stack.length; i++) {
				if (this._stack[i] === existingItem) {
					this._stack.splice(i, 1);

					break;
				}
			}

			existingItem = null;
		}

		if (currentItem !== null && currentItem === existingItem) {
			currentItem.emit(this.Event.URL_CHANGED);

			this.emit({
				type: this.Event.PARAMETERS_CHANGED,
				module: module,
				action: action,
				parameters: parameters
			});

			return;
		}

		if (existingItem !== null) {
			// existing item exists, remove loop
			if (isBackBtn) {
				// back button pressed, remove all items after the existing item
				while (this._stack.length > 0) {
					stackItem = this.peekLast();

					if (stackItem === currentItem) {
						// pop the current item from stack but don't destroy the element yet as we need to animate it
						this._stack.pop();
						stackChanged = true;

						continue;
					}

					if (stackItem == existingItem) {
						existingItem.emit(this.Event.WAKEUP);

						isBack = true;

						break;
					}

					this._stack.pop();
					stackChanged = true;

					stackItem.emit(this.Event.EXIT);

					if (stackItem.container !== null) {
						stackItem.container.remove();
					}
				}
			} else {
				// no back button pressed, remove all items up to and including the existing item
				while (this._stack.length > 0) {
					stackItem = this._stack.pop();
					stackChanged = true;

					if (stackItem === currentItem) {
						// pop the current item from stack but don't destroy the element yet as we need to animate it
						continue;
					}

					stackItem.emit(this.Event.EXIT);

					if (stackItem.container !== null) {
						stackItem.container.remove();
					}

					if (stackItem === existingItem) {
						isReopen = true;

						break;
					}
				}
			}
		}

		if (!isBack) {
			app.parameters = parameters;
			app.registerController(className + '.' + actionName, moduleObj[actionName]);

			newItem = this.appendNavigation(module, action, parameters, true);
			stackChanged = true;

			newItem.emit = function(type, parameters) {
				var scope = this.container.data('$scope');

				if (util.isObject(scope) && util.isFunction(scope.$broadcast)) {
					scope.$broadcast(type, parameters);
				}
			};
		}

		if (stackChanged) {
			this.emit({
				type: this.Event.STACK_CHANGED,
				stack: this._stack
			});
		}

		newItemContainer = ui.showView(
			module,
			action,
			className,
			actionName,
			parameters,
			moduleObj,
			viewContent,
			currentItem !== null ? currentItem.container : null,
			existingItem !== null ? existingItem.container : null,
			newItem !== null ? newItem.id : null,
			isBack,
			function() {
				if (isBack || isReopen) {
					currentItem.emit(this.Event.EXIT);
					currentItem.container.remove();
				} else if (currentItem !== null) {
					currentItem.emit(this.Event.SLEEP);
				}

				this.emit({
					type: self.Event.POST_NAVIGATE,
					module: module,
					action: action,
					parameters: parameters
				});

				deferred.resolve();

				app.validate();
			}.bind(this)
		);

		if (newItem !== null) {
			newItem.container = newItemContainer;
		}
	};

	/**
	 * Opens a partial view.
	 *
	 * Partials can be used to load module actions in any container to display main menu etc.
	 *
	 * @method partial
	 * @param {String} containerSelector Container selector
	 * @param {String} module Module to open
	 * @param {String} [action=index] Action to navigate to
	 * @param {Object} [parameters] Action parameters
	 * @param {Boolean} [append=false] Should the content be appended instead of replaced
	 * @return {Deferred} Deferred promise
	 */
	Navi.prototype.partial = function(containerSelector, module, action, parameters, append) {
		action = action || 'index';
		parameters = parameters || [];
		append = util.isBoolean(append) ? append : false;

		this._partialRendering = true;

		var self = this,
			deferred = new Deferred(),
			className = util.convertEntityName(module) + 'Module',
			actionName = util.convertCallableName(action) + 'Action',
			moduleCssFilename = 'modules/' + module + '/style/' + module + '-module.css',
			viewFilename = 'modules/' + module + '/views/' + module + '-' + action + '.html',
			item = null;

		this.emit({
			type: this.Event.PRE_PARTIAL,
			containerSelector: containerSelector,
			module: module,
			action: action,
			parameters: parameters
		});

		util.when(
			resourceManager.loadModule(module),
			resourceManager.loadView(viewFilename),
			resourceManager.loadCss(moduleCssFilename)
		).done(function(moduleObj, viewContent) {
			item = ui.showPartial(
				module,
				action,
				className,
				actionName,
				parameters,
				moduleObj,
				viewContent,
				containerSelector,
				append
			);

			self.emit({
				type: self.Event.POST_PARTIAL,
				containerSelector: containerSelector,
				module: module,
				action: action,
				parameters: parameters
			});

			deferred.resolve(item);

			app.validate();

			self._partialRendering = false;
		}).fail(function() {
			throw new Error('Loading module "' + module + '" resources failed');
		});

		return deferred.promise();
	};

	/**
	 * Navigates back to previous action.
	 *
	 * @method back
	 */
	Navi.prototype.back = function() {
		var currentItem = this.getCurrentItem(),
			previousItem = this.getPreviousItem();

		if (currentItem === null || previousItem === null) {
			return;
		}

		window.history.back();
	};

	/**
	 * Changes a parameter of the current URL.
	 *
	 * @method setUrlParameter
	 * @param {String} name Name of the parameter
	 * @param {String} value Parameter value
	 * @param {Boolean} [replace=false] Should the URL be replaced, e.g not create history step
	 * @return {Boolean} Was setting the parameter successful
	 */
	Navi.prototype.setUrlParameter = function(name, value, replace) {
		if (util.isFunction(this.router.setUrlParameter)) {
			return this.router.setUrlParameter(name, value, replace);
		}

		var currentItem = this.getCurrentItem(),
			newItem;

		if (currentItem === null) {
			return false;
		}

		newItem = util.clone(currentItem);
		newItem.parameters[name] = value;

		this.open(
			newItem.module,
			newItem.action,
			newItem.parameters
		);
	};

	/**
	 * Returns currently active action info.
	 *
	 * @method getCurrentItem
	 * @return {Object|null}
	 */
	Navi.prototype.getCurrentItem = function() {
		if (this._stack.length === 0) {
			return null;
		}

		return this._stack[this._stack.length - 1];
	};

	/**
	 * Returns previously active action info.
	 *
	 * @method getPreviousItem
	 * @return {Object|null}
	 */
	Navi.prototype.getPreviousItem = function() {
		if (this._stack.length < 2) {
			return null;
		}

		return this._stack[this._stack.length - 2];
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
	 * Returns whether there is any page to go back to.
	 *
	 * @method isBackPossible
	 * @return {Boolean}
	 */
	Navi.prototype.isBackPossible = function() {
		return this._stack.length >= 2;
	};

	/**
	 * Clears navigation history.
	 *
	 * @method clearHistory
	 */
	Navi.prototype.clearHistory = function() {
		this._stack = [];

		this.emit({
			type: this.Event.STACK_CHANGED,
			stack: this._stack
		});
	};

	/**
	 * Returns the navigation stack.
	 *
	 * @method getStack
	 * @return {Array}
	 */
	Navi.prototype.getStack = function() {
		return this._stack;
	};

	/**
	 * Called by the framework when URL changes.
	 *
	 * The parameters include:
	 * - url
	 * - hash
	 * - path
	 * - query
	 * - args
	 * - host
	 * - port
	 * - protocol
	 *
	 * @method _onUrlChanged
	 * @param {Object} parameters URL parameters
	 * @private
	 */
	Navi.prototype._onUrlChanged = function(parameters) {
		this.emit({
			type: this.Event.URL_CHANGED,
			parameters: parameters
		});
	};

	/**
	 * Pops an item from the end of the navigation stack.
	 *
	 * @method _popLastAction
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

			this.emit({
				type: this.Event.STACK_CHANGED,
				stack: this._stack
			});

			return last;
		} else {
			return null;
		}
	};

	/**
	 * Peeks the last stack item without remocing it.
	 *
	 * @method peekLast
	 * @return {Object} Last action info or null if not available
	 */
	Navi.prototype.peekLast = function() {
		if (this._stack.length === 0) {
			return null;
		}

		return this._stack[this._stack.length - 1];
	};

	/**
	 * Pops and returns last stack item.
	 *
	 * @method popLast
	 * @return {Object} Last action info or null if not available
	 */
	Navi.prototype.popLast = function() {
		if (this._stack.length === 0) {
			return null;
		}

		var item = this._stack.pop();

		this.emit({
			type: this.Event.STACK_CHANGED,
			stack: this._stack
		});

		return item;
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

		this.emit({
			type: this.Event.STACK_CHANGED,
			stack: this._stack
		});
	};

	/**
	 * Append an item to the navigation stack.
	 *
	 * @method appendNavigation
	 * @param {String} module Name of the module to use
	 * @param {String} action Module action to call, defaults to index
	 * @param {Object} parameters Map of parameters to pass to action
	 * @param {Boolean} [quiet=false] If set to true, no stack change event is automatically emitted
	 * @return {Object} New stack item
	 */
	Navi.prototype.appendNavigation = function(module, action, parameters, quiet) {
		this._stack.push({
			id: this._naviCounter++,
			module: module,
			action: action,
			parameters: util.isObject(parameters) ? parameters : {},
			level: this._stack.length,
			container: null,
			emit: function() {}
		});

		if (quiet !== true) {
			this.emit({
				type: this.Event.STACK_CHANGED,
				stack: this._stack
			});
		}

		return this._stack[this._stack.length - 1];
	};

	/**
	 * Prepends an item to the navigation stack.
	 *
	 * @method prependNavigation
	 * @param {String} module Name of the module to use
	 * @param {String} action Module action to call, defaults to index
	 * @param {Object} parameters Map of parameters to pass to action
	 * @return {Object} New stack item
	 */
	Navi.prototype.prependNavigation = function(module, action, parameters) {
		this._stack.unshift({
			id: this._naviCounter++,
			module: module,
			action: action,
			parameters: util.isObject(parameters) ? parameters : {},
			level: 0,
			container: null,
			emit: function() {}
		});

		for (var i = 1; i < this._stack.length; i++) {
			this._stack[i].level++;
		}

		this.emit({
			type: this.Event.STACK_CHANGED,
			stack: this._stack
		});

		return this._stack[0];
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
		var currentItem = this.getCurrentItem();

		if (currentItem === null || !util.isFunction(currentItem.emit)) {
			return;
		}

		currentItem.emit(event.type, event);
	};

	/**
	 * Triggered on mouse events.
	 *
	 * Passes the key event on to currently active module action controller.
	 *
	 * @method _onMouseEvent
	 * @param {Mouse.MouseEvent} event Key event
	 * @private
	 */
	Navi.prototype._onMouseEvent = function(event) {
		var currentItem = this.getCurrentItem();

		if (currentItem === null || !util.isFunction(currentItem.emit)) {
			return;
		}

		currentItem.emit(event.type, event);
	};

	return new Navi();
});
