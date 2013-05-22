define(['exports', 'src/ui/crosshair'], function (crosshairs, crosshair) {

  crosshairs.view = Backbone.View.extend({

    'initialize': function (opts) {
      _.extend(this, opts);
    }

    ,'addCrosshairView': function (model) {
      var keyframeCount = this.app.collection.keyframes.length;

      var $el = keyframeCount % 2
          ? $(crosshair.generateHtml('from', 'from', model.get('percent')))
          : $(crosshair.generateHtml('to', 'to', model.get('percent')));

      this.$el.append($el);

      var crosshairView = new crosshair.view({
        'app': this.app
        ,'$el': $el
        ,'model': model
      });
    }

  });
});
