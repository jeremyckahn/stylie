define([

  'lateralus'

  ,'./view'
  ,'text!./template.mustache'

], function (

  Lateralus

  ,View
  ,template

) {
  'use strict';

  var KeyframesPanelComponent = Lateralus.Component.extend({
    name: 'keyframes-panel'
    ,View: View
    ,template: template
  });

  return KeyframesPanelComponent;
});
