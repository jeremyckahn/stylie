define(['src/app'], function (app) {

  return Backbone.View.extend({

    'initialize': function (opts) {
      _.extend(this, opts);

      this.scrubber = new RekapiScrubber(
          app.kapi, app.view.canvas.$canvasBG[0]);

      this.$el = this.scrubber.$container;
    }

    ,'fadeToggle': function () {
      this.$el.fadeToggle(app.constant.TOGGLE_FADE_SPEED);
    }

  });

});
