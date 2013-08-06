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
	'core/BaseUtil'
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
	util
) {
	'use strict';

	/**
	 * Manages the user interface. Base implementation.
	 *
	 * Can fire the following events:
	 *
	 *	> READY - fired when ui is ready
	 *	> MODAL_SHOWN - fired when modal window is displayed
	 *		modal - the modal that was shown
	 *	> MODAL_HIDDEN - fired when modal window is hidden
	 *
	 * @class BaseUI
	 * @extends EventEmitter
	 * @constructor
	 * @module Core
	 */
	var BaseUI = function() {
		EventEmitter.call(this);

		this._transitioning = false;
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
		READY: 'ready',
		MODAL_SHOWN: 'modal-shown',
		MODAL_HIDDEN: 'modal-hidden'
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
	 * Transitions from one page to another.
	 *
	 * @method transitionView
	 * @param {String} currentWrapSelector Current page wrap selector
	 * @param {String} newWrapSelector New page wrap selector
	 * @param {Boolean} [isReverse=false] Should reverse (back) animation be displayed
	 * @param {Function} [doneCallback] Called when transition is complete
	 */
	BaseUI.prototype.transitionView = function(
		currentWrapSelector,
		newWrapSelector,
		isReverse,
		doneCallback
	) {
		isReverse = util.isBoolean(isReverse) ? isReverse : false;

		this._transitioning = true;

		var self = this,
			currentWrap = $(currentWrapSelector),
			newWrap = $(newWrapSelector),
			prefix = config.cssPrefix,
			body = $(document.body),
			transitionType = config.pageTransition,
			simultaneousTransitions = ['slide', 'slideup', 'slidedown'],
			isSimultaneous = util.contains(simultaneousTransitions, transitionType);

		$(document.body).scrollTop(0);

		if (currentWrap.length > 0) {
			body.addClass(prefix + 'transitioning ' + prefix + 'transition-' + transitionType);

			if (isReverse) {
				currentWrap.addClass(prefix + 'reverse');
				newWrap.addClass(prefix + 'reverse');
			}

			currentWrap.addClass(prefix + transitionType + ' ' + prefix + 'out');

			if (isSimultaneous) {
				newWrap.addClass(prefix + 'page-active ' + prefix + transitionType + ' ' + prefix + 'in');
			}

			var animationEndEvents = 'animationEnd animationend oAnimationEnd msAnimationEnd mozAnimationEnd ' +
				'webkitAnimationEnd transitionend oTransitionEnd otransitionend webkitTransitionEnd MSTransitionEnd';

			currentWrap.bind(animationEndEvents, function() {
				currentWrap.removeClass(
					prefix + transitionType + ' ' + prefix + 'out ' + prefix + 'page-active ' + prefix + 'reverse'
				);

				if (!isSimultaneous) {
					newWrap.addClass(prefix + 'page-active ' + prefix + transitionType + ' ' + prefix + 'in');
				}

				currentWrap.unbind(animationEndEvents);
			});

			newWrap.bind(animationEndEvents, function() {
				newWrap.removeClass(prefix + transitionType + ' ' + prefix + 'in ' + prefix + 'reverse');
				body.removeClass(prefix + 'transitioning ' + prefix + 'transition-' + transitionType);
				newWrap.unbind(animationEndEvents);

				self._transitioning = false;

				if (util.isFunction(doneCallback)) {
					doneCallback();
				}
			});
		} else {
			newWrap.addClass(prefix + 'page-active');

			this._transitioning = false;

			if (util.isFunction(doneCallback)) {
				doneCallback();
			}
		}
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
	 * Renders module action view.
	 *
	 * @method showView
	 * @param {String} module Name of the module
	 * @param {String} action Name of the action
	 * @param {String} className Class name of the module
	 * @param {String} actionName Method name of the action
	 * @param {Array} parameters Action parameters
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
		action,
		className,
		actionName,
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

		var prefix = config.cssPrefix,
			newWrapId = 'content-' + newItemId,
			parentWrap = $(config.viewSelector),
			currentWrap = parentWrap.find('.' + prefix + 'page-active'),
			newWrap;

		parentWrap.append(
			'<div id="' + newWrapId + '" class="' + prefix + 'page ' + module + '-module ' + action + '-action"></div>'
		);

		newWrap = $('#' + newWrapId)
			.html(viewContent)
			.attr('ng-controller', className + '.' + actionName);

		try {
			app.compile(newWrap)(app.baseScope);

			this.transitionView(currentWrap, newWrap, isBack, doneCallback);
		} catch (e) {
			dbg.error(e);
		}

		return newWrap;
	};

	/**
	 * Displays partial content.
	 *
	 * @method showPartial
	 * @param {String} module Name of the module
	 * @param {String} action Name of the action
	 * @param {String} className Class name of the module
	 * @param {String} actionName Method name of the action
	 * @param {Array} parameters Action parameters
	 * @param {Object} moduleObj Module object
	 * @param {String} viewContent View content to render
	 * @param {String} containerSelector Container selector to place the content into
	 * @param {Boolean} append Should the content be appended instead of replaced
	 * @private
	 */
	BaseUI.prototype.showPartial = function(
		module,
		action,
		className,
		actionName,
		parameters,
		moduleObj,
		viewContent,
		containerSelector,
		append
	) {
		var container = $(containerSelector),
			controllerName = className + '-' + actionName,
			containerId;

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

		app.parameters = parameters;

		app.registerController(controllerName, moduleObj[actionName]);

		try {
			app.compile(container)(app.baseScope);
		} catch (e) {
			dbg.error(e);
		}
	};

	/**
	 * Displays a confirmation window.
	 *
	 * The method accepts any number of additional parameters that are used in the translation of the content.
	 *
	 * @method confirm
	 * @param {Function} callback Callback to call on confirmation
	 * @param {String} [title] Default title override, can be translation key
	 * @param {String} [content] Default confirmation text override, can be translation key
	 */
	BaseUI.prototype.confirm = function(callback, title, content) {
		var self = this,
			filename = 'partials/confirm.html',
			existing = $('#confirm');

		// TODO Not sure if this is great..
		if (existing.length > 0) {
			existing.remove();
		}

		title = title || 'confirm-title';
		content = content || 'confirm-text';

		if (translator.has(title)) {
			title = translator.translate(title);
		}

		if (translator.has(content)) {
			var translationArgs = [];

			if (arguments.length > 3) {
				translationArgs = _.toArray(arguments).slice(3);
			}

			translationArgs.unshift(content);

			content = translator.translate.apply(translator, translationArgs);
		}

		resourceManager.loadView(filename)
			.done(function(template) {
				$(document.body).append(template);

				$('#confirm-title').html(title);
				$('#confirm-content').html(content);
				$('#confirm-btn').click(function() {
					if (util.isFunction(callback)) {
						callback();
					}

					$('#confirm').modal('hide');
				});

				$('#confirm')
					.modal()
					.on('shown', function() {
						self.emit({
							type: self.Event.MODAL_SHOWN,
							modal: $(this)
						});

						app.validate();
					})
					.on('hidden', function() {
						$(this).remove();

						self.emit({
							type: self.Event.MODAL_HIDDEN
						});

						app.validate();
					});
			})
			.fail(function() {
				throw new Error('Loading confirm template from ' + filename + ' failed');
			});
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
