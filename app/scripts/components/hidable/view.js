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
     * @param {boolean=} [options.startHidden]
     * @param {number=} [options.targetShowOpacity]
     */
    initialize: function (options) {
      baseProto.initialize.apply(this, arguments);
      this.isHidden = !!options.startHidden;
      this.targetShowOpacity = options.targetShowOpacity || 1;

      if (this.isHidden) {
        this.hideCallback();
      }

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
          ,opacity: this.targetShowOpacity
        }).keyframe(constant.HIDABLE_VIEW_TRANSITION_DURATION, {
          scale: 0
          ,opacity: 0
          ,'function': this.hideCallback.bind(this)
        }, {
          scale: 'easeInBack'
          ,opacity: 'easeOutQuad'
        });

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
          ,opacity: this.targetShowOpacity
          ,'function': function () {
            this.isHidden = false;
          }.bind(this)
        }, {
          scale: 'swingTo'
          ,opacity: 'easeInQuad'
        });

      this.actor.rekapi.play(1);
    }

    ,hideCallback: function () {
      this.$el.css('display', 'none');
      this.isHidden = true;
    }

    ,toggle: function () {
      this[this.isHidden ? 'show' : 'hide']();
    }
  });

  return HidableComponentView;
});
