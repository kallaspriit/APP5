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
	 * @param {Function} [resultCallback] Optional callback called on modal close
	 */
	UI.prototype.openModal = function(module, activity, parameters, resultCallback) {
		var self = this,
			moduleCssFilename = 'modules/' + module + '/style/' + module + '-module.css',
			viewFilename = 'modules/' + module + '/views/' + module + '-' + activity + '.html';

		// TODO Handle parameters

		util.when(
			resourceManager.loadActivity(module, activity),
			resourceManager.loadView(viewFilename),
			resourceManager.loadCss(moduleCssFilename)
		).done(function(activityInstance, viewContent) {
			self.showModal(viewContent, activityInstance.onCreate, resultCallback);
		});
	};

	/**
	 * Displays a modal window with specific content.
	 *
	 * @method showModal
	 * @param {String} content Modal content
	 * @param {Object} [options] Optional modal options
	 * @param {Function} [resultCallback] Optional callback called on modal close
	 */
	UI.prototype.showModal = function(content, controller, resultCallback) {
		var modalInstance = app.modalService.open({
			template: content,
			controller: controller || null
		});

		modalInstance.result.then(function (result) {
			resultCallback(result);
		}, function () {
			resultCallback(null);
		});

		return modalInstance;
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
