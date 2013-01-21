define(
['jquery', 'config/main', 'Bindable', 'Debug', 'DebugRenderer', 'Util'],
function($, config, Bindable, dbg, debugRenderer, util) {
	'use strict';

	/**
	 * Manages the user interface.
	 *
	 * Can fire the following events:
	 *
	 *	> READY - fired when ui is ready
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
	 */
	UI.prototype.Event = {
		READY: 'ready'
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

		var body = $(document.body),
			transitionType = config.pageTransition,
			simultaneousTransitions = ['slide', 'slideup', 'slidedown'],
			isSimultaneous = util.contains(simultaneousTransitions, transitionType);

		if (currentWrap.length > 0) {
			body.addClass('transitioning transition-' + transitionType);

			if (isReverse) {
				currentWrap.addClass('reverse');
				newWrap.addClass('reverse');
			}

			currentWrap.addClass(transitionType + ' out');

			if (isSimultaneous) {
				newWrap.addClass('page-active ' + transitionType + ' in');
			}

			currentWrap.bind('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', function() {
				currentWrap.removeClass(transitionType + ' out page-active reverse');

				if (!isSimultaneous) {
					newWrap.addClass('page-active ' + transitionType + ' in');
				}

				currentWrap.unbind('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd');
			});

			newWrap.bind('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', function() {
				newWrap.removeClass(transitionType + ' in reverse');
				body.removeClass('transitioning transition-' + transitionType);
				newWrap.unbind('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd');

				if (util.isFunction(completeCallback)) {
					completeCallback();
				}
			});
		} else {
			newWrap.addClass('page-active');

			if (util.isFunction(completeCallback)) {
				completeCallback();
			}
		}
	};

	/**
	 * Called on document ready.
	 *
	 * @method _onDocumentReady
	 * @private
	 */
	UI.prototype._onDocumentReady = function() {
		if (config.debug) {
			debugRenderer.init();
		}

		this.fire({
			type: this.Event.READY
		});
	};

	return new UI();
});