define([

  'lateralus'

  ,'./view'
  ,'./model'
  ,'text!./template.mustache'

], function (

  Lateralus

  ,View
  ,Model
  ,template

) {
  'use strict';

  var Base = Lateralus.Component;

  var BezierizerComponent = Base.extend({
    name: 'bezierizer'
    ,View: View
    ,Model: Model
    ,template: template
  });

  return BezierizerComponent;
});
