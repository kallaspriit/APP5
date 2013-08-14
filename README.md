APP5
====

**Modular HTML5 Application Framework based on AngularJS.**

![APP5 logo](https://raw.github.com/kallaspriit/APP5/master/media/logo-doc.png "APP5")

![Download presentation](https://dl.dropboxusercontent.com/u/8855759/app5/slides-thumb.jpg "Download introductory presentation below")

[PowerPoint](https://dl.dropboxusercontent.com/u/8855759/app5/presentation.pptx) | [PDF](https://dl.dropboxusercontent.com/u/8855759/app5/presentation.pdf)

Features
--------
* Uses Google's [AngularJS](http://angularjs.org/) for rendering
	* Keep JavaScript and HTML separate
	* Extend HTML with reusable components
	* Two-way data-binding between the controllers and views
	* Dependency injection makes the code clearer and easier to test
	* Minimizes boilerplate code needed for DOM-manipulation
* Uses [require.js](http://requirejs.org/) for resource management
	* No need to define all required resources upfront
	* Lazy-loads modules as needed
	* Simultaneous asynchronous module loading with automatic dependency resolution
	* There are no "magic" global variables, each component requests required resources
	* Makes validating code with linting software (jshint) easier
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
	* The view updates automatically as soon as any information in the models is changed
* Easily extendable
	* Easy to add new libraries
	* User can create new directives and filters
	* Simple to use any UI frameworks such as Twitter Bootstrap
* Multilingual
	* Includes AngularJS directives for easy internationalization (i18n)
	* Language can be changed live without reloading application or losing current state
	* Each module has its own translations file
	* Supports any number of languages
* Event-driven architecture
	* Many components emit custom events such as navigating to a new page
	* Components can register any number of listeners to such events
	* Keeps the components loosely coupled as the emitters are not aware of consumers
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
* Documented
	* The entire code-base is well-documented according to YUIDoc rules
	* Project site with manual and tutorials will follow
* Endorses good code quality
	* Includes ANT task for verifying code using JsHint
	* Includes reasonable JsHint rules usable with supporting editors such as JetBrains WebStorm
	* Includes file templates for common components such as models and modules for WebStorm.
* Mobile-friendly
	* Tested with modern mobile browsers
	* Great for making app-like rich applications
	* Supports various transitions between views
	* Supports optional touch events
	* Previous views are kept alive for instant back navigation without losing state
* Backend independent
	* Server backend does not need to concern itself with how the data should be presented
	* No HTML generated on the server side
	* Only JSON/XML data is exchanged with the backend to fetch/store information and validate business rules
	* Reduces backend load as it only has to deal with data
	* Any number of frontend application can be built on the same backend web service
	* Frontend and backend people can work separately
	* Backend can be implemented in any language such as Java/.NET/PHP/Node without affecting frontend

Issues
------
* Requires modern browser (Safari, Chrome, Firefox, IE8+)
* As the content is generated on the client side, search engines don't see much without some additional trickery

Development status
------------------
The framework is still under heavy development and interfaces are subject to change but it's usable for non-mission-critical applications.

Documentation
-------------
Work in progress, see the example included with the framework.