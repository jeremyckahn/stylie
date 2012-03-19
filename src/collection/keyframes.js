define(['exports', 'src/model/keyframe'], function (keyframes, keyframe) {
  keyframes.collection = Backbone.Collection.extend({

    'model': keyframe.model

    ,'initialize': function () {

    }

    ,'updateModelViews': function () {
      _.each(this.models, function (model) {
        model.crosshairView.render();
        model.keyframeView.render();
      });
    }

    ,'updateModelKeyframeViews': function () {
      if (!this.models[0].keyframeView) {
        return;
      }

      _.each(this.models, function (model) {
        model.keyframeView.render();
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
