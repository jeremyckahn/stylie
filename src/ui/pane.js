define([

  'jquery'
  ,'underscore'
  ,'backbone'

  ,'src/app'
  ,'src/constants'

], function (

  $
  ,_
  ,Backbone

  ,app
  ,constant

) {

  var $win = $(window);

  return Backbone.View.extend({

    'CONTAINER_TEMPLATE': [
      '<div class="pane"></div>'
    ].join('')

    ,'HANDLE_TEMPLATE': [
      '<div class="pane-handle"></div>'
    ].join('')

    ,'CONTENT_WRAPPER_TEMPLATE': [
      '<div class="pane-content"></div>'
    ].join('')

    ,'events': {}

    ,'initialize': function (opts) {
      _.extend(this, opts);
      this.$handle = $(this.HANDLE_TEMPLATE);
      this.$el.wrap($(this.CONTAINER_TEMPLATE));
      this.$el = this.$el.parent();
      this.$el
        .wrapInner($(this.CONTENT_WRAPPER_TEMPLATE))
        .prepend(this.$handle)
        .css({
          'left': $win.width() - this.$el.outerWidth(true)
        })
        .dragon({
          'within': this.$el.parent()
          ,'handle': '.pane-handle'
        });
      this.oldSize = this.getSize();
      $win.on('resize', _.bind(this.onResize, this));
    }

    ,'onResize': function (evt) {
      var width = this.$el.outerWidth(true);
      var winWidth = $win.width();

      if ((this.$el.offset().left + width) > winWidth) {
        this.$el.css('left', winWidth - width);
      }
    }

    ,'getSize': function () {
      return {
        'height': this.$el.height()
        ,'width': this.$el.width()
      };
    }

    ,'toggle': function () {
      this.$el.fadeToggle(constant.TOGGLE_FADE_SPEED);
    }

  });
});
