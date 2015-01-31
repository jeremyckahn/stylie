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

  var Base = Lateralus.Component;

  var CrosshairContainerComponent = Base.extend({
    name: 'crosshair-container'
    ,View: View
    ,template: template
  });

  return CrosshairContainerComponent;
});
