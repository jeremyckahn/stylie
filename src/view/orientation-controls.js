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

    events: {
      change: 'onChange'
    }

    /**
     * @param {Stylie} stylie
     */
    ,initialize: function (opts) {
      this.stylie = opts.stylie;
    }

    ,onChange: function () {
      this.stylie.trigger(constant.UPDATE_CSS_OUTPUT);
    }

    ,getOrientation: function () {
      return this.$el.serialize().split('=')[1];
    }

  });

});
