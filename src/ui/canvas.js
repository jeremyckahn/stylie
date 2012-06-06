define(['exports', 'src/ui/background'], function (canvas, background) {

  var $win = $(window);
  // There is only one header in a DOM, so this is fine (if ugly).
  var $header = $('header');

  canvas.view = Backbone.View.extend({

    'initialize': function (opts) {
      _.extend(this, opts);
      this.initDOM();
    }

    ,'initDOM': function () {
      var height = $win.height();
      var width = $win.width();

      this.app.kapi = new Kapi({
          'context': this.$el[0]
          ,'height': height
          ,'width': width
        });
      this.backgroundView = new background.view({
        'app': this.app
        ,'$el': this.$canvasBG
        ,'height': height
        ,'width': width
      });
      var currentActor = this.getDOMActor();
      this.app.kapi.addActor(currentActor);
      this.app.config.currentActor = currentActor;
      this.setDOMKeyframePoints(currentActor);
      this.initRekapiControls();
      $win.on('resize', _.bind(this.onWindowResize, this));
    }

    ,'onWindowResize': function (evt) {
      var height = $win.height() - $header.outerHeight();
      var width = $win.width();
      this.app.kapi.canvasHeight(height);
      this.app.kapi.canvasWidth(width);
      this.backgroundView.resize({
        'height': height
        ,'width': width
      });
      this.backgroundView.update();
    }

    ,'initRekapiControls': function () {
      this.app.kapi.controls = new RekapiScrubber(
          this.app.kapi, this.$canvasBG[0]);
    }

    ,'getDOMActor': function () {
      var actorEl = $('#rekapi-canvas').children();
      actorEl
        .height(actorEl.height())
        .width(actorEl.width());
      return new Kapi.DOMActor(actorEl[0]);
    }

    ,'setDOMKeyframePoints': function (DOMActor) {
      // TODO: Fix this crazy brittleness.
      DOMActor
        .keyframe(0, this.app.collection.keyframes.first().getCSS())
        .keyframe(+this.app.config.initialDuration,
            this.app.collection.keyframes.last().getCSS());
    }

  });

});
