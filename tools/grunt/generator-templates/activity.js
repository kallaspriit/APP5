define(['core/Activity'],
function(Activity) {
	'use strict';

	/**
	 * $(Module)$(Activity) activity.
	 *
	 * @class $(Module)$(Activity)Activity
	 * @extends Activity
	 * @constructor
	 * @module $(Module)Module
	 */
	var $(Module)$(Activity)Activity = function() {
		Activity.call(this);
	};

	$(Module)$(Activity)Activity.prototype = Object.create(Activity.prototype);

	/**
	 * Main activity controller.
	 *
	 * @method onCreate
	 * @param {Scope} $scope Angular scope
	 */
	$(Module)$(Activity)Activity.prototype.onCreate = function($scope) {
		$scope.name = '$(Activity)';
	};

	/**
	 * Called after onRestart(), or onPause(), for your activity to start interacting with the user.
	 *
	 * @method onResume
	 */
	$(Module)$(Activity)Activity.prototype.onResume = function() {};

	/**
	 * Called as part of the activity lifecycle when an activity is going into the background, but has not (yet) been
	 * killed. The counterpart to onResume().
	 *
	 * When activity B is launched in front of activity A, this callback will be invoked on A. B will not be created
	 * until A's onPause() returns, so be sure to not do anything lengthy here.
	 *
	 * @method onPause
	 */
	$(Module)$(Activity)Activity.prototype.onPause = function() {};

	/**
	 * Perform any final cleanup before an activity is destroyed.
	 *
	 * @method onDestroy
	 */
	$(Module)$(Activity)Activity.prototype.onDestroy = function() {};

	/**
	 * Called when the url parameters such as page number changes.
	 *
	 * @method onParametersChanged
	 */
	$(Module)$(Activity)Activity.prototype.onParametersChanged = function() {};

	/**
	 * Called on keyboard key down.
	 *
	 * @method onKeyDown
	 */
	$(Module)$(Activity)Activity.prototype.onKeyDown = function() {};

	/**
	 * Called on keyboard key up.
	 *
	 * @method onKeyUp
	 */
	$(Module)$(Activity)Activity.prototype.onKeyUp = function() {};

	/**
	 * Called on mouse key down.
	 *
	 * @method onMouseDown
	 */
	$(Module)$(Activity)Activity.prototype.onMouseDown = function() {};

	/**
	 * Called on mouse cursor move.
	 *
	 * @method onMouseMove
	 */
	$(Module)$(Activity)Activity.prototype.onMouseMove = function() {};

	/**
	 * Called on mouse key up.
	 *
	 * @method onMouseUp
	 */
	$(Module)$(Activity)Activity.prototype.onMouseUp = function() {};

	return $(Module)$(Activity)Activity;
});