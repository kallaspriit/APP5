define(["ResourceManager","App","Util","addons/datepicker/glDatePicker"],function(e,t,n){var a=function(e){return(10>e.getDate()?"0":"")+e.getDate()+"."+(10>e.getMonth()+1?"0":"")+(e.getMonth()+1)+"."+e.getFullYear()},l=function(e){var t=new Date,n=t.getFullYear(),a=t.getMonth(),l=t.getDate(),r=e.split(".");return 3===r.length&&(l=parseInt(r[0],10),a=parseInt(r[1],10)-1,n=parseInt(r[2],10)),new Date(n,a,l)},r=function(r,i,d){e.loadCss("addons/datepicker/glDatePicker.default.css");var o=null,c=null,s=new Date;n.isUndefined(d.ngModel)||(o=r.$watch("model",function(e){n.isString(e)&&(s=l(e),i.val(a(s)))})),window.setTimeout(function(){c=$(i).glDatePicker({onClick:function(e,l,i){var o=a(i);e.val(o),n.isUndefined(d.ngModel)||(r.model=o,t.validate())},selectedDate:s,zIndex:1e4,startDate:new Date(1900,0,1),endDate:new Date}).glDatePicker(!0)},500),i.bind("$destroy",function(){n.isFunction(o)&&o(),null!==c&&$(c.calendar[0]).remove()})};return[function(){return{scope:{model:"=ngModel"},restrict:"E",transclude:!0,replace:!0,link:r,templateUrl:"addons/datepicker/datepicker.html"}}]});