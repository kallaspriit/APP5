define(["Bindable"],function(t){var e=function(){this.connected=!1,this._host=null,this._port=null,this._ws=null,this._everOpened=!1,this._reconnectInterval=1e3,this._reconnectAttempts=10,this._reconnectAttemptsLeft=null};return e.prototype=new t,e.prototype.Event={OPEN_REQUESTED:"open-requested",OPENED:"opened",CLOSED:"closed",ERROR:"error",MESSAGE_RECEIVED:"message-received",MESSAGE_SENT:"message-sent"},e.prototype.State={UNINITIATED:0,OPEN:1,CLOSING:2,CLOSED:3},e.prototype.init=function(){return this},e.prototype.valid=function(){return null!==this._ws&&this._ws.readyState===this.State.OPEN},e.prototype.open=function(t,e){var n=this;this._host=t,this._port=e,this.fire({type:this.Event.OPEN_REQUESTED,config:{host:t,port:e}}),null!==this._ws&&(this._ws.onopen=function(){},this._ws.onclose=function(){},this._ws.onerror=function(){},this._ws.onmessage=function(){},this._ws.close(),this._ws=null),this._ws=new WebSocket("ws://"+this._host+":"+this._port),this._ws.onopen=function(t){n._onOpen(t)},this._ws.onclose=function(t){n._onClose(t)},this._ws.onerror=function(t){n._onError(t)},this._ws.onmessage=function(t){n._onMessage(t)}},e.prototype.send=function(t){if(!this.valid())throw Error("Unable to send socket data, connection not established ("+t+")");this._ws.send(t),this.fire({type:this.Event.MESSAGE_SENT,data:t})},e.prototype.close=function(){this._ws.close()},e.prototype.setReconnectInterval=function(t){this._reconnectInterval=t},e.prototype.setReconnectAttempts=function(t){this._reconnectAttempts=t},e.prototype.wasEverOpened=function(){return this._everOpened},e.prototype._attemptReconnect=function(){if(-1!==this._reconnectAttempts&&(null===this._reconnectAttemptsLeft&&(this._reconnectAttemptsLeft=this._reconnectAttempts),this._reconnectAttemptsLeft--),!(this.valid()||-1!==this._reconnectAttempts&&0>=this._reconnectAttemptsLeft)){var t=this;this.open(this._host,this._port,this._sessionId),window.setTimeout(function(){t._attemptReconnect()},this._reconnectInterval)}},e.prototype._onOpen=function(t){this.connected=!0,this._everOpened=!0,this._reconnectAttemptsLeft=this._reconnectAttempts,this.fire({type:this.Event.OPENED,event:t,ws:this})},e.prototype._onClose=function(t){this.connected=!1,this.fire({type:this.Event.CLOSED,event:t,ws:this}),this._everOpened&&this._attemptReconnect()},e.prototype._onError=function(t){this.fire({type:this.Event.ERROR,event:t,ws:this})},e.prototype._onMessage=function(t){this.fire({type:this.Event.MESSAGE_RECEIVED,event:t,data:t.data,ws:this})},e});