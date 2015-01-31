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

  var ManagementPanelComponent = Base.extend({
    name: 'management-panel'
    ,View: View
    ,template: template
  });

  return ManagementPanelComponent;
});
