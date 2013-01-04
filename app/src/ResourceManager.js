define(
['Bindable'],
function (Bindable) {
	"use strict";

	/**
	 * Manages application resources.
	 *
	 * Can fire the following events:
	 *
	 *	> MODULE_LOADED - fired when application module is loaded
	 *		name - name of the module
	 *		obj - module object
	 *
	 * @class ResourceManager
	 * @extends Bindable
	 * @constructor
	 */
	var ResourceManager = function () {

	};

	ResourceManager.prototype = new Bindable();

	/**
	 * Debugger event types.
	 *
	 * @event
	 * @param {Object} Event
	 * @param {String} Event.MODULE_LOADED Application module was loaded
	 */
	ResourceManager.prototype.Event = {
		MODULE_LOADED: 'module-loaded'
	};

	/**
	 * Initiates the component.
	 *
	 * @method init
	 * @return {ResourceManager} Self
	 */
	ResourceManager.prototype.init = function () {
		return this;
	};

	return new ResourceManager();
});