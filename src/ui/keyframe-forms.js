define(['src/ui/keyframe-form'], function (KeyframeForm) {
  return Backbone.View.extend({

    'initialize': function (opts) {
      _.extend(this, opts);
      this.keyframeForms = {};
    }

    ,'addKeyframeView': function (model) {
      var keyframeForm = new KeyframeForm({
        'owner': this
        ,'model': model
      });

      this.keyframeForms[keyframeForm.cid] = keyframeForm;
      this.$el.append(keyframeForm.$el);
    }

    ,'render': function () {
      _.each(this.keyframeForms, function (view) {
        view.render();
      });
    }

  });
});
