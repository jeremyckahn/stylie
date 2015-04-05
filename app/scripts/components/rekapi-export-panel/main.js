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

  var RekapiExportPanelComponent = Base.extend({
    name: 'rekapi-export-panel'
    ,Model: Model
    ,View: View
    ,template: template
  });

  return RekapiExportPanelComponent;
});
