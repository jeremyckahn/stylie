/*global require*/
'use strict';

require.config({
  baseUrl: '/'
  ,shim: {
    xdLocalStorage: {
      exports: 'xdLocalStorage'
    }
  }
  ,paths: {
    text: 'bower_components/requirejs-text/text'
    ,jquery: 'scripts/lib/custom-jquery'
    ,'jquery-mousewheel': 'bower_components/jquery-mousewheel/jquery.mousewheel'
    ,'jquery-dragon': 'bower_components/jquery-dragon/src/jquery.dragon'
    ,'jquery-cubelet': 'bower_components/jquery-cubelet/dist/jquery.cubelet'
    ,shifty: 'bower_components/shifty/dist/shifty'
    ,rekapi: 'bower_components/rekapi/dist/rekapi'
    ,keydrown: 'bower_components/keydrown/dist/keydrown'
    ,backbone: 'bower_components/backbone/backbone'
    ,underscore: 'bower_components/lodash/lodash'
    ,mustache: 'bower_components/mustache/mustache'
    ,bezierizer: 'bower_components/bezierizer/dist/bezierizer'
    ,xdLocalStorage:
      'bower_components/xdLocalStorage/dist/scripts/xdLocalStorage.min'
  }
  ,packages: [{
    name: 'lateralus'
    ,location: 'bower_components/lateralus/scripts'
    ,main: 'lateralus'
  }, {
    name: 'stylie'
    ,location: 'scripts'
    ,main: 'stylie'
  }, {
    name: 'lateralus.component.tabs'
    ,location: 'bower_components/lateralus-components/tabs'
  }, {
    name: 'aenima'
    ,location: 'bower_components/aenima'
  }]
});

require([

  'stylie'

], function (

  Stylie

) {
  window.stylie = new Stylie(document.getElementById('stylie'));
});
