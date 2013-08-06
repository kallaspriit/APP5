define(
['core/BaseUI', 'core/ResourceManager', 'Util'],
function(BaseUI, resourceManager, util) {
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
	 *
	 * @class UI
	 * @extends BaseUI
	 * @constructor
	 * @module App
	 */
	var UI = function() {
		BaseUI.call(this);

		require(['core/Navi'], function(naviManager) {
			navi = naviManager;
		});

		this._transitioning = false;
	};

	UI.prototype = Object.create(BaseUI.prototype);

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
						self.emit({
							type: self.Event.MODAL_SHOWN,
							modal: $(this)
						});
					})
					.on('hidden', function() {
						$(this).remove();

						self.emit({
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

	return new UI();
});
