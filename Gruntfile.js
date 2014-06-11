module.exports = function(grunt) {

  // Add the grunt-mocha-test tasks.
  grunt.loadNpmTasks('grunt-mocha-cli');

  grunt.initConfig({
      mochacli: {
          options: {
              harmony: true,
              files: "test/**/*.js"
          },
          test: {
            options: {
              reporter: 'nyan'
            }
          },
          debug: {
            options: {
              reporter: 'nyan',
              'debug-brk': true
            }
          }
      }
  });

  grunt.registerTask('test', ['mochacli:test']);
  grunt.registerTask('test-debug', ['mochacli:debug']);

};