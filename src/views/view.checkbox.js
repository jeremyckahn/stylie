define(function () {

  var Checkbox = {}

  Checkbox.view = Backbone.View.extend({

    'events': {
      'change': 'onChange'
    }

    ,'initialize': function (opts) {
      _.extend(this, opts);
      this.delegateEvents();
      this.$el.trigger('change');
    }

    ,'onChange': function () {}

  });

  return Checkbox;

});
