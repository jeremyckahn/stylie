// jshint maxlen:100
'use strict';
var LIVERELOAD_PORT = 35731;
var SERVER_PORT = 9005;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

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
    watch: {
      options: {
        nospawn: true,
        livereload: LIVERELOAD_PORT
      },
      compass: {
        files: [
          '<%= yeoman.app %>/styles/{,*/}*.{scss,sass}',
          '<%= yeoman.app %>/scripts/components/**/*.{scss,sass}',
          '<%= yeoman.app %>/node_modules/aenima/**/*.{scss,sass}'
        ],
        tasks: ['compass']
      },
      livereload: {
        options: {
          livereload: grunt.option('livereloadport') || LIVERELOAD_PORT
        },
        files: [
          '<%= yeoman.app %>/*.html',
          '<%= yeoman.app %>/styles/main.css',
          '<%= yeoman.app %>/scripts/**/*.{js,mustache}',
          '<%= yeoman.app %>/node_modules/aenima/**/*.{js,mustache}',
          '<%= yeoman.app %>/img/{,*/}*.{png,jpg,jpeg,gif,webp}',
          '<%= yeoman.app %>/scripts/templates/*.{ejs,mustache,hbs}'
        ]
      },
    },
    connect: {
      options: {
        port: grunt.option('port') || SERVER_PORT,
        // change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, yeomanConfig.app)
            ];
          }
        }
      },
      dist: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, yeomanConfig.dist)
            ];
          }
        }
      }
    },
    open: {
      server: {
        path: 'http://localhost:<%= connect.options.port %>'
      }
    },
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
    compass: {
      options: {
        sassDir: '<%= yeoman.app %>/styles',
        cssDir: '<%= yeoman.app %>/styles',
        imagesDir: '<%= yeoman.app %>/img',
        importPath: './',
        relativeAssets: true
      },
      dist: {},
      server: {
        options: {
          debugInfo: true
        }
      }
    },
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>'
      }
    },
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      options: {
        dirs: ['<%= yeoman.dist %>'],
        blockReplacements: {
          remove: function () {
            return '';
          }
        }
      }
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
    cssmin: {
      dist: {
        files: {
          '<%= yeoman.dist %>/styles/main.css': [
            '<%= yeoman.app %>/styles/main.css'
          ]
        }
      }
    },
    htmlmin: {
      dist: {
        options: {
          /*removeCommentsFromCDATA: true,
          // https://github.com/yeoman/grunt-usemin/issues/44
          //collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeAttributeQuotes: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true*/
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>',
          src: '*.html',
          dest: '<%= yeoman.dist %>'
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

  grunt.registerTask('server', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve' + (target ? ':' + target : '')]);
  });

  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'open:server', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'compass:server',
      'connect:livereload',
      'open:server',
      'watch'
    ]);
  });

  grunt.registerTask('build', [
    'clean:dist',
    'compass:dist',
    'useminPrepare',
    'exec:webpack',
    'imagemin',
    'htmlmin',
    'concat',
    'cssmin',
    'copy:fonts',
    'usemin',
    'appcache'
  ]);

  grunt.registerTask('fast-build', [
    'compass:dist',
    'useminPrepare',
    'exec:webpack',
    'htmlmin',
    'concat',
    'cssmin',
    'usemin',
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
