define(
['SocketClient', 'Util', 'Navi', 'Debug'],
function(SocketClient, util, navi, dbg) {
	'use strict';

	/**
	 * Test server client.
	 *
	 * @class TestClient
	 * @extends Bindable
	 * @constructor
	 * @module Core
	 */
	var TestClient = function() {
		this._ws = new SocketClient();
		this._requests = 0;
		this._responseCallbacks = {};
		this._id = null;
		this._isMaster = false;
	};

	/**
	 * Initiates the component.
	 *
	 * @method init
	 * @return {TestClient} Self
	 */
	TestClient.prototype.init = function() {
		var self = this;

		this._ws.bind(this._ws.Event.OPEN_REQUESTED, function(e) {
			dbg.log('! Requesting test client connection', e.config);
		});

		this._ws.bind(this._ws.Event.OPENED, function() {
			dbg.log('+ Test client connection opened');

			self._registerListeners();
		});

		this._ws.bind(this._ws.Event.CLOSED, function() {
			dbg.log('- Test client connection closed');
		});

		this._ws.bind(this._ws.Event.MESSAGE_RECEIVED, function(e) {
			self._onMessageReceived(e.data);
		});

		return this;
	};

	/**
	 * Attempts opening the connection.
	 *
	 * @method open
	 * @param {String} host Server host
	 * @param {String} port Server port
	 */
	TestClient.prototype.open = function(host, port) {
		this._ws.setReconnectAttempts(0);
		this._ws.open(
			host,
			port
		);
	};

	/**
	 * Requests to become the master agent.
	 *
	 * @method becomeMaster
	 */
	TestClient.prototype.becomeMaster = function() {
		var self = this;

		this.request('becomeMaster');
	};

	/**
	 * Makes a request to the server.
	 *
	 * @method request
	 * @param {String} handler The server-side handler
	 * @param {Object} [parameters] Request parameters
	 * @param {Object} [callback] Response callback
	 */
	TestClient.prototype.request = function(handler, parameters, callback) {
		parameters = parameters || {};

		var id = this._requests++,
			request = {
				id: id,
				handler: handler,
				parameters: parameters,
				expectResponse: util.isFunction(callback)
			};

		if (util.isFunction(callback)) {
			this._responseCallbacks[id] = callback;
		}

		this._ws.send(JSON.stringify(request));
	};

	/**
	 * Registers various event listeners.
	 *
	 * @method _registerListeners
	 * @private
	 */
	TestClient.prototype._registerListeners = function() {
		var self = this;

		navi.bind(navi.Event.PRE_NAVIGATE, function(e) {
			if (!self._isMaster) return;

			self.request(
				'navigate',
				{
					action: e.action,
					module: e.module,
					parameters: e.parameters
				}
			);
		});
	};

	/**
	 * Called when a server message is received.
	 *
	 * @method _onMessageReceived
	 * @param {String} messaage Message
	 * @private
	 */
	TestClient.prototype._onMessageReceived = function(messaage) {
		if (messaage.substr(0, 1) !== '{') {
			console.log('Unknown test client message', messaage);

			return;
		}

		var data = JSON.parse(messaage);

		switch (data.type) {
			case 'setup':
				this._handleSetup(data);
				break;

			case 'request':
				this._handleRequest(data);
			break;

			case 'response':
				this._handleResponse(data);
			break;
		}
	};

	/**
	 * Handles setup data.
	 *
	 * @method _handleRequest
	 * @param {Object} request Server request
	 * @private
	 */
	TestClient.prototype._handleSetup = function(setup) {
		dbg.log('! Test client setup received', setup);

		this._id = setup.id;
		this._isMasterId = setup.masterId;
		this._isMaster = setup.masterId == this._id;
	};

	/**
	 * Handles server request.
	 *
	 * @method _handleRequest
	 * @param {Object} request Server request
	 * @private
	 */
	TestClient.prototype._handleRequest = function(request) {
		dbg.log('< Test client request', request);

		switch (request.action) {
			case 'navigate':
				this._handleNavigateRequest(request.parameters);
			break;

			default:
				throw new Error('Unsupported request action: ' + request.action);
		}
	};

	/**
	 * Handles navigation request.
	 *
	 * @method _handleNavigateRequest
	 * @param {Object} parameters Request parameters
	 * @private
	 */
	TestClient.prototype._handleNavigateRequest = function(parameters) {
		navi.open(
			parameters.module,
			parameters.action,
			parameters.parameters
		);
	};

	/**
	 * Handles server response.
	 *
	 * @method _handleResponse
	 * @param {Object} response Server response
	 * @private
	 */
	TestClient.prototype._handleResponse = function(response) {
		if (util.isFunction(this._responseCallbacks[response.requestId])) {
			this._responseCallbacks[response.requestId].call(
				this._responseCallbacks[response.requestId],
				response.data
			);
		}
	};

	return new TestClient();
});