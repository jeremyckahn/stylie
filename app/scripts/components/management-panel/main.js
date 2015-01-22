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

  var ManagementPanelComponent = Base.extend({
    name: 'management-panel'
    ,Model: Model
    ,View: View
    ,template: template
  });

  return ManagementPanelComponent;
});
