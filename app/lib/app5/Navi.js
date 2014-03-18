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
	 * Provides functionality to navigate between module activities.
	 *
	 * Can fire the following events:
	 *
	 *	> PRE_NAVIGATE - fired before navigating to a new module activity
	 *		module - module name
	 *		activity - activity name
	 *		parameters - activity parameters
	 *	> POST_NAVIGATE - fired after navigating to a new module activity
	 *		module - module name
	 *		activity - activity name
	 *		parameters - activity parameters
	 *	> PRE_PARTIAL - fired before opening a partial view
	 *		containerSelector - selector for the partial container
	 *		module - module name
	 *		activity - activity name
	 *		parameters - activity parameters
	 *	> POST_PARTIAL - fired after opening a partial view
	 *		containerSelector - selector for the partial container
	 *		module - module name
	 *		activity - activity name
	 *		parameters - activity parameters
	 *	> STACK_CHANGED - fired when navigation stack changes
	 *		stack - updated navigation stack
	 *  > URL_CHANGED - fired when the URL changes
	 *		parameters - URL parameters (url, hash, path, query, args, host, port, protocol)
	 * > PARAMETERS_CHANGED - fired when current activity parameters change
	 *		module - name of the module
	 *		activity - name of the activity
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
		this._queue = [];
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
	 * @param {String} Event.PARAMETERS_CHANGED Called when current activity parameters change
	 * @param {String} Event.SLEEP Called on scope when activity is put to sleep
	 * @param {String} Event.WAKEUP Called on scope when activity is awaken
	 * @param {String} Event.EXIT Called on scope when activity is killed
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
	 * Navigates to a module activity.
	 *
	 * By default the activity is opened in container defined by the configuration property viewSelector.
	 *
	 * @method open
	 * @param {String} module Module to open
	 * @param {String} [activity=index] Activity to navigate to
	 * @param {Array} [parameters] Activity parameters
	 */
	Navi.prototype.open = function(module, activity, parameters) {
		if (ui.isTransitioning()) {
			// there's an ongoing transition to a view, queue this request
			this._queue.push({
				type: 'indirect',
				module: module,
				activity: activity,
				parameters: parameters
			});

			return;
		}

		this.router.navigate(module, activity, parameters);
	};

	/**
	 * Opens module activity.
	 *
	 * By default the activity is opened in container defined by the configuration property viewSelector.
	 *
	 * @method _open
	 * @param {String} module Module to open
	 * @param {String} [activity=index] Activity to navigate to
	 * @param {Array} [parameters] Activity parameters
	 * @param {Boolean} [isBack=false] Is the opening triggered by a back button
	 * @return {Deferred} Deferred promise
	 * @private
	 */
	Navi.prototype._open = function(module, activity, parameters, isBack) {
		activity = activity || 'index';
		parameters = parameters || [];

		if (!util.isBoolean(isBack)) {
			isBack = false;
		}

		if (ui.isTransitioning()) {
			// there's an ongoing transition to a view, queue this request
			this._queue.push({
				type: 'direct',
				module: module,
				activity: activity,
				parameters: parameters,
				isBack: isBack
			});

			return;
		}

		var self = this,
			deferred = new Deferred(),
			className = util.convertEntityName(module) + 'Module',
			activityName = util.convertCallableName(activity) + 'Activity',
			moduleCssFilename = 'modules/' + module + '/style/' + module + '-module.css',
			viewFilename = 'modules/' + module + '/views/' + module + '-' + activity + '.html';

		this.emit({
			type: this.Event.PRE_NAVIGATE,
			module: module,
			activity: activity,
			parameters: parameters
		});

		util.when(
			resourceManager.loadActivity(module, activity),
			resourceManager.loadView(viewFilename),
			resourceManager.loadCss(moduleCssFilename)
		).done(function(activityInstance, viewContent) {
			self._showActivity(
				module,
				activity,
				activityInstance,
				viewContent,
				className,
				activityName,
				deferred,
				parameters,
				isBack
			);
		}).fail(function(reason) {
			throw new Error('Attempting to open ' + module + '.' + activityName + ', but ' + reason.toLowerCase());
		});

		return deferred.promise();
	};

	/**
	 * Shows module activity once the resources have been loaded.
	 *
	 * @method _showActivity
	 * @param {String} module Module name
	 * @param {String} activity Module activity name
	 * @param {Object} activityInstance Module object
	 * @param {String} viewContent Activity view content
	 * @param {String} className Name of the module class
	 * @param {String} activityName Name of the module activity
	 * @param {Deferred} deferred Progress deferred
	 * @param {Array} parameters List of parameters
	 * @param {Boolean} isBack Is the view change triggered by back-button
	 * @private
	 */
	Navi.prototype._showActivity = function(
		module,
		activity,
		activityInstance,
		viewContent,
		className,
		activityName,
		deferred,
		parameters,
		isBackBtn
	) {
		if (!util.isFunction(activityInstance.onCreate)) {
			throw new Error('Invalid "' + module + '" module activity "' + activity + '" requested');
		}

		var self = this,
			currentItem = this.getCurrentItem(),
			existingItem = this.getExistingItem(module, activity),
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
			currentItem.emit(this.Event.URL_CHANGED, {
				module: module,
				activity: activity,
				parameters: parameters
			});

			this.emit({
				type: this.Event.PARAMETERS_CHANGED,
				module: module,
				activity: activity,
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
			app.registerController(className + '.' + activityName, activityInstance.onCreate);

			newItem = this.appendNavigation(module, activity, parameters, true);
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
			activity,
			className,
			activityName,
			parameters,
			activityInstance,
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
					activity: activity,
					parameters: parameters
				});

				deferred.resolve();

				app.validate();

				this._checkQueue();
			}.bind(this)
		);

		if (newItem !== null) {
			newItem.container = newItemContainer;
		}
	};

	/**
	 * Opens a partial view.
	 *
	 * Partials can be used to load activities in any container to display main menu etc.
	 *
	 * @method partial
	 * @param {String} containerSelector Container selector
	 * @param {String} module Module to open
	 * @param {String} [activity=index] Activity to navigate to
	 * @param {Object} [parameters] Activity parameters
	 * @param {Boolean} [append=false] Should the content be appended instead of replaced
	 * @return {Deferred} Deferred promise
	 */
	Navi.prototype.partial = function(containerSelector, module, activity, parameters, append) {
		activity = activity || 'index';
		parameters = parameters || [];
		append = util.isBoolean(append) ? append : false;

		this._partialRendering = true;

		var self = this,
			deferred = new Deferred(),
			className = util.convertEntityName(module) + 'Module',
			activityName = util.convertCallableName(activity) + 'Activity',
			moduleCssFilename = 'modules/' + module + '/style/' + module + '-module.css',
			viewFilename = 'modules/' + module + '/views/' + module + '-' + activity + '.html',
			item = null;

		this.emit({
			type: this.Event.PRE_PARTIAL,
			containerSelector: containerSelector,
			module: module,
			activity: activity,
			parameters: parameters
		});

		util.when(
			resourceManager.loadActivity(module, activity),
			resourceManager.loadView(viewFilename),
			resourceManager.loadCss(moduleCssFilename)
		).done(function(activityInstnace, viewContent) {
			item = ui.showPartial(
				module,
				activity,
				className,
				activityName,
				parameters,
				activityInstnace,
				viewContent,
				containerSelector,
				append
			);

			self.emit({
				type: self.Event.POST_PARTIAL,
				containerSelector: containerSelector,
				module: module,
				activity: activity,
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
	 * Navigates back to previous activity.
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
			newItem.activity,
			newItem.parameters
		);
	};

	/**
	 * Returns currently active activity info.
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
	 * Returns previously active activity info.
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
	 * @param {String} activity Activity name
	 * @return {Object|null} Navi info or null if not exists
	 */
	Navi.prototype.getExistingItem = function(module, activity) {
		var i,
			item;

		for (i = 0; i < this._stack.length; i++) {
			item = this._stack[i];

			if (item.module === module && item.activity === activity) {
				return item;
			}
		}

		return null;
	};

	/**
	 * Returns whether currently active module activity is as given.
	 *
	 * @method isCurrentView
	 * @param {String} module Module name
	 * @param {String} activity Activity name
	 * @return {Boolean}
	 */
	Navi.prototype.isCurrentView = function(module, activity) {
		var currentItem = this.getCurrentItem();

		if (currentItem === null) {
			return false;
		}

		return currentItem.module === module && currentItem.activity === activity;
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
	 * @method _popLastActivity
	 * @param {Number} [steps=1] How many steps to jump back
	 * @return {Object} Last activity info
	 * @private
	 */
	Navi.prototype._popLastActivity = function(steps) {
		steps = steps || 1;

		if (this._stack.length >= 2) {
			for (var i = 0; i < steps; i++) {
				this._removeCurrentActivity();
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
	 * @return {Object} Last activity info or null if not available
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
	 * @return {Object} Last activity info or null if not available
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
	 * @method removeCurrentActivity
	 * @private
	 */
	Navi.prototype._removeCurrentActivity = function() {
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
	 * @param {String} activity Module activity to call, defaults to index
	 * @param {Object} parameters Map of parameters to pass to activity
	 * @param {Boolean} [quiet=false] If set to true, no stack change event is automatically emitted
	 * @return {Object} New stack item
	 */
	Navi.prototype.appendNavigation = function(module, activity, parameters, quiet) {
		this._stack.push({
			id: this._naviCounter++,
			module: module,
			activity: activity,
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
	 * @param {String} activity Module activity to call, defaults to index
	 * @param {Object} parameters Map of parameters to pass to activity
	 * @return {Object} New stack item
	 */
	Navi.prototype.prependNavigation = function(module, activity, parameters) {
		this._stack.unshift({
			id: this._naviCounter++,
			module: module,
			activity: activity,
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
	 * Passes the key event on to currently active module activity controller.
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
	 * Passes the key event on to currently active module activity controller.
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

	/**
	 * Checks for any requests in the queue and executes the first one.
	 *
	 * @method _checkQueue
	 * @private
	 */
	Navi.prototype._checkQueue = function() {
		if (this._queue.length === 0 || ui.isTransitioning()) {
			return;
		}

		var item = this._queue.shift();

		if (item.type === 'direct') {
			this._open(item.module, item.activity, item.parameters, item.isBack);
		} else {
			this.open(item.module, item.activity, item.parameters);
		}
	};

	return new Navi();
});
