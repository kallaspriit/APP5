define(['core/Activity'],
function(Activity) {
	'use strict';

	/**
	 * $(Activity) activity.
	 *
	 * @class $(Activity)Activity
	 * @extends Activity
	 * @constructor
	 * @module $(Module)Module
	 */
	var $(Activity)Activity = function() {
		Activity.call(this);
	};

	$(Activity)Activity.prototype = Object.create(Activity.prototype);

	/**
	 * Main activity controller.
	 *
	 * @method onCreate
	 * @param {Scope} $scope Angular scope
	 */
	$(Activity)Activity.prototype.onCreate = function($scope) {
		
	};

	/**
	 * Called after onRestart(), or onPause(), for your activity to start interacting with the user.
	 *
	 * @method onResume
	 */
	$(Activity)Activity.prototype.onResume = function() {};

	/**
	 * Called as part of the activity lifecycle when an activity is going into the background, but has not (yet) been
	 * killed. The counterpart to onResume().
	 *
	 * When activity B is launched in front of activity A, this callback will be invoked on A. B will not be created
	 * until A's onPause() returns, so be sure to not do anything lengthy here.
	 *
	 * @method onPause
	 */
	$(Activity)Activity.prototype.onPause = function() {};

	/**
	 * Perform any final cleanup before an activity is destroyed.
	 *
	 * @method onDestroy
	 */
	$(Activity)Activity.prototype.onDestroy = function() {};

	/**
	 * Called when the url parameters such as page number changes.
	 *
	 * @method onParametersChanged
	 */
	$(Activity)Activity.prototype.onParametersChanged = function() {};

	/**
	 * Called on keyboard key down.
	 *
	 * @method onKeyDown
	 */
	$(Activity)Activity.prototype.onKeyDown = function() {};

	/**
	 * Called on keyboard key up.
	 *
	 * @method onKeyUp
	 */
	$(Activity)Activity.prototype.onKeyUp = function() {};

	/**
	 * Called on mouse key down.
	 *
	 * @method onMouseDown
	 */
	$(Activity)Activity.prototype.onMouseDown = function() {};

	/**
	 * Called on mouse cursor move.
	 *
	 * @method onMouseMove
	 */
	$(Activity)Activity.prototype.onMouseMove = function() {};

	/**
	 * Called on mouse key up.
	 *
	 * @method onMouseUp
	 */
	$(Activity)Activity.prototype.onMouseUp = function() {};

	return $(Activity)Activity;
});