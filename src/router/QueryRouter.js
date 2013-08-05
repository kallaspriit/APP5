define(
['router/RouterBase', 'config/main', 'Navi', 'App', 'Util'],
function(RouterBase, config, navi, app, util) {
	'use strict';

	/**
	 * Query-string based router strategy.
	 *
	 * @class QueryRouter
	 * @extends RouterBase
	 * @constructor
	 * @module Core
	 */
	var QueryRouter = function() {
		RouterBase.call(this);
	};

	QueryRouter.prototype = Object.create(RouterBase.prototype);

	/**
	 * Initiates the component.
	 *
	 * @method init
	 * @return {Router} Self
	 */
	QueryRouter.prototype.init = function() {
		var self = this;

		navi.on(navi.Event.URL_CHANGED, function(e) {
			self._onUrlChanged(e.parameters);
		});

		return this;
	};

	/**
	 * Composes a URL that matches given module action.
	 *
	 * @method navigate
	 * @param {String} module Module name
	 * @param {String} [action=index] Action name
	 * @param {Object} [parameters] Action parameters
	 */
	QueryRouter.prototype.navigate = function(module, action, parameters) {
		var urlArguments = {
			module: module,
			action: action
		};

		if (util.isObject(parameters) && !util.isEmpty(parameters)) {
			urlArguments.parameters = parameters;
		}

		app.location.search(urlArguments);
		app.validate();
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
	QueryRouter.prototype._onUrlChanged = function(parameters) {
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

	return new QueryRouter();
});
