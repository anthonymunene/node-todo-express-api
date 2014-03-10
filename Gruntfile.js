var path = require('path');
module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		target: 'public',
		bower_dir: 'bower_components',
		bootstrap_dir: '<%= bower_dir%>/bootstrap-sass/vendor/assets',
		express: {
			server: {
				options: {
					port: 3000,
					server: path.resolve(__dirname, 'server'),
					bases: path.resolve(__dirname, 'assets'),
					livereload: false,
					serverreload: true
				}
			}
		},
		// Configure a mochaTest task
		mochaTest: {
			test: {
				options: {
					reporter: 'spec'
				},
				src: ['test/**/*.spec.js']
			}
		}
	});
	// will read the dependencies/devDependencies/peerDependencies in your package.json
	// and load grunt tasks that match the provided patterns.
	// Loading the different plugins
	require('load-grunt-tasks')(grunt);
	grunt.registerTask('default', ['express']);
};