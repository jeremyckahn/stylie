define(['exports', 'src/ui/background'], function (canvas, background) {

  canvas.view = Backbone.View.extend({

    'initialize': function (opts) {
      _.extend(this, opts);
      this.initDOM();
    }

    ,'initDOM': function () {
      this.app.kapi = new Kapi(this.$el[0], {
          'fps': 60
          ,'height': 400
          ,'width': 500
        });
      this.backgroundView = new background.view({
        'app': this.app
        ,'$el': this.$canvasBG
        ,'height': 400
        ,'width': 500
      });
      var currentActor = this.getDOMActor();
      this.app.kapi.addActor(currentActor);
      this.app.config.currentActor = currentActor;
      this.setDOMKeyframePoints(currentActor);
      this.initRekapiControls();

    }

    ,'initRekapiControls': function () {
      this.app.kapi.controls = new RekapiScrubber(this.app.kapi);
      this.app.util.updatePath();
    }

    ,'getDOMActor': function () {
      var actorEl = $('#rekapi-canvas').children();
      actorEl
        .height(actorEl.height())
        .width(actorEl.width());
      return new Kapi.DOMActor(actorEl[0]);
    }

    ,'setDOMKeyframePoints': function (DOMActor) {
      DOMActor.keyframe(0,
            _.extend(this.app.config.crosshairs.from.getCenter(), {
          'color': '#777'
          ,'radius': 15
        }))
        .keyframe(this.app.config.initialDuration,
            _.extend(this.app.config.crosshairs.to.getCenter(), {
          'color': '#333'
        }));
    }

    ,'updateDOMBackground': function () {
      this.backgroundView.update();
    }

  });

});
