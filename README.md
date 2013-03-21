APP5
====

**HTML5 Application Framework.**

Features
--------
* Uses Google's [AngularJS](http://angularjs.org/) for rendering
	* Keep JavaScript and HTML seperate
	* Extend HTML with reusable components
	* Two-way data-binding between the controllers and views
	* Dependency injection makes the code clearer and easier to test
	* Minimizes boilerplate code needed for DOM-manipulation
* Uses [require.js](http://requirejs.org/) for resource management
	* No need to define all required resources upfront
	* Lazy-loads modules as needed
	* Simultaneous asynchronous module loading with automatic dependency resolution
* Modular architecture
	* The application is divided into stand-alone modules
	* Each module has its own logic, views, css, translations
	* Modules are lazy-loaded as required by the application
	* Simple navigation between module actions with back-functionality
* MVC
	* Uses true model-view-controller architecture
	* Data is stored in models (plain objects/arrays)
	* Business logic and communication between models and views are handled by controllers (model actions)
	* Views use AngularJS to render data from models
* Easily extendable
	* Easy to add new libraries
	* User can create new directives and filters
	* Simple to use any UI frameworks such as Twitter Bootstrap
* Event-driven architecture
	* Many components emit custom events such as navigating to a new page
	* Components can register any number of listeners to such events
	* Keepts the components loosely coupled as the emitters are not aware of consumers
* Includes build system
	* ANT and nodejs scripts
	* Verify code quality
	* Automatically generate documentation
	* Compresses and merges JavaScript files
	* Annotates the build with version information
* Debuggable
	* Includes interface for logging various events
	* Users can easily implements their own debug event listeners for logging etc
	* Develop with full sources, automatically compress and merge for deployment
* Endorses good code quality
	* Includes ANT task for verifying code using JsHint
	* Includes reasonable JsHint rules usable with supporting editors such as JetBrains WebStorm
	* Includes file templates for common components such as models and modules for WebStorm.
* Mobile-frendly
	* Tested with modern mobile browsers
	* Great for making app-like rich applications
	* Supports various transitions between views
	* Supports optional touch events
	* Previous views are kept alive for instant back navigation without losing state

Documentation
-------------
Work in progress, see the example included with the framework.