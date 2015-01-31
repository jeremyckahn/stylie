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

  var AnimationPathComponent = Base.extend({
    name: 'animation-path'
    ,View: View
    ,template: template
  });

  return AnimationPathComponent;
});
