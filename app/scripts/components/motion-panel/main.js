define([

  'lateralus'

  ,'./view'
  ,'text!./template.mustache'

  ,'stylie.component.bezierizer'

], function (

  Lateralus

  ,View
  ,template

  ,BezierizerComponent

) {
  'use strict';

  var MotionPanelComponent = Lateralus.Component.extend({
    name: 'motion-panel'
    ,View: View
    ,template: template

    ,initialize: function () {
      this.addComponent(BezierizerComponent, {
        el: this.view.$bezierizer
      });
    }
  });

  return MotionPanelComponent;
});
