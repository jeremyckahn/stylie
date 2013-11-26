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

    /**
     * Subscribes to the constant.ALERT_ERROR message, which accepts a string
     * representing the message to show to the user.  So:
     *
     *   publish(constant.ALERT_ERROR, ['Hello, user.']);
     */
    'initialize': function (opts) {
      _.extend(this, opts);
      this.fadeOutTimeout_ = 0;
      this.$contentEl_ = this.$el.find('p');
      MinPubSub.subscribe(constant.ALERT_ERROR, _.bind(this.show, this));
    }

    ,'show': function (alertMessage) {
      clearTimeout(this.fadeOutTimeout_);
      this.$contentEl_.text(alertMessage);
      this.$el.fadeIn(constant.TOGGLE_FADE_SPEED);
      this.fadeOutTimeout_ = setTimeout(
        _.bind(this.hide, this), constant.ALERT_TIMEOUT);
    }

    ,'hide': function () {
      this.$el.fadeOut(constant.TOGGLE_FADE_SPEED);
    }

  });
});
