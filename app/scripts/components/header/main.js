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

  var HeaderComponent = Base.extend({
    name: 'header'
    ,Model: Model
    ,View: View
    ,template: template
  });

  return HeaderComponent;
});
