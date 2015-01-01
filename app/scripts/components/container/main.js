define([

  'lateralus'

  ,'./view'
  ,'text!./template.mustache'

  ,'stylie.component.control-panel'
  ,'stylie.component.preview'

], function (

  Lateralus

  ,View
  ,template

  ,ControlPanelComponent
  ,PreviewComponent

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

      this.previewComponent = this.addComponent(PreviewComponent, {
        el: this.view.$preview
      });
    }
  });

  return ContainerComponent;
});
