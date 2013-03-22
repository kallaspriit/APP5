define(
['Bindable'],
function(Bindable) {
	'use strict';

	/**
	 * Socket client implementation.
	 *
	 * Can fire the following events:
	 *
	 *	> OPEN_REQUESTED - Triggered when connection is requested
	 *		config - socket config
	 *	> OPENED - Triggered when connection is opened
	 *		event - web socket event
	 *	> CLOSED - Triggered when connection is closed
	 *		event - web socket event
	 *	> ERROR - Triggered when an error occurs
	 *		event - web socket event
	 *	> MESSAGE_RECEIVED - Triggered when a message is received
	 *		event - web socket event
	 *		data - the received data
	 *	> MESSAGE_SENT - Triggered when a message is sent out
	 *		data - the sent data
	 *
	 * @class SocketClient
	 * @extends Bindable
	 * @constructor
	 * @module Core
	 */
	var SocketClient = function() {
		this.connected = false;
		this._host = null;
		this._port = null;
		this._ws = null;
		this._everOpened = false;
		this._reconnectInterval = 1000;
		this._reconnectAttempts = 10;
		this._reconnectAttemptsLeft = null;
	};

	SocketClient.prototype = new Bindable();

	/**
	 * Event types.
	 *
	 * @event
	 * @param {Object} Event
	 * @param {String} Event.OPEN_REQUESTED Triggered when connection is requested
	 * @param {String} Event.OPENED Triggered when connection is opened
	 * @param {String} Event.CLOSED Triggered when connection is closed
	 * @param {String} Event.ERROR Triggered when an error occurs
	 * @param {String} Event.MESSAGE_RECEIVED Triggered when a message is received
	 * @param {String} Event.MESSAGE_SENT Triggered when a message is sent out
	 */
	SocketClient.prototype.Event = {
		OPEN_REQUESTED: 'open-requested',
		OPENED: 'opened',
		CLOSED: 'closed',
		ERROR: 'error',
		MESSAGE_RECEIVED: 'message-received',
		MESSAGE_SENT: 'message-sent'
	};

	/**
	 * Event types.
	 *
	 * @event
	 * @param {Object} State
	 * @param {String} Event.UNINITIATED Connection has not been established
	 * @param {String} Event.OPEN Connection is ready for communication
	 * @param {String} Event.CLOSING Connection is going through the closing handshake.
	 * @param {String} Event.CLOSED Connection has been closed or could not be opened
	 */
	SocketClient.prototype.State = {
		UNINITIATED: 0,
		OPEN: 1,
		CLOSING: 2,
		CLOSED: 3
	};

	/**
	 * Initiates the component.
	 *
	 * @method init
	 * @return {SocketClient} Self
	 */
	SocketClient.prototype.init = function() {
		return this;
	};

	/**
	 * Initiates the component.
	 *
	 * @method init
	 * @return {SocketClient} Self
	 */
	SocketClient.prototype.valid = function() {
		return this._ws !== null && this._ws.readyState === this.State.OPEN;
	};

	/**
	 * Initiates the component.
	 *
	 * @method open
	 * @param {String} host Host of the socket server
	 * @param {Number} port Server port number
	 */
	SocketClient.prototype.open = function(host, port) {
		var self = this;

		this._host = host;
		this._port = port;

		this.fire({
			type: this.Event.OPEN_REQUESTED,
			config: {
				host: host,
				port: port
			}
		});

		if (this._ws !== null) {
			this._ws.onopen = function() {};
			this._ws.onclose = function() {};
			this._ws.onerror = function() {};
			this._ws.onmessage = function() {};
			this._ws.close();
			this._ws = null;
		}

		this._ws = new WebSocket('ws://' + this._host + ':' + this._port);

		this._ws.onopen = function(event) {
			self._onOpen(event);
		};

		this._ws.onclose = function(event) {
			self._onClose(event);
		};

		this._ws.onerror = function(event) {
			self._onError(event);
		};

		this._ws.onmessage = function(event) {
			self._onMessage(event);
		};
	};

	/**
	 * Sends a message
	 *
	 * @method send
	 * @param {String} message Message to send
	 */
	SocketClient.prototype.send = function(message) {
		if (!this.valid()) {
			throw new Error('Unable to send socket data, connection not established (' + message + ')');
		}

		this._ws.send(message);

		this.fire({
			type: this.Event.MESSAGE_SENT,
			data: message
		});
	};

	/**
	 * Closes the connection.
	 *
	 * @method close
	 */
	SocketClient.prototype.close = function() {
		this._ws.close();
	};

	/**
	 * Sets the reconnecting interval to use (milliseconds).
	 *
	 * @method setReconnectInterval
	 * @param {Number} interval Interval to use in milliseconds
	 */
	SocketClient.prototype.setReconnectInterval = function(interval) {
		this._reconnectInterval = interval;
	};

	/**
	 * Sets the number of reconnection attempts.
	 *
	 * @method setReconnectAttempts
	 * @param {Number} attempts Max number of attempts
	 */
	SocketClient.prototype.setReconnectAttempts = function(attempts) {
		this._reconnectAttempts = attempts;
	};

	/**
	 * Returns whether the connection has been opened before.
	 *
	 * @method wasEverOpened
	 * @return {Boolean}
	 */
	SocketClient.prototype.wasEverOpened = function() {
		return this._everOpened;
	};

	/**
	 * Attempts to reconnect to the socket server.
	 *
	 * @method _attemptReconnect
	 * @private
	 */
	SocketClient.prototype._attemptReconnect = function() {
		if (this._reconnectAttempts !== -1) {
			if (this._reconnectAttemptsLeft === null) {
				this._reconnectAttemptsLeft = this._reconnectAttempts;
			}

			this._reconnectAttemptsLeft--;
		}

		if (this.valid() || (this._reconnectAttempts !== -1 && this._reconnectAttemptsLeft <= 0)) {
			return;
		}

		var self = this;

		this.open(this._host, this._port, this._sessionId);

		window.setTimeout(function() {
			self._attemptReconnect();
		}, this._reconnectInterval);
	};

	/**
	 * Called when socket connection is opened.
	 *
	 * @method _onOpen
	 * @param {Object} event Event information
	 * @private
	 */
	SocketClient.prototype._onOpen = function(event) {
		this.connected = true;
		this._everOpened = true;
		this._reconnectAttemptsLeft = this._reconnectAttempts;

		this.fire({
			type: this.Event.OPENED,
			event: event,
			ws: this
		});
	};

	/**
	 * Called when socket connection is closed.
	 *
	 * @method _onClose
	 * @param {Object} event Event information
	 * @private
	 */
	SocketClient.prototype._onClose = function(event) {
		this.connected = false;

		this.fire({
			type: this.Event.CLOSED,
			event: event,
			ws: this
		});

		if (this._everOpened) {
			this._attemptReconnect();
		}
	};

	/**
	 * Called when a socket error occurs.
	 *
	 * @method _onError
	 * @param {Object} event Event information
	 * @private
	 */
	SocketClient.prototype._onError = function(event) {
		this.fire({
			type: this.Event.ERROR,
			event: event,
			ws: this
		});
	};

	/**
	 * Called when a socket message is received.
	 *
	 * @method _onMessage
	 * @param {Object} event Event information
	 * @private
	 */
	SocketClient.prototype._onMessage = function(event) {
		this.fire({
			type: this.Event.MESSAGE_RECEIVED,
			event: event,
			data: event.data,
			ws: this
		});
	};

	return SocketClient;
});