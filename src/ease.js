require(['src/css-gen', 'src/ui/checkbox', 'src/ui/button',
        'src/ui/auto-update-textfield'],
    function (cssGen, checkbox, button,
        autoUpdateTextField) {

  var app = {
    'config': {}
    ,'const': {}
    ,'util': {}
    ,'view': {}
  };

  app.const.PRERENDER_GRANULARITY = 100;

  app.util.updatePath = function () {
    var fromCoords = app.util.getCrosshairCoords(crosshairs.from);
    var toCoords = app.util.getCrosshairCoords(crosshairs.to);
    app.util.generatePathPrerender(fromCoords.x, fromCoords.y, toCoords.x,
        toCoords.y, selects._from.val(), selects._to.val());
  };

  app.util.initSelect = function (select) {
    _.each(Tweenable.prototype.formula, function (formula, name) {
      var option = $(document.createElement('option'), {
          'value': name
        });

      option.html(name);
      select.append(option);
    });
  };

  app.util.generatePathPoints = function (x1, y1, x2, y2, easeX, easeY) {
    var points = [];
    var from = {
        'x': x1
        ,'y': y1
      };
    var to = {
        'x': x2
        ,'y': y2
      };
    var easing = {
      'x': easeX
      ,'y': easeY
    };
    var i, point;
    for (i = 0; i <= app.const.PRERENDER_GRANULARITY; i++) {
      point = Tweenable.util.interpolate(
          from, to, (1 / app.const.PRERENDER_GRANULARITY) * i, easing);
      points.push(point);
    }

    return points;
  };

  app.util.generatePathPrerender = function (x1, y1, x2, y2, easeX, easeY) {
    app.config.prerenderedPath = document.createElement('canvas');
    app.config.prerenderedPath.width = app.kapi.canvas_width();
    app.config.prerenderedPath.height = app.kapi.canvas_height();
    var ctx = app.config.prerenderedPath.ctx =
        app.config.prerenderedPath.getContext('2d');
    var points = app.util.generatePathPoints.apply(this, arguments);

    var previousPoint;
    ctx.beginPath();
    _.each(points, function (point) {
      if (previousPoint) {
        ctx.lineTo(point.x, point.y);
      } else {
        ctx.moveTo(point.x, point.y);
      }

      previousPoint = point;
    });
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#fa0';
    ctx.stroke();
    ctx.closePath();
  };

  app.util.getCrosshairCoords = function (crosshair) {
    var pos = crosshair.position();
    return {
      x: pos.left + crosshair.width()/2
      ,y: pos.top + crosshair.height()/2
    };
  };

  app.util.moveLastKeyframe = function (actor, toMillisecond) {
    var trackNames = actor.getTrackNames();
    var lastFrameIndex = actor.getTrackLength(trackNames[0]) - 1;

    _.each(trackNames, function (trackName) {
      actor.modifyKeyframeProperty(trackName, lastFrameIndex, {
            'millisecond': toMillisecond
          });
    });

    actor.kapi.updateInternalState();
    app.config.animationDuration = toMillisecond;
  };

  app.util.getFormulaFromEasingFunc = function (fn) {
    var fnString = fn.toString(); // An f'n string
    var indexOfReturn = fnString.indexOf('return');
    var deprefixed = fnString.slice(indexOfReturn + 7);
    var desuffixed = deprefixed.replace(/\}$/, '');
    return desuffixed;
  };

  var SelectView = Backbone.View.extend({

  });

  app.view.durationField = new autoUpdateTextField.view({

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

  // The code in these are deliberately using some weird formatting.  The code
  // within gets used as a string.  Like magic!
  Tweenable.prototype.formula.customEase1 =
      function (x) {return Math.pow(x, 4)};

  Tweenable.prototype.formula.customEase2 =
      function (x) {return Math.pow(x, 0.25)};

  var ease = $('.ease');
  ease.on('keyup', function (evt) {
    var el = $(evt.target);
    var val = el.val();
    var easename = el.data('easename');
    var lastValid = el.data('lastvalidfn');

    if (lastValid === val) {
      return;
    }

    try {
      eval('Tweenable.prototype.formula.' + easename
          + ' = function (x) {return ' + val + '}');
      el.data('lastvalidfn', val);
      el.removeClass('error');
      app.util.updatePath();
    } catch (ex) {
      eval('Tweenable.prototype.formula.' + easename
          + ' = function (x) {return ' + lastValid + '}');
      el.addClass('error');
    }
  });

  ease.each(function (i, el) {
    el = $(el);
    var easename = el.data('easename');
    var fn = Tweenable.prototype.formula[easename];
    var fnString = app.util.getFormulaFromEasingFunc(fn);
    el.val(fnString);
    el.data('lastvalidfn', fnString);
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

  var crosshairs = {
    'from': $('.crosshair.from')
    ,'to': $('.crosshair.to')
  };

  app.util.handleDrag = function (evt, ui) {
    var target = $(evt.target);
    var pos = target.data('pos');
    var timeToModify = pos === 'from' ? 0 : app.config.animationDuration;
    app.config.circle.modifyKeyframe(timeToModify,
        app.util.getCrosshairCoords(crosshairs[pos]));
    app.kapi
      .canvas_clear()
      .redraw();
    app.util.updatePath();
  };

  app.util.handleDragStop = function (evt, ui) {
    app.util.handleDrag.apply(this, arguments);
  };

  crosshairs.from.add(crosshairs.to).draggable({
    'containment': 'parent'
    ,'drag': app.util.handleDrag
    ,'stop': app.util.handleDragStop
  });

  var selects = $('#tween-controls select');

  // TODO: This is reeeeeeeally sloppy, just attaching the selects to $ instance
  // itself. Clean this silliness up.
  selects._from = selects.filter('#x-easing');
  selects._to = selects.filter('#y-easing');

  selects.each(function (i, el) {
    app.util.initSelect($(el));
  });

  selects.on('change', function (evt) {
    var target = $(evt.target);
    var easingObj = {};
    easingObj[target.data('axis')] = target.val();
    app.config.circle.modifyKeyframe(
        app.config.animationDuration, {}, easingObj)
    app.util.updatePath();
    app.kapi
      .canvas_clear()
      .redraw();
  });

  app.kapi.addActor(app.config.circle);
  app.config.circle.keyframe(0,
        _.extend(app.util.getCrosshairCoords(crosshairs.from), {
      'color': '#777'
      ,'radius': 15
    }))
    .keyframe(app.config.initialDuration,
        _.extend(app.util.getCrosshairCoords(crosshairs.to), {
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
      var fromCoords = this.app.util.getCrosshairCoords(crosshairs.from);
      var toCoords = this.app.util.getCrosshairCoords(crosshairs.to);
      var points = this.app.util.generatePathPoints(fromCoords.x, fromCoords.y,
          toCoords.x, toCoords.y, selects._from.val(), selects._to.val());
      console.log(cssGen.generateCSS3Keyframes('foo', points,'-webkit-'));
    }
  });

});
