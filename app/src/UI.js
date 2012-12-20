define(
['jquery', 'BaseEvent', 'Debug', 'Navi'],
function($, BaseEvent, dbg, navi) {
"use strict";

var UI = function() {

};

UI.prototype = new BaseEvent();

UI.prototype.init = function() {
	var self = this;

	this.initDebugListeners();

	$(document).ready(function() {
		self.onDocumentReady();
	});
};

UI.prototype.initDebugListeners = function() {
	dbg.bind(dbg.Event.CONSOLE, function(e) {
		console.log('CONSOLE', e);
	});
};

UI.prototype.onDocumentReady = function() {
	$(document.body).css('background-color', '#F00');
};

return new UI();

});