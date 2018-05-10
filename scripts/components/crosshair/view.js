import _ from 'underscore';
import Lateralus from 'lateralus';
import kd from 'keydrown';
import template from 'text!./template.mustache';
import 'jquery-mousewheel';
import 'jquery-cubelet';

const Base = Lateralus.Component.View;
const baseProto = Base.prototype;

const CrosshairComponentView = Base.extend({
  template: template,

  lateralusEvents: {
    /**
     * @param {boolean} isRotationModeEnabled
     */
    'change:isRotationModeEnabled': function(isRotationModeEnabled) {
      if (isRotationModeEnabled) {
        this.enableRotationEditMode();
      } else {
        this.disableRotationEditMode();
      }
    },

    /**
     * @param {{
     *   x: number,
     *   y: number,
     *   rotationX: number,
     *   rotationY: number,
     *   rotationZ: number,
     *   scale: number
     * }} diff
     */
    moveSelectedCrosshairByDiff: function(diff) {
      if (this.isPrimarySelectedCrosshair || !this.model.get('isSelected')) {
        return;
      }

      const attrs = this.model.toJSON();
      this.model.set({
        x: attrs.x + diff.x,
        y: attrs.y + diff.y,
        rotationX: attrs.rotationX + diff.rotationX,
        rotationY: attrs.rotationY + diff.rotationY,
        rotationZ: attrs.rotationZ + diff.rotationZ,
        scale: attrs.scale + diff.scale,
      });
    },
  },

  modelEvents: {
    /**
     * @param {KeyframePropertyModel} model
     * @param {Object} options
     * @param {boolean} options.changedByCrosshairView
     */
    change: function(model, options) {
      if (!options.changedByCrosshairView) {
        this.render();
      }
    },

    /**
     * @param {KeyframePropertyModel} model
     * @param {boolean} isSelected
     */
    'change:isSelected': function(model, isSelected) {
      this.$el[isSelected ? 'addClass' : 'removeClass']('selected');
    },

    remove: function() {
      this.component.dispose();
    },
  },

  events: {
    drag: function() {
      this.setUiStateToModel();
    },

    dragStart: function() {
      this.emit('requestRecordUndoState');
    },

    click: function() {
      if (kd.SHIFT.isDown()) {
        this.model.set('isSelected', !this.model.get('isSelected'));
      }
    },

    'mousedown .cubelet-container': function() {
      this.emit('requestRecordUndoState');
    },

    'change .rotation-control': function() {
      this.setUiStateToModel();
      this.render();
    },
  },

  /**
   * @param {Object} options See http://backbonejs.org/#View-constructor
   * @param {KeyframePropertyModel} options.model
   */
  initialize: function() {
    baseProto.initialize.apply(this, arguments);
    this.isPrimarySelectedCrosshair = false;

    this.$rotationControl.cubeletInit().cubeletHide();

    // The element must be hidden upon initial render to prevent a brief
    // flash of it being in the wrong position.  It is shown after being
    // positioned in deferredInitialize.
    this.$el.css('display', 'none');
  },

  deferredInitialize: function() {
    // Check to see if this View's component/model has been torn down and
    // abort if so.  This can happen if the user is making rapid undo inputs.
    if (!_.size(this.model)) {
      return;
    }

    this.$el.dragon({
      within: this.$el.parent(),
    });

    this.render();

    if (this.lateralus.model.get('isRotationModeEnabled')) {
      this.enableRotationEditMode();
    }

    this.$el.css('display', '');
  },

  render: function() {
    const json = this.model.toJSON();
    const halfBoxSize = this.$el.height() / 2;

    // Orient to the center of the crosshair, not the top-left
    this.$el.css({
      top: json.y - halfBoxSize,
      left: json.x - halfBoxSize,
    });

    this.$dashmarkContainer.css(
      'transform',
      this.getRotationTransformStringFromModel()
    );

    this.$rotationControl.cubeletSetCoords({
      x: json.rotationX,
      y: json.rotationY,
      z: json.rotationZ,
      scale: json.scale,
    });
  },

  /**
   * @return {string}
   */
  getRotationTransformStringFromModel: function() {
    const json = this.model.toJSON();

    return (
      'rotateX(' +
      json.rotationX +
      'deg) rotateY(' +
      json.rotationY +
      'deg) rotateZ(' +
      json.rotationZ +
      'deg) scale(' +
      json.scale +
      ')'
    );
  },

  setUiStateToModel: function() {
    const cubeletCoords = this.$rotationControl.cubeletGetCoords();
    const halfBoxSize = this.$el.height() / 2;

    this.model.set(
      {
        // Orient to the center of the crosshair, not the top-left
        x: parseInt(this.$el.css('left')) + halfBoxSize,
        y: parseInt(this.$el.css('top')) + halfBoxSize,

        rotationX: cubeletCoords.x,
        rotationY: cubeletCoords.y,
        rotationZ: cubeletCoords.z,
        scale: cubeletCoords.scale,
      },
      {
        changedByCrosshairView: true,
      }
    );

    const previousAttributes = this.model.previousAttributes();
    const attrs = this.model.toJSON();
    const diff = {
      x: attrs.x - previousAttributes.x,
      y: attrs.y - previousAttributes.y,
      rotationX: attrs.rotationX - previousAttributes.rotationX,
      rotationY: attrs.rotationY - previousAttributes.rotationY,
      rotationZ: attrs.rotationZ - previousAttributes.rotationZ,
      scale: attrs.scale - previousAttributes.scale,
    };

    if (this.model.get('isSelected')) {
      this.isPrimarySelectedCrosshair = true;
      this.emit('moveSelectedCrosshairByDiff', diff);
      this.isPrimarySelectedCrosshair = false;
    }
  },

  enableRotationEditMode: function() {
    this.$el.dragonDisable();
    this.$rotationControl.cubeletShow();
  },

  disableRotationEditMode: function() {
    this.$el.dragonEnable();
    this.$rotationControl.cubeletHide();
  },
});

export default CrosshairComponentView;
