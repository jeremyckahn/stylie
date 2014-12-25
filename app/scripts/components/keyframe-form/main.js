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

  var KeyframeFormComponent = Base.extend({
    name: 'keyframe-form'
    ,View: View
    ,template: template
  });

  return KeyframeFormComponent;
});
