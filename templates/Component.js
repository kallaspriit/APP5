define(
['BaseEvent'],
function(BaseEvent) {
"use strict";

var privateMember = 'value';

var privateMethod = function() {
	return privateMember.toUpperCase();
};

var Component = function() {

};

Component.prototype = new BaseEvent();

Component.prototype.Event = {
	TEST: 'test'
};

Component.prototype.init = function() {
	this.fire({
		type: this.Event.TEST,
		data: privateMethod()
	});
};

return new Component();

});