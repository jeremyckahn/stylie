define([

  'lateralus'

  ,'./model'
  ,'./view'
  ,'text!./template.mustache'

  ,'stylie.component.crosshair-container'

], function (

  Lateralus

  ,Model
  ,View
  ,template

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
      this.addComponent(CrosshairContainerComponent, {
        el: this.view.$crosshairContainer.el
      });
    }
  });

  return PreviewComponent;
});
