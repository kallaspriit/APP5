define(
['jquery', 'EventEmitter', 'Deferred', 'Util', 'Translator', 'config/main'],
function($, EventEmitter, Deferred, util, translator, config) {
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
	 *	> LOAD_ERROR - fired when loading a resource failed
	 *		resource - type of resource
	 *
	 * @class ResourceManager
	 * @extends EventEmitter
	 * @constructor
	 * @module Core
	 */
	var ResourceManager = function() {
		EventEmitter.call(this);

		this._modules = {};
		this._views = {};
		this._loadedCssFiles = {};
	};

	ResourceManager.prototype = Object.create(EventEmitter.prototype);

	/**
	 * Event types.
	 *
	 * @event Event
	 * @param {Object} Event
	 * @param {String} Event.MODULE_LOADED Application module was loaded
	 * @param {String} Event.VIEW_LOADED Application view was loaded
	 * @param {String} Event.LOAD_ERROR Loading a resource failed
	 */
	ResourceManager.prototype.Event = {
		MODULE_LOADED: 'module-loaded',
		VIEW_LOADED: 'view-loaded',
		LOAD_ERROR: 'load-error'
	};

	/**
	 * Event types.
	 *
	 * @event Event
	 * @param {Object} ResourceType
	 * @param {String} ResourceType.FILE RequireJS file
	 * @param {String} ResourceType.MODULE Application module
	 * @param {String} ResourceType.MODULE_TRANSLATIONS Application module translations
	 * @param {String} ResourceType.VIEW Action view
	 * @param {String} ResourceType.CSS Css file
	 * @param {String} ResourceType.REQUEST Http request
	 */
	ResourceManager.prototype.ResourceType = {
		FILE: 'file',
		MODULE: 'module',
		MODULE_TRANSLATIONS: 'module-translations',
		VIEW: 'view',
		CSS: 'css',
		REQUEST: 'request'
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
		var self = this;

		require.onError = function(error) {
			self.emit({
				type: self.Event.LOAD_ERROR,
				resource: self.ResourceType.FILE,
				error: error
			});
		};

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
		var self = this;

		type = type || this.HTTP.GET;
		dataType = dataType || 'json';
		data = data || null;

		if (url.substr(url.length - 5) === '.html') {
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
		}).fail(function(xhr, message, error) {
			if (util.isFunction(callback)) {
				callback(null);
			}

			self.emit({
				type: self.Event.LOAD_ERROR,
				resource: self.ResourceType.REQUEST,
				url: url,
				dataType: type,
				data: data,
				xhr: xhr,
				message: message,
				error: error
			});
		});
	};

	/**
	 * Makes a GET request to given URL.
	 *
	 * Data parameter can be skipped.
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
		var parameters;

		if (util.isFunction(data) && util.isUndefined(dataType)) {
			parameters = [url, this.HTTP.GET, null, data, callback];
		} else {
			parameters = [url, this.HTTP.GET, data, callback, dataType];
		}

		return this.request.apply(this, parameters);
	};

	/**
	 * Makes a POST request to given URL.
	 *
	 * Data parameter can be skipped.
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
		var parameters;

		if (util.isFunction(data) && util.isUndefined(dataType)) {
			parameters = [url, this.HTTP.POST, null, data, callback];
		} else {
			parameters = [url, this.HTTP.POST, data, callback, dataType];
		}

		return this.request.apply(this, parameters);
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
			translationsName = name + '-translations.js',
			moduleFilename = 'modules/' + name + '/' + className,
			translationsFilename = 'modules/' + name + '/' + translationsName;

		if (util.isObject(this._modules[name])) {
			deferred.resolve(this._modules[name]);

			if (util.isFunction(callback)) {
				callback(this._modules[name]);
			}

			return deferred.promise();
		}

		require(
			[moduleFilename, translationsFilename],
			function(module, translations) {
				if (!util.isObject(module)) {
					self.emit({
						type: self.Event.LOAD_ERROR,
						resource: self.ResourceType.MODULE,
						name: name,
						filename: moduleFilename
					});

					throw new Error(
						'Loading module "' + name + '" from "' + moduleFilename + '" failed'
					);
				}

				if (!util.isObject(translations)) {
					self.emit({
						type: self.Event.LOAD_ERROR,
						resource: self.ResourceType.MODULE_TRANSLATIONS,
						name: name,
						filename: translationsFilename
					});

					throw new Error(
						'Loading module "' + name + '" translations from "' + translationsFilename + '" failed'
					);
				}

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
					if (key.substr(key.length - 6) !== 'Action') {
						continue;
					}

					module[key].$module = name;
					module[key].$name = key;
				}

				if (config.debug) {
					window.app.modules[className] = module;
				}

				self.emit({
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
	 * @param {Function} [callback] Callback to call with loaded
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
				self.emit({
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
				self.emit({
					type: self.Event.LOAD_ERROR,
					resource: self.ResourceType.VIEW,
					filename: filename
				});

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

			self.emit({
				type: self.Event.LOAD_ERROR,
				resource: self.ResourceType.CSS,
				filename: filename
			});

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
