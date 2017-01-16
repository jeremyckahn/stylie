const path = require('path');
const Webpack = require('webpack');

const isProduction = process.env.NODE_ENV === 'production';

const modulePaths = [
  'scripts',
  path.join(__dirname, 'node_modules')
];

module.exports = {
  entry: 'main.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'main.js',
  },
  devtool: 'source-map',
  resolveLoader: {

    // http://webpack.github.io/docs/troubleshooting.html#npm-linked-modules-doesn-t-find-their-dependencies
    fallback: modulePaths,

    alias: {
      text: 'raw-loader'
    }
  },
  resolve: {
    modulesDirectories: modulePaths,

    // http://webpack.github.io/docs/troubleshooting.html#npm-linked-modules-doesn-t-find-their-dependencies
    fallback: modulePaths,

    alias: {
      underscore: 'lodash',
      jquery: 'lib/custom-jquery',
      'jquery-mousewheel': 'jquery-mousewheel/jquery.mousewheel',
      'jquery-dragon': 'jquery-dragon/src/jquery.dragon',
      'jquery-cubelet': 'jquery-cubelet/dist/jquery.cubelet',
      shifty: 'shifty/dist/shifty',
      rekapi: 'rekapi/dist/rekapi',
      keydrown: 'keydrown/dist/keydrown',
      backbone: 'backbone/backbone',
      lateralus: 'lateralus/dist/lateralus',
      'lateralus.component.tabs': 'lateralus-components/tabs/main',
      aenima: 'aenima',
      bezierizer: 'bezierizer/dist/bezierizer'
    }
  },
  plugins: [
    new Webpack.optimize.UglifyJsPlugin({
      compress: {
        dead_code: true,
        unused: true
      },
      output: {
        comments: false
      }
    })
  ],
  devServer: {
    port: 9005
  },
  sassLoader: {
    includePaths: [
      path.resolve(__dirname, './node_modules/compass-mixins/lib')
    ],
    outputStyle: isProduction ? 'compressed' : 'expanded',
    sourceComments: !isProduction
  }
};
