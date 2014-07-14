define([

  'underscore'
  ,'backbone'
  ,'shifty'

  ,'src/constants'

], function (

  _
  ,Backbone
  ,Tweenable

  ,constant

) {
  return Backbone.View.extend({

    /**
     * @param {Object} opts
     *   @param {Stylie} stylie
     *   @param {number} height
     *   @param {number} width
     */
    'initialize': function (opts) {
      this.stylie = opts.stylie;
      this.context = this.$el[0].getContext('2d');
      this.resize({
        'height': opts.height
        ,'width': opts.width
      });

      var boundUpdate = _.bind(this.update, this);
      Backbone.on(constant.PATH_CHANGED, boundUpdate);
      Backbone.on(constant.KEYFRAME_ORDER_CHANGED, boundUpdate);
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

    ,'generatePathPoints': function () {
      var currentActorModel = this.stylie.collection.actors.getCurrent();
      var keyframeLength = currentActorModel.getLength();
      var transformKeyframeProperties =
          currentActorModel.get('actor').getPropertiesInTrack('transform');
      var points = [];

      var i;
      for (i = 1; i < keyframeLength; ++i) {
        var fromKeyframe = currentActorModel.getAttrsForKeyframe(i - 1);
        var toKeyframe = currentActorModel.getAttrsForKeyframe(i);
        var x1 = fromKeyframe.x;
        var y1 = fromKeyframe.y;
        var x2 = toKeyframe.x;
        var y2 = toKeyframe.y;
        var easings = currentActorModel.getEasingsForKeyframe(
            transformKeyframeProperties[i].millisecond);
        var easeX = easings.x;
        var easeY = easings.y;

        points = points.concat(
            this.generatePathSegment(x1, x2, y1, y2, easeX, easeY));
      }

      return points;
    }

    ,'generatePathSegment': function (x1, x2, y1, y2, easeX, easeY) {
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
      var j, point;
      for (j = 0; j <= constant.RENDER_GRANULARITY; j++) {
        point = Tweenable.interpolate(
            from, to, (1 / constant.RENDER_GRANULARITY) * j, easing);
        points.push(point);
      }

      return points;
    }

    ,'generatePathPrerender': function (useDimColor) {
      var stylie = this.stylie;
      stylie.config.prerenderedPath = document.createElement('canvas');
      stylie.config.prerenderedPath.width =
          stylie.view.canvas.$canvasBG.width();
      stylie.config.prerenderedPath.height =
          stylie.view.canvas.$canvasBG.height();
      var ctx = stylie.config.prerenderedPath.ctx =
          stylie.config.prerenderedPath.getContext('2d');
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
      this.generatePathPrerender(useDimColor);

      this.$el[0].width = this.$el.width();
      if (this.stylie.config.isPathShowing) {
        this.context.drawImage(this.stylie.config.prerenderedPath, 0, 0);
      }
    }

  });
});
