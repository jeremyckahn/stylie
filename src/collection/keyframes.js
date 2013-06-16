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

    ,'updateModelFormViews': function () {
      if (!this.models[0].keyframeForm) {
        return;
      }

      this.each(function (model) {
        model.keyframeForm.render();
      });
    }

    ,'updateModelCrosshairViews': function () {
      if (!this.models[0].crosshairView) {
        return;
      }

      this.each(function (model) {
        model.crosshairView.render();
      });
    }

  });
});
