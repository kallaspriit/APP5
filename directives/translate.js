define([],function(){return["translator","util","_",function(e,t,n){return function(r,i,o){var a,s,l,u=i.html(),c=[],p={};if(t.isString(o.translate)&&o.translate.length>0&&n.extend(c,o.translate.split(/, ?/)),e.has(u))if(c.length>0)for(l=0;c.length>l;l++)p[c[l]]=null,r.$watch(c[l],function(r){if(p[this.param]=r,a=n.values(p),a.unshift(u),t.normalizeType(a),s=n.reduce(a,function(e,t){return null!==t&&e===!0},!0)){try{i.html(e.translate.apply(e,a))}catch(o){t.noop(o)}e.on(e.Event.LANGUAGE_CHANGED,function(){this.element.html(e.translate.apply(e,this.args))}.bind({args:a,element:i}))}}.bind({i:l,param:c[l],values:p}));else i.html(e.translate(u)),e.on(e.Event.LANGUAGE_CHANGED,function(){this.element.html(e.translate(this.key))}.bind({key:u,element:i}))}}]});