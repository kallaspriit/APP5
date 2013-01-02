define(
['Bindable'],
function(Bindable) {
"use strict";

var ResourceManager = function() {

};

ResourceManager.prototype = new Bindable();

ResourceManager.prototype.Event = {
	
};

ResourceManager.prototype.init = function() {
    return this;
};

return new ResourceManager();

});