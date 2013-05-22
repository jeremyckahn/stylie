define(['exports', 'src/ui/keyframe-form'],
    function (keyframeForms, keyframeForm) {
  keyframeForms.view = Backbone.View.extend({

    'initialize': function (opts) {
      _.extend(this, opts);
      this.keyframeViews = {};
    }

    ,'addKeyframeView': function (model) {
      var keyframeView = new keyframeForm.view({
        'owner': this
        ,'model': model
      });

      this.keyframeViews[keyframeView.cid] = keyframeView;
      this.$el.append(keyframeView.$el);
    }

    ,'render': function () {
      _.each(this.keyframeViews, function (view) {
        view.render();
      });
    }

  });
});
