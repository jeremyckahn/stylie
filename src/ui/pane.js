define(['exports'], function (pane) {

  var $win = $(window);

  pane.view = Backbone.View.extend({

    'HANDLE_TEMPLATE': [
      '<div class="pane-handle"></div>'
    ].join('')

    ,'events': {}

    ,'initialize': function (opts) {
      _.extend(this, opts);
      this.$handle = $(this.HANDLE_TEMPLATE);
      this.$el
        .addClass('pane')
        .prepend(this.$handle)
        .css({
          'left': $win.width() - this.$el.outerWidth(true)
        })
        .draggable({
          'containment': 'parent'
          ,'handle': this.$handle
        });
    }

  });
});
