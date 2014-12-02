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

  var MotionPanelComponent = Lateralus.Component.extend({
    name: 'motion-panel'
    ,View: View
    ,template: template
  });

  return MotionPanelComponent;
});
