define([

  'jquery'
  ,'underscore'
  ,'backbone'
  ,'shifty'

  ,'src/constants'

], function (

  $
  ,_
  ,Backbone
  ,Tweenable

  ,constant

) {

  var $win = $(window);
  var prerenderBuffer = document.createElement('canvas');

  return Backbone.View.extend({

    /**
     * @param {Object} opts
     *   @param {Stylie} stylie
     *   @param {jQuery} $header
     *   @param {number} height
     *   @param {number} width
     */
    initialize: function (opts) {
      this.stylie = opts.stylie;
      this.$header = opts.$header;
      this._isShowing = true;
      this.context = this.$el[0].getContext('2d');
      this.resize(opts.width, opts.height);

      var boundRender = _.bind(this.render, this);
      this.listenTo(this.stylie, constant.PATH_CHANGED, boundRender);
      this.listenTo(this.stylie, constant.KEYFRAME_ORDER_CHANGED, boundRender);
      this.listenTo(this.stylie, constant.TOGGLE_PATH_AND_CROSSHAIRS,
          _.bind(this.showOrHidePath, this));

      $win.on('resize', _.bind(this.onWindowResize, this));
    }

    /**
     * @param {jQuery.Event} evt
     */
    ,onWindowResize: function (evt) {
      var height = $win.height() - this.$header.outerHeight();
      var width = $win.width();
      this.resize(width, height);
    }

    /**
     * @param {number} width
     * @param {number} height
     */
    ,resize: function (width, height) {
      var dims = { width: width, height: height };

      _.each(['width', 'height'], function (dim) {
        if (dim in dims) {
          var tweakObj = {};
          tweakObj[dim] = dims[dim];
          this.$el
            .css(tweakObj)
            .attr(tweakObj);
        }
      }, this);

      this.render();
    }

    ,generatePathPoints: function () {
      var currentActorModel = this.stylie.actorCollection.getCurrent();
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
        var easings =
          currentActorModel.keyframeCollection.at(i).getEasings();
        var easeX = easings.x;
        var easeY = easings.y;

        points = points.concat(
            this.generatePathSegment(x1, x2, y1, y2, easeX, easeY));
      }

      return points;
    }

    ,generatePathSegment: function (x1, x2, y1, y2, easeX, easeY) {
      var points = [];
      var from = {
          x: x1
          ,y: y1
        };
      var to = {
          x: x2
          ,y: y2
        };
      var easing = {
        x: easeX
        ,y: easeY
      };
      var j, point;
      for (j = 0; j <= constant.RENDER_GRANULARITY; j++) {
        point = Tweenable.interpolate(
            from, to, (1 / constant.RENDER_GRANULARITY) * j, easing);
        points.push(point);
      }

      return points;
    }

    ,generatePathPrerender: function () {
      var stylie = this.stylie;
      prerenderBuffer.width = this.$el.width();
      prerenderBuffer.height = this.$el.height();
      var ctx = prerenderBuffer.ctx = prerenderBuffer.getContext('2d');
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
      var strokeColor = 'rgb(255,176,0)';
      ctx.strokeStyle = strokeColor;
      ctx.stroke();
      ctx.closePath();
    }

    ,render: function () {
      this.generatePathPrerender();

      this.$el[0].width = this.$el.width();
      if (this._isShowing) {
        this.context.drawImage(prerenderBuffer, 0, 0);
      }
    }

    /**
     * @param {boolean} isShowing
     */
    ,showOrHidePath: function (isShowing) {
      this._isShowing = isShowing;
      this.render();
    }

  });
});
