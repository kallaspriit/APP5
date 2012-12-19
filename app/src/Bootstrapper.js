define(
['UI', 'Navi'],
function(ui, navi) {

var Bootstrapper = function() {

};

Bootstrapper.prototype.bootstrap = function() {
	ui.init();
	navi.init();
};

return new Bootstrapper();

});