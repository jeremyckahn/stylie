/*global require*/
'use strict';

require.config({
  baseUrl: '/'
  ,paths: {
    text: 'node_modules/requirejs-text/text'
    ,jquery: 'scripts/lib/custom-jquery'
    ,'jquery-mousewheel': 'node_modules/jquery-mousewheel/jquery.mousewheel'
    ,'jquery-dragon': 'node_modules/jquery-dragon/src/jquery.dragon'
    ,'jquery-cubelet': 'node_modules/jquery-cubelet/dist/jquery.cubelet'
    ,shifty: 'node_modules/shifty/dist/shifty'
    ,rekapi: 'node_modules/rekapi/dist/rekapi'
    ,keydrown: 'node_modules/keydrown/dist/keydrown'
    ,backbone: 'node_modules/backbone/backbone'
    ,underscore: 'node_modules/lodash/index'
    ,mustache: 'node_modules/mustache/mustache'
    ,bezierizer: 'node_modules/bezierizer/dist/bezierizer'
  }
  ,packages: [{
    name: 'lateralus'
    ,location: 'node_modules/lateralus/scripts'
    ,main: 'lateralus'
  }, {
    name: 'stylie'
    ,location: 'scripts'
    ,main: 'stylie'
  }, {
    name: 'lateralus.component.tabs'
    ,location: 'node_modules/lateralus-components/tabs'
  }, {
    name: 'aenima'
    ,location: 'node_modules/aenima'
  }]
});

require([

  'stylie'

], function (

  Stylie

) {
  window.stylie = new Stylie(document.getElementById('stylie'));
});
