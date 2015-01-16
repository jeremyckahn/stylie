define([

  'lateralus'

  ,'./model'
  ,'./view'
  ,'text!./template.mustache'

  ,'stylie.component.animation-path'
  ,'stylie.component.crosshair-container'

], function (

  Lateralus

  ,Model
  ,View
  ,template

  ,AnimationPathComponent
  ,CrosshairContainerComponent

) {
  'use strict';

  var Base = Lateralus.Component;

  var PreviewComponent = Base.extend({
    name: 'preview'
    ,Model: Model
    ,View: View
    ,template: template

    ,initialize: function () {
      this.addComponent(AnimationPathComponent, {
        el: this.view.$animationPath[0]
      });

      this.addComponent(CrosshairContainerComponent, {
        el: this.view.$crosshairContainer[0]
      });
    }
  });

  return PreviewComponent;
});
