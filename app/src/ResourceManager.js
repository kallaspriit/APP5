define(
['jquery', 'Bindable', 'Deferred', 'Util', 'Translator', 'config/main'],
function($, Bindable, Deferred, util, translator, config) {
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
		this._loadedCssFiles = {};
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
	 * @return {jQuery.Deferred} Deferred
	 */
	ResourceManager.prototype.loadModule = function(name, callback) {
		var self = this,
			deferred = new Deferred(),
			className = util.convertEntityName(name) + 'Module',
			translationsName = name + '-translations.js';

		if (util.isObject(this._modules[name])) {
			deferred.resolve(this._modules[name]);

			if (util.isFunction(callback)) {
				callback(this._modules[name]);
			}

			return deferred.promise();
		}

		require(
			['modules/' + name + '/' + className, 'modules/' + name + '/' + translationsName],
			function(module, translations) {
				var translationKey,
					translationLanguage;

				if (util.isObject(translations)) {
					for (translationKey in translations) {
						for (translationLanguage in translations[translationKey]) {
							translator.addTranslation(
								name + '.' + translationKey,
								translationLanguage, translations[translationKey][translationLanguage]
							);
						}
					}
				}

				module.$name = name;

				for (var key in module) {
					if (key.substr(-6) !== 'Action') {
						continue;
					}

					module[key].$module = name;
					module[key].$name = key;
				}

				if (config.debug) {
					window.app.modules[className] = module;
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

				deferred.resolve(module);

				if (util.isFunction(callback)) {
					callback(module);
				}
			}
		);

		return deferred.promise();
	};

	/**
	 * Loads a module view.
	 *
	 * @method loadView
	 * @param {String} filename Filename of the view
	 * @param {Function} callback Callback to call with loaded
	 * @return {jQuery.Deferred} jQuery deferred
	 */
	ResourceManager.prototype.loadView = function(filename, callback) {
		var self = this,
			deferred = new Deferred();

		if (util.isString(this._views[filename])) {
			if (util.isFunction(callback)) {
				callback(this._views[filename]);
			}

			deferred.resolve(this._views[filename]);

			return deferred.promise();
		}

		this.get(filename)
			.success(function(html) {
				self.fire({
					type: self.Event.VIEW_LOADED,
					filename: filename,
					content: html
				});

				self._views[filename] = html;

				deferred.resolve(html);

				if (util.isFunction(callback)) {
					callback(html);
				}
			}).error(function() {
				deferred.reject('Loading view from ' + filename + ' failed');
			});

		return deferred.promise();
	};

	/**
	 * Loads a css file.
	 *
	 * This only works in modern chrome..
	 *
	 * @method loadCss
	 * @param {String} filename File to load
	 * @param {Function} [loadedCallback] Optional callback to call when CSS is loaded
	 * @return {jQuery.Deferred} jQuery deferred
	 *
	ResourceManager.prototype.loadCss = function(filename, loadedCallback) {
		var id = 'css-' + util.uid(),
			deferred = new Deferred();

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
	};*/

	/**
	 * Loads a css file.
	 *
	 * @method loadCss
	 * @param {String} filename File to load
	 * @param {Function} [loadedCallback] Optional callback to call when CSS is loaded
	 * @return {jQuery.Deferred} jQuery deferred
	 */
	ResourceManager.prototype.loadCss = function(filename, loadedCallback) {
		var self = this,
			deferred = new Deferred();

		if (!util.isUndefined(this._loadedCssFiles[filename])) {
			deferred.resolve(this._loadedCssFiles[filename]);

			return deferred.promise();
		}

		var	head = document.getElementsByTagName('head')[0],
			link = document.createElement('link'),
			sheet,
			cssRules,
			checkInterval,
			failTimeout;

		link.setAttribute('href', filename);
		link.setAttribute('rel', 'stylesheet');
		link.setAttribute('type', 'text/css');

		if ('sheet' in link) {
			sheet = 'sheet';
			cssRules = 'cssRules';
		} else {
			sheet = 'styleSheet';
			cssRules = 'rules';
		}

		checkInterval = setInterval(function () {
			try {
				if (link[sheet] && link[sheet][cssRules].length) {
					clearInterval(checkInterval);
					clearTimeout(failTimeout);

					self._loadedCssFiles[filename] = link;

					deferred.resolve(link);

					if (util.isFunction(loadedCallback)) {
						loadedCallback.call(loadedCallback, true, link);
					}
				}
			} catch (e) {}
		}, 10);

		failTimeout = setTimeout(function () {
			clearInterval(checkInterval);
			clearTimeout(failTimeout);

			head.removeChild(link);

			deferred.reject('Loading css "' + filename + '" failed');

			if (util.isFunction(loadedCallback)) {
				loadedCallback.call(loadedCallback, false, link);
			}
		}, 10000);

		head.appendChild(link);

		return deferred.promise();
	};

	return new ResourceManager();
});