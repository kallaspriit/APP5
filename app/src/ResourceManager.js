define(
['Bindable', 'Util', 'jquery'],
function (Bindable, util, $) {
	'use strict';

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
	 * @module Core
	 */
	var ResourceManager = function () {
		this._modules = {};
		this._views = {};
	};

	ResourceManager.prototype = new Bindable();

	/**
	 * Event types.
	 *
	 * @event
	 * @param {Object} Event
	 * @param {String} Event.MODULE_LOADED Application module was loaded
	 */
	ResourceManager.prototype.Event = {
		MODULE_LOADED: 'module-loaded'
	};

	/**
	 * HTTP request types.
	 *
	 * @property
	 * @param {Object} HTTP
	 * @param {String} HTTP.GET Get http request type
	 * @param {String} HTTP.POST Post http request type
	 */
	ResourceManager.prototype.HTTP = {
		GET: 'GET',
		POST: 'POST'
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

	/**
	 * Makes an AJAX POST request to given URL.
	 *
	 * If the url ends with ".html", HTML data is expected, otherwise JSON.
	 *
	 * @method request
	 * @param {String} url URL of the data
	 * @param {String} type Request type, one of ResourceManager.HTTP constants
	 * @param {Object} [data] Optional POST data to send
	 * @param {Function} [callback] Optional callback to call
	 * @param {String} [dataType] Response data type, defaults to JSON
	 * @return {jQuery.Deferred} jQuery deferred
	 */
	ResourceManager.prototype.request = function(
		url,
		type,
		data,
		callback,
		dataType
	) {
		type = type || this.HTTP.GET;
		dataType = dataType || 'json';
		data = data || null;

		if (url.substr(-5) === '.html') {
			dataType = 'html';
		}

		return $.ajax({
			url: url,
			dataType: dataType,
			type: type,
			data: data,
			/*xhrFields: {
				withCredentials: true
			},*/
			cache: false
		}).success(function(data) {
			if (util.typeOf(callback) === 'function') {
				callback(data);
			}
		}).fail(function() {
			if (util.typeOf(callback) === 'function') {
				callback(null);
			}
		});
	};

	/**
	 * Makes a GET request to given URL.
	 *
	 * @method get
	 * @param {String} url URL of the data
	 * @param {Object} [data] Optional POST data to send
	 * @param {Function} [callback] Optional callback to call
	 * @param {String} [dataType] Response data type, defaults to JSON
	 * @return {jQuery.Deferred} jQuery deferred
	 */
	ResourceManager.prototype.get = function(
		url,
		data,
		callback,
		dataType
	) {
		return this.request(url, this.HTTP.GET, data, callback, dataType);
	};

	/**
	 * Makes a POST request to given URL.
	 *
	 * @method post
	 * @param {String} url URL of the data
	 * @param {Object} [data] Optional POST data to send
	 * @param {Function} [callback] Optional callback to call
	 * @param {String} [dataType] Response data type, defaults to JSON
	 * @return {jQuery.Deferred} jQuery deferred
	 */
	ResourceManager.prototype.get = function(
		url,
		data,
		callback,
		dataType
	) {
		return this.request(url, this.HTTP.POST, data, callback, dataType);
	};

	/**
	 * Loads a module.
	 *
	 * @method loadModule
	 * @param {String} name Full name of the module to load
	 * @param {Function} callback Callback to call
	 * @return {ResourceManager} Self
	 */
	ResourceManager.prototype.loadModule = function (name, callback) {
		var self = this,
			className = util.convertEntityName(name) + 'Module';

		if (util.typeOf(this._modules[name]) === 'function') {
			return this._modules[name];
		}

		require(['modules/' + name + '/' + className], function(module) {
			if (util.typeOf(module) !== 'object') {
				throw new Error('Invalid module "' + name + '" requested');
			}

			if (util.typeOf(callback) === 'function') {
				self._modules[name] = module;

				callback(module);
			}
		});

		return this;
	};

	/**
	 * Loads a module view.
	 *
	 * @method loadView
	 * @param {String} module Name of the module
	 * @param {String} action Name of the module action
	 * @param {Function} callback Callback to call with loaded
	 */
	ResourceManager.prototype.loadView = function (module, action, callback) {
		var filename = 'modules/' + module + '/views/' + module + '-' + action + '.html';

		this.get(filename)
			.success(function(html) {
				if (util.typeOf(callback) === 'function') {
					callback(html);
				}
			}).error(function() {
				throw new Error('Loading view ' + module + '::' + action + ' from ' + filename + ' failed');
			});
	};

	return new ResourceManager();
});