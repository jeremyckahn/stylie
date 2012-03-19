define(function () {

  var utils = {};

  utils.init = function (app) {

    app.util.pxToNumber = function (px) {
      return +(px.replace('px', ''));
    };

    app.util.trimString = function (str) {
      return str.replace(/^\s*|\s*$/g, '');
    };

    app.util.updatePath = function () {
      var fromCoords = app.collection.keyframes.first().getAttrs();
      var toCoords = app.collection.keyframes.last().getAttrs();
      app.util.generatePathPrerender(fromCoords.left, fromCoords.top,
          toCoords.left, toCoords.top,
          app.config.selects.x.$el.val(), app.config.selects.y.$el.val());
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
      for (i = 0; i <= app.const.RENDER_GRANULARITY; i++) {
        point = Tweenable.util.interpolate(
            from, to, (1 / app.const.RENDER_GRANULARITY) * i, easing);
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
      var fnString = fn.toString().replace('\n', ''); // An effin' string
      var deprefixed = fnString.replace(/.*return\s*/g, '');
      var desuffixed = deprefixed.replace(/\}|;\s*}$/g, '');
      return desuffixed;
    };

  };

  return utils;

});
