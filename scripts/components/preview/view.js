import _ from 'underscore';
import Lateralus from 'lateralus';
import kd from 'keydrown';
import template from 'text!./template.mustache';

const Base = Lateralus.Component.View;
const baseProto = Base.prototype;

const PreviewComponentView = Base.extend({
  template: template,

  lateralusEvents: {
    userRequestEnableKeyframeSelection: function() {
      this.$el.addClass('keyframe-selection-mode-enabled');
    },

    userRequestDisableKeyframeSelection: function() {
      this.$el.removeClass('keyframe-selection-mode-enabled');
    },
  },

  events: {
    /**
     * @param {jQuery.Event} evt
     */
    mouseup: function(evt) {
      const lastMouseDownCoords = this.lastMouseDownCoords;

      if (
        !kd.SHIFT.isDown() &&
        evt.clientX === lastMouseDownCoords.clientX &&
        evt.clientY === lastMouseDownCoords.clientY
      ) {
        this.emit('userRequestDeselectAllKeyframes');
      }
    },

    /**
     * @param {jQuery.Event} evt
     */
    mousedown: function(evt) {
      this.lastMouseDownCoords = _.pick(evt, 'clientX', 'clientY');
    },
  },

  /**
   * @param {Object} [options] See http://backbonejs.org/#View-constructor
   */
  initialize: function() {
    baseProto.initialize.apply(this, arguments);
    this.lastMouseDownCoords = {};
  },
});

export default PreviewComponentView;
