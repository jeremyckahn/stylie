/*global require*/
'use strict';

require.config({
  baseUrl: '/'
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
    name: 'stylie.component.keybindings'
    ,location: 'scripts/components/keybindings'
  }, {
    name: 'stylie.component.hidable'
    ,location: 'scripts/components/hidable'
  }, {
    name: 'stylie.component.container'
    ,location: 'scripts/components/container'
  }, {
    name: 'stylie.component.header'
    ,location: 'scripts/components/header'
  }, {
    name: 'stylie.component.modal'
    ,location: 'scripts/components/modal'
  }, {
    name: 'stylie.component.help'
    ,location: 'scripts/components/help'
  }, {
    name: 'stylie.component.too-small-message'
    ,location: 'scripts/components/too-small-message'
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
    name: 'stylie.component.html-panel'
    ,location: 'scripts/components/html-panel'
  }, {
    name: 'stylie.component.management-panel'
    ,location: 'scripts/components/management-panel'
  }, {
    name: 'stylie.component.keyframe-form'
    ,location: 'scripts/components/keyframe-form'
  }, {
    name: 'stylie.component.bezierizer'
    ,location: 'scripts/components/bezierizer'
  }, {
    name: 'stylie.component.curve-selector'
    ,location: 'scripts/components/curve-selector'
  }, {
    name: 'stylie.component.preview'
    ,location: 'scripts/components/preview'
  }, {
    name: 'stylie.component.animation-path'
    ,location: 'scripts/components/animation-path'
  }, {
    name: 'stylie.component.crosshair-container'
    ,location: 'scripts/components/crosshair-container'
  }, {
    name: 'stylie.component.crosshair'
    ,location: 'scripts/components/crosshair'
  }, {
    name: 'stylie.component.actor-container'
    ,location: 'scripts/components/actor-container'
  }, {
    name: 'stylie.component.timeline-scrubber'
    ,location: 'scripts/components/timeline-scrubber'
  }]
});

require([

  'stylie'

], function (

  Stylie

) {
  window.stylie = new Stylie(document.getElementById('stylie'));
});
