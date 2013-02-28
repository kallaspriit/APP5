define(
['Bindable'],
function(Bindable) {
	'use strict';

	/**
	 * ???
	 *
	 * Can fire the following events:
	 *
	 *	> ??? - fired...
	 *		??? - ???
	 *
	 * @class ${NAME}
	 * @extends Bindable
	 * @constructor
	 * @module Core
	 */
	var ${NAME} = function() {

	};

	${NAME}.prototype = new Bindable();

	/**
	 * Event types.
	 *
	 * @event
	 * @param {Object} Event
	 * @param {String} Event.??? Triggered ???
	 */
	${NAME}.prototype.Event = {
		???: '???'
	};

	/**
	 * Initiates the component.
	 *
	 * @method init
	 * @return {${NAME}} Self
	 */
	${NAME}.prototype.init = function() {
		return this;
	};
	
	return new ${NAME}();
});