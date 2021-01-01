const path = require('path');
const Webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

const { version } = require('./package.json');

const rootDir = modulePath => path.resolve(__dirname, modulePath);

module.exports = {
  entry: {
    main: './scripts/main.js',
    stylie: './scripts/stylie.js'
  },
  mode: 'production',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    library: 'stylie',
    libraryTarget: 'umd',
    umdNamedDefine: true
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
    symlinks: false,
    alias: {
      underscore: 'lodash',
      lodash: rootDir('node_modules/lodash/index.js'),
      jquery: rootDir('scripts/lib/custom-jquery'),
      'jquery-mousewheel': rootDir('node_modules/jquery-mousewheel/jquery.mousewheel'),
      'jquery-dragon': rootDir('node_modules/jquery-dragon/src/jquery.dragon'),
      'jquery-cubelet': rootDir('node_modules/jquery-cubelet/dist/jquery.cubelet'),
      rekapi: rootDir('node_modules/rekapi/src/main'),
      shifty: rootDir('node_modules/shifty/src/index'),
      keydrown: rootDir('node_modules/keydrown/dist/keydrown'),
      lateralus: rootDir('node_modules/lateralus/dist/lateralus'),
      'lateralus.component.tabs': rootDir('node_modules/@jeremyckahn/lateralus-components/tabs/main'),
      aenima: rootDir('node_modules/aenima'),
      bezierizer: rootDir('node_modules/bezierizer/dist/bezierizer')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
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
    new CleanWebpackPlugin([ 'dist' ]),
    new CopyWebpackPlugin([
      { from: 'index.html' },
      { from: 'manifest.json' },
      { from: 'img', to: 'img' }
    ]),
    new Webpack.BannerPlugin(version),
    new WorkboxPlugin.GenerateSW({
      exclude: [/\.(?:DS_Store|xcf)$/],
    })
  ],
  devServer: {
    host: '0.0.0.0',
    port: 9005
  }
};
