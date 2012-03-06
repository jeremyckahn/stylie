define(['exports'], function (pane) {
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
        .draggable({
          'containment': 'parent'
          ,'handle': this.$handle
        });
    }

  });
});
