define(["underscore","Bindable","Deferred","App","Debug","Util","UI","ResourceManager","Keyboard","Mouse","config/main"],function(t,e,n,r,i,o,a,s,u,c,l){var f=function(){this.backPossible=!1,this._stack=[],this._naviCounter=0,this._partialRendering=!1};return f.prototype=new e,f.prototype.Event={PRE_NAVIGATE:"pre-navigate",POST_NAVIGATE:"post-navigate",PRE_PARTIAL:"pre-partial",POST_PARTIAL:"post-partial",STACK_CHANGED:"stack-changed",SLEEP:"sleep",WAKEUP:"wakeup",EXIT:"exit"},f.prototype.init=function(){var t=this;return u.bind([u.Event.KEYDOWN,u.Event.KEYUP],function(e){t._onKeyEvent(e.info)}),c.bind([c.Event.MOUSEDOWN,c.Event.MOUSEUP,c.Event.MOUSEMOVE],function(e){t._onMouseEvent(e.info)}),this.bind(this.Event.STACK_CHANGED,function(){t.backPossible=t.isBackPossible()}),this},f.prototype.open=function(e,n,o){if(a.isTransitioning())return i.log("! Already transitioning"),void 0;var s={module:e,action:n};t.isEmpty(o)||(s.parameters=o),r.location.search(s),r.validate()},f.prototype._open=function(t,e,u){if(e=e||"index",u=u||[],a.isTransitioning())return i.log("! Already transitioning"),void 0;var c=this,l=new n,f=o.convertEntityName(t)+"Module",h=o.convertCallableName(e)+"Action",p="modules/"+t+"/style/"+t+"-module.css",d="modules/"+t+"/views/"+t+"-"+e+".html",m=null;return this.fire({type:this.Event.PRE_NAVIGATE,module:t,action:e,parameters:u}),o.when(s.loadModule(t),s.loadView(d),s.loadCss(p)).done(function(n,i){m=a.showView(t,e,f,h,u,n,i,function(){c.fire({type:c.Event.POST_NAVIGATE,module:t,action:e,parameters:u}),l.resolve(m),r.validate()})}).fail(function(){throw Error('Loading module "'+t+'" resources failed')}),l.promise()},f.prototype.partial=function(t,e,i,u,c){i=i||"index",u=u||[],c=o.isBoolean(c)?c:!1,this._partialRendering=!0;var l=this,f=new n,h=o.convertEntityName(e)+"Module",p=o.convertCallableName(i)+"Action",d="modules/"+e+"/style/"+e+"-module.css",m="modules/"+e+"/views/"+e+"-"+i+".html",g=null;return this.fire({type:this.Event.PRE_PARTIAL,containerSelector:t,module:e,action:i,parameters:u}),o.when(s.loadModule(e),s.loadView(m),s.loadCss(d)).done(function(n,o){g=a.showPartial(e,i,h,p,u,n,o,t,c),l.fire({type:l.Event.POST_PARTIAL,containerSelector:t,module:e,action:i,parameters:u}),f.resolve(g),r.validate(),l._partialRendering=!1}).fail(function(){throw Error('Loading module "'+e+'" resources failed')}),f.promise()},f.prototype.back=function(){var t=this.getCurrent(),e=this.getPrevious();null!==t&&null!==e&&this.open(l.index.module,l.index.action,l.index.parameters)},f.prototype.getCurrent=function(){return 0===this._stack.length?null:this._stack[this._stack.length-1]},f.prototype.getPrevious=function(){return 2>this._stack.length?null:this._stack[this._stack.length-2]},f.prototype.isBackPossible=function(){return this._stack.length>=2},f.prototype.clearHistory=function(){this._stack=[],this.fire({type:this.Event.STACK_CHANGED,stack:this._stack})},f.prototype.getExistingItem=function(t,e){var n,r;for(n=0;this._stack.length>n;n++)if(r=this._stack[n],r.module===t&&r.action===e)return r;return null},f.prototype.getStack=function(){return this._stack},f.prototype._popLastAction=function(t){if(t=t||1,this._stack.length>=2){for(var e=0;t>e;e++)this._removeCurrentAction();var n=this._stack.pop();return this.fire({type:this.Event.STACK_CHANGED,stack:this._stack}),n}return null},f.prototype._removeCurrentAction=function(){this._stack.length>=1&&this._stack.pop(),this.fire({type:this.Event.STACK_CHANGED,stack:this._stack})},f.prototype.appendNavigation=function(t,e,n,r){return this._stack.push({id:this._naviCounter++,module:t,action:e,parameters:n,instance:r,level:this._stack.length,container:null,fire:function(){}}),this.fire({type:this.Event.STACK_CHANGED,stack:this._stack}),this._stack[this._stack.length-1]},f.prototype._onKeyEvent=function(t){var e=this.getCurrent();null!==e&&o.isFunction(e.fire)&&e.fire(t.type,t)},f.prototype._onMouseEvent=function(t){var e=this.getCurrent();null!==e&&o.isFunction(e.fire)&&e.fire(t.type,t)},new f});