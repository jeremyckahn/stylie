define([

  'underscore'
  ,'backbone'
  ,'minpubsub'

  ,'src/app'
  ,'src/constants'

], function (

  _
  ,Backbone
  ,MinPubSub

  ,app
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
      MinPubSub.publish(constant.UPDATE_CSS_OUTPUT);
    }

    ,'getOrientation': function () {
      return this.$el.serialize().split('=')[1];
    }

  });

});
