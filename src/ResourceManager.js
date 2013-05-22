define(["jquery","Bindable","Deferred","Util","Translator","config/main"],function(e,t,n,r,i,o){var a=function(){this._modules={},this._views={},this._loadedCssFiles={}};return a.prototype=new t,a.prototype.Event={MODULE_LOADED:"module-loaded",VIEW_LOADED:"view-loaded",LOAD_ERROR:"load-error"},a.prototype.ResourceType={FILE:"file",MODULE:"module",MODULE_TRANSLATIONS:"module-translations",VIEW:"view",CSS:"css",REQUEST:"request"},a.prototype.HTTP={GET:"GET",POST:"POST"},a.prototype.init=function(){var e=this;return require.onError=function(t){e.fire({type:e.Event.LOAD_ERROR,resource:e.ResourceType.FILE,error:t})},this},a.prototype.request=function(t,n,i,o,a){var s=this;return n=n||this.HTTP.GET,a=a||"json",i=i||null,".html"===t.substr(t.length-5)&&(a="html"),e.ajax({url:t,dataType:a,type:n,data:i,cache:!1}).success(function(e){r.isFunction(o)&&o(e)}).fail(function(e,a,u){r.isFunction(o)&&o(null),s.fire({type:s.Event.LOAD_ERROR,resource:s.ResourceType.REQUEST,url:t,dataType:n,data:i,xhr:e,message:a,error:u})})},a.prototype.get=function(e,t,n,i){var o;return o=r.isFunction(t)&&r.isUndefined(i)?[e,this.HTTP.GET,null,t,n]:[e,this.HTTP.GET,t,n,i],this.request.apply(this,o)},a.prototype.post=function(e,t,n,i){var o;return o=r.isFunction(t)&&r.isUndefined(i)?[e,this.HTTP.POST,null,t,n]:[e,this.HTTP.POST,t,n,i],this.request.apply(this,o)},a.prototype.loadModule=function(e,t){var a=this,s=new n,u=r.convertEntityName(e)+"Module",l=e+"-translations.js",c="modules/"+e+"/"+u,f="modules/"+e+"/"+l;return r.isObject(this._modules[e])?(s.resolve(this._modules[e]),r.isFunction(t)&&t(this._modules[e]),s.promise()):(require([c,f],function(n,l){if(!r.isObject(n))throw a.fire({type:a.Event.LOAD_ERROR,resource:a.ResourceType.MODULE,name:e,filename:c}),Error('Loading module "'+e+'" from "'+c+'" failed');if(!r.isObject(l))throw a.fire({type:a.Event.LOAD_ERROR,resource:a.ResourceType.MODULE_TRANSLATIONS,name:e,filename:f}),Error('Loading module "'+e+'" translations from "'+f+'" failed');var h,p;if(r.isObject(l))for(h in l)for(p in l[h])i.addTranslation(e+"."+h,p,l[h][p]);n.$name=e;for(var d in n)"Action"===d.substr(d.length-6)&&(n[d].$module=e,n[d].$name=d);if(o.debug&&(window.app.modules[u]=n),a.fire({type:a.Event.MODULE_LOADED,name:e,module:n}),!r.isObject(n))throw Error('Invalid module "'+e+'" requested');a._modules[e]=n,s.resolve(n),r.isFunction(t)&&t(n)}),s.promise())},a.prototype.loadView=function(e,t){var i=this,o=new n;return r.isString(this._views[e])?(r.isFunction(t)&&t(this._views[e]),o.resolve(this._views[e]),o.promise()):(this.get(e).success(function(n){i.fire({type:i.Event.VIEW_LOADED,filename:e,content:n}),i._views[e]=n,o.resolve(n),r.isFunction(t)&&t(n)}).error(function(){i.fire({type:i.Event.LOAD_ERROR,resource:i.ResourceType.VIEW,filename:e}),o.reject("Loading view from "+e+" failed")}),o.promise())},a.prototype.loadCss=function(e,t){var i=this,o=new n;if(!r.isUndefined(this._loadedCssFiles[e]))return o.resolve(this._loadedCssFiles[e]),o.promise();var a,s,u,l,c=document.getElementsByTagName("head")[0],f=document.createElement("link");return f.setAttribute("href",e),f.setAttribute("rel","stylesheet"),f.setAttribute("type","text/css"),"sheet"in f?(a="sheet",s="cssRules"):(a="styleSheet",s="rules"),u=setInterval(function(){try{f[a]&&f[a][s].length&&(clearInterval(u),clearTimeout(l),i._loadedCssFiles[e]=f,o.resolve(f),r.isFunction(t)&&t.call(t,!0,f))}catch(n){}},10),l=setTimeout(function(){clearInterval(u),clearTimeout(l),c.removeChild(f),i.fire({type:i.Event.LOAD_ERROR,resource:i.ResourceType.CSS,filename:e}),o.reject('Loading css "'+e+'" failed'),r.isFunction(t)&&t.call(t,!1,f)},1e4),c.appendChild(f),o.promise()},new a});