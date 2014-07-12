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

    /**
     * @param {Object} opts
     *   @param {jQuery} $canvasBG
     */
    'initialize': function (opts) {
      this.$canvasBG = opts.$canvasBG;
      this.scrubber = new RekapiScrubber(app.rekapi, this.$canvasBG[0]);
      this.$el = this.scrubber.$container;
      this.el = this.scrubber.$container[0];
    }

    ,'fadeToggle': function () {
      this.$el.fadeToggle(constant.TOGGLE_FADE_SPEED);
    }

  });

});
