define([

  'lateralus'

  ,'text!./template.mustache'

  ,'stylie.component.crosshair'

], function (

  Lateralus

  ,template

  ,CrosshairComponent

) {
  'use strict';

  var Base = Lateralus.Component.View;
  var baseProto = Base.prototype;

  var CrosshairContainerComponentView = Base.extend({
    template: template

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
    }

    /**
     * @param {KeyframePropertyModel} keyframePropertyModel
     */
    ,addCrosshair: function (keyframePropertyModel) {
      var crosshairEl = document.createElement('div');

      var crosshairComponent = this.addComponent(CrosshairComponent, {
        el: crosshairEl
        ,model: keyframePropertyModel
      });

      crosshairComponent.view.$el.appendTo(this.$el);
    }

    /**
     * @param {boolean} enabled
     */
    ,setRotationModeEnablement: function (enabled) {
      this.$el[enabled ? 'addClass' : 'removeClass']('rotation-mode');
    }
  });

  return CrosshairContainerComponentView;
});
