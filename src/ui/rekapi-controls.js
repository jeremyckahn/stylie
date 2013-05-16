define(['exports'], function (rekapiControls) {

  rekapiControls.view = Backbone.View.extend({

    'events': {
    }

    ,'initialize': function (opts) {
      _.extend(this, opts);

      this.scrubber = new RekapiScrubber(
          this.app.kapi, this.app.canvasView.$canvasBG[0]);

      this.$el = this.scrubber.$container;
    }

    ,'fadeToggle': function () {
      this.$el.fadeToggle(this.app.constant.TOGGLE_FADE_SPEED);
    }

  });

});
