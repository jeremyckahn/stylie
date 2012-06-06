/**
 * jQuery Dragon.  It's a dragging plugin!
 *   v0.1.3
 *   By Jeremy Kahn (jeremyckahn@gmail.com)
 *   MIT License.
 *   For more info: https://github.com/jeremyckahn/dragon
 */
;(function ($) {

  var $win = $(window);
  var $doc = $(document.documentElement);
  var noop = $.noop || function () {};


  /**
   * Options:
   *
   *   @param {boolean} noCursor Prevents the drag cursor from being "move"
   *   @param {string} axis The axis to constrain dragging to.  Either 'x' or
   *     'y'.  Disabled by default.
   *   @param {jQuery} within The jQuery'ed element's bounds to constrain the
   *     drag range within.
   *   @param {string} handle A jQuery selector for the "handle" element within
   *     the dragon element that initializes the dragging action.
   *   @param {function} dragStart Fires when dragging begins.
   *   @param {function} drag Fires for every tick of the drag.
   *   @param {function} dragEnd Fires when dragging ends.
   */
  $.fn.dragon = function (opts) {
    initDragonEls(this, opts || {});
  };


  // CONSTANTS
  $.extend($.fn.dragon, {
    'AXIS_X': 'x'
    ,'AXIS_Y': 'y'
  });


  function initDragonEls ($els, opts) {
    opts.axis = opts.axis || {};
    $els.attr('draggable', 'true');
    $els.on('dragstart', preventDefault);

    if (!opts.noCursor) {
      if (opts.handle) {
        $els.find(opts.handle).css('cursor', 'move');
      } else {
        $els.css('cursor', 'move');
      }
    }

    $els.each(function (i, el) {
      var $el = $(el);
      var position = $el.position();
      var top = position.top;
      var left = position.left;

      $el
        .css({
          'top': top
          ,'left': left
          ,'position': 'absolute'
        })
        .data('dragon', {})
        .data('dragon-opts', opts);

      if (opts.handle) {
        $el.on('mousedown', opts.handle, $.proxy(onMouseDown, $el));
      } else {
        $el.on('mousedown', $.proxy(onMouseDown, $el));
      }

    });
  }


  /**
   * @param {Object} evt
   * @param {number=} opt_pageX Can be used if evt.pageX is falsy (if the event
   *     was synthesized)
   * @param {number=} opt_pageY Can be used if evt.pageY is falsy (if the event
   *     was synthesized)
   */
  function onMouseDown (evt, opt_pageX, opt_pageY) {
    var data = this.data('dragon');
    var onMouseUpInstance = $.proxy(onMouseUp, this);
    var onMouseMoveInstance = $.proxy(onMouseMove, this);
    var initialPosition = this.position();
    this.data('dragon', {
      'onMouseUp': onMouseUpInstance
      ,'onMouseMove': onMouseMoveInstance
      ,'isDragging': true
      ,'left': initialPosition.left
      ,'top': initialPosition.top
      ,'grabPointX': initialPosition.left -
         (typeof evt.pageX === 'number' ? evt.pageX : opt_pageX)
      ,'grabPointY': initialPosition.top -
         (typeof evt.pageY === 'number' ? evt.pageY : opt_pageY)
    });

    $doc
      .on('mouseup', onMouseUpInstance)
      .on('blur', onMouseUpInstance)
      .on('mousemove', onMouseMoveInstance);

    $doc.on('selectstart', preventSelect);
    fire('dragStart', this, evt);
  }


  function onMouseUp (evt) {
    var data = this.data('dragon');
    data.isDragging = false;

    $doc.off('mouseup', data.onMouseUp)
      .off('blur', data.onMouseUp)
      .off('mousemove', data.onMouseMove)
      .off('selectstart', preventSelect);

    delete data.onMouseUp;
    delete data.onMouseMove;
    fire('dragEnd', this, evt);
  }


  function onMouseMove (evt) {
    var data = this.data('dragon');
    var opts = this.data('dragon-opts');
    var newCoords = {};

    if (opts.axis !== $.fn.dragon.AXIS_X) {
      newCoords.top = evt.pageY + data.grabPointY;
    }

    if (opts.axis !== $.fn.dragon.AXIS_Y) {
      newCoords.left = evt.pageX + data.grabPointX;
    }

    if (opts.within) {
      // omg!
      var offset = this.offset();
      var width = this.outerWidth(true);
      var height = this.outerHeight(true);
      var container = opts.within;
      var containerWidth = container.innerWidth();
      var containerHeight = container.innerHeight();
      var containerOffset = container.offset();
      var containerPaddingTop = parseInt(container.css('paddingTop'), 10);
      var containerTop = containerOffset.top + containerPaddingTop;
      var containerBottom = containerTop + containerHeight;
      var containerPaddingLeft = parseInt(container.css('paddingLeft'), 10);
      var containerLeft = containerOffset.left + containerPaddingLeft;
      var containerRight = containerLeft + containerWidth;
      var marginLeft = parseInt(this.css('marginLeft'), 10);
      var marginTop = parseInt(this.css('marginTop'), 10);
      var marginBottom = parseInt(this.css('marginBottom'), 10);
      var marginRight = parseInt(this.css('marginRight'), 10);
      var minDistanceLeft = containerPaddingLeft - marginLeft;
      var minDistanceRight = containerWidth + marginRight;
      var minDistanceTop = containerPaddingTop - marginTop;
      var minDistanceBottom = containerHeight + marginBottom;

      if (newCoords.left < minDistanceLeft
          || offset.left < containerLeft) {
        newCoords.left = minDistanceLeft;
      }

      if (newCoords.left + width > minDistanceRight
          || offset.left > containerRight) {
        newCoords.left = minDistanceRight - width;
      }

      if (newCoords.top < minDistanceTop
          || offset.top < containerTop) {
        newCoords.top = minDistanceTop;
      }

      if (newCoords.top + height > minDistanceBottom
          || offset.top > containerBottom) {
        newCoords.top = minDistanceBottom - height;
      }
    }

    this.css(newCoords);
    fire('drag', this, evt);
  }


  // This event handler fixes some craziness with the startselect event breaking
  // the cursor style.
  // http://forum.jquery.com/topic/chrome-text-select-cursor-on-drag
  function preventSelect(evt) {
    preventDefault(evt);
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
    } else if (document.selection) {
      document.selection.clear();
    }
  }


  function preventDefault (evt) {
    evt.preventDefault();
  }


  // Yep, you only get to bind one event handler.  Much faster this way.
  function fire (event, $el, evt) {
    var handler = $el.data('dragon-opts')[event];
    // Patch the proxied Event Object
    evt.target = $el[0];
    handler && handler(evt);
  }

} (this.jQuery));
