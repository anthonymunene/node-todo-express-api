module.exports = function(grunt){
	// do grunt related tasks here
	var jsVendorFolder ='public/js/vendor';
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
			src:['public/js/*.js']
		},
		uglify: {

		}
	});
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	// Register the default tasks
	grunt.registerTask('default', ['jshint']);

	// Register building task
	grunt.registerTask('build', ['copy']);

};