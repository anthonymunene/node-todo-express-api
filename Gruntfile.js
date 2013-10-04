"use strict";
var request = require('request');
module.exports = function (grunt) {
	// do grunt related tasks here
	var jsVendorFolder = 'public/js/vendor',
		reloadPort = 35729,
		files;
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		copy: {
			main: {
				files: [
					{expand: true, cwd: 'bower_components/modernizr/', src: ['modernizr.js'], dest: jsVendorFolder, filter: 'isFile'}, // includes files in path
					{expand: true, cwd: 'bower_components/jquery2/', src: ['jquery.js'], dest: jsVendorFolder, filter: 'isFile'}
					//{src: ['path/**'], dest: 'dest/'}, // includes files in path and its subdirs
					//{expand: true, cwd: 'path/', src: ['**'], dest: 'dest/'}, // makes all src relative to cwd
					//{expand: true, flatten: true, src: ['path/**'], dest: 'dest/', filter: 'isFile'} // flattens results to a single level
				]
			}
		},
		jshint: {
			options: {
				curly: true,
				eqeqeq: true,
				eqnull: true,
				browser: true,
				globals: {
					jQuery: true
				},
			},
			src: ['public/js/*.js']
		},
		uglify: {

		},
		develop: {
			server: {
				file: 'app.js'
			}
		},
		watch: {
			options: {
				livereload: reloadPort,
				nospawn: true
			},
			server: {
				files: [
					'app.js',
					'routes/*.js'
				],
				tasks: [
					'develop', 'delayed-livereload'
				]
			},
			js: {
				files: ['public/js/*.js'],
				options: {
					livereload: reloadPort
				}
			},
			css: {
				files: ['public/sass/**/*.scss'],
				tasks: ['compass']
			},
			jade: {
				files: ['views/*.jade'],
				options: {
					livereload: reloadPort
				}
			}
		},
		compass: {
			dist: {
				options: {
					config: 'config.rb'
				}
			}
		}
	});
	grunt.config.requires('watch.server.files');
	files = grunt.config('watch.server.files');
	files = grunt.file.expand(files);

	grunt.registerTask('delayed-livereload', 'Live reload after the node server has restarted.', function () {
		var done = this.async();
		setTimeout(function () {
			request.get('http://localhost:' + reloadPort + '/changed?files=' + files.join(','),  function (err, res) {
				var reloaded = !err && res.statusCode === 200;
				if (reloaded) {
					grunt.log.ok('Delayed live reload successful.');
				} else {
					grunt.log.error('Unable to make a delayed live reload.');
				}
				done(reloaded);
			});
		}, 500);
	});
	// grunt.loadNpmTasks('grunt-contrib-uglify');
	// grunt.loadNpmTasks('grunt-contrib-jshint');
	// grunt.loadNpmTasks('grunt-contrib-watch');
	// grunt.loadNpmTasks('grunt-contrib-concat');
	// grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.loadNpmTasks('grunt-develop');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	// Register the default tasks
	grunt.registerTask('default', ['develop', 'watch']);

	// Register building task
	grunt.registerTask('build', ['copy']);

};