require(['src/utils', 'src/css-gen', 'src/ui/checkbox', 'src/ui/button',
        'src/ui/select', 'src/ui/auto-update-textfield', 'src/ui/ease-field',
        'src/ui/crosshair'],
    function (utils, cssGen, checkbox, button,
        select, autoUpdateTextfield, easeField,
        crosshair) {

  var app = {
    'config': {}
    ,'const': {}
    ,'util': {}
    ,'view': {}
  };

  app.const.PRERENDER_GRANULARITY = 100;
  utils.init(app);

  // The code in these are deliberately using some weird formatting.  The code
  // within gets used as a string.  Like magic!
  Tweenable.prototype.formula.customEase1 =
      function (x) {return Math.pow(x, 4)};

  Tweenable.prototype.formula.customEase2 =
      function (x) {return Math.pow(x, 0.25)};

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
        this.app.util.moveLastKeyframe(this.app.config.circle, validVal);
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

  var canvas = $('canvas')[0];
  app.kapi = new Kapi(canvas, {
      'fps': 60
      ,'height': 400
      ,'width': 500
    });
  app.config.circle = new Kapi.Actor({
    'draw': function (canvas_context, state) {

      if (app.config.isPathShowing && app.config.prerenderedPath) {
        canvas_context.drawImage(app.config.prerenderedPath, 0, 0);
      }

      canvas_context.beginPath();
        canvas_context.arc(
          state.x || 0,
          state.y || 0,
          state.radius || 50,
          0,
          Math.PI*2,
          true);
        canvas_context.fillStyle = state.color || '#444';
        canvas_context.fill();
        canvas_context.closePath();
        return this;
      }
    });
  app.kapi.canvas_style('background', '#eee');

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

  app.kapi.addActor(app.config.circle);
  app.config.circle.keyframe(0,
        _.extend(app.config.crosshairs.from.getCenter(), {
      'color': '#777'
      ,'radius': 15
    }))
    .keyframe(app.config.initialDuration,
        _.extend(app.config.crosshairs.to.getCenter(), {
      'color': '#333'
    }));

  app.kapi.controls = new RekapiScrubber(app.kapi);
  app.util.updatePath();
  app.kapi.play();
  app.kapi.pause();

  app.view.showPathView = new checkbox.view({

    'app': app

    ,'$el': $('#show-path')

    ,'onChange': function (evt) {
      var checked = this.$el.attr('checked');
      this.app.config.isPathShowing = !!checked;
      this.app.kapi.redraw();
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
