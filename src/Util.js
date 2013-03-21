define(["Deferred","underscore"],function(t,e){return{round:function(t,e){var n=Math.pow(10,e);return Math.round(t*n)/n},date:function(){return new Date},microtime:function(){return this.date().getTime()/1e3},clone:function(t){return e.clone(t)},extend:function(t,n){return this.noop(t,n),e.extend.apply(e,e.toArray(arguments))},contains:function(t,n){return e.contains(t,n)},str:function(t){if(null===t)return"null";if("string"===this.typeOf(t))return t;try{return JSON.stringify(t)}catch(e){return"[obj]"}},bool:function(t){return t?!0:!1},typeOf:function(t){return function(e){return e===void 0?"undefined":e===t?"global":{}.toString.call(e).match(/\s([a-z|A-Z]+)/)[1].toLowerCase()}}(this),isFunction:function(t){return"function"===this.typeOf(t)},isString:function(t){return"string"===this.typeOf(t)},isBoolean:function(t){return"boolean"===this.typeOf(t)},isNumber:function(t){return"number"===this.typeOf(t)},isArray:function(t){return"array"===this.typeOf(t)},isObject:function(t){return"object"===this.typeOf(t)&&null!==t},isNull:function(t){return"null"===this.typeOf(t)},isDate:function(t){return"date"===this.typeOf(t)},isError:function(t){return"error"===this.typeOf(t)},isUndefined:function(t){return"undefined"===this.typeOf(t)},parseUrlParameters:function(t){var e,n,r,i,o,s=t.split("&"),a={};for(o in s)e=s[o],n=e.split("="),r=n[0],i=!0,2===n.length&&(i=n[1]),a[r]=i;return this.normalizeType(a)},formatAmount:function(t){if(t=parseFloat(t),isNaN(t))return"n/a";var e,n=t>=0?1:-1,r=Math.abs(t),i="";return r>1e6?(e=Math.floor(r/1e4)/100,i="m"):r>1e3?(e=Math.floor(r/100)/10,i="k"):e=r>1?Math.floor(r):Math.round(100*r)/100,""+e*n+i},getUrlParameters:function(){var t=window.location.href,e=t.indexOf("?");return-1==e?{}:this.parseUrlParameters(t.substr(e+1))},getHashParameters:function(){var t=window.location.hash,e=t.indexOf("#");return-1==e?{}:this.parseUrlParameters(t.substr(e+1))},normalizeType:function(t){var e=this.typeOf(t);if("string"===e)return parseInt(t,10)==t?parseInt(t,10):parseFloat(t)==t?parseFloat(t):"true"===t.toLowerCase(t)?!0:"false"===t.toLowerCase(t)?!1:"null"===t.toLowerCase(t)?null:t;if("object"===e){for(var n in t)t.hasOwnProperty(n)&&(t[n]=this.normalizeType(t[n]));return t}if("array"===e){for(var r=0;t.length>r;r++)t[r]=this.normalizeType(t[r]);return t}return t},convertEntityName:function(t){for(var e;-1!=(e=t.indexOf("-"));)t=t.substr(0,e)+t.substr(e+1,1).toUpperCase()+t.substr(e+2);return t.substr(0,1).toUpperCase()+t.substr(1)},convertCallableName:function(t){for(var e;-1!=(e=t.indexOf("-"));)t=t.substr(0,e)+t.substr(e+1,1).toUpperCase()+t.substr(e+2);return t},formatPath:function(t){var e=/http:\/\/.+?\/(.+)/,n=e.exec(t);return null===n?t:n[1]},remove:function(t,n){var r=this.typeOf(n);if("array"===r){var i=e.indexOf(n,t);return-1===i?!1:(n.splice(i,1),!0)}if("object"===r){var o;for(o in n)if(n[o]===t)return delete n[o],!0;return!1}throw Error("Unable to remove item, invalid collection")},parseStackLine:function(t){var e=/at (.+) \((.+):(\d+):(\d+)\)/,n=e.exec(t);return null===n?null:{method:n[1],filename:n[2],line:parseInt(n[3],10),column:parseInt(n[4],10)}},sprintf:function(){function t(t){return Object.prototype.toString.call(t).slice(8,-1).toLowerCase()}function e(t,e){var n,r=[];for(n=e;e>0;e--)r[e]=t;return r.join("")}var n=function(){return n.cache.hasOwnProperty(arguments[0])||(n.cache[arguments[0]]=n.parse(arguments[0])),n.format.call(null,n.cache[arguments[0]],arguments)};n.format=function(n,r){var i,o,s,a,u,c,l,f=1,h=n.length,p="",d=[];for(o=0;h>o;o++)if(p=t(n[o]),"string"===p)d.push(n[o]);else if("array"===p){if(a=n[o],a[2])for(i=r[f],s=0;a[2].length>s;s++){if(!i.hasOwnProperty(a[2][s]))throw Error('[sprintf] property "'+a[2][s]+'" does not exist');i=i[a[2][s]]}else i=a[1]?r[a[1]]:r[f++];if(/[^s]/.test(a[8])&&"number"!==t(i))throw Error("[sprintf] expecting number but found "+t(i));switch(a[8]){case"b":i=i.toString(2);break;case"c":i=String.fromCharCode(i);break;case"d":i=parseInt(i,10);break;case"e":i=a[7]?i.toExponential(a[7]):i.toExponential();break;case"f":i=a[7]?parseFloat(i).toFixed(a[7]):parseFloat(i);break;case"o":i=i.toString(8);break;case"s":i=(i+="")&&a[7]?i.substring(0,a[7]):i;break;case"u":i=Math.abs(i);break;case"x":i=i.toString(16);break;case"X":i=i.toString(16).toUpperCase()}i=/[def]/.test(a[8])&&a[3]&&i>=0?"+"+i:i,c=a[4]?"0"==a[4]?"0":a[4].charAt(1):" ",l=a[6]-(i+"").length,u=a[6]?e(c,l):"",d.push(a[5]?i+u:u+i)}return d.join("")},n.cache={};var r=/^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/;return n.parse=function(t){for(var e=t,n=[],i=[],o=0;e;){if(null!==(n=/^[^\x25]+/.exec(e)))i.push(n[0]);else if(null!==(n=/^\x25{2}/.exec(e)))i.push("%");else{if(null===(n=r.exec(e)))throw Error("[sprintf] huh?");if(n[2]){o|=1;var s=[],a=n[2],u=[];if(null===(u=/^([a-z_][a-z_\d]*)/i.exec(a)))throw Error("[sprintf] huh?");for(s.push(u[1]);""!==(a=a.substring(u[0].length));)if(null!==(u=/^\.([a-z_][a-z_\d]*)/i.exec(a)))s.push(u[1]);else{if(null===(u=/^\[(\d+)\]/.exec(a)))throw Error("[sprintf] huh?");s.push(u[1])}n[2]=s}else o|=2;if(3===o)throw Error("[sprintf] mixing positional and named placeholders is not supported");i.push(n)}e=e.substring(n[0].length)}return i},n}(),vsprintf:function(t,e){return e.unshift(t),this.sprintf.apply(null,e)},when:function(){return t.when.apply(window,arguments)},uid:function(){var t=function(){return(0|65536*(1+Math.random())).toString(16).substring(1)};return t()+t()+"-"+t()+"-"+t()+"-"+t()+"-"+t()+t()+t()},noop:function(){}}});