define(
[
	'jquery',
	'underscore',
	'config/main',
	'core/EventEmitter',
	'core/App',
	'core/ResourceManager',
	'core/Debug',
	'core/DebugRenderer',
	'core/Translator',
	'core/BaseUtil',
	'core/Deferred'
],
function(
	$,
	_,
	config,
	EventEmitter,
	app,
	resourceManager,
	dbg,
	debugRenderer,
	translator,
	util,
	Deferred
) {
	'use strict';

	/**
	 * Manages the user interface. Base implementation.
	 *
	 * Can fire the following events:
	 *
	 *	> READY - fired when ui is ready
	 *
	 * @class BaseUI
	 * @extends EventEmitter
	 * @constructor
	 * @module Core
	 */
	var BaseUI = function() {
		EventEmitter.call(this);

		this._transitioning = false;
		this._pageViewCount = 0;
	};

	BaseUI.prototype = Object.create(EventEmitter.prototype);

	/**
	 * Event types.
	 *
	 * @event Event
	 * @param {Object} Event
	 * @param {String} Event.READY UI is ready
	 * @param {String} Event.MODAL_SHOWN A modal window is displayed
	 * @param {String} Event.MODAL_HIDDEN A modal window is hidden
	 */
	BaseUI.prototype.Event = {
		READY: 'ready'
	};

	/**
	 * Initializes the debugger.
	 *
	 * @method init
	 * @return {BaseUI} Self
	 */
	BaseUI.prototype.init = function() {
		var self = this;

		require(['core/Navi'], function() {
			$(document).ready(function() {
				self._onDocumentReady();
			});
		});

		return this;
	};

	/**
	 * Returns whether the view is already transitioning.
	 *
	 * @method isTransitioning
	 * @return {Boolean}
	 */
	BaseUI.prototype.isTransitioning = function() {
		return this._transitioning;
	};

	/**
	 * Renders activity view.
	 *
	 * @method showView
	 * @param {String} module Name of the module
	 * @param {String} activity Name of the activity
	 * @param {String} className Class name of the module
	 * @param {Array} parameters Activity parameters
	 * @param {Object} moduleObj Module object
	 * @param {String} viewContent View content to render
	 * @param {DOMElement} currentContainer Current view container to animate to
	 * @param {DOMElement} existingContainer Previous view container to animate from
	 * @param {String} newItemId Identifier of the new item if created
	 * @param {Boolean} isBack Is the navigation happening to a previous view
	 * @param {Function} doneCallback Callback to call when done
	 * @return {DOMElement|null} New item container or null if navigating back
	 * @private
	 */
	BaseUI.prototype.showView = function(
		module,
		activity,
		className,
		parameters,
		moduleObj,
		viewContent,
		currentContainer,
		existingContainer,
		newItemId,
		isBack,
		doneCallback
	) {
		if (isBack) {
			this.transitionView(currentContainer, existingContainer, isBack, doneCallback);

			return null;
		}

		this._pageViewCount++;

		var cssPrefix = config.cssPrefix,
			newWrapId = 'content-' + newItemId,
			parentWrap = $(config.viewSelector),
			currentWrap = parentWrap.find('.' + cssPrefix + 'page-active'),
			body = $(document.body),
			newWrap,
			scope;

		newWrap = $('<div/>', {
			'id': newWrapId,
			'class': cssPrefix + 'page ' + module + '-module ' + activity + '-activity ' + cssPrefix + 'page-loading',
			'ng-controller': module + '.' + activity,
			'style': 'z-index: ' + (1000 - this._pageViewCount) // TODO Find a better way
		}).html(viewContent).appendTo(parentWrap);

		//newWrap.addClass(prefix + 'page-loading');
		body.addClass(cssPrefix + 'loading-view');

		try {
			scope = app.baseScope.$new(false);

			app.compile(newWrap)(scope);
			app.validate();

			scope.$evalAsync(function() {
				body.removeClass(cssPrefix + 'loading-view first-load');
				newWrap.removeClass(cssPrefix + 'page-loading');

				this.transitionView(currentWrap, newWrap, isBack, doneCallback);
			}.bind(this));
		} catch (e) {
			dbg.error(e);
		}

		return newWrap;
	};

	/**
	 * Transitions from one page to another.
	 *
	 * @method transitionView
	 * @param {Array} currentWrap Current page wrap selector
	 * @param {Array} newWrap New page wrap selector
	 * @param {Boolean} [isReverse=false] Should reverse (back) animation be displayed
	 * @param {Function} [doneCallback] Called when transition is complete
	 */
	BaseUI.prototype.transitionView = function(
		currentWrap,
		newWrap,
		isReverse,
		doneCallback
	) {
		isReverse = util.isBoolean(isReverse) ? isReverse : false;

		this._transitioning = true;

		var prefix = config.cssPrefix,
			body = $(document.body),
			transitionType = config.pageTransition,
			simultaneousTransitions = ['slide', 'slideup', 'slidedown'],
			isSimultaneous = util.contains(simultaneousTransitions, transitionType),
			bodyClasses = [],
			currentWrapClasses = [],
			newWrapClasses = [],
			animationEndEvents = 'animationEnd animationend oAnimationEnd msAnimationEnd mozAnimationEnd ' +
				'webkitAnimationEnd transitionend oTransitionEnd otransitionend webkitTransitionEnd MSTransitionEnd',
			currentWrapAnimation = new Deferred(),
			newWrapAnimation = new Deferred();

		body.scrollTop(0);

		if (currentWrap.length > 0) {
			if (transitionType === 'none') {
				newWrap.addClass(prefix + 'page-active');
				currentWrap.removeClass(prefix + 'page-active');

				this._transitioning = false;

				if (util.isFunction(doneCallback)) {
					doneCallback();
				}
			} else {
				bodyClasses.push(prefix + 'transitioning');
				bodyClasses.push(prefix + 'transition-' + transitionType);

				if (isReverse) {
					currentWrapClasses.push(prefix + 'reverse');
					newWrapClasses.push(prefix + 'reverse');
				}

				if (isSimultaneous) {
					newWrapClasses.push(prefix + 'in');
					newWrapClasses.push(prefix + 'page-active');
					newWrapClasses.push(prefix + 'page-pre-transform');
					newWrapClasses.push(prefix + transitionType);
				}

				currentWrapClasses.push(prefix + transitionType);
				currentWrapClasses.push(prefix + 'out');

				currentWrap.addClass(currentWrapClasses.join(' '));
				newWrap.addClass(newWrapClasses.join(' '));

				window.setTimeout(function() {
					newWrap.removeClass(prefix + 'page-pre-transform');
					body.addClass(bodyClasses.join(' '));
				}.bind(this), 0);

				currentWrap.on(animationEndEvents, function() {
					currentWrap.removeClass(
						prefix + transitionType + ' ' + prefix + 'out ' + prefix + 'page-active ' + prefix + 'reverse'
					);

					if (!isSimultaneous) {
						newWrap.addClass(prefix + 'page-active ' + prefix + transitionType + ' ' + prefix + 'in');
					}

					this.wrap.off(animationEndEvents);

					currentWrapAnimation.resolve();
				}.bind({ wrap: currentWrap }));

				newWrap.on(animationEndEvents, function() {
					newWrap.removeClass(prefix + transitionType + ' ' + prefix + 'in ' + prefix + 'reverse');
					body.removeClass(prefix + 'transitioning ' + prefix + 'transition-' + transitionType);

					this.wrap.off(animationEndEvents);

					newWrapAnimation.resolve();
				}.bind({ wrap: newWrap }));

				Deferred.when(
					currentWrapAnimation,
					newWrapAnimation
				).done(function() {
					this._transitioning = false;

					if (util.isFunction(doneCallback)) {
						doneCallback();
					}
				}.bind(this));
			}
		} else {
			newWrap.addClass(prefix + 'page-active');

			this._transitioning = false;

			if (util.isFunction(doneCallback)) {
				doneCallback();
			}
		}
	};

	/**
	 * Displays partial content.
	 *
	 * @method showPartial
	 * @param {String} module Name of the module
	 * @param {String} activity Name of the activity
	 * @param {String} className Class name of the module
	 * @param {Array} parameters Activity parameters
	 * @param {Object} activityInstance Module object
	 * @param {String} viewContent View content to render
	 * @param {String} containerSelector Container selector to place the content into
	 * @param {Boolean} append Should the content be appended instead of replaced
	 * @private
	 */
	BaseUI.prototype.showPartial = function(
		module,
		activity,
		className,
		parameters,
		activityInstance,
		viewContent,
		containerSelector,
		append
	) {
		var cssPrefix = config.cssPrefix,
			container = $(containerSelector),
			controllerName = module + '.' + activity,
			containerId,
			scope;

		if (container.length === 0) {
			throw new Error('Partial container for "' + containerSelector + '" not found');
		}

		if (append) {
			containerId = $(viewContent).attr('id');
			container.append(viewContent);
			$('#' + containerId).attr('ng-controller', controllerName);
		} else {
			container.html(viewContent).attr('ng-controller', controllerName);
		}

		container.addClass(
			cssPrefix + 'partial ' + module + '-module ' + activity + '-activity ' + cssPrefix + 'partial-loading'
		);

		activityInstance.setParameters(parameters);

		app.registerController(
			controllerName,
			app.getAnnotatedController(activityInstance.onCreate, activityInstance)
		);

		try {
			scope = app.baseScope.$new(false);

			app.compile(container)(scope);

			scope.$evalAsync(function() {
				$(container).removeClass(cssPrefix + 'partial-loading');
			}.bind(this));
		} catch (e) {
			dbg.error(e);
		}
	};

	/**
	 * Called on document ready.
	 *
	 * @method _onDocumentReady
	 * @private
	 */
	BaseUI.prototype._onDocumentReady = function() {
		if (config.debug) {
			debugRenderer.init(this);

			window.app.debugRenderer = debugRenderer;
		}

		if ('ontouchstart' in document) {
			$(document.body).removeClass('no-touch').addClass('with-touch');
		}

		this.emit({
			type: this.Event.READY
		});
	};

	return BaseUI;
});
