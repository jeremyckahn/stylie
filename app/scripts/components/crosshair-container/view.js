define([

  'lateralus'

  ,'text!./template.mustache'

  ,'../crosshair/main'

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

    ,lateralusEvents: {
      /**
       * @param {boolean} showPath
       */
      userRequestUpdateShowPathSetting: function (showPath) {
        this.$el[showPath ? 'removeClass' : 'addClass']('transparent');
      }

      /**
       * @param {KeyframePropertyModel} keyframePropertyModel
       */
      ,keyframePropertyAdded: function (keyframePropertyModel) {
        this.addCrosshair(keyframePropertyModel);
      }

      ,userRequestStartRotationEditMode: function () {
        this.setRotationModeEnablement(true);
      }

      ,userRequestEndRotationEditMode: function () {
        this.setRotationModeEnablement(false);
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);

      if (!this.lateralus.model.getUi('showPath')) {
        this.$el.addClass('transparent');
      }
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
