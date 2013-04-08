define(
['Bindable', 'config/main', 'Navi', 'Util'],
function(Bindable, config, navi, util) {
	'use strict';

	/**
	 * Provides application routing functionality.
	 *
	 * Can fire the following events:
	 *
	 *	> URL_CHANGED - Triggered when url changes
	 *		??? - ???
	 *
	 * @class Router
	 * @extends Bindable
	 * @constructor
	 * @module Core
	 */
	var Router = function() {

	};

	Router.prototype = new Bindable();

	/**
	 * Event types.
	 *
	 * @event
	 * @param {Object} Event
	 * @param {String} Event.URL_CHANGED Triggered when url changes
	 */
	Router.prototype.Event = {
		URL_CHANGED: 'url-changed'
	};

	/**
	 * Initiates the component.
	 *
	 * @method init
	 * @return {Router} Self
	 */
	Router.prototype.init = function() {
		var self = this;

		navi.bind(navi.Event.URL_CHANGED, function(e) {
			self._onUrlChanged(e.parameters);
		});

		return this;
	};

	/**
	 * Called when application URL changes.
	 *
	 * The parameters include:
	 * - url
	 * - hash
	 * - path
	 * - query
	 * - args
	 * - host
	 * - port
	 * - protocol
	 *
	 * @method _onUrlChanged
	 * @param {Object} parameters URL parameters
	 * @private
	 */
	Router.prototype._onUrlChanged = function(parameters) {
		var current = navi.getCurrent();

		if (
			util.isString(parameters.args.module)
			&& util.isString(parameters.args.action)
			&& (
				current === null
				|| parameters.args.module !== current.module
				|| parameters.args.action !== current.action
			)
		) {
			navi._open(
				parameters.args.module,
				parameters.args.action,
				util.isObject(parameters.args.parameters) ? parameters.args.parameters : {}
			);
		} else {
			navi._open(
				config.index.module,
				config.index.action,
				config.index.parameters
			);
		}
	};

	return new Router();
});