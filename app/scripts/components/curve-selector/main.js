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

  var CurveSelectorComponent = Lateralus.Component.extend({
    name: 'curve-selector'
    ,View: View
    ,template: template
  });

  return CurveSelectorComponent;
});
