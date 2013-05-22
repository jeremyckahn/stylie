define(['exports', 'src/model/keyframe', 'src/ui/keyframe'],
    // TODO: The naming here is a huge mess.  Need to convert away from the
    // CommonJS decoration pattern because the model/view/names conflict. :(
    function (keyframes, keyframe, keyframeView) {

  keyframes.collection = Backbone.Collection.extend({

    'model': keyframe.model

    ,'initialize': function (models, opts) {
      var app = this.app = opts.app;

      this.on('add', function (model) {
        new keyframeView.view({
            'app': app
            ,'model': model
          });
      });
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

  return keyframes;
});
