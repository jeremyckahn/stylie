define([

  'lateralus'

  ,'text!./template.mustache'

], function (

  Lateralus

  ,template

) {
  'use strict';

  var Base = Lateralus.Component.View;
  var baseProto = Base.prototype;

  var TimelineScrubberComponentView = Base.extend({
    template: template

    ,lateralusEvents: {
      /**
       * @param {boolean} isPlaying
       */
      rekapiPlayStateChange: function (isPlaying) {
        this.syncToRekapiPlayState(isPlaying);
      }

      /**
       * @param {RekapiComponent} rekapiComponent
       */
      ,timelineModified: function (rekapiComponent) {
        this.syncScrubberToRekapi(rekapiComponent);
      }

      /**
       * @param {RekapiComponent} rekapiComponent
       */
      ,animationHasUpdated: function (rekapiComponent) {
        this.syncScrubberToRekapi(rekapiComponent);
      }
    }

    ,events: {
      'click .play': function () {
        this.emit('userRequestPlay');
      }

      ,'click .pause': function () {
        this.emit('userRequestPause');
      }

      ,'click .stop': function () {
        this.emit('userRequestStop');
      }

      ,'mousedown .scrubber': function () {
        this.emit('userRequestPause');
      }

      ,'change .scrubber': function () {
        this.syncRekapiToScrubber();
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
    }

    /**
     * @param {boolean} isPlaying
     */
    ,syncToRekapiPlayState: function (isPlaying) {
      if (isPlaying) {
        this.$play.addClass('hide');
        this.$pause.removeClass('hide');
      } else {
        this.$play.removeClass('hide');
        this.$pause.addClass('hide');
      }
    }

    /**
     * @param {RekapiComponent} rekapiComponent
     */
    ,syncScrubberToRekapi: function (rekapiComponent) {
      var rekapi = rekapiComponent.rekapi;
      var animationLength = rekapi.getAnimationLength();
      this.$scrubber
        .attr('max', animationLength)
        .val(rekapi.getLastPositionUpdated() * animationLength);
    }

    ,syncRekapiToScrubber: function () {
      this.emit('userRequestSetPlayheadMillisecond', this.$scrubber.val());
    }
  });

  return TimelineScrubberComponentView;
});
