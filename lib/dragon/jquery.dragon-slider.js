/**
 * jQuery Dragon Slider.  It's a slider plugin!
 *   v0.1.0
 *   By Jeremy Kahn (jeremyckahn@gmail.com)
 *   Depends on jQuery jquery.dragon.js
 *   MIT License.
 *   For more info: https://github.com/jeremyckahn/dragon
 */

;(function ($) {

  var $win = $(window);
  var $doc = $(document.documentElement);
  var noop = $.noop || function () {};


  // CONSTANTS
  var DEFAULTS = {
    'width': 250
    ,'increment': .02
    ,'drag': $.noop
  };
  var KEY_RIGHT = 39;
  var KEY_LEFT = 37;


  /**
   * @param {jQuery} $slider
   * @param {jQuery} $handle
   * @return {number}
   */
  function getInnerSliderWidth ($slider, $handle) {
    return $slider.width() - $handle.outerWidth();
  }


  /**
   * @param {Object=} opts
   *   @param {number} width Width of the slider.
   *   @param {Function(number)} drag The drag event handler.  Receives the
   *       current slider value.
   */
  $.fn.dragonSlider = function (opts) {
    opts = opts || {};
    var defaultsCopy = $.extend({}, DEFAULTS);
    initDragonSliderEls(this, $.extend(defaultsCopy, opts));
  };


  /**
   * @param {number} val Between 0 and 1.
   */
  $.fn.dragonSliderSet = function (val, triggerDrag) {
    val = Math.min(1, val);
    val = Math.max(0, val);
    var data = this.data('dragon-slider');
    var $handle = this.find('.dragon-slider-handle');
    var scaledVal = val * getInnerSliderWidth(this, $handle);
    $handle.css('left', scaledVal);

    if (triggerDrag !== false) {
      data.drag(this.dragonSliderGet());
    }
  };


  /**
   * @return {number} Between 0 and 1.
   */
  $.fn.dragonSliderGet = function () {
    var $handle = this.find('.dragon-slider-handle');
    var left = $handle.position().left;
    return left / getInnerSliderWidth(this, $handle);
  };


  /**
   * @param {jQuery} $els
   * @param {Object} opts
   */
  function initDragonSliderEls ($els, opts) {
    $els.each(function (i, el) {
      var $el = $(el);
      $el.data('dragon-slider', $.extend({}, opts));
      var $handle = createDragHandle($el);
      $el
        .addClass('dragon-slider')
        .width(opts.width - parseInt($el.css('border-width') || 0, 10))
        .on('mousedown', onSliderMousedown)
        .append($handle);
    });
  }


  /**
   * @param {jQuery} $container
   */
  function createDragHandle ($container) {
    var $handle = $(document.createElement('BUTTON'));
    var data = $container.data('dragon-slider');
    $handle.addClass('dragon-slider-handle');
    $handle.dragon({
      'within': $container
      ,'drag': function () {
        // Setting the gotten value to centralize the "drag" event tiggering
        $container.dragonSliderSet($container.dragonSliderGet());
      }
    });
    $handle.on('keydown', onHandleKeydown);

    return $handle;
  }


  /**
   * @param {Object} ev
   */
  function onHandleKeydown (ev) {
    var $el = $(this);
    var $parent = $el.parent();
    var current = $parent.dragonSliderGet();
    var data = $parent.data('dragon-slider');
    var increment = data.increment;
    var key = ev.which;

    if (key === KEY_LEFT) {
      $parent.dragonSliderSet(current - increment);
    } else if (key === KEY_RIGHT) {
      $parent.dragonSliderSet(current + increment);
      $parent.trigger('drag');
    }
  }


  /**
   * @param {Object} ev
   */
  function onSliderMousedown (ev) {
    if (ev.target === this) {
      var $el = $(this);
      var $handle = $el.find('.dragon-slider-handle');
      var offset = ev.clientX - $el.offset().left;
      offset -= $handle.outerWidth() / 2;
      $el.dragonSliderSet(offset / getInnerSliderWidth($el, $handle));
      $handle.trigger('mousedown', [ev.pageX, ev.pageY]);
    }
  }

} (this.jQuery));
