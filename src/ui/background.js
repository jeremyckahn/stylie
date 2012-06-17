define(['exports'], function (background) {
  background.view = Backbone.View.extend({

    'initialize': function (opts) {
      _.extend(this, opts);
      this.context = this.$el[0].getContext('2d');
      this.$el.css('background', '#eee');
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
      for (i = 0; i <= this.app.const.RENDER_GRANULARITY; i++) {
        point = Tweenable.util.interpolate(
            from, to, (1 / this.app.const.RENDER_GRANULARITY) * i, easing);
        points.push(point);
      }

      return points;
    }

    ,'generatePathPrerender': function (x1, y1, x2, y2, easeX, easeY) {
      this.app.config.prerenderedPath = document.createElement('canvas');
      this.app.config.prerenderedPath.width = this.app.canvasView.$canvasBG.width();
      this.app.config.prerenderedPath.height = this.app.canvasView.$canvasBG.height();
      var ctx = this.app.config.prerenderedPath.ctx =
          this.app.config.prerenderedPath.getContext('2d');
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
      ctx.strokeStyle = '#fa0';
      ctx.stroke();
      ctx.closePath();
    }

    ,'update': function () {
      var fromCoords = this.app.collection.keyframes.first().getAttrs();
      var toCoords = this.app.collection.keyframes.last().getAttrs();
      this.generatePathPrerender(fromCoords.x, fromCoords.y,
          toCoords.x, toCoords.y, this.app.config.selects.x.$el.val(),
          this.app.config.selects.y.$el.val());

      if (this.app.config.prerenderedPath) {
        this.$el[0].width = this.$el.width();
        if (this.app.config.isPathShowing) {
          this.context.drawImage(this.app.config.prerenderedPath, 0, 0);
        }
      }
    }

  });
});
