define([

  'keydrown'

  ,'src/constants'

], function (

  kd

  ,constant

) {

  var bodyClassList = document.body.classList;

  /**
   * @param {Stylie} stylie
   */
  function Keybindings (stylie) {
    this.stylie = stylie;

    kd.run(kd.tick.bind(kd));

    kd.SHIFT.press(this.ifNotFocused(function () {
      if (!bodyClassList.contains('is-dragging-crosshair')) {
        bodyClassList.add('shift-down');
        this.stylie.trigger(constant.ROTATION_MODE_START);
      }
    }));

    kd.SHIFT.up(this.ifNotFocused(function () {
      bodyClassList.remove('shift-down');
      this.stylie.trigger(constant.ROTATION_MODE_STOP);
    }));

    kd.SPACE.press(this.ifNotFocused(function () {
      if (this.stylie.rekapi.isPlaying()) {
        this.stylie.rekapi.pause();
      } else {
        this.stylie.rekapi.play();
      }
    }));

    kd.C.press(this.ifNotFocused(function () {
      this.stylie.view.controlPane.toggle();
    }));

    kd.H.press(this.ifNotFocused(function () {
      this.stylie.view.helpModal.toggle();
    }));

    kd.T.press(this.ifNotFocused(function () {
      this.stylie.view.rekapiControls.fadeToggle();
    }));

    kd.K.press(this.ifNotFocused(function () {
      this.stylie.actorCollection.getCurrent()
        .appendNewKeyframeWithDefaultProperties();
    }));

    kd.P.press(this.ifNotFocused(function () {
      this.stylie.view.showPath.$el.click();
    }));

  }

  /**
   * @param {Function} keyHandler
   * @return {Function}
   */
  Keybindings.prototype.ifNotFocused = function (keyHandler) {
    return function () {
      if (document.activeElement === document.body) {
        keyHandler.call(this);
      }
    }.bind(this);
  };

  return Keybindings;
});
