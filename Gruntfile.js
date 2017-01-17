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
    copy: {
      package: {
        files: [{
          expand: true,
          dot: true,
          cwd: '.',
          dest: '<%= yeoman.dist %>',
          src: [
            'package.json'
          ]
        }]
      }
    },
    'gh-pages': {
      options: {
        base: 'dist',
        message: 'Automated deploy commit.'
      },
      src: [
        '**/*',
        'index.html',
        'stylie.js',
        'stylie.js.map',
        'manifest.appcache',
        '.nojekyll'
      ]
    },
    bump: {
      options: {
        files: ['package.json'],
        commit: false,
        createTag: false,
        tagName: '%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: false
      }
    },
    exec: {
      build: 'npm run build'
    }
  });

  grunt.registerTask('build', [
    'exec:build'
  ]);

  grunt.registerTask('deploy', [
    'build',
    'copy:package',
    'gh-pages'
  ]);
};
