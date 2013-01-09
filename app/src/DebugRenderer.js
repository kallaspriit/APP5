define(
['jquery', 'Debug', 'ResourceManager', 'Util', 'moment'],
function ($, dbg, resourceManager, util, moment) {
	'use strict';

	/**
	 * Default renderer for the debugging information.
	 *
	 * @class DebugRenderer
	 * @constructor
	 * @module Core
	 */
	var DebugRenderer = function() {

	};

	/**
	 * Starts listening for the debug events.
	 *
	 * @method init
	 * @return {DebugRenderer} Self
	 */
	DebugRenderer.prototype.init = function() {
		this._initCss();
		this._initHtml();

		var self = this;

		dbg.bind(dbg.Event.CONSOLE, function(e) {
			var time = util.date(),
				source = util.formatPath(e.source.filename) + ':' + e.source.line,
				args = [moment(time).format('hh:mm:ss'), source],
				i;

			for (i = 0; i < e.args.length; i++) {
				args.push(e.args[i]);
			}

			console.log.apply(console, args);
		});

		dbg.bind(dbg.Event.LOG, function(e) {
			var type = 'info',
				message = e.args[0],
				id = message.substr(0, 2),
				content = self._formatContent(e.args);

			if (id === '+ ') {
				type = 'success';
			} else if (id === '- ') {
				type = 'error';
			}

			self._appendMessage(type, content, e.source);
		});

		return this;
	};

	/**
	 * Loads renderer css.
	 *
	 * @method _initCss
	 * @private
	 */
	DebugRenderer.prototype._initCss = function() {
		resourceManager.loadCss('style/debug-renderer.css');
	};

	/**
	 * Generates required HTML.
	 *
	 * @method _initHtml
	 * @private
	 */
	DebugRenderer.prototype._initHtml = function() {
		$(document.body).append('<div id="debug-renderer"></div>');
	};

	/**
	 * Appends a new log message.
	 *
	 * @method _appendMessage
	 * @param {String} type Type of the message
	 * @param {String} message Message content
	 * @param {Object} source Message source
	 * @private
	 */
	DebugRenderer.prototype._appendMessage = function(type, message, source) {
		var wrap = $('#debug-renderer'),
			sourceContent = util.formatPath(source.filename) + ':' + source.line;

		wrap.append('<div class="' + type + '">' + message + '<span>' + sourceContent + '</span></div> ');
	};

	/**
	 * Formats message content.
	 *
	 * @method _formatContent
	 * @param {Array} properties Properties to format
	 * @return {String}
	 * @private
	 */
	DebugRenderer.prototype._formatContent = function(properties) {
		var content = '',
			token;

		for (var i = 0; i < properties.length; i++) {
			token = properties[i];

			if (i === 0 && util.typeOf(token) === 'string' && /[-+!] /.test(token)) {
				token = token.substr(2);
			}

			if (content.length > 0) {
				content += ', ';
			}

			content += util.str(token);
		}

		return content.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");;
	};

	return new DebugRenderer();
});