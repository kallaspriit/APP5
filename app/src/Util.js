define(function() {
"use strict";

return {
	getDate: function() {
		return new Date();
	},
	microtime: function() {
		return this.getDate().getTime() / 1000;
	}
};

});