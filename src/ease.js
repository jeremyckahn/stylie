require(['src/utils', 'src/css-gen', 'src/ui/checkbox', 'src/ui/button',
        'src/ui/select', 'src/ui/auto-update-textfield', 'src/ui/ease-field',
        'src/ui/crosshair', 'src/ui/canvas'],
    function (utils, cssGen, checkbox, button,
        select, autoUpdateTextfield, easeField,
        crosshair, canvas) {

  var app = {
    'config': {}
    ,'const': {}
    ,'util': {}
    ,'view': {}
  };

  app.const.PRERENDER_GRANULARITY = 100;
  utils.init(app);

  Tweenable.prototype.formula.customEase1 = function (x) {
    return Math.pow(x, 4);
  };

  Tweenable.prototype.formula.customEase2 = function (x) {
    return Math.pow(x, 0.25);
  };

  app.config.selects = {
    'x': new select.view({
      '$el': $('#x-easing')
      ,'app': app
    })

    ,'y': new select.view({
      '$el': $('#y-easing')
      ,'app': app
    })
  };

  app.view.durationField = new autoUpdateTextfield.view({

    'app': app

    ,'$el': $('#duration')

    ,'ARROW_KEY_INCREMENT': 10

    ,'onValReenter': function (val) {
      if (!isNaN(val)) {
        var validVal = Math.abs(val);
        this.app.util.moveLastKeyframe(this.app.config.currentActor, validVal);
      }
    }

    ,'tweakVal': function (tweakAmount) {
      this.$el.val(parseInt(app.config.animationDuration, 10) + tweakAmount);
      this.$el.trigger('keyup');
    }

    ,'onArrowUp': function () {
      this.tweakVal(this.ARROW_KEY_INCREMENT);
    }

    ,'onArrowDown': function () {
      this.tweakVal(-this.ARROW_KEY_INCREMENT);
    }

  });

  app.config.animationDuration = app.config.initialDuration =
      app.view.durationField.$el.val();

  app.config.easeFields = [];
  $('.ease').each(function (i, el) {
    var easeFieldInst = new easeField.view({
      '$el': $(el)
      ,'app': app
    });

    app.config.easeFields.push(easeFieldInst);
  });

  app.config.crosshairs = {
    'from': new crosshair.view({
        'app': app
        ,'$el': $('.crosshair.from')
      })
    ,'to': new crosshair.view({
        'app': app
        ,'$el': $('.crosshair.to')
      })
  };

  app.canvasView = new canvas.view({
    'app': app
    ,'$el': $('#rekapi-canvas')
    ,'$canvasBG': $('#tween-path')
  });

  app.canvasView.updateDOMBackground();
  app.kapi.play();
  app.kapi.pause();

  app.view.showPathView = new checkbox.view({

    'app': app

    ,'$el': $('#show-path')

    ,'onChange': function (evt) {
      var checked = this.$el.attr('checked');
      this.app.config.isPathShowing = !!checked;
      this.app.kapi.redraw();
      this.app.canvasView.updateDOMBackground();
    }

  });

  app.view.genKeyframesBtn = new button.view({

    'app': app

    ,'$el': $('#gen-keyframes')

    ,'onClick': function (evt) {
      var fromCoords = this.app.config.crosshairs.from.getCenter();
      var toCoords = this.app.config.crosshairs.to.getCenter();
      var points = this.app.util.generatePathPoints(fromCoords.x, fromCoords.y,
          toCoords.x, toCoords.y, app.config.selects.x.$el.val(),
          app.config.selects.y.$el.val());
      console.log(cssGen.generateCSS3Keyframes('foo', points,'-webkit-'));
    }

  });

});
