define(
['core/BaseUI'],
function(BaseUI) {
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

		this._transitioning = false;
	};

	UI.prototype = Object.create(BaseUI.prototype);

	return new UI();
});
