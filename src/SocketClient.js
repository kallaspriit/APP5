define(["EventEmitter"],function(e){var t=function(){e.call(this),this.connected=!1,this._host=null,this._port=null,this._ws=null,this._everOpened=!1,this._reconnectInterval=1e3,this._reconnectAttempts=10,this._reconnectAttemptsLeft=null};return t.prototype=Object.create(e.prototype),t.prototype.Event={OPEN_REQUESTED:"open-requested",OPENED:"opened",CLOSED:"closed",ERROR:"error",MESSAGE_RECEIVED:"message-received",MESSAGE_SENT:"message-sent"},t.prototype.State={UNINITIATED:0,OPEN:1,CLOSING:2,CLOSED:3},t.prototype.init=function(){return this},t.prototype.valid=function(){return null!==this._ws&&this._ws.readyState===this.State.OPEN},t.prototype.open=function(e,t){var n=this;this._host=e,this._port=t,this.emit({type:this.Event.OPEN_REQUESTED,config:{host:e,port:t}}),null!==this._ws&&(this._ws.onopen=function(){},this._ws.onclose=function(){},this._ws.onerror=function(){},this._ws.onmessage=function(){},this._ws.close(),this._ws=null),this._ws=new WebSocket("ws://"+this._host+":"+this._port),this._ws.onopen=function(e){n._onOpen(e)},this._ws.onclose=function(e){n._onClose(e)},this._ws.onerror=function(e){n._onError(e)},this._ws.onmessage=function(e){n._onMessage(e)}},t.prototype.send=function(e){if(!this.valid())throw Error("Unable to send socket data, connection not established ("+e+")");"object"==typeof e&&(e=JSON.stringify(e)),this._ws.send(e),this.emit({type:this.Event.MESSAGE_SENT,data:e})},t.prototype.close=function(){this._ws.close()},t.prototype.setReconnectInterval=function(e){this._reconnectInterval=e},t.prototype.setReconnectAttempts=function(e){this._reconnectAttempts=e},t.prototype.wasEverOpened=function(){return this._everOpened},t.prototype._attemptReconnect=function(){if(-1!==this._reconnectAttempts&&(null===this._reconnectAttemptsLeft&&(this._reconnectAttemptsLeft=this._reconnectAttempts),this._reconnectAttemptsLeft--),!(this.valid()||-1!==this._reconnectAttempts&&0>=this._reconnectAttemptsLeft)){var e=this;this.open(this._host,this._port,this._sessionId),window.setTimeout(function(){e._attemptReconnect()},this._reconnectInterval)}},t.prototype._onOpen=function(e){this.connected=!0,this._everOpened=!0,this._reconnectAttemptsLeft=this._reconnectAttempts,this.emit({type:this.Event.OPENED,event:e,client:this})},t.prototype._onClose=function(e){this.connected=!1,this.emit({type:this.Event.CLOSED,event:e,client:this}),this._everOpened&&this._attemptReconnect()},t.prototype._onError=function(e){this.emit({type:this.Event.ERROR,event:e,client:this})},t.prototype._onMessage=function(e){this.emit({type:this.Event.MESSAGE_RECEIVED,event:e,data:e.data,client:this})},t});