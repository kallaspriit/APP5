define(
[],
function() {
	'use strict';

	/**
	 * Base activity.
	 *
	 * @class Activity
	 * @constructor
	 * @module Core
	 */
	var Activity = function() {

	};

	/**
	 * Called when the activity is starting.
	 *
	 * @method onCreate
	 */
	Activity.prototype.onCreate = function() {};

	/**
	 * Called after onCreate(Bundle) — or after onRestart() when the activity had been stopped, but is now again being
	 * displayed to the user. It will be followed by onResume().
	 *
	 * @method onStart
	 */
	Activity.prototype.onStart = function() {};

	/**
	 * Called after onStop() when the current activity is being re-displayed to the user (the user has navigated back
	 * to it). It will be followed by onStart() and then onResume().
	 *
	 * @method onRestart
	 */
	Activity.prototype.onRestart = function() {};

	/**
	 * Called after onRestart(), or onPause(), for your activity to start interacting with the user.
	 *
	 * @method onResume
	 */
	Activity.prototype.onResume = function() {};

	/**
	 * Called as part of the activity lifecycle when an activity is going into the background, but has not (yet) been
	 * killed. The counterpart to onResume().
	 *
	 * When activity B is launched in front of activity A, this callback will be invoked on A. B will not be created
	 * until A's onPause() returns, so be sure to not do anything lengthy here.
	 *
	 * @method onPause
	 */
	Activity.prototype.onPause = function() {};

	/**
	 * Called when you are no longer visible to the user. You will next receive either onRestart() or onDestroy()
	 * depending on later user activity.
	 *
	 * @method onStop
	 */
	Activity.prototype.onStop = function() {};

	/**
	 * Perform any final cleanup before an activity is destroyed.
	 *
	 * @method onDestroy
	 */
	Activity.prototype.onDestroy = function() {};

	/**
	 * Called when the url parameters such as page number changes.
	 *
	 * @method onParametersChanged
	 */
	Activity.prototype.onParametersChanged = function() {};

	/**
	 * Called on keyboard key down.
	 *
	 * @method onKeyDown
	 */
	Activity.prototype.onKeyDown = function() {};

	/**
	 * Called on keyboard key up.
	 *
	 * @method onKeyUp
	 */
	Activity.prototype.onKeyUp = function() {};

	/**
	 * Called on mouse key down.
	 *
	 * @method onMouseDown
	 */
	Activity.prototype.onMouseDown = function() {};

	/**
	 * Called on mouse cursor move.
	 *
	 * @method onMouseMove
	 */
	Activity.prototype.onMouseMove = function() {};

	/**
	 * Called on mouse key up.
	 *
	 * @method onMouseUp
	 */
	Activity.prototype.onMouseUp = function() {};

	return Activity;
});