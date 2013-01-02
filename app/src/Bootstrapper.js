define(
['Debug', 'ResourceManager', 'UI', 'Navi'],
function(dbg, resourceManager, ui, navi) {
"use strict";

var Bootstrapper = function() {

};

Bootstrapper.prototype.bootstrap = function() {
    window.app = {
        dbg: dbg.init(),
        resourceManager: resourceManager.init(),
        ui: ui.init(),
        navi: navi.init()
    };
};

return new Bootstrapper();

});