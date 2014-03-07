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
					port: 9000,
                    server: path.resolve(__dirname, 'server'),
                    bases: path.resolve(__dirname, 'assets'),
					livereload: true,
                    serverreload: true
				}
			}
		},
		compass: {                  // Task
            dist: {                   // Target
              options: {              // Target options
                sassDir: 'scss',
                cssDir: '<%= temp %>/css',
                outputStyle: 'compressed'
              }
            },
            dev: {                    // Another target
              options: {
                sassDir: 'assets/scss',
                cssDir: '<%= target%>/stylesheets',
                outputStyle: "expanded",
                importPath: '<%= bootstrap_dir%>/stylesheets/bootstrap'
              }
            }
        },
        concat: {
        	createBootstrapJS: {
        		src: ['<%= bootstrap_dir%>/javascripts/bootstrap/*.js'],
        		dest: '<%= target%>/javascripts/bootstrap.js'
        	}
        },
        copy: {
        	copyJqueryDev: {
        		expand: true,
        		flatten: true,
        		src: '<%= bower_dir%>/jquery/dist/jquery.js',
        		dest: '<%= target%>/javascripts/vendor/',
        		filter: 'isFile'
        	}
        }
	});
    // will read the dependencies/devDependencies/peerDependencies in your package.json
    // and load grunt tasks that match the provided patterns.
    // Loading the different plugins
	require('load-grunt-tasks')(grunt);
	grunt.registerTask('default', ['bootstrapSetup', 'express']);
	grunt.registerTask('bootstrapSetup', ['concat:createBootstrapJS', 'copy:copyJqueryDev', 'compass:dev']);
};