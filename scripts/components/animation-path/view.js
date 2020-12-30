import $ from 'jquery';
import Lateralus from 'lateralus';
import _ from 'underscore';
import { interpolate } from 'shifty';
import template from 'text!./template.mustache';
import constant from '../../constant';

const Base = Lateralus.Component.View;
const baseProto = Base.prototype;
const prerenderBuffer = document.createElement('canvas');
const $win = $(window);

// Aliased for speed
const PATH_RENDER_GRANULARITY = constant.PATH_RENDER_GRANULARITY;

const AnimationPathComponentView = Base.extend({
  template,

  lateralusEvents: {
    /**
     * @param {boolean} showPath
     */
    userRequestUpdateShowPathSetting(showPath) {
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
  initialize() {
    baseProto.initialize.apply(this, arguments);
    this.context = this.$el[0].getContext('2d');

    if (!this.lateralus.model.getUi('showPath')) {
      this.$el.addClass('transparent');
    }

    $win.on('resize', _.bind(this.onWindowResize, this));
  },

  deferredInitialize() {
    const $parent = this.$el.parent();
    this.resize($parent.width(), $parent.height());
  },

  onWindowResize() {
    this.resize($win.width(), $win.height());
  },

  /**
   * @param {number} width
   * @param {number} height
   */
  resize(width, height) {
    const dims = { width, height };

    _.each(
      ['width', 'height'],
      function(dim) {
        if (dim in dims) {
          const tweakObj = {};
          tweakObj[dim] = dims[dim];
          this.$el.css(tweakObj).attr(tweakObj);
        }
      },
      this
    );

    this.render();
  },

  updatePath() {
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
  generatePathSegment(x1, x2, y1, y2, easeX, easeY) {
    const points = [];
    const from = {
      x: x1,
      y: y1,
    };
    const to = {
      x: x2,
      y: y2,
    };
    const easing = {
      x: easeX,
      y: easeY,
    };
    let j, point;
    for (j = 0; j <= PATH_RENDER_GRANULARITY; j++) {
      point = interpolate(from, to, (1 / PATH_RENDER_GRANULARITY) * j, easing);
      points.push(point);
    }

    return points;
  },

  /**
   * @param {RekapiComponent} rekapiComponent
   */
  generatePathPoints() {
    const actorModel = this.collectOne('currentActorModel');
    const numKeyframes = actorModel.transformPropertyCollection.length;
    let points = [];

    let i;
    for (i = 1; i < numKeyframes; ++i) {
      const fromKeyframe = actorModel.transformPropertyCollection
        .at(i - 1)
        .toJSON();
      const toKeyframe = actorModel.transformPropertyCollection.at(i).toJSON();
      const x1 = fromKeyframe.x;
      const y1 = fromKeyframe.y;
      const x2 = toKeyframe.x;
      const y2 = toKeyframe.y;
      const easeX = toKeyframe.easing_x;
      const easeY = toKeyframe.easing_y;

      points = points.concat(
        this.generatePathSegment(x1, x2, y1, y2, easeX, easeY)
      );
    }

    return points;
  },

  generatePathPrerender() {
    prerenderBuffer.width = this.$el.width();
    prerenderBuffer.height = this.$el.height();
    const ctx = (prerenderBuffer.ctx = prerenderBuffer.getContext('2d'));
    const points = this.generatePathPoints();

    let previousPoint;
    ctx.beginPath();
    _.each(points, point => {
      if (previousPoint) {
        ctx.lineTo(point.x, point.y);
      } else {
        ctx.moveTo(point.x, point.y);
      }

      previousPoint = point;
    });
    ctx.lineWidth = constant.PATH_THICKNESS;
    const strokeColor = constant.PATH_COLOR;
    ctx.strokeStyle = strokeColor;
    ctx.stroke();
    ctx.closePath();
  },

  render() {
    // Quick way to clear the canvas
    this.$el[0].width = this.$el.width();

    if (this.$el.is(':visible')) {
      this.context.drawImage(prerenderBuffer, 0, 0);
    }
  },
});

export default AnimationPathComponentView;
