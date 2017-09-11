const path = require('path');
const Webpack = require('webpack');

const { version } = require('./package.json');

module.exports = {
  entry: './scripts/main.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'main.js',
  },
  devtool: 'source-map',
  resolveLoader: {
    alias: {
      text: 'raw-loader'
    }
  },
  resolve: {
    modules: [
      'node_modules'
    ],
    alias: {
      underscore: 'lodash',
      jquery: path.resolve(__dirname, 'scripts/lib/custom-jquery'),
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
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: path.join(__dirname, 'node_modules')
      }, {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        use: [{
          loader: 'file-loader'
        }]
      }, {
        test: /\.(sass|scss|css)$/,
        use: [{
          loader: 'style-loader'
        }, {
          loader: 'css-loader'
        }, {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
            includePaths: [
              path.resolve(__dirname, './node_modules/compass-mixins/lib')
            ]
          }
        }]
      }
    ]
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
    }),
    new Webpack.BannerPlugin(version)
  ],
  devServer: {
    port: 9005
  }
};
