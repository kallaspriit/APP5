define(
['config/main', 'App', 'Navi', 'Util'],
function(config, app, navi, util) {
	'use strict';

	/**
	 * Provides application routing functionality.
	 *
	 * @class Router
	 * @constructor
	 * @module Core
	 */
	var Router = function() {
		this._mode = this.Mode.QUERY;
	};

	/**
	 * Routing modes.
	 *
	 * @event
	 * @param {Object} Mode
	 * @param {String} Mode.QUERY Query-based routing ?module=phonebook&action=contacts style
	 * @param {String} Mode.PATH Path-based routing /phonebook/contacts style
	 */
	Router.prototype.Mode = {
		QUERY: 'query',
		PATH: 'path'
	};

	/**
	 * Sets navigation mode to use.
	 *
	 * @method setMode
	 * @param {String} mode Navigation mode to use
	 * @return {Router} Self
	 */
	Router.prototype.setMode = function(mode) {
		this._mode = mode;
	};

	/**
	 * Initiates the component.
	 *
	 * @method init
	 * @param {String} [mode] Navigation mode to use
	 * @return {Router} Self
	 */
	Router.prototype.init = function(mode) {
		var self = this;

		navi.bind(navi.Event.URL_CHANGED, function(e) {
			self._onUrlChanged(e.parameters);
		});

		if (util.isString(mode)) {
			this.setMode(mode);
		}

		return this;
	};

	/**
	 * Composes a URL that matches given module action.
	 *
	 * @method navigate
	 * @param {String} module Module name
	 * @param {String} [action=index] Action name
	 * @param {Object} [parameters] Action parameters
	 * @return {Router} Self
	 */
	Router.prototype.navigate = function(module, action, parameters) {
		switch (this._mode) {
			case this.Mode.QUERY:
				return this._navigateQuery(module, action, parameters);

			case this.Mode.PATH:
				return this._navigatePath(module, action, parameters);

			default:
				throw new Error('Invalid router mode "' + this._mode + '"');
		}
	};

	/**
	 * Query-based navigation strategy.
	 *
	 * @method _navigateQuery
	 * @param {String} module Module name
	 * @param {String} [action=index] Action name
	 * @param {Object} [parameters] Action parameters
	 * @return {Router} Self
	 * @private
	 */
	Router.prototype._navigateQuery = function(module, action, parameters) {
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
	 * Path-based navigation strategy.
	 *
	 * @method _navigatePath
	 * @param {String} module Module name
	 * @param {String} [action=index] Action name
	 * @param {Object} [parameters] Action parameters
	 * @return {Router} Self
	 * @private
	 */
	Router.prototype._navigatePath = function(module, action, parameters) {
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
	Router.prototype._onUrlChanged = function(parameters) {
		switch (this._mode) {
			case this.Mode.QUERY:
				return this._handleUrlChangeQuery(parameters);

			case this.Mode.PATH:
				return this._handleUrlChangePath(parameters);

			default:
				throw new Error('Invalid router mode "' + this._mode + '"');
		}
	};

	/**
	 * Query-based handler for URL change.
	 *
	 * @method _handleUrlChangeQuery
	 * @param {Object} parameters URL parameters
	 * @private
	 */
	Router.prototype._handleUrlChangeQuery = function(parameters) {
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

	/**
	 * Path-based handler for URL change.
	 *
	 * @method _handleUrlChangePath
	 * @param {Object} urlParameters URL parameters
	 * @private
	 */
	Router.prototype._handleUrlChangePath = function(urlParameters) {
		var path = urlParameters.path,
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

	return new Router();
});