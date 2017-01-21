// jshint maxlen:100
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'scripts/views/{,*/}*.js'
// use this if you want to match all subfolders:
// 'scripts/views/**/*.js'
// templateFramework: 'lodash'

module.exports = function (grunt) {
  // show elapsed time at the end
  require('time-grunt')(grunt);
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  // configurable paths
  var yeomanConfig = {
    app: '.',
    dist: 'dist'
  };

  grunt.initConfig({
    yeoman: yeomanConfig,
    bump: {
      options: {
        files: ['package.json'],
        commit: false,
        createTag: false,
        tagName: '%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: false
      }
    }
  });
};
