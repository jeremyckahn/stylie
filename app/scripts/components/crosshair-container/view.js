define([

  'lateralus'

  ,'text!./template.mustache'

  ,'stylie.component.crosshair'

  ,'../../constant'

], function (

  Lateralus

  ,template

  ,CrosshairComponent

  ,constant

) {
  'use strict';

  var Base = Lateralus.Component.View;
  var baseProto = Base.prototype;

  var CrosshairContainerComponentView = Base.extend({
    template: template

    ,lateralusEvents: {
      userRequestUpdateShowPathSetting: function () {
        this.$el.fadeToggle(constant.PATH_TOGGLE_TRANSITION_DURATION);
      }
    }

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
