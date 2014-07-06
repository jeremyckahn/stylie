define([

  'underscore'
  ,'backbone'

  ,'src/constants'

], function (

  _
  ,Backbone

  ,constant

) {

  return Backbone.View.extend({

    'events': {
      'change': 'onChange'
    }

    ,'initialize': function (opts) {
      _.extend(this, opts);
    }

    ,'onChange': function () {
      Backbone.trigger(constant.UPDATE_CSS_OUTPUT);
    }

    ,'getOrientation': function () {
      return this.$el.serialize().split('=')[1];
    }

  });

});
