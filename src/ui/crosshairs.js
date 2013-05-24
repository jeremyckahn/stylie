define(['src/app', 'src/ui/crosshair'], function (app, CrosshairView) {

  return Backbone.View.extend({

    'initialize': function (opts) {
      _.extend(this, opts);
    }

    ,'addCrosshairView': function (model) {
      var keyframeCount = app.collection.keyframes.length;

      var $el = keyframeCount % 2
          ? $(CrosshairView.generateHtml('from', 'from', model.get('percent')))
          : $(CrosshairView.generateHtml('to', 'to', model.get('percent')));

      this.$el.append($el);

      var crosshairView = new CrosshairView({
        '$el': $el
        ,'model': model
      });
    }

  });
});
