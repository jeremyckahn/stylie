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
    clean: {
      dist: ['<%= yeoman.dist %>/*']
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.app %>/scripts/*.js',
        '<%= yeoman.app %>/scripts/components/{,*/}*.js'
      ]
    },
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/img',
          src: '{,*/}*.{png,jpg,jpeg}',
          dest: '<%= yeoman.dist %>/img'
        }]
      }
    },
    copy: {
      fonts: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            'node_modules/bootstrap-sass/assets/fonts/bootstrap/*',
            '.nojekyll'
          ]
        }]
      },
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
      },
      index: {
        files: [{
          expand: true,
          dot: true,
          cwd: '.',
          dest: '<%= yeoman.dist %>',
          src: [
            'index.html'
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
    appcache: {
      options: {
        basePath: '<%= yeoman.dist %>',
        preferOnline: true
      },
      all: {
        dest: '<%= yeoman.dist %>/manifest.appcache',
        cache: {
          patterns: [
            '<%= yeoman.dist %>/**/**',
            'manifest.appcache'
          ]
        },
        network: '*'
      }
    },
    exec: {
      webpack: './node_modules/.bin/webpack -d --optimize-minimize'
    }
  });

  grunt.registerTask('build', [
    'clean:dist',
    'exec:webpack',
    'imagemin',
    'copy:index',
    'copy:fonts',
    'appcache'
  ]);

  grunt.registerTask('fast-build', [
    'exec:webpack',
  ]);

  grunt.registerTask('deploy', [
    'build',
    'copy:package',
    'gh-pages'
  ]);

  grunt.registerTask('default', [
    'jshint',
    'build'
  ]);
};
