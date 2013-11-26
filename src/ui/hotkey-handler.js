define([

  'underscore'
  ,'backbone'
  ,'minpubsub'

  ,'src/app'
  ,'src/constants'

], function (

  _
  ,Backbone
  ,MinPubSub

  ,app
  ,constant

) {

  return Backbone.View.extend({

    'events': {
      'keydown': 'onKeydown'
      ,'keyup': 'onKeyup'
    }

    ,'initialize': function (opts) {
      _.extend(this, opts);
      this._isShiftHeldDown = false;
    }

    ,'onKeydown': function (evt) {
      // Effectively checks that no element was focused.
      if (evt.target !== this.$el[0]) {
        return;

      } else if (evt.shiftKey) {
        this.$el.addClass('shift-down');
        this._isShiftHeldDown = true;
        MinPubSub.publish(constant.ROTATION_MODE_START);

      } else if (evt.keyCode === 67) { // "C" key
        app.view.controlPane.toggle();

      } else if (evt.keyCode === 72) { // "H" key
        app.view.helpModal.toggle();

      } else if (evt.keyCode === 32) { // Space bar
        if (app.kapi.isPlaying()) {
          app.kapi.pause();
        } else {
          app.kapi.play();
        }
      } else if (evt.keyCode === 84) { // "T" key
        app.view.rekapiControls.fadeToggle();
      } else if (evt.keyCode === 75) { // "K" key
        app.collection.actors.getCurrent()
          .appendNewKeyframeWithDefaultProperties();
      }
    }

    ,'onKeyup': function (evt) {
      if (this._isShiftHeldDown) {
        this._isShiftHeldDown = false;
        this.$el.removeClass('shift-down');
        MinPubSub.publish(constant.ROTATION_MODE_STOP);
      }
    }

  });

});
