define([

  'lateralus'

  ,'./model'
  ,'./view'
  ,'text!./template.mustache'

], function (

  Lateralus

  ,Model
  ,View
  ,template

) {
  'use strict';

  var Base = Lateralus.Component;

  var CrosshairContainerComponent = Base.extend({
    name: 'crosshair-container'
    ,Model: Model
    ,View: View
    ,template: template
  });

  return CrosshairContainerComponent;
});
