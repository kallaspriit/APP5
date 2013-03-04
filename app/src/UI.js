define(
['jquery', 'underscore', 'config/main', 'Bindable', 'ResourceManager', 'Debug', 'DebugRenderer', 'Util', 'Translator'],
function($, _, config, Bindable, resourceManager, dbg, debugRenderer, util, translator) {
	'use strict';

	var navi = null;

	/**
	 * Manages the user interface.
	 *
	 * Can fire the following events:
	 *
	 *	> READY - fired when ui is ready
	 *	> MODAL_SHOWN - fired when modal window is displayed
	 *		modal - the modal that was shown
	 *	> MODAL_HIDDEN - fired when modal window is hidden
	 *	> SWIPE - fired when document is swiped
	 *		direction - direction of the swipe, one of left, right, top, bottom
	 *		distance - x and y of swipe direction
	 *		startPosition - start x, y
	 *		endPosition	- end x, y
	 *
	 * @class UI
	 * @extends Bindable
	 * @constructor
	 * @module Core
	 */
	var UI = function() {

	};

	UI.prototype = new Bindable();

	/**
	 * Event types.
	 *
	 * @event
	 * @param {Object} Event
	 * @param {String} Event.READY UI is ready
	 * @param {String} Event.MODAL_SHOWN A modal window is displayed
	 * @param {String} Event.MODAL_HIDDEN A modal window is hidden
	 * @param {String} Event.SWIPE Document is swiped
	 */
	UI.prototype.Event = {
		READY: 'ready',
		MODAL_SHOWN: 'modal-shown',
		MODAL_HIDDEN: 'modal-hidden',
		SWIPE: 'swipe'
	};

	/**
	 * Initializes the debugger.
	 *
	 * @method init
	 * @return {UI} Self
	 */
	UI.prototype.init = function() {
		var self = this;

		$(document).ready(function() {
			self._onDocumentReady();
		});

		require(['Navi'], function(naviManager) {
			navi = naviManager;
		});

		return this;
	};

	/**
	 * Transitions from one page to another.
	 *
	 * @method transitionView
	 * @param {Object} currentWrap Current page wrap jQuery element
	 * @param {Object} newWrap New page wrap jQuery element
	 * @param {Boolean} [isReverse=false] Should reverse (back) animation be displayed
	 * @param {Function} [completeCallback] Called when transition is complete
	 */
	UI.prototype.transitionView = function(currentWrap, newWrap, isReverse, completeCallback) {
		isReverse = util.isBoolean(isReverse) ? isReverse : false;

		var prefix = config.cssPrefix,
			body = $(document.body),
			transitionType = config.pageTransition,
			simultaneousTransitions = ['slide', 'slideup', 'slidedown'],
			isSimultaneous = util.contains(simultaneousTransitions, transitionType);

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

			var animationEndEvents = 'animationEnd oAnimationEnd msAnimationEnd mozAnimationEnd webkitAnimationEnd';

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

				if (util.isFunction(completeCallback)) {
					completeCallback();
				}
			});
		} else {
			newWrap.addClass(prefix + 'page-active');

			if (util.isFunction(completeCallback)) {
				completeCallback();
			}
		}
	};

	/**
	 * Opens a view in a modal window.
	 *
	 * @method openModal
	 * @param {String} module Module to open
	 * @param {String} [action=index] Action to navigate to
	 * @param {Object} [parameters] Action parameters
	 * @param {Object} [options] Optional modal options
	 */
	UI.prototype.openModal = function(module, action, parameters, options) {
		this.showModal('<div id="modal-content"></div>', options, function() {
			navi.partial('#modal-content', module, action, parameters);
		});
	};

	/**
	 * Displays a modal window with specific content.
	 *
	 * @method showModal
	 * @param {String} content Modal content
	 * @param {Object} [options] Optional modal options
	 * @param {Function} [readyCallback] Callback to call once modal is displayed
	 */
	UI.prototype.showModal = function(content, options, readyCallback) {
		var self = this,
			filename = 'partials/modal.html',
			existing = $('#modal');

		// TODO Not sure if this is great..
		if (existing.length > 0) {
			existing.remove();
		}

		resourceManager.loadView(filename)
			.done(function(template) {
				$(document.body).append(template);

				$('#modal')
					.html(content)
					.modal(util.isObject(options) ? options : {})
					.on('shown', function() {
						self.fire({
							type: self.Event.MODAL_SHOWN,
							modal: $(this)
						});
					})
					.on('hidden', function() {
						$(this).remove();

						self.fire({
							type: self.Event.MODAL_HIDDEN
						});
					});

				if (util.isFunction(readyCallback)) {
					readyCallback();
				}
			})
			.fail(function() {
				throw new Error('Loading modal template from ' + filename + ' failed');
			});
	};

	/**
	 * Hides currently visible modal window if exists.
	 *
	 * @method hideModal
	 */
	UI.prototype.hideModal = function() {
		$('#modal').modal('hide');
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
	UI.prototype.confirm = function(callback, title, content) {
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
						self.fire({
							type: self.Event.MODAL_SHOWN,
							modal: $(this)
						});
					})
					.on('hidden', function() {
						$(this).remove();

						self.fire({
							type: self.Event.MODAL_HIDDEN
						});
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
	UI.prototype._onDocumentReady = function() {
		var self = this;

		if (config.debug) {
			debugRenderer.init(this);
		}

		//$(document).bind('touchmove', false);

		$(document.body).hammer().bind('swipe', function(e) {
			var startX = e.position.x - e.distanceX,
				startY = e.position.y - e.distanceY;

			self._onSwipe(e.direction, {x: e.distanceX, y: e.distanceY}, {x: startX, y: startY}, e.position);
		});

		if ('ontouchstart' in document) {
			$(document.body).removeClass('no-touch').addClass('with-touch');
		}

		this.fire({
			type: this.Event.READY
		});
	};

	UI.prototype._onSwipe = function(direction, distance, startPosition, endPosition) {
		this.fire({
			type: this.Event.SWIPE,
			direction: direction,
			distance: distance,
			startPosition: startPosition,
			endPosition: endPosition
		});

		if (direction === 'right' && Math.abs(distance.x) >= 100) {
			require(['Navi'], function(navi) {
				navi.back();
			});

			return false;
		}
	};

	return new UI();
});
