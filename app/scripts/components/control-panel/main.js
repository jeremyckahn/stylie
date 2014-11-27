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

  var ControlPanelComponent = Lateralus.Component.extend({
    name: 'control-panel'
    ,View: View
    ,template: template
  });

  return ControlPanelComponent;
});
