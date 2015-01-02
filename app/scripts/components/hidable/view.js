define([

  'lateralus'

  ,'rekapi'

  ,'../../constant'

], function (

  Lateralus

  ,Rekapi

  ,constant

) {
  'use strict';

  var Base = Lateralus.Component.View;
  var baseProto = Base.prototype;

  var HidableComponentView = Base.extend({
    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    initialize: function () {
      baseProto.initialize.apply(this, arguments);
      this.isHidden = false;

      this.actor = (new Rekapi(this.el)).addActor({
        context: this.el
      });
    }

    ,hide: function () {
      if (this.actor.rekapi.isPlaying()) {
        return;
      }


      this.actor
        .removeAllKeyframes()
        .keyframe(0, {
          scale: 1
          ,opacity: 1
        }).keyframe(constant.HIDABLE_VIEW_TRANSITION_DURATION, {
          scale: 0
          ,opacity: 0
          ,'function': function () {
            this.$el.css('display', 'none');
            this.isHidden = true;
          }.bind(this)
        }, 'easeInBack');

      this.actor.rekapi.play(1);
    }

    ,show: function () {
      if (this.actor.rekapi.isPlaying()) {
        return;
      }

      this.$el.css('display', '');

      this.actor
        .removeAllKeyframes()
        .keyframe(0, {
          scale: 0
          ,opacity: 0
        }).keyframe(constant.HIDABLE_VIEW_TRANSITION_DURATION, {
          scale: 1
          ,opacity: 1
          ,'function': function () {
            this.isHidden = false;
          }.bind(this)
        }, 'swingTo');

      this.actor.rekapi.play(1);
    }

    ,toggle: function () {
      this[this.isHidden ? 'show' : 'hide']();
    }
  });

  return HidableComponentView;
});
