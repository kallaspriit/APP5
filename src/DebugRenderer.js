define(["jquery","Debug","ResourceManager","Util","moment","underscore"],function(t,e,n,r,i,o){var a=function(){this.ui=null};return a.prototype.init=function(t){var e=this;return this.ui=t,this._initCss(function(){e._initHtml(),e._initEvents()}),this},a.prototype.showError=function(e,n,i,o){e=e||"System Error Occured",n=n||"A system error occured, sorry for the inconvenience.",i=i||"",n="<p><strong>"+n.replace("<","&lt;").replace(">","&gt;")+"</strong></p>";var a,s=t("#debug-renderer-error"),u="";if(r.isArray(o)&&o.length>0){for(a=0;o.length>a;a++)a>0&&(u+="<br>"),u+="#"+(a+1)+" "+o[a].filename+":"+o[a].line+" - "+o[a].method;n+="<p>"+u+"</p>"}0===s.length&&(t(document.body).append('<div id="debug-renderer-error">	<div class="debug-renderer-error-inner">		<h1 class="debug-renderer-error-title"></h1>		<div class="debug-renderer-error-location"></div>		<div class="debug-renderer-error-close">&times;</div>		<div class="debug-renderer-error-content"></div>	</div></div>'),s=t("#debug-renderer-error")),s.find(".debug-renderer-error-title").html(e),s.find(".debug-renderer-error-content").html(n),s.find(".debug-renderer-error-location").html(i),s.find(".debug-renderer-error-close").click(function(){s.fadeOut(function(){t(this).remove()})}),s.fadeIn()},a.prototype._initCss=function(t){n.loadCss("style/debug-renderer.css",t)},a.prototype._initHtml=function(){t(document.body).append('<div id="debug-renderer"></div>'),t(document.body).hasClass("with-touch")&&t("#debug-renderer").hammer().bind("swipe",function(e){switch(e.direction){case"left":return t(this).addClass("visible"),!1;case"right":return t(this).removeClass("visible"),!1}}).bind("hold",function(){t(this).empty()})},a.prototype._initEvents=function(){var t=this;require(["Navi"],function(t){t.bind(t.Event.PRE_NAVIGATE,function(t){e.log("! Navigating to "+t.module+"::"+t.action,t.parameters)})}),n.bind(n.Event.MODULE_LOADED,function(t){e.log("+ Loaded module "+t.name)}),n.bind(n.Event.VIEW_LOADED,function(t){e.log("+ Loaded view "+t.filename)}),e.bind(e.Event.CONSOLE,function(t){var e,n=r.date(),o=[i(n).format("hh:mm:ss")];for(r.isObject(t.source)&&o.push(r.formatPath(t.source.filename)+":"+t.source.line),e=0;t.args.length>e;e++)o.push(t.args[e]);r.isFunction(console.log.apply)?console.log.apply(console,o):console.log(o)}),e.bind(e.Event.LOG,function(e){var n="info",i=e.args[0];if(!r.isString(i)){if(!r.isFunction(""+i))return;i=""+i}var o=i.substr(0,2),a=t._formatContent(e.args);"+ "===o?n="success":"- "===o&&(n="error"),t._appendMessage(n,a,e.source)}),e.bind(e.Event.ALERT,function(e){var n=t._formatContent(e.args);t._appendMessage("alert",n,e.source)}),e.bind(e.Event.ERROR,function(e){function n(t){return t instanceof Error&&(t.stack?t=t.message&&-1===t.stack.indexOf(t.message)?"Error: "+t.message+"\n"+t.stack:t.stack:t.sourceURL&&(t=t.message+"\n"+t.sourceURL+":"+t.line)),t}var i=[];o.each(e.args,function(t){i.push(n(t))}),r.isFunction(console.error.apply)?console.error.apply(console,i):console.error(i);var a="Unknown error",s=[],u="unknown",c="?";3===e.args.length&&r.isNumber(e.args[2])?(a=e.args[0],u=e.args[1],c=e.args[2]):1===e.args.length&&r.isError(e.args[0])?(a=e.args[0].message,r.isArray(e.args)&&e.args.length>0&&r.isString(e.args[0].stack)&&(s=o.filter(o.map(e.args[0].stack.split("\n"),function(t){return r.parseStackLine(t)}),function(t){return null!==t}),u=s[0].filename,c=s[0].line)):1===e.args.length&&r.isString(e.args[0])&&(e.args.length>0&&(a=e.args[0]),r.isObject(e.source)&&r.isString(e.source.filename)&&(u=e.source.filename,r.isNumber(e.source.line)&&(c=e.source.line))),t.showError("System Error Occured",a,u+":"+c,s);var l,f="";if(s.length>0)for(l=0;s.length>l;l++)l>0&&(f+="<br>"),f+="#"+(l+1)+" "+s[l].filename+":"+s[l].line+" - "+s[l].method;t._appendMessage("error",a+(f.length>0?"<br>"+f:""),{filename:u,line:c})})},a.prototype._appendMessage=function(e,n,i){var o,a=t("#debug-renderer"),s=100,u=a.find("div"),c=u.length;c>s-1&&t(u.splice(0,c-(s-1))).remove(),o=r.isObject(i)?r.formatPath(i.filename)+":"+i.line:"<em>unknown</em>",a.append('<div class="'+e+'">'+n+"<span>"+o+"</span></div> "),a.prop("scrollTop",a.prop("scrollHeight"))},a.prototype._formatContent=function(t){for(var e,n="",i=0;t.length>i;i++)e=t[i],0===i&&r.isString(e)&&/[\-+!] /.test(e)&&(e=e.substr(2)),n.length>0&&(n+=", "),n+=r.str(e);return n.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")},new a});