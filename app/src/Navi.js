define(['BaseEvent', 'Debug'], function(BaseEvent, dbg) {
	var Navi = function() {
		dbg.console('NAVI LOADED');
	};

	Navi.prototype.open = function(module) {
		dbg.console('NAVI OPEN', module);
	};

	return new Navi();
});