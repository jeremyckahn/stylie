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
    ,'aenima.constant': 'bower_components/aenima/constant'
    ,'aenima.utils': 'bower_components/aenima/utils'
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
    name: 'aenima.component.shifty'
    ,location: 'bower_components/aenima/components/shifty'
  }, {
    name: 'aenima.component.rekapi'
    ,location: 'bower_components/aenima/components/rekapi'
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
    name: 'aenima.component.control-panel'
    ,location: 'bower_components/aenima/components/control-panel'
  }, {
    name: 'stylie.component.control-panel'
    ,location: 'scripts/components/control-panel'
  }, {
    name: 'stylie.component.keyframes-panel'
    ,location: 'scripts/components/keyframes-panel'
  }, {
    name: 'aenima.component.motion-panel'
    ,location: 'bower_components/aenima/components/motion-panel'
  }, {
    name: 'aenima.component.export-panel'
    ,location: 'bower_components/aenima/components/export-panel'
  }, {
    name: 'aenima.component.css-export-panel'
    ,location: 'bower_components/aenima/components/css-export-panel'
  }, {
    name: 'aenima.component.rekapi-export-panel'
    ,location: 'bower_components/aenima/components/rekapi-export-panel'
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
    name: 'aenima.component.bezierizer'
    ,location: 'bower_components/aenima/components/bezierizer'
  }, {
    name: 'aenima.component.curve-selector'
    ,location: 'bower_components/aenima/components/curve-selector'
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
