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

  var CurveSelectorComponent = Base.extend({
    name: 'curve-selector'
    ,View: View
    ,template: template
  });

  return CurveSelectorComponent;
});
