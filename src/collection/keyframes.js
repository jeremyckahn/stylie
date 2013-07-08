define(['src/app', 'src/model/keyframe'], function (app, KeyframeModel) {

  return Backbone.Collection.extend({

    'model': KeyframeModel

    ,'initialize': function (models, opts) {
      _.extend(this, opts);

      this.on('add', _.bind(function (model) {
        this.owner.crosshairsView.addCrosshairView(model);
        this.owner.keyframeFormsView.addKeyframeView(model);
      }, this));
    }

    ,'comparator': function (keyframeModel) {
      return keyframeModel.get('millisecond');
    }

    ,'updateModelFormViews': function () {
      if (!this.models[0].keyframeFormView) {
        return;
      }

      this.each(function (model) {
        model.keyframeFormView.render();
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

    ,'removeKeyframe': function (millisecond) {
      this.remove(this.findWhere({'millisecond': millisecond}));
    }

  });
});
