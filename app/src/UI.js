define(
['underscore', 'core/BaseUI', 'core/ResourceManager', 'core/Translator', 'core/App', 'Util'],
function(_, BaseUI, resourceManager, translator, app, util) {
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

		util.extend(this.Event, {
			MODAL_SHOWN: 'modal-shown',
			MODAL_HIDDEN: 'modal-hidden'
		});

		this._transitioning = false;
	};

	UI.prototype = Object.create(BaseUI.prototype);

	/**
	 * Opens a view in a modal window.
	 *
	 * @method openModal
	 * @param {String} module Module to open
	 * @param {String} [activity=index] Activity to navigate to
	 * @param {Object} [parameters] Activity parameters
	 * @param {Object} [options] Optional modal options
	 * @param {Function} [readyCallback] Callback to call once modal is displayed
	 */
	UI.prototype.openModal = function(module, activity, parameters, options, readyCallback) {
		this.showModal('<div id="modal-content"></div>', options, function() {
			navi.partial('#modal-content', module, activity, parameters);

			if (util.isFunction(readyCallback)) {
				readyCallback.call(readyCallback, module, activity, parameters, options);
			}
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
			$('.modal-backdrop').remove();
			existing.remove();
		}

		resourceManager.loadView(filename)
			.done(function(template) {
				$(document.body).addClass('modal-open').append(template);

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

		$(document.body).removeClass('modal-open');
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
				var confirmed = false;

				$(document.body).append(template);

				$('#confirm-title').html(title);
				$('#confirm-content').html(content);
				$('#confirm-btn').click(function() {
					if (util.isFunction(callback)) {
						callback(true);
					}

					confirmed = true;

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
					.on('hidden.bs.modal', function() {
						if (!confirmed && util.isFunction(callback)) {
							callback(false);
						}

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

	return new UI();
});
