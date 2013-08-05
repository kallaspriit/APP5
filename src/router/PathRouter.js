define(
['router/RouterBase', 'config/main', 'Navi', 'App', 'Util'],
function(RouterBase, config, navi, app, util) {
	'use strict';

	/**
	 * Path-based router strategy.
	 *
	 * @class PathRouter
	 * @extends RouterBase
	 * @constructor
	 * @module Core
	 */
	var PathRouter = function() {
		RouterBase.call(this);
	};

	PathRouter.prototype = Object.create(RouterBase.prototype);

	/**
	 * Initiates the component.
	 *
	 * @method init
	 * @return {Router} Self
	 */
	PathRouter.prototype.init = function() {
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
	PathRouter.prototype.navigate = function(module, action, parameters) {
		var path = '/' + module + '/' + action,
			key;

		if (util.isObject(parameters) && !util.isEmpty(parameters)) {
			for (key in parameters) {
				if (parameters[key] === true) {
					path += '/' + key;
				} else {
					path += '/' + key + '=' + parameters[key];
				}
			}
		}

		app.location.path(path);
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
	PathRouter.prototype._onUrlChanged = function(parameters) {
		var path = parameters.path,
			tokens = path.split('/'),
			module = config.index.module,
			action = config.index.action,
			actionParameters = config.index.parameters,
			i,
			paramParts,
			paramName,
			paramValue;

		if (tokens.length >= 2 && tokens[1].length > 0) {
			module = tokens[1];
			actionParameters = {};
		}

		if (tokens.length >= 3 && tokens[2].length > 0) {
			action = tokens[2];
		}

		if (tokens.length >= 4) {
			for (i = 3; i < tokens.length; i++) {
				if (tokens[i].indexOf('=') !== -1) {
					paramParts = tokens[i].split('=');
					paramName = paramParts[0];
					paramValue = util.normalizeType(paramParts[1]);
				} else {
					paramName = tokens[i];
					paramValue = true;
				}

				actionParameters[paramName] = paramValue;
			}
		}

		navi._open(
			module,
			action,
			actionParameters
		);
	};

	return new PathRouter();
});
