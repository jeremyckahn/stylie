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

  var KeyframeFormComponent = Lateralus.Component.extend({
    name: 'keyframe-form'
    ,View: View
    ,template: template
  });

  return KeyframeFormComponent;
});
