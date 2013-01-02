define(
['Debug', 'ResourceManager', 'UI', 'Navi'],
function(dbg, resourceManager, ui, navi) {
"use strict";

var Bootstrapper = function() {

};

Bootstrapper.prototype.bootstrap = function() {
	dbg.init();
	resourceManager.init();
	ui.init();
	navi.init();
};

return new Bootstrapper();

});