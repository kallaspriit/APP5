define([],function(){var t=function(){this._listeners={}};return t.prototype.bind=function(t,e){"string"==typeof t&&(t=[t]);for(var n=0;t.length>n;n++){this._listeners[t[n]]===void 0&&(this._listeners[t[n]]=[]);for(var r=0;this._listeners[t[n]].length>r;r++)if(this._listeners[t[n]][r]===e)return e;this._listeners[t[n]].push(e)}return this._onBind(t,e),e},t.prototype._onBind=function(){},t.prototype.unbind=function(t,e){if(this._listeners[t]===void 0)return!1;for(var n=0;this._listeners[t].length>n;n++)if(this._listeners[t][n]===e)return this._listeners[t].splice(n,1),!0;return!1},t.prototype.fire=function(t){if("string"==typeof t&&(t={type:t}),t.target===void 0&&(t.target=this),t.type===void 0)throw'Event "type" attribute is missing';var e=!0;if("object"==typeof this._listeners[t.type])for(var n=0;this._listeners[t.type].length>n;n++)this._listeners[t.type][n].call(this,t)===!1&&(e=!1);return e},t.prototype.numListeners=function(t){return this._listeners[t]===void 0?0:this._listeners[t].length},t.prototype.clearListeners=function(t){t===void 0?this._listeners={}:this._listeners[t]=[]},t.prototype.getListeners=function(t){return"string"==typeof t?this._listeners[t]!==void 0?this._listeners[t]:null:this._listeners},t});