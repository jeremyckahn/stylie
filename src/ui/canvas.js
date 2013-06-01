define(['src/app', 'src/ui/background'], function (app, BackgroundView) {

  var $win = $(window);
  // There is only one header in a DOM, so this is fine (if ugly).
  var $header = $('header');

  return Backbone.View.extend({

    'initialize': function (opts) {
      _.extend(this, opts);
      this.initDOM();
    }

    ,'initDOM': function () {
      var height = $win.height();
      var width = $win.width();

      this.backgroundView = new BackgroundView({
        '$el': this.$canvasBG
        ,'height': height
        ,'width': width
      });
      var currentActor = this.getDOMActor();
      app.kapi.addActor(currentActor);
      app.config.currentActor = currentActor;
      this.setDOMKeyframePoints(currentActor);
      $win.on('resize', _.bind(this.onWindowResize, this));
    }

    ,'onWindowResize': function (evt) {
      var height = $win.height() - $header.outerHeight();
      var width = $win.width();
      this.backgroundView.resize({
        'height': height
        ,'width': width
      });
      this.backgroundView.update();
    }

    ,'getDOMActor': function () {
      var actorEl = $('#rekapi-canvas').children();
      return new Kapi.DOMActor(actorEl[0]);
    }

    ,'setDOMKeyframePoints': function (DOMActor) {
      // TODO: Fix this crazy brittleness.
      DOMActor
        .keyframe(0,
            app.collection.keyframes.first().getCSS(),
            'linear linear')
        .keyframe(+app.config.initialDuration,
            app.collection.keyframes.last().getCSS(),
            'linear linear');
    }

  });

});
