define(['exports'], function (pane) {

  var $win = $(window);

  pane.view = Backbone.View.extend({

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
        .draggable({
          'containment': 'parent'
          ,'handle': this.$handle
        });
      this.oldSize = this.getSize();
    }

    ,'onResize': function () {
      this.oldSize = this.getSize();
    }

    ,'getSize': function () {
      return {
        'height': this.$el.height()
        ,'width': this.$el.width()
      };
    }

  });
});
