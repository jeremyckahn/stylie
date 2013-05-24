define(['src/app', 'src/model/keyframe', 'src/ui/keyframe'],
    function (app, KeyframeModel, KeyframeView) {

  return Backbone.Collection.extend({

    'model': KeyframeModel

    ,'initialize': function (models, opts) {

      this.on('add', function (model) {
        new KeyframeView({
            'model': model
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
