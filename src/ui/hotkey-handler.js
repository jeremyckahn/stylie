define(function () {

  return Backbone.View.extend({

    'events': {
      'keydown': 'onKeydown'
      ,'keyup': 'onKeyup'
    }

    ,'initialize': function (opts) {
      _.extend(this, opts);
    }

    ,'onKeydown': function (evt) {
      // Effectively checks that no element was focused.
      if (evt.target !== this.$el[0]) {
        return;

      } else if (evt.shiftKey) {
        this.$el.addClass('shift-down');

      } else if (evt.keyCode === 67) { // "C" key
        this.app.view.controlPaneView.toggle();

      } else if (evt.keyCode === 72) { // "H" key
        this.app.view.helpModal.toggle();

      } else if (evt.keyCode === 32) { // Space bar
        this.app.kapi.isPlaying()
          ? this.app.kapi.pause()
          : this.app.kapi.play();
      } else if (evt.keyCode === 84) { // "T" key
        this.app.view.rekapiControls.fadeToggle();
      }
    }

    ,'onKeyup': function (evt) {
      this.$el.removeClass('shift-down');
    }

  });

});
