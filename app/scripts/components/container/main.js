define([

  'lateralus'

  ,'./view'
  ,'text!./template.mustache'

  ,'stylie.component.control-panel'

], function (

  Lateralus

  ,View
  ,template

  ,ControlPanelComponent

) {
  'use strict';

  var Base = Lateralus.Component;

  var ContainerComponent = Base.extend({
    name: 'container'
    ,View: View
    ,template: template

    ,initialize: function () {
      this.controlPanelComponent = this.addComponent(ControlPanelComponent, {
        el: this.view.$controlPanel
      });
    }
  });

  return ContainerComponent;
});
