define(
[
	'core/BaseBootstrapper'
],
function(
	BaseBootstrapper
) {
	'use strict';

	/**
	 * Responsible for bootstrapping the application.
	 *
	 * @class Bootstrapper
	 * @extends BaseBootstrapper
	 * @constructor
	 * @module App
	 */
	var Bootstrapper = function() {
		BaseBootstrapper.call(this);
	};

	Bootstrapper.prototype = Object.create(BaseBootstrapper.prototype);

	/**
	 * Called before the system bootstrapping routine.
	 *
	 * @method preBootstrap
	 */
	Bootstrapper.prototype.preBootstrap = function() {};

	/**
	 * Called after the system bootstrapping routine.
	 *
	 * @method preBootstrap
	 */
	Bootstrapper.prototype.postBootstrap = function() {};

	return new Bootstrapper();
});
