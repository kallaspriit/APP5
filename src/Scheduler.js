define(["Deferred","Util","Navi"],function(t,e,n){var r=function(){this._timeouts={},this._intervals={}};return r.prototype.init=function(){var t=this;return n.bind(n.Event.PRE_NAVIGATE,function(){t.clear(null,!1)}),this},r.Timeout=function(n,r,i,o,a,s){var u=this;this._component=n,this._callback=r,this._milliseconds=i,this._persistent=o,this._parameters=a,this._interval=s,this._alive=!0,this._counter=0,this._id=this._interval?window.setInterval(function(){u._counter++,e.isFunction(r)&&r.apply(u,a)},i):window.setTimeout(function(){u._alive=!1,e.isFunction(r)&&r.apply(u,a),u.resolve.apply(u,[u,"fired"])},i),e.extend(this,new t)},r.Timeout.prototype.isAlive=function(){return this._alive},r.Timeout.prototype.isPersistent=function(){return this._persistent},r.Timeout.prototype.isInterval=function(){return this._interval},r.Timeout.prototype.cancel=function(){this._alive&&(this._interval?window.clearInterval(this._id):window.clearTimeout(this._id),this.resolve(this,"cancel"),this._alive=!1)},r.prototype.setTimeout=function(t,n,i,o,a){e.isFunction(t)&&(t="general",n=arguments[0],i=arguments[1],o=arguments[2],a=arguments[3]),o=e.isUndefined(o)?!1:e.bool(o),a=a||[];var s=6===arguments.length&&arguments[5]===!0,u=new r.Timeout(t,n,i,o,a,s);return e.isUndefined(this._timeouts[t])&&(this._timeouts[t]=[]),this._timeouts[t].push(u),this._purge(),u},r.prototype.setInterval=function(t,e,n,r,i){return this.setTimeout(t,e,n,r,i,!0)},r.prototype.clearTimeouts=function(t,n){t=t||null,n=e.isUndefined(n)?!0:e.bool(n);var r,i,o=3===arguments.length&&arguments[2]===!0;for(r in this._timeouts)if(null===t||r===t){for(i=0;this._timeouts[r].length>i;i++)!n&&this._timeouts[r][i].isPersistent()||this._timeouts[r][i].isInterval()!==o||this._timeouts[r][i].cancel(),this._timeouts[r].splice(i,1);0===this._timeouts[r].length&&delete this._timeouts[r]}},r.prototype.clearIntervals=function(t,e){this.clearTimeouts(t,e,!0)},r.prototype.clear=function(t,e){this.clearTimeouts(t,e),this.clearIntervals(t,e)},r.prototype._purge=function(){var t,e;for(t in this._timeouts)for(e=0;this._timeouts[t].length>e;e++)this._timeouts[t][e].isAlive()||this._timeouts[t].splice(e,1)},new r});