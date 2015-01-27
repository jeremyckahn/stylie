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

  var TooSmallMessageComponent = Base.extend({
    name: 'too-small-message'
    ,Model: Model
    ,View: View
    ,template: template
  });

  return TooSmallMessageComponent;
});
