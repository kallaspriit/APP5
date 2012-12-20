define(
['BaseEvent', 'Debug', 'Util'],
function(BaseEvent, dbg, util) {
"use strict";

var activeModule = null;

var Navi = function() {

};

Navi.prototype = new BaseEvent();

Navi.prototype.init = function() {

};

Navi.prototype.open = function(module) {
	activeModule = module;
};

Navi.prototype.getActiveModule = function() {
	return activeModule;
};

return new Navi();

});