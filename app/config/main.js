define(['config/base', 'underscore'], function(base, _) {
	console.log('MAIN CONFIG EXEC', base);

	var options = _.clone(base);

	// override any developer-specific options
	options.test = 'b';

	return options;
});