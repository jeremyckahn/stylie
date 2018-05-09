define([
  'jquery',
  'lateralus',
  'underscore',
  'shifty',
  'text!./template.mustache',
  '../../constant',
], function($, Lateralus, _, Tweenable, template, constant) {
  'use strict';

  var Base = Lateralus.Component.View;
  var baseProto = Base.prototype;
  var prerenderBuffer = document.createElement('canvas');
  var $win = $(window);

  // Aliased for speed
  var PATH_RENDER_GRANULARITY = constant.PATH_RENDER_GRANULARITY;

  var AnimationPathComponentView = Base.extend({
    template: template,

    lateralusEvents: {
      /**
       * @param {boolean} showPath
       */
      userRequestUpdateShowPathSetting: function(showPath) {
        this.$el[showPath ? 'removeClass' : 'addClass']('transparent');
        this.render();
      },

      'rekapi:timelineModified': function() {
        this.updatePath();
      },
    },

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    initialize: function() {
      baseProto.initialize.apply(this, arguments);
      this.context = this.$el[0].getContext('2d');

      if (!this.lateralus.model.getUi('showPath')) {
        this.$el.addClass('transparent');
      }

      $win.on('resize', _.bind(this.onWindowResize, this));
    },

    deferredInitialize: function() {
      var $parent = this.$el.parent();
      this.resize($parent.width(), $parent.height());
    },

    onWindowResize: function() {
      this.resize($win.width(), $win.height());
    },

    /**
     * @param {number} width
     * @param {number} height
     */
    resize: function(width, height) {
      var dims = { width: width, height: height };

      _.each(
        ['width', 'height'],
        function(dim) {
          if (dim in dims) {
            var tweakObj = {};
            tweakObj[dim] = dims[dim];
            this.$el.css(tweakObj).attr(tweakObj);
          }
        },
        this
      );

      this.render();
    },

    updatePath: function() {
      this.generatePathPrerender();
      this.render();
    },

    /**
     * @param {number} x1
     * @param {number} x2
     * @param {number} y1
     * @param {number} y2
     * @param {string} easeX
     * @param {string} easeY
     * @return {Array.<{x: number, y: number}>}
     */
    generatePathSegment: function(x1, x2, y1, y2, easeX, easeY) {
      var points = [];
      var from = {
        x: x1,
        y: y1,
      };
      var to = {
        x: x2,
        y: y2,
      };
      var easing = {
        x: easeX,
        y: easeY,
      };
      var j, point;
      for (j = 0; j <= PATH_RENDER_GRANULARITY; j++) {
        point = Tweenable.interpolate(
          from,
          to,
          1 / PATH_RENDER_GRANULARITY * j,
          easing
        );
        points.push(point);
      }

      return points;
    },

    /**
     * @param {RekapiComponent} rekapiComponent
     */
    generatePathPoints: function() {
      var actorModel = this.collectOne('currentActorModel');
      var numKeyframes = actorModel.transformPropertyCollection.length;
      var points = [];

      var i;
      for (i = 1; i < numKeyframes; ++i) {
        var fromKeyframe = actorModel.transformPropertyCollection
          .at(i - 1)
          .toJSON();
        var toKeyframe = actorModel.transformPropertyCollection.at(i).toJSON();
        var x1 = fromKeyframe.x;
        var y1 = fromKeyframe.y;
        var x2 = toKeyframe.x;
        var y2 = toKeyframe.y;
        var easeX = toKeyframe.easing_x;
        var easeY = toKeyframe.easing_y;

        points = points.concat(
          this.generatePathSegment(x1, x2, y1, y2, easeX, easeY)
        );
      }

      return points;
    },

    generatePathPrerender: function() {
      prerenderBuffer.width = this.$el.width();
      prerenderBuffer.height = this.$el.height();
      var ctx = (prerenderBuffer.ctx = prerenderBuffer.getContext('2d'));
      var points = this.generatePathPoints();

      var previousPoint;
      ctx.beginPath();
      _.each(points, function(point) {
        if (previousPoint) {
          ctx.lineTo(point.x, point.y);
        } else {
          ctx.moveTo(point.x, point.y);
        }

        previousPoint = point;
      });
      ctx.lineWidth = constant.PATH_THICKNESS;
      var strokeColor = constant.PATH_COLOR;
      ctx.strokeStyle = strokeColor;
      ctx.stroke();
      ctx.closePath();
    },

    render: function() {
      // Quick way to clear the canvas
      this.$el[0].width = this.$el.width();

      if (this.$el.is(':visible')) {
        this.context.drawImage(prerenderBuffer, 0, 0);
      }
    },
  });

  return AnimationPathComponentView;
});
