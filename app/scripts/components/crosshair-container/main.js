define([

  'lateralus'

  ,'./model'
  ,'./view'
  ,'text!./template.mustache'

], function (

  Lateralus

  ,Model
  ,View
  ,template

) {
  'use strict';

  var Base = Lateralus.Component;

  var CrosshairContainerComponent = Base.extend({
    name: 'crosshair-container'
    ,Model: Model
    ,View: View
    ,template: template

    ,lateralusEvents: {
      /**
       * @param {KeyframePropertyModel} keyframePropertyModel
       */
      keyframePropertyAdded: function (keyframePropertyModel) {
        this.view.addCrosshair(keyframePropertyModel);
      }
    }

  });

  return CrosshairContainerComponent;
});
