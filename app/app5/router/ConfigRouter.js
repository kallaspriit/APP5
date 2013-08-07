define(
[
	'config/main',
	'config/routes',
	'core/router/RouterBase',
	'core/Navi',
	'core/App',
	'core/BaseUtil'
],
function(config, routes, RouterBase, navi, app, util) {
	'use strict';

	/**
	 * Configuration-file based router strategy.
	 *
	 * @class ConfigRouter
	 * @extends RouterBase
	 * @constructor
	 * @module Core
	 */
	var ConfigRouter = function() {
		RouterBase.call(this);

		this._currentRouteName = null;
	};

	ConfigRouter.prototype = Object.create(RouterBase.prototype);

	/**
	 * Parameter types.
	 *
	 * @property Param
	 * @param {String} Param.STRING String type
	 * @param {String} Param.POS_INT Positive integer type
	 */
	ConfigRouter.prototype.Param = {
		STRING: 'string',
		INT: 'int',
		POS_INT: '+int'
	};

	/**
	 * Default values for the parameter types.
	 *
	 * @property ParamDefaults
	 */
	ConfigRouter.prototype.ParamDefaults = {
		'string': '',
		'int': 0,
		'+int': 1
	};

	/**
	 * Initiates the component.
	 *
	 * @method init
	 * @return {Router} Self
	 */
	ConfigRouter.prototype.init = function() {
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
	 * @param {String} module Module name or route name
	 * @param {String} [action=index] Action name or route parameters
	 * @param {Object} [parameters] Action parameters
	 */
	ConfigRouter.prototype.navigate = function(module, action, parameters) {
		if (util.isUndefined(action) || util.isObject(action)) {
			var routeName = module,
				routeParameters = action,
				replaceUrl = typeof(parameters) !== 'undefined' ? parameters : false;

			this.open(routeName, routeParameters, replaceUrl);

			return;
		}

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
	 * Composes a URL that matches given module action.
	 *
	 * @method navigate
	 * @param {String} routeName Name of the route
	 * @param {Object} [parameters] Route parameters
	 * @param {Boolean} [replace=false] Should the URL be replaced, e.g not create history step
	 */
	ConfigRouter.prototype.open = function(routeName, parameters, replace) {
		if (!util.isObject(routes[routeName])) {
			throw new Error('Route "' + routeName + '" not found');
		}

		var route = this._parseRoute(routes[routeName]),
			path = route.path,
			routeParameters = util.clone(route.parameters),
			token,
			i;

		if (util.isObject(parameters)) {
			util.extend(routeParameters, parameters);
		}

		for (i = 0; i < route.tokens.length; i++) {
			token = route.tokens[i];

			if (token.type == 'static') {
				continue;
			}

			if (util.isUndefined(routeParameters[token.name])) {
				routeParameters[token.name] = this.ParamDefaults[token.type];
			}

			path = path.replace(token.original, routeParameters[token.name]);
		}

		app.location.path('/' + path);

		if (replace) {
			app.location.replace();
		}

		app.validate();
	};

	/**
	 * Changes a parameter of the current URL.
	 *
	 * @method setUrlParameter
	 * @param {String} name Name of the parameter
	 * @param {String} value Parameter value
	 * @param {Boolean} [replace=false] Should the URL be replaced, e.g not create history step
	 * @return {Boolean} Was setting the parameter successful
	 */
	ConfigRouter.prototype.setUrlParameter = function(name, value, replace) {
		var currentItem = navi.getCurrent(),
			newItem;

		if (currentItem === null) {
			return false;
		}

		newItem = util.clone(currentItem);
		newItem.parameters[name] = value;

		if (this._currentRouteName !== null) {
			navi.open(
				this._currentRouteName,
				newItem.parameters,
				replace
			);
		} else {
			navi.open(
				newItem.module,
				newItem.action,
				newItem.parameters
			);
		}
	},

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
	ConfigRouter.prototype._onUrlChanged = function(parameters) {
		var path = parameters.path,
			routeName,
			route,
			matchParameters;

		for (routeName in routes) {
			route = this._parseRoute(routes[routeName]);
			route.name = routeName;

			matchParameters = this._matchRoute(route, path);

			if (matchParameters === null) {
				continue;
			}

			this._currentRouteName = routeName;

			navi._open(
				route.module,
				route.action,
				matchParameters,
				parameters.isBack
			);

			return;
		}

		this._currentRouteName = null;

		var tokens = path.split('/'),
			module = config.index.module,
			action = config.index.action,
			actionParameters = config.index.parameters,
			isDefault = true,
			i,
			paramParts,
			paramName,
			paramValue;

		if (tokens.length >= 2 && tokens[1].length > 0) {
			module = tokens[1];
			actionParameters = {};
			isDefault = false;
		}

		if (tokens.length >= 3 && tokens[2].length > 0) {
			action = tokens[2];
			isDefault = false;
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

			isDefault = false;
		}

		if (isDefault && util.isString(config.index.route)) {
			this._currentRouteName = config.index.route;
		}

		util.normalizeType(actionParameters);

		navi._open(
			module,
			action,
			actionParameters,
			parameters.isBack
		);
	};

	/**
	 * Parses a route definition into a more detailed state including:
	 * - module
	 * - action
	 * - parameters
	 * - tokens
	 *
	 * @method _parseRoute
	 * @param {Object} route Route to parse
	 * @return {Object} Parsed route
	 * @private
	 */
	ConfigRouter.prototype._parseRoute = function(route) {
		var pathParameters = [];

		if (route.path.length > 0) {
			var pathTokens = route.path.split('/'),
				i;

			for (i = 0; i < pathTokens.length; i++) {
				if (pathTokens[i].substr(0, 1) === ':') {
					pathParameters.push(this._parseRouteParameter(pathTokens[i]));
				} else {
					pathParameters.push({
						original: pathTokens[i],
						type: 'static',
						name: pathTokens[i]
					});
				}
			}
		}

		return {
			path: route.path,
			module: route.module,
			action: route.action,
			parameters: route.parameters || {},
			tokens: pathParameters
		};
	};

	/**
	 * Parses a route parameter to name and type.
	 *
	 * @method _parseRouteParameter
	 * @param {String} original Parameter to parse int :param[type] format
	 * @return {Object} Parsed parameter
	 * @private
	 */
	ConfigRouter.prototype._parseRouteParameter = function(original) {
		var parameter = original.substr(1);

		if (parameter.indexOf('[') === -1) {
			return {
				original: original,
				type: this.Param.STRING,
				name: parameter
			};
		}

		var regex = /(\w+)\[([+\w]+)\]/,
			matches = regex.exec(parameter);

		return {
			original: original,
			type: matches[2],
			name: matches[1]
		};
	};

	ConfigRouter.prototype._matchRoute = function(route, path) {
		if (path.substr(0, 1) === '/') {
			path = path.substr(1);
		}

		var pathTokens = path.split('/'),
			match = true,
			parameters = {},
			pathToken,
			routeToken,
			i;

		for (i = 0; i < pathTokens.length; i++) {
			if (util.isUndefined(route.tokens[i])) {
				match = false;

				break;
			}

			pathToken = pathTokens[i];
			routeToken = route.tokens[i]; // check if exists

			if (!this._matchTokens(pathToken, routeToken)) {
				match = false;

				break;
			}

			if (routeToken.type !== 'static') {
				parameters[routeToken.name] = pathToken;
			}
		}

		util.normalizeType(parameters);

		if (match) {
			return parameters;
		} else {
			return null;
		}
	};

	ConfigRouter.prototype._matchTokens = function(pathToken, routeToken) {
		if (routeToken.type === 'static') {
			if (pathToken !== routeToken.name) {
				return false;
			}
		} else if (routeToken.type === this.Param.STRING) {
			if (!util.isString(pathToken) && !util.isNumber(pathToken)) {
				return false;
			}
		} else if (routeToken.type === this.Param.INT) {
			if (parseInt(pathToken, 10) + '' !== pathToken) {
				return false;
			}
		} else if (routeToken.type === this.Param.POS_INT) {
			if (parseInt(pathToken, 10) + '' !== pathToken || parseInt(pathToken, 10) < 1) {
				return false;
			}
		}

		return true;
	};

	return new ConfigRouter();
});
