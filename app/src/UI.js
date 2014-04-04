define(
['underscore', 'core/BaseUI', 'core/ResourceManager', 'core/Translator', 'core/App', 'Util'],
function(_, BaseUI, resourceManager, translator, app, util) {
	'use strict';

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
			moduleCssFilename = 'modules/' + module + '/style/' + module + '-module.css';

		util.when(
			resourceManager.loadActivity(module, activity),
			resourceManager.loadActivityView(module, activity),
			resourceManager.loadCss(moduleCssFilename)
		).done(function(activityInstance, viewContent) {
			activityInstance.setParameters(parameters);

			self.showModal(viewContent, activityInstance.onCreate, parameters, resultCallback, activityInstance);
		});
	};

	/**
	 * Displays a modal window with specific content.
	 *
	 * @method showModal
	 * @param {String} content Modal content
	 * @param {Object} [options] Optional modal options
	 * @param {Object} [parameters] Activity parameters
	 * @param {Function} [resultCallback] Optional callback called on modal close
	 * @param {Object} [context] Optional context to bind to
	 */
	UI.prototype.showModal = function(content, controller, parameters, resultCallback, context) {
		var preannotatedController = null,
			bindContext = context || controller;

		if (util.isFunction(controller)) {
			preannotatedController = app.getAnnotatedController(controller, bindContext);
		} else if (util.isArray(controller)) {
			preannotatedController = controller;

			preannotatedController[preannotatedController.length - 1] = preannotatedController[
				preannotatedController.length - 1
			].bind(bindContext);
		}

		var modalInstance = app.modalService.open({
			template: content,
			controller: preannotatedController
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

	return new UI();
});
