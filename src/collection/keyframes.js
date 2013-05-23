define(['src/model/keyframe', 'src/ui/keyframe'],
    function (KeyframeModel, KeyframeView) {

  return Backbone.Collection.extend({

    'model': KeyframeModel

    ,'initialize': function (models, opts) {
      var app = this.app = opts.app;

      this.on('add', function (model) {
        new KeyframeView({
            'app': app
            ,'model': model
          });
      });
    }

    ,'updateModelKeyframeViews': function () {
      if (!this.models[0].keyframeForm) {
        return;
      }

      _.each(this.models, function (model) {
        model.keyframeForm.render();
      });
    }

    ,'updateModelCrosshairViews': function () {
      if (!this.models[0].crosshairView) {
        return;
      }

      _.each(this.models, function (model) {
        model.crosshairView.render();
      });
    }

  });
});
