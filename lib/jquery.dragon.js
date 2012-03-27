;(function ($) {

  var $doc = $(document.documentElement);

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
   *   @param {function} onDragStart Fires when dragging begins.
   *   @param {function} onDrag Fires for every tick of the drag.
   *   @param {function} onDragEnd Fires when dragging ends.
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
        .data('dragon-opts', opts)
        .on('dragon-dragstart', $.proxy(opts.onDragStart || $.noop, $el))
        .on('dragon-drag', $.proxy(opts.onDrag || $.noop, $el))
        .on('dragon-dragend', $.proxy(opts.onDragEnd || $.noop, $el));

      if (opts.handle) {
        $el.on('mousedown', opts.handle, $.proxy(onMouseDown, $el));
      } else {
        $el.on('mousedown', $.proxy(onMouseDown, $el));
      }

    });
  }

  function onMouseDown (evt) {
    var data = this.data('dragon');
    var wasAlreadyDragging = data.isDragging;
    var onMouseUpInstance = $.proxy(onMouseUp, this);
    var onMouseMoveInstance = $.proxy(onMouseMove, this);
    var initialPosition = this.position();
    this.data('dragon', {
      'onMouseUp': onMouseUpInstance
      ,'onMouseMove': onMouseMoveInstance
      ,'isDragging': true
      ,'left': initialPosition.left
      ,'top': initialPosition.top
      ,'grabPointX': initialPosition.left - evt.pageX
      ,'grabPointY': initialPosition.top - evt.pageY
    });

    $doc
      .on('mouseup', onMouseUpInstance)
      .on('blur', onMouseUpInstance)
      .on('mousemove', onMouseMoveInstance);

    $doc.on('selectstart', preventSelect);
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
    fire('onDragEnd', this);
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

      if (newCoords.left < containerPaddingLeft
          || offset.left < containerLeft) {
        newCoords.left = containerPaddingLeft;
      }

      if (newCoords.left + width > containerWidth
          || offset.left > containerRight) {
        newCoords.left = containerWidth - width;
      }

      if (newCoords.top < containerPaddingTop
          || offset.top < containerTop) {
        newCoords.top = containerPaddingTop;
      }

      if (newCoords.top + height > containerHeight
          || offset.top > containerBottom) {
        newCoords.top = containerHeight - height;
      }
    }

    this.css(newCoords);
    fire('onDrag', this);
  }

  // This event handler fixes some craziness with the startselect event breaking
  // the cursor CSS setting.
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
  function fire (event, $el) {
    var handler = $el.data('dragon-opts')[event];
    handler && handler();
  }

} (jQuery));
