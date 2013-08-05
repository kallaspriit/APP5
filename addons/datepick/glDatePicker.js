/*!
 * glDatePicker v2.0
 * http://glad.github.com/glDatePicker/
 *
 * Copyright (c) 2013 Gautam Lad.  All rights reserved.
 * Released under the MIT license.
 *
 * Date: Tue Jan 1 2013
 */

(function(){$.fn.glDatePicker=function(e){var t="glDatePicker",a=this.data(t);return a?e===!0?a:this:this.each(function(){return $(this).data(t,new glDatePicker(this,e))})},$.fn.glDatePicker.defaults={cssName:"default",zIndex:1e3,borderSize:1,calendarOffset:{x:0,y:1},showAlways:!1,hideOnClick:!0,allowMonthSelect:!0,allowYearSelect:!0,todayDate:new Date,selectedDate:null,prevArrow:"◄",nextArrow:"►",selectableDates:null,selectableDateRange:null,specialDates:null,selectableMonths:null,selectableYears:null,selectableDOW:null,monthNames:null,dowNames:null,dowOffset:0,onClick:function(e,t,a){e.val(a.toLocaleDateString())},onHover:function(){},onShow:function(e){e.show()},onHide:function(e){e.hide()},firstDate:null};var glDatePicker=function(){function glDatePicker(e,t){var a=this;a.el=$(e);var l=a.el;a.options=$.extend(!0,{},$.fn.glDatePicker.defaults,t);var n=a.options;a.calendar=$($.find("[gldp-el="+l.attr("gldp-id")+" ]")),n.selectedDate=n.selectedDate||n.todayDate,n.firstDate=new Date(n.firstDate||n.selectedDate)._first(),(l.attr("gldp-id")||"").length||l.attr("gldp-id","gldp-"+Math.round(1e10*Math.random())),l.addClass("gldp-el").bind("click",function(e){a.show(e)}).bind("focus",function(e){a.show(e)}),a.calendar.length&&!n.showAlways&&a.calendar.hide(),$(document).bind("mouseup",function(e){var t=e.target,n=a.calendar;l.is(t)||n.is(t)||0!==n.has(t).length||!n.is(":visible")||a.hide()}),a.render()}return glDatePicker.prototype={show:function(){$.each($(".gldp-el").not(this.el),function(e,t){t.length&&t.options.onHide(t.calendar)}),this.options.onShow(this.calendar)},hide:function(){this.options&&!this.options.showAlways&&this.options.onHide(this.calendar)},render:function(renderCalback){var self=this,el=self.el,options=self.options,calendar=self.calendar,coreClass=" core border ",cssName="gldp-"+options.cssName,todayVal=options.todayDate._val(),todayTime=todayVal.time,maxRow=6,maxCol=7,borderSize=options.borderSize+"px",getSelectableList=function(e,t,a){for(var l=[],n=e;t>=n;n++)l.push(n);if(a){var o=[];$.each(a,function(a,l){l>=e&&t>=l&&0>o._indexOf(l)&&o.push(l)}),l=o.length?o:l}return l.sort(),l},selectableMonths=getSelectableList(0,11,options.selectableMonths),selectableYears=getSelectableList(todayVal.year-100,todayVal.year+5,options.selectableYears),selectableDOW=getSelectableList(0,6,options.selectableDOW),dowNames=options.dowNames||["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],monthNames=options.monthNames||["January","February","March","April","May","June","July","August","September","October","November","December"],containerWidth=el.outerWidth(),containerHeight=containerWidth,getCellSize=function(e,t){return e/t+options.borderSize/t*(t-1)},cellWidth=getCellSize(containerWidth,maxCol),cellHeight=getCellSize(containerHeight,maxRow+2);calendar.length?eval(calendar.data("is"))||(containerWidth=calendar.outerWidth(),containerHeight=calendar.outerHeight(),cellWidth=getCellSize(containerWidth,maxCol),cellHeight=getCellSize(containerHeight,maxRow+2)):(self.calendar=calendar=$("<div/>").attr("gldp-el",el.attr("gldp-id")).data("is",!0).css({display:options.showAlways?void 0:"none",zIndex:options.zIndex,width:cellWidth*maxCol+"px"}),$("body").append(calendar)),el.is(":visible")||calendar.hide(),calendar.removeClass().addClass(cssName).children().remove();var onResize=function(){var e=el.offset();calendar.css({top:e.top+el.outerHeight()+options.calendarOffset.y+"px",left:e.left+options.calendarOffset.x+"px"})};$(window).resize(onResize),onResize();var cellCSS={width:cellWidth+"px",height:cellHeight+"px",lineHeight:cellHeight+"px"},setFirstDate=function(e){e&&(options.firstDate=e,self.render())},getFirstDate=function(e){var t=new Date(options.firstDate);for(e=e||0;;){if(t.setMonth(t.getMonth()+e),t.setDate(Math.min(1,t._max())),0==e)break;var a=t._val(),l=a.month,n=a.year;if(-1!=selectableMonths._indexOf(l)){if(-1!=selectableYears._indexOf(n))break;if(selectableYears[0]>n||n>selectableYears[selectableYears.length-1])return null}}return t},prevFirstDate=getFirstDate(-1),nextFirstDate=getFirstDate(1),firstDate=options.firstDate=getFirstDate(),firstDateVal=firstDate._val(),firstDateMonth=firstDateVal.month,firstDateYear=firstDateVal.year,startDate=new Date(firstDate),dowOffset=Math.abs(Math.min(6,Math.max(0,options.dowOffset))),startOffset=startDate.getDay()-dowOffset;startOffset=1>startOffset?-7-startOffset:-startOffset,dowNames=dowNames.concat(dowNames).slice(dowOffset,dowOffset+7),startDate._add(startOffset);var showPrev=prevFirstDate,showNext=nextFirstDate,monyearClass=coreClass+"monyear ",prevCell=$("<div/>").addClass(monyearClass).css($.extend({},cellCSS,{borderWidth:borderSize+" 0 0 "+borderSize})).append($("<a/>").addClass("prev-arrow"+(showPrev?"":"-off")).html(options.prevArrow)).mousedown(function(){return!1}).click(function(e){""!=options.prevArrow&&showPrev&&(e.stopPropagation(),setFirstDate(prevFirstDate))}),titleCellCount=maxCol-2,titleWidth=cellWidth*titleCellCount-titleCellCount*options.borderSize+options.borderSize,titleCell=$("<div/>").addClass(monyearClass+"title").css($.extend({},cellCSS,{width:titleWidth+"px",borderTopWidth:borderSize,marginLeft:"-"+borderSize})),nextCell=$("<div/>").addClass(monyearClass).css($.extend({},cellCSS,{marginLeft:"-"+borderSize,borderWidth:borderSize+" "+borderSize+" 0 0"})).append($("<a/>").addClass("next-arrow"+(showNext?"":"-off")).html(options.nextArrow)).mousedown(function(){return!1}).click(function(e){""!=options.nextArrow&&showNext&&(e.stopPropagation(),setFirstDate(nextFirstDate))});calendar.append(prevCell).append(titleCell).append(nextCell);for(var row=0,cellIndex=0;maxRow+1>row;row++)for(var col=0;maxCol>col;col++,cellIndex++){var cellDate=new Date(startDate),cellClass="day",cellZIndex=options.zIndex+cellIndex,cell=$("<div/>");if(row){cellDate._add(col+(row-1)*maxCol);var cellDateVal=cellDate._val(),cellDateTime=cellDateVal.time,specialData=null,isSelectable=!0,getRepeatDate=function(e,t){return e.repeatYear===!0&&t.setYear(cellDateVal.year),e.repeatMonth===!0&&t.setMonth(cellDateVal.month),t._val()};cell.html(cellDateVal.date),options.selectableDateRange&&(isSelectable=!1,$.each(options.selectableDateRange,function(e,t){var a=t.from,l=t.to||null;return l=l||new Date(t.from.getFullYear(),t.from.getMonth(),t.from._max()),a=getRepeatDate(t,a),l=getRepeatDate(t,l),cellDateTime>=a.time&&l.time>=cellDateTime?(isSelectable=!0,!0):void 0})),options.selectableDates&&((options.selectableDateRange&&!isSelectable||isSelectable&&!options.selectableDateRange)&&(isSelectable=!1),$.each(options.selectableDates,function(e,t){var a=getRepeatDate(t,t.date);return a.time==cellDateTime?isSelectable=!0:void 0})),!isSelectable||0>selectableYears._indexOf(cellDateVal.year)||0>selectableMonths._indexOf(cellDateVal.month)||0>selectableDOW._indexOf(cellDateVal.day)?cellClass="noday":(cellClass=["sun","mon","tue","wed","thu","fri","sat"][cellDateVal.day],firstDateMonth!=cellDateVal.month&&(cellClass+=" outday"),todayTime==cellDateTime&&(cellClass="today",cellZIndex+=50),options.selectedDate._time()==cellDateTime&&(cellClass="selected",cellZIndex+=51),options.specialDates&&$.each(options.specialDates,function(e,t){var a=getRepeatDate(t,t.date);a.time==cellDateTime&&(cellClass=t.cssClass||"special",cellZIndex+=52,specialData=t.data)}),cell.mousedown(function(){return!1}).hover(function(e){e.stopPropagation();var t=$(this).data("data");options.onHover(el,cell,t.date,t.data)}).click(function(e){e.stopPropagation();var t=$(this).data("data");options.selectedDate=options.firstDate=t.date,self.render(function(){!options.showAlways&&options.hideOnClick&&self.hide()}),options.onClick(el,$(this),t.date,t.data)}))}else cellClass="dow",cell.html(dowNames[col]),cellDate=null;$.extend(cellCSS,{borderTopWidth:borderSize,borderBottomWidth:borderSize,borderLeftWidth:row>0||!row&&!col?borderSize:0,borderRightWidth:row>0||!row&&6==col?borderSize:0,marginLeft:col>0?"-"+borderSize:0,marginTop:row>0?"-"+borderSize:0,zIndex:cellZIndex}),cell.data("data",{date:cellDate,data:specialData}).addClass(coreClass+cellClass).css(cellCSS),calendar.append(cell)}var toggleYearMonthSelect=function(e){var t="inline-block",a="none";options.allowMonthSelect&&(monthText.css({display:e?t:a}),monthSelect.css({display:e?a:t})),options.allowYearSelect&&(yearText.css({display:e?a:t}),yearSelect.css({display:e?t:a}))},onYearMonthSelect=function(){options.firstDate=new Date(yearSelect.val(),monthSelect.val(),1),self.render()},monthSelect=$("<select/>").hide().change(onYearMonthSelect),yearSelect=$("<select/>").hide().change(onYearMonthSelect),monthText=$("<span/>").html(monthNames[firstDateMonth]).mousedown(function(){return!1}).click(function(e){e.stopPropagation(),toggleYearMonthSelect(!1)}),yearText=$("<span/>").html(firstDateYear).mousedown(function(){return!1}).click(function(e){e.stopPropagation(),toggleYearMonthSelect(!0)});$.each(monthNames,function(e,t){if(options.allowMonthSelect&&-1!=selectableMonths._indexOf(e)){var a=$("<option/>").html(t).attr("value",e);e==firstDateMonth&&a.attr("selected","selected"),monthSelect.append(a)}}),$.each(selectableYears,function(e,t){if(options.allowYearSelect){var a=$("<option/>").html(t).attr("value",t);t==firstDateYear&&a.attr("selected","selected"),yearSelect.append(a)}});var titleYearMonth=$("<div/>").append(monthText).append(monthSelect).append(yearText).append(yearSelect);titleCell.children().remove(),titleCell.append(titleYearMonth),renderCalback=renderCalback||function(){},renderCalback()}},glDatePicker}();(function(){Date.prototype._clear=function(){return this.setHours(0),this.setMinutes(0),this.setSeconds(0),this.setMilliseconds(0),this},Date.prototype._time=function(){return this._clear().getTime()},Date.prototype._max=function(){var e=1==new Date(this.getYear(),1,29).getMonth()?1:0,t=[31,28+e,31,30,31,30,31,31,30,31,30,31];return t[this.getMonth()]},Date.prototype._add=function(e){this.setDate(this.getDate()+e)},Date.prototype._first=function(){var e=new Date(this);return e.setDate(1),e},Date.prototype._val=function(){return this._clear(),{year:this.getFullYear(),month:this.getMonth(),date:this.getDate(),time:this.getTime(),day:this.getDay()}},Array.prototype._indexOf=function(e){return $.inArray(e,this)}})()})();