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

  var CrosshairComponent = Base.extend({
    name: 'crosshair'
    ,Model: Model
    ,View: View
    ,template: template
  });

  return CrosshairComponent;
});
