define([

  'lateralus'

  ,'./view'
  ,'text!./template.mustache'

  ,'../header/main'
  ,'../help/main'
  ,'../too-small-message/main'
  ,'../control-panel/main'
  ,'../preview/main'

], function (

  Lateralus

  ,View
  ,template

  ,HeaderComponent
  ,HelpComponent
  ,TooSmallMessageComponent
  ,ControlPanelComponent
  ,PreviewComponent

) {
  'use strict';

  var Base = Lateralus.Component;

  var ContainerComponent = Base.extend({
    name: 'stylie-container'
    ,View: View
    ,template: template

    ,initialize: function () {
      if (!this.lateralus.model.get('isEmbedded')) {
        this.headerComponent = this.addComponent(HeaderComponent, {
          el: this.view.$header[0]
        });

        this.helpComponent = this.addComponent(HelpComponent, {
          el: this.view.$help[0]
        });

        this.tooSmallMessageComponent = this.addComponent(
            TooSmallMessageComponent, {
          el: this.view.$tooSmallMessage[0]
        });
      }

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
