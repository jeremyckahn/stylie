define(['exports'], function (checkbox) {

  checkbox.view = Backbone.View.extend({

    'events': {
      'change': '_onChange'
    }

    ,'initialize': function (opts) {
      _.extend(this, opts);
      this.delegateEvents();
      this.$el.trigger('change');
    }

    ,'_onChange': function (evt) {
      this.onChange.call(this, evt, this.$el.attr('checked'));
    }

  });

});
