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

  var HelpComponent = Base.extend({
    name: 'help'
    ,Model: Model
    ,View: View
    ,template: template
  });

  return HelpComponent;
});
