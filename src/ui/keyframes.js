define(['src/collection/keyframes', 'src/ui/keyframe'],
    function (keyframes, keyframe) {
  keyframes.view = Backbone.View.extend({

    'events': {}

    ,'initialize': function (opts) {
      _.extend(this, opts);
      this.collection = new keyframes.collection(opts.models);
      delete this.models;
      this.keyframeViews = {};
      this.initKeyframeViews();
    }

    ,'initKeyframeViews': function () {
      this.collection.each(function (model) {
        var view = this.initKeyframeView(model);
        this.$el.append(view.$el);
      }, this);
    }

    ,'initKeyframeView': function (model) {
      var keyframeView = new keyframe.view({
        'owner': this
        ,'model': model
      });

      this.keyframeViews[keyframeView.cid] = keyframeView;
      return keyframeView;
    }

    ,'render': function () {
      _.each(this.keyframeViews, function (view) {
        view.render();
      });
    }

  });

  return keyframes;
});
