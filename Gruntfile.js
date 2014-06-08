/* global console:true, process:true, module:true */
var LIVERELOAD_PORT = 35729;
var SERVER_PORT = 9000;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to match all subfolders:
// 'test/spec/**/*.js'
// templateFramework: 'lodash'

module.exports = function (grunt) {
  'use strict';

  // show elapsed time at the end
  require('time-grunt')(grunt);
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  // configurable paths
  var gruntConfig = {
    app: './',
    dist: 'bin'
  };

  grunt.initConfig({
    grunt: gruntConfig,
    watch: {
      options: {
        nospawn: true,
        livereload: true
      },
      livereload: {
        options: {
          livereload: LIVERELOAD_PORT
        },
        files: [
          '<%= grunt.app %>/*.html',
          '<%= grunt.app %>/*.css',
          '<%= grunt.app %>/src/{,*/}*.js'
        ]
      },
      compass: {
        files: ['<%= grunt.app %>/styles/sass/{,*/}*.{scss,sass}'],
        tasks: ['compass']
      }
    },
    connect: {
      options: {
        port: SERVER_PORT,
        // change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, gruntConfig.app)
            ];
          }
        }
      }
    },
    open: {
      server: {
        path: 'http://localhost:<%= connect.options.port %>/dev.html'
      }
    },
    clean: {
      dist: ['<%= grunt.dist %>/*', '<%= grunt.app %>styles/css']
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= grunt.app %>/src/{,*/}*.js'
      ]
    },
    bump: {
      options: {
        files: ['package.json', 'bower.json'],
        commit: false,
        createTag: false,
        tagName: '%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: false
      }
    },
    compass: {
      options: {
        sassDir: '<%= grunt.app %>/styles/sass',
        cssDir: '<%= grunt.app %>/styles/css',
        imagesDir: '<%= grunt.app %>/img'
      },
      dist: {
        options: {
          environment: 'production'
        }
      },
      server: {
        options: {
          debugInfo: true,
          environment: 'development'
        }
      }
    }
  });

  grunt.registerTask('compile', function () {
    var exec = require('child_process').exec;
    var done = this.async();
    exec('node build.js', function (error, stdout, stderr) {
      if (error) {
        console.log('Error: ' + stderr);
      }

      done();
    });
  });

  grunt.registerTask('createDefaultTemplate', function () {
    grunt.file.write('.tmp/scripts/templates.js', 'this.JST = this.JST || {};');
  });

  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run([
        'clean:dist',
        'build',
        'compass:dist',
        'open',
        'connect:dist:keepalive'
      ]);
    }

    grunt.task.run([
      'clean:dist',
      'connect:livereload',
      'compass:server',
      'open',
      'watch'
    ]);
  });

  grunt.registerTask('build', [
    'clean:dist',
    'compass:dist',
    'compile'
  ]);

  grunt.registerTask('default', [
    'jshint',
    'build'
  ]);
};
