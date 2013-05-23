define(['src/ui/crosshair'], function (CrosshairView) {

  return Backbone.View.extend({

    'initialize': function (opts) {
      _.extend(this, opts);
    }

    ,'addCrosshairView': function (model) {
      var keyframeCount = this.app.collection.keyframes.length;

      var $el = keyframeCount % 2
          ? $(CrosshairView.generateHtml('from', 'from', model.get('percent')))
          : $(CrosshairView.generateHtml('to', 'to', model.get('percent')));

      this.$el.append($el);

      var crosshairView = new CrosshairView({
        'app': this.app
        ,'$el': $el
        ,'model': model
      });
    }

  });
});
