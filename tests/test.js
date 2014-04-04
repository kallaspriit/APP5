var tests = [];

for (var file in window.__karma__.files) {
	if (window.__karma__.files.hasOwnProperty(file)) {
		if (/Spec\.js$/.test(file)) {
			tests.push(file);
		}
	}
}

requirejs.config({
	baseUrl: '/base/app/src',

	paths: {
		Counter: '../lib/counter/Counter',
		jquery: '../lib/jquery/jquery',
		underscore: '../lib/underscore/underscore'
	},

	shim: {
		underscore: {
			exports: '_'
		}
	},

	// ask Require.js to load these files (all our tests)
	deps: tests,

	// start test run, once Require.js is done
	callback: window.__karma__.start
});