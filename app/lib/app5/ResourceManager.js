define(
['jquery', 'config/main', 'core/EventEmitter', 'core/Deferred', 'core/BaseUtil', 'core/Translator'],
function($, config, EventEmitter, Deferred, util, translator) {
	'use strict';

	/**
	 * Manages application resources.
	 *
	 * Can fire the following events:
	 *
	 *	> ACTIVITY_LOADED - fired when a application activity is loaded
	 *		name - name of the activity
	 *		activity - activity object
	 *	> VIEW_LOADED - fired when a application view is loaded
	 *		filename - filename of the view
	 *		content - view content
	 *
	 * @class ResourceManager
	 * @extends EventEmitter
	 * @constructor
	 * @module Core
	 */
	var ResourceManager = function() {
		EventEmitter.call(this);

		this._activities = {};
		this._views = {};
		this._loadedCssFiles = {};
	};

	ResourceManager.prototype = Object.create(EventEmitter.prototype);

	/**
	 * Event types.
	 *
	 * @event Event
	 * @param {Object} Event
	 * @param {String} Event.ACTIVITY_LOADED Application module was loaded
	 * @param {String} Event.VIEW_LOADED Application view was loaded
	 */
	ResourceManager.prototype.Event = {
		ACTIVITY_LOADED: 'activity-loaded',
		VIEW_LOADED: 'view-loaded'
	};

	/**
	 * Event types.
	 *
	 * @event Event
	 * @param {Object} ResourceType
	 * @param {String} ResourceType.FILE RequireJS file
	 * @param {String} ResourceType.MODULE Application module
	 * @param {String} ResourceType.MODULE_TRANSLATIONS Application module translations
	 * @param {String} ResourceType.VIEW Activity view
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
		require.onError = function(error) {
			throw new Error('Loading resource failed (' + error + ')');
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
		}).fail(function(/*xhr, message, error*/) {
			if (util.isFunction(callback)) {
				callback(null);
			}

			throw new Error('Requesting "' + url + '" failed');
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
	 * @param {String} activityName Full name of the module to load
	 * @param {Function} callback Callback to call
	 * @return {jQuery.Deferred} Deferred
	 */
	ResourceManager.prototype.loadActivity = function(moduleName, activityName, callback) {
		var self = this,
			deferred = new Deferred(),
			activityClassName = util.convertEntityName(activityName) + 'Activity',
			translationsName = moduleName + '-translations.js',
			activityFilename = 'modules/' + moduleName + '/' + activityClassName,
			translationsFilename = 'modules/' + moduleName + '/' + translationsName;

		if (util.isObject(this._activities[activityName])) {
			deferred.resolve(this._activities[activityName]);

			if (util.isFunction(callback)) {
				callback(this._activities[activityName]);
			}

			return deferred.promise();
		}

		require(
			[activityFilename, translationsFilename],
			function(activityClass, translations) {
				if (!util.isFunction(activityClass)) {
					throw new Error(
						'Loading activity "' + activityName + '" from "' + activityFilename + '" failed'
					);
				}

				if (!util.isObject(translations)) {
					throw new Error(
						'Loading module "' + activityName + '" translations from "' + translationsFilename + '" failed'
					);
				}

				var classes = {'activity': activityClass},
					activityInstance = new classes.activity(),
					translationKey,
					translationLanguage;

				if (util.isObject(translations)) {
					for (translationKey in translations) {
						for (translationLanguage in translations[translationKey]) {
							translator.addTranslation(
								moduleName + '.' + translationKey,
								translationLanguage, translations[translationKey][translationLanguage]
							);
						}
					}
				}

				activityInstance.$module = moduleName;
				activityInstance.$name = activityName;

				if (config.debug) {
					window.app.activities[activityClassName] = activityInstance;
				}

				self.emit({
					type: self.Event.ACTIVITY_LOADED,
					name: activityName,
					activity: activityInstance
				});

				self._activities[activityName] = activityInstance;

				deferred.resolve(activityInstance);

				if (util.isFunction(callback)) {
					callback(activityInstance);
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
				throw new Error('Loading view from ' + filename + ' failed');
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

			throw new Error('Loading css "' + filename + '" failed');
		}, 10000);

		head.appendChild(link);

		return deferred.promise();
	};

	return new ResourceManager();
});
