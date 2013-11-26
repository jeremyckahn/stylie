define([

  'underscore'
  ,'backbone'
  ,'rekapi-scrubber'

  ,'src/app'
  ,'src/constants'

], function (

  _
  ,Backbone
  ,RekapiScrubber

  ,app
  ,constant

) {

  return Backbone.View.extend({

    'initialize': function (opts) {
      _.extend(this, opts);

      this.scrubber = new RekapiScrubber(
          app.kapi, app.view.canvas.$canvasBG[0]);

      this.$el = this.scrubber.$container;
    }

    ,'fadeToggle': function () {
      this.$el.fadeToggle(constant.TOGGLE_FADE_SPEED);
    }

  });

});
