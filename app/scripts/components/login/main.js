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

  var LoginComponent = Base.extend({
    name: 'login'
    ,Model: Model
    ,View: View
    ,template: template
  });

  return LoginComponent;
});
