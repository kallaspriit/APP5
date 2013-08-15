define(
['core/EventEmitter'],
function(EventEmitter) {
	'use strict';

	/**
	 * ${NAME}.
	 *
	 * @class ${NAME}
	 * @extends Bindable
	 * @constructor
	 * @module Core
	 */
	var ${NAME} = function() {
		EventEmitter.call(this);
	};

	${NAME}.prototype = Object.create(EventEmitter.prototype);

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