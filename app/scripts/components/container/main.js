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

  var ContainerComponent = Lateralus.Component.extend({
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
