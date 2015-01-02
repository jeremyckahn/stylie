define([

  'lateralus'

  ,'./view'
  ,'text!./template.mustache'

  ,'stylie.component.keybindings'
  ,'stylie.component.control-panel'
  ,'stylie.component.preview'

], function (

  Lateralus

  ,View
  ,template

  ,KeybindingsComponent
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
      this.keybindingsComponent = this.addComponent(KeybindingsComponent);

      this.controlPanelComponent = this.addComponent(ControlPanelComponent, {
        el: this.view.$controlPanel[0]
      });

      this.previewComponent = this.addComponent(PreviewComponent, {
        el: this.view.$preview[0]
      });
    }
  });

  return ContainerComponent;
});
