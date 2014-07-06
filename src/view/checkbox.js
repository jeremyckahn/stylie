define([

  'underscore'
  ,'backbone'

], function (

  _
  ,Backbone

) {

  return Backbone.View.extend({

    'events': {
      'change': '_onChange'
    }

    ,'initialize': function (opts) {
      _.extend(this, opts);

      if (opts.callHandlerOnInit) {
        this.delegateEvents();
        this.$el.trigger('change');
      }
    }

    ,'_onChange': function (evt) {
      this.onChange.call(this, evt, this.$el.is(':checked'));
    }

  });

});
