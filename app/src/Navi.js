define(
['Bindable', 'Debug', 'Util'],
function(Bindable, dbg, util) {
"use strict";

var activeModule = null;

var Navi = function() {

};

Navi.prototype = new Bindable();

Navi.prototype.init = function() {
    return this;
};

Navi.prototype.open = function(module) {
	activeModule = module;
};

Navi.prototype.getActiveModule = function() {
	return activeModule;
};

return new Navi();

});