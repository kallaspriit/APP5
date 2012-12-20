define(
['config/base', 'underscore'],
function(base, _) {
"use strict";

var options = _.clone(base);

// override any developer-specific options
options.test = 'test';

return options;

});