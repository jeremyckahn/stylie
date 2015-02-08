define([

  'lateralus'

  ,'./view'
  ,'text!./template.mustache'

  ,'stylie.component.keybindings'
  ,'stylie.component.header'
  ,'stylie.component.login'
  ,'stylie.component.help'
  ,'stylie.component.too-small-message'
  ,'stylie.component.control-panel'
  ,'stylie.component.preview'

], function (

  Lateralus

  ,View
  ,template

  ,KeybindingsComponent
  ,HeaderComponent
  ,LoginComponent
  ,HelpComponent
  ,TooSmallMessageComponent
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

      this.headerComponent = this.addComponent(HeaderComponent, {
        el: this.view.$header[0]
      });

      this.loginComponent = this.addComponent(LoginComponent, {
        el: this.view.$login[0]
      });

      this.helpComponent = this.addComponent(HelpComponent, {
        el: this.view.$help[0]
      });

      this.tooSmallMessageComponent = this.addComponent(
          TooSmallMessageComponent, {
        el: this.view.$tooSmallMessage[0]
      });

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
