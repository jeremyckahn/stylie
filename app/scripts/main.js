/*global require*/
'use strict';

require.config({
  baseUrl: '/'
  ,shim: {
    bootstrap: {
      deps: ['jquery']
      ,exports: 'jquery'
    }
  }
  ,paths: {
    text: 'bower_components/requirejs-text/text'
    ,jquery: 'bower_components/jquery/jquery'
    ,'jquery-dragon': 'bower_components/jquery-dragon/src/jquery.dragon'
    ,shifty: 'bower_components/shifty/dist/shifty'
    ,rekapi: 'bower_components/rekapi/dist/rekapi'
    ,backbone: 'bower_components/backbone/backbone'
    ,underscore: 'bower_components/lodash/dist/lodash'
    ,mustache: 'bower_components/mustache/mustache'
    ,bezierizer: 'bower_components/bezierizer/dist/bezierizer'
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
    name: 'stylie.component.shifty'
    ,location: 'scripts/components/shifty'
  }, {
    name: 'stylie.component.rekapi'
    ,location: 'scripts/components/rekapi'
  }, {
    name: 'stylie.component.container'
    ,location: 'scripts/components/container'
  }, {
    name: 'stylie.component.control-panel'
    ,location: 'scripts/components/control-panel'
  }, {
    name: 'stylie.component.keyframes-panel'
    ,location: 'scripts/components/keyframes-panel'
  }, {
    name: 'stylie.component.motion-panel'
    ,location: 'scripts/components/motion-panel'
  }, {
    name: 'stylie.component.css-panel'
    ,location: 'scripts/components/css-panel'
  }, {
    name: 'stylie.component.keyframe-form'
    ,location: 'scripts/components/keyframe-form'
  }, {
    name: 'stylie.component.bezierizer'
    ,location: 'scripts/components/bezierizer'
  }, {
    name: 'stylie.component.curve-selector'
    ,location: 'scripts/components/curve-selector'
  }]
});

require([

  'stylie'

], function (

  Stylie

) {
  window.stylie = new Stylie(document.getElementById('stylie'));
});
