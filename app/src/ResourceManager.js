define(
['jquery', 'Bindable', 'Util'],
function($, Bindable, util) {
	'use strict';

	/**
	 * Manages application resources.
	 *
	 * Can fire the following events:
	 *
	 *	> MODULE_LOADED - fired when a application module is loaded
	 *		name - name of the module
	 *		module - module object
	 *	> VIEW_LOADED - fired when a application view is loaded
	 *		filename - filename of the view
	 *		content - view content
	 *
	 * @class ResourceManager
	 * @extends Bindable
	 * @constructor
	 * @module Core
	 */
	var ResourceManager = function() {
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
	 * @param {String} Event.VIEW_LOADED Application view was loaded
	 */
	ResourceManager.prototype.Event = {
		MODULE_LOADED: 'module-loaded',
		VIEW_LOADED: 'view-loaded'
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
	ResourceManager.prototype.init = function() {
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
			if (util.isFunction(callback)) {
				callback(data);
			}
		}).fail(function() {
			if (util.isFunction(callback)) {
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
	ResourceManager.prototype.post = function(
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
	ResourceManager.prototype.loadModule = function(name, callback) {
		var self = this,
			className = util.convertEntityName(name) + 'Module';

		if (util.isObject(this._modules[name])) {
			if (util.isFunction(callback)) {
				callback(this._modules[name]);
			}

			return this;
		}

		require(['modules/' + name + '/' + className], function(module) {
			module.$name = name;

			for (var key in module) {
				if (key.substr(-6) !== 'Action') {
					continue;
				}

				module[key].$module = name;
				module[key].$name = key;
			}

			self.fire({
				type: self.Event.MODULE_LOADED,
				name: name,
				module: module
			});

			if (!util.isObject(module)) {
				throw new Error('Invalid module "' + name + '" requested');
			}

			self._modules[name] = module;

			if (util.isFunction(callback)) {
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
	 * @return {jQuery.Deferred} jQuery deferred
	 */
	ResourceManager.prototype.loadView = function(module, action, callback) {
		var self = this,
			filename = 'modules/' + module + '/views/' + module + '-' + action + '.html';

		if (util.isString(this._views[filename])) {
			if (util.isFunction(callback)) {
				callback(this._views[filename]);
			}

			var deferred = $.Deferred();

			deferred.resolve();

			return deferred;
		}

		return this.get(filename)
			.success(function(html) {
				self.fire({
					type: self.Event.VIEW_LOADED,
					filename: filename,
					content: html
				});

				self._views[filename] = html;

				if (util.isFunction(callback)) {
					callback(html);
				}
			}).error(function() {
				throw new Error('Loading view ' + module + '::' + action + ' from ' + filename + ' failed');
			});
	};

	/**
	 * Loads a css file.
	 *
	 * @method loadCss
	 * @param {String} filename File to load
	 * @param {Function} [loadedCallback] Optional callback to call when CSS is loaded
	 * @return {jQuery.Deferred} jQuery deferred
	 */
	ResourceManager.prototype.loadCss = function(filename, loadedCallback) {
		var id = 'css-' + util.uid(),
			deferred = $.Deferred();

		$('<link>')
			.attr({
				id: id,
				rel: 'stylesheet',
				type: 'text/css',
				href: filename
			}).appendTo('head');

		$('#' + id).load(function() {
			deferred.resolve();

			if (util.isFunction(loadedCallback)) {
				loadedCallback.call(loadedCallback);
			}
		});

		return deferred;
	};

	return new ResourceManager();
});