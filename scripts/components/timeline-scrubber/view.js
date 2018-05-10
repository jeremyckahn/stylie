import Lateralus from 'lateralus';
import template from 'text!./template.mustache';
import HidableComponent from 'aenima/components/hidable/main';

const Base = Lateralus.Component.View;
const baseProto = Base.prototype;

const TimelineScrubberComponentView = Base.extend({
  template: template,

  lateralusEvents: {
    /**
     * @param {Rekapi} rekapi
     */
    'rekapi:playStateChange': function(rekapi) {
      this.syncToRekapiPlayState(rekapi.isPlaying());
    },

    /**
     * @param {Rekapi} rekapi
     */
    'rekapi:timelineModified': function(rekapi) {
      this.syncScrubberToRekapi(rekapi);
    },

    /**
     * @param {Rekapi} rekapi
     */
    'rekapi:afterUpdate': function(rekapi) {
      this.syncScrubberToRekapi(rekapi);
    },

    userRequestToggleScrubber: function() {
      this.hidableView.toggle();
    },
  },

  events: {
    'click .play': function() {
      this.emit('userRequestPlay');
    },

    'click .pause': function() {
      this.emit('userRequestPause');
    },

    'click .stop': function() {
      this.emit('userRequestStop');
    },

    'mousedown .scrubber': function() {
      this.emit('userRequestPause');
    },

    'change .scrubber': function() {
      this.syncRekapiToScrubber();
    },
  },

  /**
   * @param {Object} [options] See http://backbonejs.org/#View-constructor
   */
  initialize: function() {
    baseProto.initialize.apply(this, arguments);

    this.hidableView = this.addSubview(HidableComponent.View, {
      el: this.el,
    });
  },

  /**
   * @param {boolean} isPlaying
   */
  syncToRekapiPlayState: function(isPlaying) {
    if (isPlaying) {
      this.$play.addClass('hide');
      this.$pause.removeClass('hide');
    } else {
      this.$play.removeClass('hide');
      this.$pause.addClass('hide');
    }
  },

  /**
   * @param {Rekapi} rekapi
   */
  syncScrubberToRekapi: function(rekapi) {
    const animationLength = rekapi.getAnimationLength();
    this.$scrubber
      .attr('max', animationLength)
      .val(rekapi.getLastPositionUpdated() * animationLength);
  },

  syncRekapiToScrubber: function() {
    this.emit('userRequestSetPlayheadMillisecond', this.$scrubber.val());
  },
});

export default TimelineScrubberComponentView;
