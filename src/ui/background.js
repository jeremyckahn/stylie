define([

  'underscore'
  ,'backbone'
  ,'shifty'
  ,'minpubsub'

  ,'src/app'
  ,'src/constants'

], function (

  _
  ,Backbone
  ,Tweenable
  ,MinPubSub

  ,app
  ,constant

) {
  return Backbone.View.extend({

    'initialize': function (opts) {
      _.extend(this, opts);
      this.context = this.$el[0].getContext('2d');
      this.resize({
        'height': opts.height
        ,'width': opts.width
      });

      var boundUpdate = _.bind(this.update, this);
      MinPubSub.subscribe(constant.PATH_CHANGED, boundUpdate);
      MinPubSub.subscribe(constant.KEYFRAME_ORDER_CHANGED, boundUpdate);
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
      var currentActorModel = app.collection.actors.getCurrent();
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
      this.generatePathPrerender(useDimColor);

      this.$el[0].width = this.$el.width();
      if (app.config.isPathShowing) {
        this.context.drawImage(app.config.prerenderedPath, 0, 0);
      }
    }

  });
});
