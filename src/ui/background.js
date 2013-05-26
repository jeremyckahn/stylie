define(['src/app', 'src/constants'], function (app, constant) {
  return Backbone.View.extend({

    'initialize': function (opts) {
      _.extend(this, opts);
      this.context = this.$el[0].getContext('2d');
      this.resize({
        'height': opts.height
        ,'width': opts.width
      });
    }

    ,'resize': function (dims) {
      _.each(['height', 'width'], function (dim) {
        if (dim in dims) {
          var tweakObj = {};
          tweakObj[dim] = dims[dim];
          this.$el
            .css(tweakObj)
            .attr(tweakObj);
        }
      }, this);
    }

    ,'generatePathPoints': function (x1, y1, x2, y2, easeX, easeY) {
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
      for (i = 0; i <= constant.RENDER_GRANULARITY; i++) {
        point = Tweenable.interpolate(
            from, to, (1 / constant.RENDER_GRANULARITY) * i, easing);
        points.push(point);
      }

      return points;
    }

    ,'generatePathPrerender': function (
          x1, y1, x2, y2, easeX, easeY, useDimColor) {
      app.config.prerenderedPath = document.createElement('canvas');
      app.config.prerenderedPath.width =
          app.view.canvas.$canvasBG.width();
      app.config.prerenderedPath.height =
          app.view.canvas.$canvasBG.height();
      var ctx = app.config.prerenderedPath.ctx =
          app.config.prerenderedPath.getContext('2d');
      var points = this.generatePathPoints.apply(this, arguments);

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
      // TODO: These need to be constants!
      var strokeColor = useDimColor
          ? 'rgba(255,176,0,.5)'
          : 'rgb(255,176,0)';
      ctx.strokeStyle = strokeColor;
      ctx.stroke();
      ctx.closePath();
    }

    ,'update': function (useDimColor) {
      var fromCoords = app.collection.keyframes.first().getAttrs();
      var toCoords = app.collection.keyframes.last().getAttrs();
      this.generatePathPrerender(fromCoords.x, fromCoords.y,
          toCoords.x, toCoords.y, app.view.selectX.$el.val(),
          app.view.selectY.$el.val(), useDimColor);

      if (app.config.prerenderedPath) {
        this.$el[0].width = this.$el.width();
        if (app.config.isPathShowing) {
          this.context.drawImage(app.config.prerenderedPath, 0, 0);
        }
      }
    }

  });
});
