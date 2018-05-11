import Lateralus from 'lateralus';
import template from 'text!./template.mustache';
import CrosshairComponent from '../crosshair/main';

const Base = Lateralus.Component.View;
const baseProto = Base.prototype;

const CrosshairContainerComponentView = Base.extend({
  template,

  lateralusEvents: {
    /**
     * @param {boolean} showPath
     */
    userRequestUpdateShowPathSetting(showPath) {
      this.$el[showPath ? 'removeClass' : 'addClass']('transparent');
    },

    /**
     * @param {KeyframePropertyModel} keyframePropertyModel
     */
    keyframePropertyAdded(keyframePropertyModel) {
      this.addCrosshair(keyframePropertyModel);
    },

    userRequestStartRotationEditMode() {
      this.setRotationModeEnablement(true);
    },

    userRequestEndRotationEditMode() {
      this.setRotationModeEnablement(false);
    },
  },

  /**
   * @param {Object} [options] See http://backbonejs.org/#View-constructor
   */
  initialize() {
    baseProto.initialize.apply(this, arguments);

    if (!this.lateralus.model.getUi('showPath')) {
      this.$el.addClass('transparent');
    }
  },

  /**
   * @param {KeyframePropertyModel} keyframePropertyModel
   */
  addCrosshair(keyframePropertyModel) {
    const crosshairEl = document.createElement('div');

    const crosshairComponent = this.addComponent(CrosshairComponent, {
      el: crosshairEl,
      model: keyframePropertyModel,
    });

    crosshairComponent.view.$el.appendTo(this.$el);
  },

  /**
   * @param {boolean} enabled
   */
  setRotationModeEnablement(enabled) {
    this.$el[enabled ? 'addClass' : 'removeClass']('rotation-mode');
  },
});

export default CrosshairContainerComponentView;
