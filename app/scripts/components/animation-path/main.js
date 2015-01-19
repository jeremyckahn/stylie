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

  var AnimationPathComponent = Base.extend({
    name: 'animation-path'
    ,Model: Model
    ,View: View
    ,template: template
  });

  return AnimationPathComponent;
});
